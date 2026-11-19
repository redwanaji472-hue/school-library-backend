import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'قصص ومغامرات' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;
}
