import { Controller, Get, Post, Patch, Param, Body, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReadingActivitiesService } from './reading-activities.service';
import { CreateReadingActivityDto } from './dto/create-reading-activity.dto';
import { ReviewActivityDto } from './dto/review-activity.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reading Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reading-activities')
export class ReadingActivitiesController {
  constructor(private readonly readingActivitiesService: ReadingActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reading activities' })
  findAll() {
    return this.readingActivitiesService.findAll();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending activities awaiting review' })
  getPending() {
    return this.readingActivitiesService.getPending();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get activities by student' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.readingActivitiesService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.readingActivitiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a reading activity (summary, quiz, etc.)' })
  create(@Body() dto: CreateReadingActivityDto) {
    return this.readingActivitiesService.create(dto);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Review an activity (approve/reject) and optionally award points' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewActivityDto) {
    return this.readingActivitiesService.review(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.readingActivitiesService.remove(id);
  }
}
