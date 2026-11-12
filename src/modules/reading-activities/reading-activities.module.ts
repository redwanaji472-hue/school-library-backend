import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingActivitiesService } from './reading-activities.service';
import { ReadingActivitiesController } from './reading-activities.controller';
import { ReadingActivity } from './entities/reading-activity.entity';
import { Student } from '../students/entities/student.entity';
import { PointsTransaction } from '../points/entities/points-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingActivity, Student, PointsTransaction])],
  controllers: [ReadingActivitiesController],
  providers: [ReadingActivitiesService],
  exports: [ReadingActivitiesService],
})
export class ReadingActivitiesModule {}
