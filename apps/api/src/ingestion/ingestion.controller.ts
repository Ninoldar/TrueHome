import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { PropertyRadarIngester } from './sources/propertyradar.ingester';
import { WebScraperIngester } from './sources/web-scraper.ingester';

@Controller('ingestion')
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly propertyRadarIngester: PropertyRadarIngester,
    private readonly webScraperIngester: WebScraperIngester,
  ) {}

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

  @Post('work-event')
  async ingestWorkEvent(@Body() body: any) {
    return this.ingestionService.ingestWorkEvent(
      body.propertyId,
      body.data,
      body.source
    );
  }

  /**
   * Fetch and ingest property from PropertyRadar API (paid)
   * 
   * Example: GET /ingestion/fetch-propertyradar?address=123 Main St&city=Plano&state=TX
   */
  @Get('fetch-propertyradar')
  async fetchFromPropertyRadar(
    @Query('address') address: string,
    @Query('city') city: string,
    @Query('state') state: string = 'TX',
  ) {
    if (!address || !city) {
      return { error: 'Address and city are required' };
    }

    try {
      const property = await this.propertyRadarIngester.ingestPropertyByAddress(
        address,
        city,
        state
      );
      return {
        success: true,
        property,
        message: 'Property fetched and ingested successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Fetch and ingest property using FREE public sources (web scraping)
   * 
   * Example: GET /ingestion/fetch-free?address=1234 Main St&city=Plano&state=TX
   */
  @Get('fetch-free')
  async fetchFromFreeSources(
    @Query('address') address: string,
    @Query('city') city: string,
    @Query('state') state: string = 'TX',
  ) {
    if (!address || !city) {
      return { error: 'Address and city are required' };
    }

    try {
      const property = await this.webScraperIngester.ingestPropertyByAddress(
        address,
        city,
        state
      );
      return {
        success: true,
        property,
        message: 'Property fetched from free public sources and ingested successfully',
        note: 'This uses geocoding and basic property data. For full details, implement CAD website scraping.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Scrape Collin CAD by APN (free, but requires website inspection)
   * 
   * Example: GET /ingestion/scrape-collin-cad?apn=123456789
   */
  @Get('scrape-collin-cad')
  async scrapeCollinCad(@Query('apn') apn: string) {
    if (!apn) {
      return { error: 'APN is required' };
    }

    try {
      const propertyData = await this.webScraperIngester.scrapeCollinCad(apn);
      
      // Ingest the scraped property
      const property = await this.ingestionService.ingestProperty(
        propertyData,
        'collin_cad_scraper',
        apn,
        propertyData
      );

      return {
        success: true,
        property,
        message: 'Property scraped from Collin CAD and ingested successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        note: 'You may need to inspect the Collin CAD website structure and update the scraper selectors.',
      };
    }
  }
}

