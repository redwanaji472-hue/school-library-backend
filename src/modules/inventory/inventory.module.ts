import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { Loan } from '../loans/entities/loan.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookCopy, Book, Loan, Student])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
