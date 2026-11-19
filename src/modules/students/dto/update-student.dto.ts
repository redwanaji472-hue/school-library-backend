import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @Min(1)
  @IsOptional()
  classId?: number;

  @ApiPropertyOptional({ example: 'Mohamed Ali' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'transferred', 'graduated', 'suspended'] })
  @IsIn(['active', 'transferred', 'graduated', 'suspended'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: true, description: 'Enable or disable the linked login account' })
  @IsBoolean()
  @IsOptional()
  accountActive?: boolean;
}
