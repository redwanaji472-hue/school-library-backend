import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { RenewLoanDto } from './dto/renew-loan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  findAll() {
    return this.loansService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active (not returned) loans' })
  getActive() {
    return this.loansService.getActiveLoans();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue loans' })
  getOverdue() {
    return this.loansService.getOverdueLoans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.findOne(id);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout a book (scan student + copy QR codes)' })
  checkout(@Body() createLoanDto: CreateLoanDto, @Request() req: any) {
    return this.loansService.checkout(createLoanDto, req.user.id);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.returnBook(id);
  }

  @Patch(':id/renew')
  @ApiOperation({ summary: 'Renew a loan (extend due date)' })
  renew(@Param('id', ParseIntPipe) id: number, @Body() renewDto: RenewLoanDto) {
    return this.loansService.renew(id, renewDto.extendDays ?? 7);
  }
}
