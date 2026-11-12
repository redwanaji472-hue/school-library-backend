import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewActivityDto {
  @ApiProperty({ example: 1, description: 'Reviewer (user) ID' })
  @IsInt()
  @IsNotEmpty()
  reviewerId: number;

  @ApiProperty({ example: 'approved', enum: ['approved', 'needs_revision', 'rejected'] })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 10, description: 'Points to award (if approved)' })
  @IsInt()
  @IsOptional()
  points?: number;
}
