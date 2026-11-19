import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Role } from '../users/entities/role.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.username = :username', { username: loginDto.username })
      .andWhere('user.isActive = true')
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const student = user.role?.name === 'student'
      ? await this.studentRepository.findOne({ where: { userId: user.id } })
      : null;
    if (user.role?.name === 'student' && (!student || student.status !== 'active')) {
      throw new UnauthorizedException('Student account is not active or linked to a student profile');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role?.name,
      ...(student ? { studentId: student.id } : {}),
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role?.name,
        ...(student ? { studentId: student.id } : {}),
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const role = await this.roleRepository.findOne({ where: { id: registerDto.roleId } });
    if (!role) throw new NotFoundException('Selected role was not found');
    if (role.name === 'student') {
      throw new BadRequestException('Create student accounts through POST /students or POST /users with classId');
    }

    const existing = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existing) throw new ConflictException('Username already exists');

    const password = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      roleId: role.id,
      fullName: registerDto.fullName,
      username: registerDto.username,
      password,
      isActive: registerDto.isActive ?? true,
    });

    const saved = await this.userRepository.save(user);
    return { id: saved.id, username: saved.username, fullName: saved.fullName };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('User account not found');
    const student = user.role?.name === 'student'
      ? await this.studentRepository.findOne({ where: { userId: user.id } })
      : null;
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name ?? null,
      isActive: user.isActive,
      ...(student ? { studentId: student.id, status: student.status } : {}),
    };
  }

  async updateMe(userId: number, dto: UpdateMyProfileDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId }, relations: ['role'] });
      if (!user) throw new NotFoundException('User account not found');

      if (dto.username && dto.username !== user.username) {
        const existing = await manager.findOne(User, { where: { username: dto.username } });
        if (existing) throw new ConflictException('Username already exists');
        user.username = dto.username;
      }
      if (dto.fullName) {
        user.fullName = dto.fullName;
        if (user.role?.name === 'student') {
          await manager.update(Student, { userId: user.id }, { fullName: dto.fullName });
        }
      }
      const saved = await manager.save(user);
      return {
        id: saved.id,
        username: saved.username,
        fullName: saved.fullName,
        role: user.role?.name ?? null,
        isActive: saved.isActive,
      };
    });
  }

  async changeMyPassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) throw new NotFoundException('User account not found');
    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}
