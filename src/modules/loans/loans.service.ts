import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Student } from '../students/entities/student.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  findAll() {
    return this.loanRepository.find({ relations: ['copy', 'copy.book', 'student', 'librarian'] });
  }

  async findOne(id: number) {
    const loan = await this.loanRepository.findOne({ where: { id }, relations: ['copy', 'copy.book', 'student', 'librarian'] });
    if (!loan) throw new NotFoundException(`Loan #${id} not found`);
    return loan;
  }

  async checkout(dto: CreateLoanDto, librarianId: number) {
    const student = await this.studentRepository.findOne({ where: { qrCode: dto.studentQrCode } });
    if (!student) throw new NotFoundException(`Student with QR ${dto.studentQrCode} not found`);

    const copy = await this.copyRepository.findOne({ where: { qrCode: dto.copyQrCode }, relations: ['book'] });
    if (!copy) throw new NotFoundException(`Book copy with QR ${dto.copyQrCode} not found`);
    if (copy.status !== 'available') throw new BadRequestException(`Copy is not available (status: ${copy.status})`);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2-week loan period

    const loan = this.loanRepository.create({
      copyId: copy.id,
      studentId: student.id,
      librarianId,
      loanDate: new Date(),
      dueDate,
      renewalsCount: 0,
    });

    copy.status = 'on_loan';
    await this.copyRepository.save(copy);

    return this.loanRepository.save(loan);
  }

  async returnBook(id: number) {
    const loan = await this.findOne(id);
    if (loan.returnDate) throw new BadRequestException('Book already returned');

    loan.returnDate = new Date();
    const copy = await this.copyRepository.findOne({ where: { id: loan.copyId } });
    if (copy) {
      copy.status = 'available';
      await this.copyRepository.save(copy);
    }
    return this.loanRepository.save(loan);
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
    return this.loanRepository.find({ where: { returnDate: undefined as any }, relations: ['copy', 'copy.book', 'student', 'librarian'] });
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
