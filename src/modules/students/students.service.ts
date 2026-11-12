import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
    const student = this.studentRepository.create({ ...dto, qrCode });
    return this.studentRepository.save(student);
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
