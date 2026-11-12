import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from './class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_id' })
  classId: number;

  @ManyToOne(() => Class, (cls) => cls.students)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'qr_code', unique: true })
  qrCode: string;

  @Column({ default: 'active' })
  status: string; // active, transferred, graduated, suspended

  @Column({ name: 'total_points', default: 0 })
  totalPoints: number;
}
