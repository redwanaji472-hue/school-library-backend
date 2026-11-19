import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LoansQueryDto {
  @ApiPropertyOptional({ enum: ['active', 'overdue', 'returned'] })
  @IsIn(['active', 'overdue', 'returned'])
  @IsOptional()
  status?: 'active' | 'overdue' | 'returned';

  @ApiPropertyOptional({ description: 'Search by student, book, or copy QR code' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  search?: string;

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
