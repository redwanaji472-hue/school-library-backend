import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const count = await this.roleRepository.count();
    if (count > 0) return;

    const roles = [
      { name: 'admin' },
      { name: 'librarian' },
      { name: 'supervisor' },
    ];

    for (const role of roles) {
      await this.roleRepository.save(this.roleRepository.create(role));
    }
    this.logger.log('Seeded roles: admin, librarian, supervisor');
  }

  private async seedAdminUser() {
    const existing = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (existing) return;

    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) return;

    const password = await bcrypt.hash('admin123', 10);
    const admin = this.userRepository.create({
      roleId: adminRole.id,
      fullName: 'System Admin',
      username: 'admin',
      password,
      isActive: true,
    });
    await this.userRepository.save(admin);
    this.logger.log('Seeded admin user (username: admin, password: admin123)');
  }
}
