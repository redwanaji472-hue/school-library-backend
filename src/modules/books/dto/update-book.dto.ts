import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 2 })
  @IsInt()
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
  @IsOptional()
  publicationYear?: number;

  @ApiPropertyOptional({ example: 'العربية' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 300 })
  @IsInt()
  @IsOptional()
  pages?: number;

  @ApiPropertyOptional({ example: 'intermediate' })
  @IsString()
  @IsOptional()
  readingLevel?: string;

  @ApiPropertyOptional({ example: 'Book description...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
