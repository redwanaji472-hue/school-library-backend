import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointsTransactionDto {
  @ApiProperty({ example: 5, description: 'Student ID' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ example: 10, description: 'Points (positive for awards, negative for deductions)' })
  @IsInt()
  @Min(-1000)
  @IsNotEmpty()
  points: number;

  @ApiProperty({ example: 'Reading challenge completed' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 3, description: 'Related activity ID' })
  @IsInt()
  @IsOptional()
  activityId?: number;
}
