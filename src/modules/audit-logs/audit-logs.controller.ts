import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (newest first)' })
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get logs by user' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.auditLogsService.findByUser(userId);
  }

  @Get('entity')
  @ApiOperation({ summary: 'Get logs by entity type' })
  @ApiQuery({ name: 'type', example: 'book' })
  findByEntity(@Query('type') type: string) {
    return this.auditLogsService.findByEntity(type);
  }
}
