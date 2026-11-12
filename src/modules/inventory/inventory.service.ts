import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { Loan } from '../loans/entities/loan.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async getSummary() {
    const totalBooks = await this.bookRepository.count();
    const totalCopies = await this.copyRepository.count();

    const statusCounts = await this.copyRepository
      .createQueryBuilder('copy')
      .select('copy.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('copy.status')
      .getRawMany();

    const activeLoans = await this.loanRepository.count({ where: { returnDate: undefined as any } });
    const overdueLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.returnDate IS NULL')
      .andWhere('loan.dueDate < :now', { now: new Date() })
      .getCount();

    return {
      totalBooks,
      totalCopies,
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
      .leftJoinAndSelect('book.copies', 'allCopies')
      .groupBy('book.id')
      .having('COUNT(CASE WHEN copy.status = :available THEN 1 END) <= :threshold', { available: 'available', threshold })
      .getMany();

    return books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      availableCopies: (b as any).allCopies?.filter((c: any) => c.status === 'available').length ?? 0,
    }));
  }
}
