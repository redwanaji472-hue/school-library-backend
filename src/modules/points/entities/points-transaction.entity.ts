import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { ReadingActivity } from '../../reading-activities/entities/reading-activity.entity';

@Entity('points_transactions')
export class PointsTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'activity_id', nullable: true })
  activityId: number;

  @ManyToOne(() => ReadingActivity, { nullable: true })
  @JoinColumn({ name: 'activity_id' })
  activity: ReadingActivity;

  @Column()
  points: number;

  @Column()
  reason: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
