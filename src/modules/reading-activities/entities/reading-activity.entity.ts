import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reading_activities')
export class ReadingActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column()
  type: string; // summary, quiz, activity, challenge

  @Column({ name: 'summary_text', type: 'text', nullable: true })
  summaryText: string;

  @Column({ default: 'pending' })
  status: string; // pending, approved, needs_revision, rejected
}
