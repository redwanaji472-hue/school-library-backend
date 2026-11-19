import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StudentsQueryDto {
  @ApiPropertyOptional({ description: 'Search by student name or username' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ['active', 'transferred', 'graduated', 'suspended'] })
  @IsIn(['active', 'transferred', 'graduated', 'suspended'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ enum: ['active', 'overdue', 'none'] })
  @IsIn(['active', 'overdue', 'none'])
  @IsOptional()
  loanStatus?: 'active' | 'overdue' | 'none';

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  classId?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
