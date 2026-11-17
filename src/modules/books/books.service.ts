import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';
import { Category } from './entities/category.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(search?: string, categoryId?: number) {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.copies', 'copies')
      .where('book.isArchived = false');

    if (search?.trim()) {
      query.andWhere(
        '(book.title ILIKE :search OR book.author ILIKE :search OR book.isbn ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }
    if (categoryId) query.andWhere('book.categoryId = :categoryId', { categoryId });

    return query.orderBy('book.title', 'ASC').getMany();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id, isArchived: false }, relations: ['category', 'copies'] });
    if (!book) throw new NotFoundException(`Book #${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category #${dto.categoryId} not found`);
    const book = this.bookRepository.create(dto);
    const saved = await this.bookRepository.save(book);

    // Generate copies
    const count = dto.numberOfCopies ?? 1;
    for (let i = 0; i < count; i++) {
      const copy = this.copyRepository.create({
        bookId: saved.id,
        qrCode: `BK-${randomUUID().split('-')[0].toUpperCase()}`,
        status: 'available',
        acquisitionDate: new Date().toISOString().split('T')[0],
      });
      await this.copyRepository.save(copy);
    }
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    book.isArchived = true;
    return this.bookRepository.save(book);
  }

  // Category methods
  findAllCategories() {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async createCategory(name: string) {
    const category = this.categoryRepository.create({ name });
    return this.categoryRepository.save(category);
  }
}
