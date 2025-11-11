import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { CollinCadIngester } from './sources/collin-cad.ingester';
import { PropertyRadarIngester } from './sources/propertyradar.ingester';
import { WebScraperIngester } from './sources/web-scraper.ingester';

@Module({
  controllers: [IngestionController],
  providers: [
    IngestionService,
    CollinCadIngester,
    PropertyRadarIngester,
    WebScraperIngester,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}

