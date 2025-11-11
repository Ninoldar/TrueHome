import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('property/:propertyId')
  async generateReport(@Param('propertyId') propertyId: string) {
    return this.reportsService.generateReport(propertyId);
  }

  @Get(':id')
  async getReport(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Get('share/:token')
  async getReportByToken(@Param('token') token: string) {
    return this.reportsService.findByShareToken(token);
  }
}
