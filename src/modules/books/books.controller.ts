import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles('admin', 'librarian', 'supervisor', 'student')
  @ApiOperation({ summary: 'Search active books with copies' })
  @ApiQuery({ name: 'search', required: false, description: 'Search title, author, or ISBN' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(@Query('search') search?: string, @Query('categoryId') categoryId?: string) {
    const parsedCategoryId = categoryId === undefined ? undefined : Number(categoryId);
    if (parsedCategoryId !== undefined && (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1)) {
      throw new BadRequestException('categoryId must be a positive integer');
    }
    return this.booksService.findAll(search, parsedCategoryId);
  }

  @Get('categories')
  @Roles('admin', 'librarian', 'supervisor', 'student')
  @ApiOperation({ summary: 'Get book categories' })
  getCategories() {
    return this.booksService.findAllCategories();
  }

  @Get(':id')
  @Roles('admin', 'librarian', 'supervisor', 'student')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Create a book (auto-generates copies)' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update a book' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Archive a book' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
