import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Student } from '../students/entities/student.entity';
import { Class } from '../students/entities/class.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({ relations: ['role'], order: { id: 'ASC' } });
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.toSafeUser(user);
  }

  async create(dto: CreateUserDto) {
    if ((dto.roleId !== undefined) === (dto.role !== undefined)) {
      throw new ConflictException('Provide exactly one of role or roleId');
    }
    const password = await bcrypt.hash(dto.password, 10);
    return this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(User, { where: { username: dto.username } });
      if (existing) throw new ConflictException('Username already exists');

      const role = dto.role
        ? await manager.findOne(Role, { where: { name: dto.role } })
        : await manager.findOne(Role, { where: { id: dto.roleId } });
      if (!role) throw new NotFoundException('Selected role was not found');

      let classRecord: Class | null = null;
      if (role.name === 'student') {
        if (!dto.classId) throw new BadRequestException('classId is required for the student role');
        classRecord = await manager.findOne(Class, { where: { id: dto.classId } });
        if (!classRecord) throw new NotFoundException(`Class #${dto.classId} not found`);
      } else if (dto.classId !== undefined) {
        throw new BadRequestException('classId can only be provided for the student role');
      }

      const user = manager.create(User, {
        roleId: role.id,
        fullName: dto.fullName,
        username: dto.username,
        password,
        isActive: dto.isActive ?? true,
      });
      const saved = await manager.save(user);

      let student: Student | undefined;
      if (classRecord) {
        student = manager.create(Student, {
          classId: classRecord.id,
          fullName: dto.fullName,
          userId: saved.id,
          qrCode: `STU-${randomUUID().split('-')[0].toUpperCase()}`,
        });
        student = await manager.save(student);
      }

      return {
        id: saved.id,
        username: saved.username,
        fullName: saved.fullName,
        role: role.name,
        isActive: saved.isActive,
        ...(student ? { student: { id: student.id, classId: student.classId, qrCode: student.qrCode } } : {}),
      };
    });
  }

  getRoles() {
    return this.roleRepository.find({ order: { id: 'ASC' } });
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id }, relations: ['role'] });
      if (!user) throw new NotFoundException(`User #${id} not found`);
      if (dto.username && dto.username !== user.username) {
        const existing = await manager.findOne(User, { where: { username: dto.username } });
        if (existing) throw new ConflictException('Username already exists');
        user.username = dto.username;
      }
      if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
      if (dto.fullName && user.role?.name === 'student') {
        await manager.update(Student, { userId: user.id }, { fullName: dto.fullName });
      }
      if (dto.fullName !== undefined) user.fullName = dto.fullName;
      if (dto.isActive !== undefined) user.isActive = dto.isActive;
      const saved = await manager.save(user);
      return this.toSafeUser(saved);
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.userRepository.remove(user);
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      roleId: user.roleId,
      fullName: user.fullName,
      username: user.username,
      isActive: user.isActive,
      role: user.role ? { id: user.role.id, name: user.role.name } : null,
    };
  }
}
