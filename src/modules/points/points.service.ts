import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointsTransaction } from './entities/points-transaction.entity';
import { Student } from '../students/entities/student.entity';
import { CreatePointsTransactionDto } from './dto/create-points-transaction.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointsTransaction)
    private readonly pointsRepository: Repository<PointsTransaction>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  findAll() {
    return this.pointsRepository.find({ relations: ['student', 'activity'] });
  }

  async findByStudent(studentId: number) {
    return this.pointsRepository.find({ where: { studentId }, relations: ['student', 'activity'] });
  }

  async getStudentBalance(studentId: number) {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);
    return { studentId, fullName: student.fullName, totalPoints: student.totalPoints };
  }

  async getLeaderboard(limit = 10) {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.class', 'class')
      .orderBy('student.totalPoints', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(dto: CreatePointsTransactionDto) {
    const student = await this.studentRepository.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);

    const transaction = this.pointsRepository.create({
      studentId: dto.studentId,
      activityId: dto.activityId,
      points: dto.points,
      reason: dto.reason,
    });
    const saved = await this.pointsRepository.save(transaction);

    // Update student total points
    student.totalPoints += dto.points;
    await this.studentRepository.save(student);

    return saved;
  }
}
