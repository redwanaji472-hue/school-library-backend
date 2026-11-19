import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { Loan } from '../loans/entities/loan.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { randomUUID } from 'crypto';
import { StudentsQueryDto } from './dto/students-query.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: StudentsQueryDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const now = new Date();
    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.class', 'class')
      .leftJoin('student.user', 'user')
      .leftJoin('user.role', 'role')
      .leftJoin(Loan, 'loan', 'loan.studentId = student.id AND loan.returnDate IS NULL')
      .addSelect(['user.id', 'user.username', 'user.isActive', 'role.id', 'role.name'])
      .distinct(true);

    if (filters.search?.trim()) {
      query.andWhere(
        '(student.fullName ILIKE :search OR user.username ILIKE :search)',
        { search: `%${filters.search.trim()}%` },
      );
    }
    if (filters.status) query.andWhere('student.status = :status', { status: filters.status });
    if (filters.classId) query.andWhere('student.classId = :classId', { classId: filters.classId });
    if (filters.loanStatus === 'overdue') {
      query.andWhere('loan.id IS NOT NULL').andWhere('loan.dueDate < :now', { now });
    } else if (filters.loanStatus === 'active') {
      query.andWhere('loan.id IS NOT NULL').andWhere('loan.dueDate >= :now', { now });
    } else if (filters.loanStatus === 'none') {
      query.andWhere('loan.id IS NULL');
    }

    const [students, total] = await query
      .orderBy('student.fullName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const loanStats = students.length
      ? await this.studentRepository.manager
          .getRepository(Loan)
          .createQueryBuilder('loan')
          .select('loan.studentId', 'studentId')
          .addSelect('COUNT(CASE WHEN loan.returnDate IS NULL THEN 1 END)', 'activeLoansCount')
          .addSelect(
            'COUNT(CASE WHEN loan.returnDate IS NULL AND loan.dueDate < :statsNow THEN 1 END)',
            'overdueLoansCount',
          )
          .where('loan.studentId IN (:...studentIds)', { studentIds: students.map((student) => student.id) })
          .setParameter('statsNow', now)
          .groupBy('loan.studentId')
          .getRawMany<{
            studentId: string;
            activeLoansCount: string;
            overdueLoansCount: string;
          }>()
      : [];
    const statsByStudentId = new Map(loanStats.map((row) => [Number(row.studentId), row]));

    return {
      items: students.map((student) => {
        const stats = statsByStudentId.get(student.id);
        const overdueLoansCount = Number(stats?.overdueLoansCount ?? 0);
        return {
          ...this.toResponse(student),
          activeLoansCount: Number(stats?.activeLoansCount ?? 0),
          hasOverdueLoan: overdueLoansCount > 0,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findClasses(academicYear?: string) {
    return this.studentRepository.manager.find(Class, {
      where: academicYear ? { academicYear } : {},
      order: { grade: 'ASC', section: 'ASC' },
    });
  }

  async findOne(id: number) {
    const student = await this.findWithClassAndRole('student.id = :id', { id });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return this.toResponse(student);
  }

  async findByQr(qrCode: string) {
    const student = await this.findWithClassAndRole('student.qrCode = :qrCode', { qrCode });
    if (!student) throw new NotFoundException(`Student with QR ${qrCode} not found`);
    return this.toResponse(student);
  }

  async findByUserId(userId: number) {
    const student = await this.findWithClassAndRole('user.id = :userId', { userId });
    if (!student) throw new NotFoundException('Student profile not found for this account');
    return this.toResponse(student);
  }

  private findWithClassAndRole(condition: string, parameters: Record<string, unknown>) {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.class', 'class')
      .leftJoin('student.user', 'user')
      .leftJoin('user.role', 'role')
      .addSelect(['user.id', 'user.username', 'user.isActive', 'role.id', 'role.name'])
      .where(condition, parameters)
      .getOne();
  }

  private toResponse(student: Student) {
    const { user, ...studentData } = student;
    return {
      ...studentData,
      username: user?.username ?? null,
      role: user?.role?.name ?? null,
      accountActive: user?.isActive ?? false,
    };
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
        isActive: dto.isActive ?? true,
      });
      const savedUser = await manager.save(user);

      const student = manager.create(Student, {
        classId: dto.classId,
        fullName: dto.fullName,
        qrCode,
        userId: savedUser.id,
      });
      const savedStudent = await manager.save(student);

      return {
        ...savedStudent,
        username: savedUser.username,
        role: 'student',
        accountActive: savedUser.isActive,
      };
    });
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.dataSource.transaction(async (manager) => {
      const student = await manager.findOne(Student, { where: { id } });
      if (!student) throw new NotFoundException(`Student #${id} not found`);
      if (dto.classId !== undefined) {
        const classRecord = await manager.findOne(Class, { where: { id: dto.classId } });
        if (!classRecord) throw new NotFoundException(`Class #${dto.classId} not found`);
        student.classId = dto.classId;
      }
      if (dto.fullName !== undefined) {
        student.fullName = dto.fullName;
        if (student.userId) {
          await manager.update(User, { id: student.userId }, { fullName: dto.fullName });
        }
      }
      if (dto.status !== undefined) student.status = dto.status;
      if (dto.accountActive !== undefined) {
        if (!student.userId) throw new BadRequestException('Student has no linked login account');
        await manager.update(User, { id: student.userId }, { isActive: dto.accountActive });
      }
      await manager.save(student);
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const student = await manager.findOne(Student, { where: { id } });
      if (!student) throw new NotFoundException(`Student #${id} not found`);
      if (student.userId) await manager.update(User, { id: student.userId }, { isActive: false });
      return manager.remove(student);
    });
  }
}
