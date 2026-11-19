import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { Student } from '../students/entities/student.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoansQueryDto } from './dto/loans-query.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: LoansQueryDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const now = new Date();
    const query = this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.copy', 'copy')
      .leftJoinAndSelect('copy.book', 'book')
      .leftJoinAndSelect('loan.student', 'student')
      .leftJoinAndSelect('loan.librarian', 'librarian');

    if (filters.status === 'active') query.andWhere('loan.returnDate IS NULL');
    if (filters.status === 'overdue') {
      query.andWhere('loan.returnDate IS NULL').andWhere('loan.dueDate < :now', { now });
    }
    if (filters.status === 'returned') query.andWhere('loan.returnDate IS NOT NULL');
    if (filters.search?.trim()) {
      query.andWhere(
        '(student.fullName ILIKE :search OR book.title ILIKE :search OR copy.qrCode ILIKE :search)',
        { search: `%${filters.search.trim()}%` },
      );
    }

    const [items, total] = await query
      .orderBy('loan.dueDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const loan = await this.loanRepository.findOne({ where: { id }, relations: ['copy', 'copy.book', 'student', 'librarian'] });
    if (!loan) throw new NotFoundException(`Loan #${id} not found`);
    return loan;
  }

  async findByStudent(studentId: number, filters: LoansQueryDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const now = new Date();
    const query = this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.copy', 'copy')
      .leftJoinAndSelect('copy.book', 'book')
      .leftJoinAndSelect('loan.student', 'student')
      .where('loan.studentId = :studentId', { studentId });

    if (filters.status === 'active') query.andWhere('loan.returnDate IS NULL');
    if (filters.status === 'overdue') {
      query.andWhere('loan.returnDate IS NULL').andWhere('loan.dueDate < :now', { now });
    }
    if (filters.status === 'returned') query.andWhere('loan.returnDate IS NOT NULL');

    const [items, total] = await query
      .orderBy('loan.loanDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async checkout(dto: CreateLoanDto, librarianId: number) {
    return this.dataSource.transaction(async (manager) => {
      const student = await manager.findOne(Student, {
        where: { qrCode: dto.studentQrCode },
        lock: { mode: 'pessimistic_write' },
      });
      if (!student) throw new NotFoundException(`Student with QR ${dto.studentQrCode} not found`);
      if (student.status !== 'active') throw new BadRequestException('Student is not active');

      const copy = await manager.findOne(BookCopy, {
        where: { qrCode: dto.copyQrCode },
        lock: { mode: 'pessimistic_write' },
      });
      if (!copy) throw new NotFoundException(`Book copy with QR ${dto.copyQrCode} not found`);
      if (copy.status !== 'available') throw new BadRequestException(`Copy is not available (status: ${copy.status})`);

      const book = await manager.findOne(Book, { where: { id: copy.bookId } });
      if (!book || book.isArchived) throw new BadRequestException('Book is archived or unavailable');

      const activeLoanCount = await manager
        .createQueryBuilder(Loan, 'loan')
        .where('loan.studentId = :studentId', { studentId: student.id })
        .andWhere('loan.returnDate IS NULL')
        .getCount();
      if (activeLoanCount >= 3) throw new BadRequestException('Student already has the maximum of 3 active loans');

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      copy.status = 'on_loan';
      await manager.save(copy);
      const loan = manager.create(Loan, {
        copyId: copy.id,
        studentId: student.id,
        librarianId,
        loanDate: new Date(),
        dueDate,
        renewalsCount: 0,
      });
      return manager.save(loan);
    });
  }

  async returnBook(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const loan = await manager.findOne(Loan, { where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!loan) throw new NotFoundException(`Loan #${id} not found`);
      return this.finishReturn(manager, loan, 'available');
    });
  }

  async returnByCopyQr(copyQrCode: string, copyStatus: 'available' | 'maintenance' = 'available') {
    return this.dataSource.transaction(async (manager) => {
      const copy = await manager.findOne(BookCopy, {
        where: { qrCode: copyQrCode },
        lock: { mode: 'pessimistic_write' },
      });
      if (!copy) throw new NotFoundException(`Book copy with QR ${copyQrCode} not found`);
      const loan = await manager.findOne(Loan, {
        where: { copyId: copy.id, returnDate: null },
        lock: { mode: 'pessimistic_write' },
      });
      if (!loan) throw new BadRequestException('No active loan exists for this copy');
      return this.finishReturn(manager, loan, copyStatus);
    });
  }

  private async finishReturn(manager: EntityManager, loan: Loan, copyStatus: 'available' | 'maintenance') {
    if (loan.returnDate) throw new BadRequestException('Book already returned');
    const copy = await manager.findOne(BookCopy, {
      where: { id: loan.copyId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!copy) throw new NotFoundException(`Book copy #${loan.copyId} not found`);
    loan.returnDate = new Date();
    copy.status = copyStatus;
    await manager.save(copy);
    return manager.save(loan);
  }

  async renew(id: number, extendDays = 7) {
    const loan = await this.findOne(id);
    if (loan.returnDate) throw new BadRequestException('Cannot renew a returned loan');

    loan.dueDate = new Date(loan.dueDate);
    loan.dueDate.setDate(loan.dueDate.getDate() + extendDays);
    loan.renewalsCount += 1;
    return this.loanRepository.save(loan);
  }

  async getActiveLoans() {
    return this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.copy', 'copy')
      .leftJoinAndSelect('copy.book', 'book')
      .leftJoinAndSelect('loan.student', 'student')
      .leftJoinAndSelect('loan.librarian', 'librarian')
      .where('loan.returnDate IS NULL')
      .orderBy('loan.dueDate', 'ASC')
      .getMany();
  }

  async getOverdueLoans() {
    const now = new Date();
    return this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.copy', 'copy')
      .leftJoinAndSelect('copy.book', 'book')
      .leftJoinAndSelect('loan.student', 'student')
      .where('loan.returnDate IS NULL')
      .andWhere('loan.dueDate < :now', { now })
      .getMany();
  }
}
