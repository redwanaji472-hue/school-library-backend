import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: 'STU-AB12CD', description: 'Student QR code' })
  @IsString()
  @IsNotEmpty()
  studentQrCode: string;

  @ApiProperty({ example: 'BK-AB12CD', description: 'Book copy QR code' })
  @IsString()
  @IsNotEmpty()
  copyQrCode: string;
}
