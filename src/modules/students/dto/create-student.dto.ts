import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 1, description: 'Class ID' })
  @IsInt()
  classId: number;

  @ApiProperty({ example: 'Ahmed Mohamed', description: 'Student full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
