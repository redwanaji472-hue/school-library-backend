import { Controller, Get, Patch, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get inventory summary (totals, status counts, loans)' })
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get('copies')
  @ApiOperation({ summary: 'Get copies by status' })
  @ApiQuery({ name: 'status', example: 'available' })
  getCopiesByStatus(@Query('status') status: string) {
    return this.inventoryService.getCopiesByStatus(status);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get books with low available copies' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  getLowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getBooksWithLowStock(threshold ?? 1);
  }

  @Patch('copies/:id/status')
  @ApiOperation({ summary: 'Update a copy status (maintenance, lost, withdrawn, etc.)' })
  @ApiQuery({ name: 'status' })
  updateCopyStatus(@Param('id', ParseIntPipe) id: number, @Query('status') status: string) {
    return this.inventoryService.updateCopyStatus(id, status);
  }
}
