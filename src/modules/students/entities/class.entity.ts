import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grade: string;

  @Column()
  section: string;

  @Column({ name: 'academic_year' })
  academicYear: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
