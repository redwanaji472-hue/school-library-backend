import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BookCopy } from '../../books/entities/book-copy.entity';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'copy_id' })
  copyId: number;

  @ManyToOne(() => BookCopy)
  @JoinColumn({ name: 'copy_id' })
  copy: BookCopy;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'librarian_id' })
  librarianId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'librarian_id' })
  librarian: User;

  @Column({ name: 'loan_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loanDate: Date;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'return_date', type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ name: 'renewals_count', default: 0 })
  renewalsCount: number;
}
