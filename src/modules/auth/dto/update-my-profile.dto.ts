import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ example: 'Library Staff' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'library.staff' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  username?: string;
}
