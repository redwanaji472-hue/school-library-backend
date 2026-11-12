import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Foreign key column - explicitly defined once
  @Column({ name: 'role_id' })
  roleId: number;

  // Relation - JoinColumn references the same column name
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
