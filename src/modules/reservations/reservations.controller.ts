import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get all reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('pending')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get pending reservations' })
  getPending() {
    return this.reservationsService.getPendingReservations();
  }

  @Get(':id')
  @Roles('admin', 'librarian', 'supervisor')
  @ApiOperation({ summary: 'Get reservation by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Create a reservation for a book' })
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @Patch(':id/cancel')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Cancel a reservation' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.cancel(id);
  }

  @Patch(':id/fulfill')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Mark reservation as fulfilled' })
  fulfill(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.fulfill(id);
  }
}
