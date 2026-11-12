import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingActivity } from './entities/reading-activity.entity';
import { Student } from '../students/entities/student.entity';
import { PointsTransaction } from '../points/entities/points-transaction.entity';
import { CreateReadingActivityDto } from './dto/create-reading-activity.dto';
import { ReviewActivityDto } from './dto/review-activity.dto';

@Injectable()
export class ReadingActivitiesService {
  constructor(
    @InjectRepository(ReadingActivity)
    private readonly activityRepository: Repository<ReadingActivity>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(PointsTransaction)
    private readonly pointsRepository: Repository<PointsTransaction>,
  ) {}

  findAll() {
    return this.activityRepository.find({ relations: ['student', 'reviewer'] });
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOne({ where: { id }, relations: ['student', 'reviewer'] });
    if (!activity) throw new NotFoundException(`Activity #${id} not found`);
    return activity;
  }

  async findByStudent(studentId: number) {
    return this.activityRepository.find({ where: { studentId }, relations: ['student', 'reviewer'] });
  }

  async getPending() {
    return this.activityRepository.find({ where: { status: 'pending' }, relations: ['student', 'reviewer'] });
  }

  async create(dto: CreateReadingActivityDto) {
    const student = await this.studentRepository.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);

    const activity = this.activityRepository.create({
      studentId: dto.studentId,
      type: dto.type,
      summaryText: dto.summaryText,
      status: 'pending',
    });
    return this.activityRepository.save(activity);
  }

  async review(id: number, dto: ReviewActivityDto) {
    const activity = await this.findOne(id);
    if (activity.status !== 'pending') throw new BadRequestException('Activity already reviewed');

    activity.reviewerId = dto.reviewerId;
    activity.status = dto.status;
    const saved = await this.activityRepository.save(activity);

    // Award points if approved
    if (dto.status === 'approved' && dto.points && dto.points > 0) {
      const transaction = this.pointsRepository.create({
        studentId: activity.studentId,
        activityId: activity.id,
        points: dto.points,
        reason: `Reading activity: ${activity.type}`,
      });
      await this.pointsRepository.save(transaction);

      // Update student total points
      const student = await this.studentRepository.findOne({ where: { id: activity.studentId } });
      if (student) {
        student.totalPoints += dto.points;
        await this.studentRepository.save(student);
      }
    }

    return saved;
  }

  async remove(id: number) {
    const activity = await this.findOne(id);
    return this.activityRepository.remove(activity);
  }
}
