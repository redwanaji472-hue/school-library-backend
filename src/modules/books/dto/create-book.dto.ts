import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  @Min(1)
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

  @ApiPropertyOptional({ example: 'School Library Press' })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsInt()
  @Min(0)
  @IsOptional()
  publicationYear?: number;

  @ApiPropertyOptional({ example: 'العربية' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 240 })
  @IsInt()
  @Min(1)
  @IsOptional()
  pages?: number;

  @ApiPropertyOptional({ example: 'beginner' })
  @IsString()
  @IsOptional()
  readingLevel?: string;

  @ApiPropertyOptional({ example: 'A short description of the book.' })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/covers/book.jpg', description: 'Cover image URL' })
  @IsString()
  @MaxLength(2048)
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: 5, description: 'Number of copies' })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  numberOfCopies?: number;
}
