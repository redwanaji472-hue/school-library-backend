import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsQueryDto } from './dto/students-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me')
  @Roles('student')
  @ApiOperation({ summary: 'Get the signed-in student profile' })
  findMe(@Request() req: any) {
    return this.studentsService.findByUserId(req.user.id);
  }

  @Get('classes')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get class and section options for student forms' })
  @ApiQuery({ name: 'academicYear', required: false, type: String })
  findClasses(@Query('academicYear') academicYear?: string) {
    return this.studentsService.findClasses(academicYear);
  }

  @Get()
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Search and filter students with pagination' })
  findAll(@Query() query: StudentsQueryDto) {
    return this.studentsService.findAll(query);
  }

  @Get('qr/:qrCode')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get student by QR code' })
  findByQr(@Param('qrCode') qrCode: string) {
    return this.studentsService.findByQr(qrCode);
  }

  @Get(':id')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Create a student and student login account (QR code auto-generated)' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Patch(':id')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update a student' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a student' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
