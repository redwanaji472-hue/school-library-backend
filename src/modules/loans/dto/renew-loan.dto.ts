import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RenewLoanDto {
  @ApiPropertyOptional({ example: 7, description: 'Days to extend (default: 7)', default: 7 })
  @IsInt()
  @Min(1)
  @IsOptional()
  extendDays?: number;
}
