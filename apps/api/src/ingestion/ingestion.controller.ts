import { Controller, Post, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('property')
  async ingestProperty(
    @Body()
    body: {
      property: any;
      source: string;
      sourceId?: string;
      rawPayload?: any;
    }
  ) {
    return this.ingestionService.ingestProperty(
      body.property,
      body.source,
      body.sourceId,
      body.rawPayload
    );
  }

  @Post('ownership')
  async ingestOwnership(@Body() body: any) {
    return this.ingestionService.ingestOwnershipEvent(
      body.propertyId,
      body.data,
      body.source
    );
  }

  @Post('sale')
  async ingestSale(@Body() body: any) {
    return this.ingestionService.ingestSale(
      body.propertyId,
      body.data,
      body.source
    );
  }

  @Post('permit')
  async ingestPermit(@Body() body: any) {
    return this.ingestionService.ingestPermit(
      body.propertyId,
      body.data,
      body.source
    );
  }
}

