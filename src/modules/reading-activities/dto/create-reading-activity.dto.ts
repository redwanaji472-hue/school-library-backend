import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReadingActivityDto {
  @ApiProperty({ example: 5, description: 'Student ID' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ example: 'summary', enum: ['summary', 'quiz', 'activity', 'challenge'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: 'The book was about...' })
  @IsString()
  @IsOptional()
  summaryText?: string;
}
