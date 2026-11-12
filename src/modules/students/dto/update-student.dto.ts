import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  classId?: number;

  @ApiPropertyOptional({ example: 'Mohamed Ali' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'transferred', 'graduated', 'suspended'] })
  @IsString()
  @IsOptional()
  status?: string;
}
