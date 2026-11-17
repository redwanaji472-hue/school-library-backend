import { IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReturnLoanDto {
  @ApiProperty({ example: 'BK-AB12CD', description: 'QR code printed on the physical copy' })
  @IsString()
  @IsNotEmpty()
  copyQrCode: string;

  @ApiPropertyOptional({ example: 'available', enum: ['available', 'maintenance'], default: 'available' })
  @IsIn(['available', 'maintenance'])
  @IsOptional()
  copyStatus?: 'available' | 'maintenance';
}
