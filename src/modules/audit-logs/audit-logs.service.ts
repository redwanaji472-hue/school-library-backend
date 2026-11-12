import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  findAll() {
    return this.auditLogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: number) {
    return this.auditLogRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findByEntity(entityType: string) {
    return this.auditLogRepository.find({ where: { entityType }, order: { createdAt: 'DESC' } });
  }

  async log(action: string, userId?: number, entityType?: string, entityId?: number, details?: any) {
    const entry = this.auditLogRepository.create({ action, userId, entityType, entityId, details });
    return this.auditLogRepository.save(entry);
  }
}
