import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('book_copies')
export class BookCopy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, (book) => book.copies)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'qr_code', unique: true })
  qrCode: string;

  @Column({ name: 'shelf_location', nullable: true })
  shelfLocation: string;

  @Column({ default: 'available' })
  status: string; // available, on_loan, reserved, maintenance, lost, withdrawn

  @Column({ name: 'acquisition_date', type: 'date', nullable: true })
  acquisitionDate: string;
}
