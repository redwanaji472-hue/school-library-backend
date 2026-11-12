import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { BookCopy } from './book-copy.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ unique: true, nullable: true })
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ name: 'publication_year', nullable: true })
  publicationYear: number;

  @Column({ default: 'العربية' })
  language: string;

  @Column({ nullable: true })
  pages: number;

  @Column({ name: 'reading_level', nullable: true })
  readingLevel: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @OneToMany(() => BookCopy, (copy) => copy.book)
  copies: BookCopy[];
}
