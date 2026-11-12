import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MlPredictionsService } from './ml-predictions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('ML Predictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ml-predictions')
export class MlPredictionsController {
  constructor(private readonly mlPredictionsService: MlPredictionsService) {}

  @Get('risk/:studentId')
  @ApiOperation({ summary: 'Predict student reading engagement risk level' })
  predictRisk(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.mlPredictionsService.predictStudentRisk(studentId);
  }

  @Get('recommend/:studentId')
  @ApiOperation({ summary: 'Recommend books for a student based on reading history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  recommendBooks(@Param('studentId', ParseIntPipe) studentId: number, @Query('limit') limit?: number) {
    return this.mlPredictionsService.recommendBooks(studentId, limit ?? 5);
  }

  @Get('library-health')
  @ApiOperation({ summary: 'Get library health metrics and predictions' })
  getLibraryHealth() {
    return this.mlPredictionsService.getLibraryHealth();
  }
}
