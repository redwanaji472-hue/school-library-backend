import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { RenewLoanDto } from './dto/renew-loan.dto';
import { ReturnLoanDto } from './dto/return-loan.dto';
import { LoansQueryDto } from './dto/loans-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get('me')
  @Roles('student')
  @ApiOperation({ summary: 'Get the signed-in student loan history' })
  getMyLoans(@Request() req: any, @Query() query: LoansQueryDto) {
    return this.loansService.findByStudent(req.user.studentId, query);
  }

  @Get()
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Search, filter, and paginate loans' })
  findAll(@Query() query: LoansQueryDto) {
    return this.loansService.findAll(query);
  }

  @Get('active')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get all active (not returned) loans' })
  getActive() {
    return this.loansService.getActiveLoans();
  }

  @Get('overdue')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get overdue loans' })
  getOverdue() {
    return this.loansService.getOverdueLoans();
  }

  @Get(':id')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get loan by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.findOne(id);
  }

  @Post('checkout')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Checkout a book (scan student + copy QR codes)' })
  checkout(@Body() createLoanDto: CreateLoanDto, @Request() req: any) {
    return this.loansService.checkout(createLoanDto, req.user.id);
  }

  @Patch(':id/return')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Return a book' })
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.returnBook(id);
  }

  @Patch('return')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Return a book by scanning its copy QR code' })
  returnByQr(@Body() dto: ReturnLoanDto) {
    return this.loansService.returnByCopyQr(dto.copyQrCode, dto.copyStatus ?? 'available');
  }

  @Patch(':id/renew')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Renew a loan (extend due date)' })
  renew(@Param('id', ParseIntPipe) id: number, @Body() renewDto: RenewLoanDto) {
    return this.loansService.renew(id, renewDto.extendDays ?? 7);
  }
}
