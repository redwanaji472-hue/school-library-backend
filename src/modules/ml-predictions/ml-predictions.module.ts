import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MlPredictionsController } from './ml-predictions.controller';
import { MlPredictionsService } from './ml-predictions.service';
import { Student } from '../students/entities/student.entity';
import { Loan } from '../loans/entities/loan.entity';
import { ReadingActivity } from '../reading-activities/entities/reading-activity.entity';
import { PointsTransaction } from '../points/entities/points-transaction.entity';
import { Book } from '../books/entities/book.entity';
import { BookCopy } from '../books/entities/book-copy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Loan,
      ReadingActivity,
      PointsTransaction,
      Book,
      BookCopy,
    ]),
  ],
  controllers: [MlPredictionsController],
  providers: [MlPredictionsService],
})
export class MlPredictionsModule {}
