import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  categoryId: number;

  @ApiPropertyOptional({ example: '978-1234567890', description: 'ISBN' })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiProperty({ example: 'The Great Gatsby', description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Book author' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ example: 5, description: 'Number of copies' })
  @IsInt()
  @IsOptional()
  numberOfCopies?: number;
}
