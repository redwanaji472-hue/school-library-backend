import { Controller, Get, Post, Param, Body, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { CreatePointsTransactionDto } from './dto/create-points-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Points')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('me')
  @Roles('student')
  @ApiOperation({ summary: 'Get the signed-in student points balance and transaction history' })
  async getMyPoints(@Request() req: any) {
    const [balance, transactions] = await Promise.all([
      this.pointsService.getStudentBalance(req.user.studentId),
      this.pointsService.findByStudent(req.user.studentId),
    ]);
    return { ...balance, transactions };
  }

  @Get()
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Get all points transactions' })
  findAll() {
    return this.pointsService.findAll();
  }

  @Get('student/:studentId')
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Get points history for a student' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.pointsService.findByStudent(studentId);
  }

  @Get('balance/:studentId')
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Get student points balance' })
  getBalance(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.pointsService.getStudentBalance(studentId);
  }

  @Get('leaderboard')
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Get students leaderboard by points' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getLeaderboard(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    return this.pointsService.getLeaderboard(Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10);
  }

  @Post()
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Award or deduct points' })
  create(@Body() dto: CreatePointsTransactionDto) {
    return this.pointsService.create(dto);
  }
}
