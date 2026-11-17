import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const studentRole = await this.roleRepository.findOne({ where: { name: 'student' } });
    if (!studentRole) {
      // Keep the serial counter aligned when role rows were inserted manually or restored from a backup.
      await this.userRepository.query(`
        SELECT setval(
          pg_get_serial_sequence('roles', 'id'),
          COALESCE(MAX(id), 1),
          MAX(id) IS NOT NULL
        )
        FROM roles
      `);
      await this.roleRepository.save(this.roleRepository.create({ name: 'student' }));
    }
  }

  findAll() {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto) {
    if ((dto.roleId !== undefined) === (dto.role !== undefined)) {
      throw new ConflictException('Provide exactly one of role or roleId');
    }

    const existing = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already exists');

    const role = dto.role
      ? await this.roleRepository.findOne({ where: { name: dto.role } })
      : await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Selected role was not found');

    const password = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      roleId: role.id,
      fullName: dto.fullName,
      username: dto.username,
      password,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.userRepository.save(user);
    return { id: saved.id, username: saved.username, fullName: saved.fullName, role: role.name, isActive: saved.isActive };
  }

  getRoles() {
    return this.roleRepository.find({ order: { id: 'ASC' } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.password) {
      (user as any).password = await bcrypt.hash(dto.password, 10);
      delete dto.password;
    }
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
