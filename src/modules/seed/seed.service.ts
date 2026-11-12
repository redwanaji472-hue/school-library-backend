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
    try {
      await this.seedRoles();
      await this.seedAdminUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to run seed service', errorMessage);
      // Do not crash the app; just log the error
    }
  }

  private async seedRoles() {
    try {
      const roles = ['admin', 'librarian', 'supervisor'];

      for (const roleName of roles) {
        const exists = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!exists) {
          await this.roleRepository.save(this.roleRepository.create({ name: roleName }));
          this.logger.log(`Created role: ${roleName}`);
        }
      }

      this.logger.log('✅ Roles seeded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to seed roles', errorMessage);
      throw error;
    }
  }

  private async seedAdminUser() {
    try {
      const existing = await this.userRepository.findOne({ where: { username: 'admin' } });
      if (existing) {
        this.logger.log('Admin user already exists, skipping seed');
        return;
      }

      const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
      if (!adminRole) {
        throw new Error('Admin role not found. Make sure roles are seeded first.');
      }

      // Read admin password from environment variable with safe fallback
      const rawPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const admin = this.userRepository.create({
        roleId: adminRole.id,
        fullName: 'System Admin',
        username: 'admin',
        password: hashedPassword,
        isActive: true,
      });

      await this.userRepository.save(admin);
      this.logger.log('✅ Admin user created successfully');
      this.logger.log(`   Username: admin`);
      // Do NOT log the password
      if (rawPassword === 'admin123') {
        this.logger.warn('   ⚠️  Using default password - CHANGE IMMEDIATELY after first login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to seed admin user', errorMessage);
      throw error;
    }
  }
}
