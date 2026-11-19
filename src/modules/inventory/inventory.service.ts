import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { Loan } from '../loans/entities/loan.entity';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async getSummary() {
    const totalBooks = await this.bookRepository.count({ where: { isArchived: false } });
    const totalCopies = await this.copyRepository
      .createQueryBuilder('copy')
      .innerJoin('copy.book', 'book', 'book.isArchived = false')
      .getCount();
    const totalStudents = await this.studentRepository.count();
    const activeStudents = await this.studentRepository
      .createQueryBuilder('student')
      .innerJoin('student.user', 'user')
      .where('student.status = :status', { status: 'active' })
      .andWhere('user.isActive = true')
      .getCount();

    const statusCounts = await this.copyRepository
      .createQueryBuilder('copy')
      .innerJoin('copy.book', 'book', 'book.isArchived = false')
      .select('copy.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('copy.status')
      .getRawMany();

    const activeLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.returnDate IS NULL')
      .getCount();
    const overdueLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.returnDate IS NULL')
      .andWhere('loan.dueDate < :now', { now: new Date() })
      .getCount();

    return {
      totalBooks,
      totalCopies,
      totalStudents,
      activeStudents,
      activeLoans,
      overdueLoans,
      copiesByStatus: statusCounts,
    };
  }

  async getCopiesByStatus(status: string) {
    return this.copyRepository.find({ where: { status }, relations: ['book'] });
  }

  async updateCopyStatus(id: number, status: string) {
    const copy = await this.copyRepository.findOne({ where: { id } });
    if (!copy) throw new Error(`Copy #${id} not found`);
    copy.status = status;
    return this.copyRepository.save(copy);
  }

  async getBooksWithLowStock(threshold = 1) {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.copies', 'copy')
      .where('book.isArchived = false')
      .select('book.id', 'id')
      .addSelect('book.title', 'title')
      .addSelect('book.author', 'author')
      .addSelect('COUNT(CASE WHEN copy.status = :available THEN 1 END)', 'availableCopies')
      .groupBy('book.id')
      .having('COUNT(CASE WHEN copy.status = :available THEN 1 END) <= :threshold', {
        available: 'available',
        threshold,
      })
      .getRawMany();

    return books.map((book) => ({
      id: Number(book.id),
      title: book.title,
      author: book.author,
      availableCopies: Number(book.availableCopies),
    }));
  }
}
