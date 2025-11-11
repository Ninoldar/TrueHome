import { Controller, Get, Param, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get(':id')
  async getProperty(@Param('id') id: string) {
    return this.propertiesService.findById(id);
  }

  @Get('by-apn/:apn')
  async getPropertyByApn(@Param('apn') apn: string) {
    return this.propertiesService.findByApn(apn);
  }

  @Get(':id/history')
  async getPropertyHistory(@Param('id') id: string) {
    return this.propertiesService.getHistory(id);
  }

  @Get(':id/permits')
  async getPropertyPermits(@Param('id') id: string) {
    return this.propertiesService.getPermits(id);
  }

  @Get(':id/sales')
  async getPropertySales(@Param('id') id: string) {
    return this.propertiesService.getSales(id);
  }

  @Get(':id/work-events')
  async getPropertyWorkEvents(@Param('id') id: string) {
    return this.propertiesService.getWorkEvents(id);
  }

  @Get(':id/risk-assessment')
  async getRiskAssessment(@Param('id') id: string) {
    return this.propertiesService.getRiskAssessment(id);
  }

  @Get(':id/timeline')
  async getTimeline(@Param('id') id: string) {
    return this.propertiesService.getTimeline(id);
  }

  @Get(':id/comparables')
  async getComparables(@Param('id') id: string, @Query('radius') radius?: string) {
    const radiusMiles = radius ? parseFloat(radius) : 1;
    return this.propertiesService.getComparables(id, radiusMiles);
  }
}
