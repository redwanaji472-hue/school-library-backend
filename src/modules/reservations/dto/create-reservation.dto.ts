import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'Book ID' })
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({ example: 5, description: 'Student ID' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;
}
