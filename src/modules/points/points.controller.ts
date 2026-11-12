import { Controller, Get, Post, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { CreatePointsTransactionDto } from './dto/create-points-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Points')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all points transactions' })
  findAll() {
    return this.pointsService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get points history for a student' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.pointsService.findByStudent(studentId);
  }

  @Get('balance/:studentId')
  @ApiOperation({ summary: 'Get student points balance' })
  getBalance(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.pointsService.getStudentBalance(studentId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get students leaderboard by points' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getLeaderboard(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    return this.pointsService.getLeaderboard(Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10);
  }

  @Post()
  @ApiOperation({ summary: 'Award or deduct points' })
  create(@Body() dto: CreatePointsTransactionDto) {
    return this.pointsService.create(dto);
  }
}
