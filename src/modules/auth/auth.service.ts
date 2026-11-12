import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username, isActive: true },
      relations: ['role'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role?.name };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role?.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existing) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      roleId: registerDto.roleId,
      fullName: registerDto.fullName,
      username: registerDto.username,
      passwordHash,
      isActive: registerDto.isActive ?? true,
    });

    const saved = await this.userRepository.save(user);
    return { id: saved.id, username: saved.username, fullName: saved.fullName };
  }
}
