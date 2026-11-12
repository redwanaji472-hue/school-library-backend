import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { BooksModule } from './modules/books/books.module';
import { LoansModule } from './modules/loans/loans.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReadingActivitiesModule } from './modules/reading-activities/reading-activities.module';
import { PointsModule } from './modules/points/points.module';
import { MlPredictionsModule } from './modules/ml-predictions/ml-predictions.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    BooksModule,
    LoansModule,
    ReservationsModule,
    InventoryModule,
    ReadingActivitiesModule,
    PointsModule,
    MlPredictionsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
