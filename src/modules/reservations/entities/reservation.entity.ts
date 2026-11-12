import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'reserved_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reservedAt: Date;

  @Column({ default: 'pending' })
  status: string; // pending, fulfilled, cancelled
}
