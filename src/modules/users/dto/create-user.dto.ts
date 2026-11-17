import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Role ID (use role or roleId)' })
  @IsInt()
  @IsOptional()
  roleId?: number;

  @ApiPropertyOptional({
    example: 'student',
    enum: ['admin', 'librarian', 'supervisor', 'student'],
    description: 'Role name. The student role is a regular user account.',
  })
  @IsString()
  @IsIn(['admin', 'librarian', 'supervisor', 'student'])
  @IsOptional()
  role?: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: true, description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
