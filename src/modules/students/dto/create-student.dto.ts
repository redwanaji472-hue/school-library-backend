import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 1, description: 'Class ID' })
  @IsInt()
  @Min(1)
  classId: number;

  @ApiProperty({ example: 'Ahmed Mohamed', description: 'Student full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'mohamed.ali', description: 'Student login username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'StudentPass123', description: 'Student login password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: true, description: 'Whether the linked login account is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
