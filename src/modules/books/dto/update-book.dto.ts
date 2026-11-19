import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: '978-0000000000' })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiPropertyOptional({ example: 'New Title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'New Author' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ example: 'Publisher Name' })
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

  @ApiPropertyOptional({ example: 300 })
  @IsInt()
  @Min(1)
  @IsOptional()
  pages?: number;

  @ApiPropertyOptional({ example: 'intermediate' })
  @IsString()
  @IsOptional()
  readingLevel?: string;

  @ApiPropertyOptional({ example: 'Book description...' })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/covers/book.jpg' })
  @IsString()
  @MaxLength(2048)
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
