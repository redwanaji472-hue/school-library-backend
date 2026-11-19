import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksQueryDto } from './dto/books-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
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
  @ApiOperation({ summary: 'Search active books with pagination' })
  findAll(@Query() query: BooksQueryDto) {
    return this.booksService.findAll(query.search, query.categoryId, query.page ?? 1, query.limit ?? 20);
  }

  @Get('categories')
  @Roles('admin', 'librarian', 'supervisor', 'student')
  @ApiOperation({ summary: 'Get book categories' })
  getCategories() {
    return this.booksService.findAllCategories();
  }

  @Post('categories')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Create a book category' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.booksService.createCategory(dto.name.trim());
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
