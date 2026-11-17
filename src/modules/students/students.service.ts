import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.studentRepository.find({ relations: ['class'] });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({ where: { id }, relations: ['class'] });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return student;
  }

  async findByQr(qrCode: string) {
    const student = await this.studentRepository.findOne({ where: { qrCode }, relations: ['class'] });
    if (!student) throw new NotFoundException(`Student with QR ${qrCode} not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    const qrCode = `STU-${randomUUID().split('-')[0].toUpperCase()}`;

    return this.dataSource.transaction(async (manager) => {
      const classRecord = await manager.findOne(Class, { where: { id: dto.classId } });
      if (!classRecord) throw new NotFoundException(`Class #${dto.classId} not found`);

      const existingUser = await manager.findOne(User, { where: { username: dto.username } });
      if (existingUser) throw new ConflictException('Username already exists');

      const studentRole = await manager.findOne(Role, { where: { name: 'student' } });
      if (!studentRole) throw new NotFoundException('Student role is not configured');

      const user = manager.create(User, {
        roleId: studentRole.id,
        fullName: dto.fullName,
        username: dto.username,
        password: await bcrypt.hash(dto.password, 10),
        isActive: true,
      });
      const savedUser = await manager.save(user);

      const student = manager.create(Student, {
        classId: dto.classId,
        fullName: dto.fullName,
        qrCode,
      });
      const savedStudent = await manager.save(student);

      return {
        ...savedStudent,
        user: { id: savedUser.id, username: savedUser.username, role: 'student' },
      };
    });
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    return this.studentRepository.remove(student);
  }
}
