import { Injectable, Logger } from '@nestjs/common';
import { IngestionService } from '../ingestion.service';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';

/**
 * Web Scraper Ingester
 * 
 * This service handles web scraping from public property data sources.
 * 
 * ⚠️ IMPORTANT: Always check:
 * - robots.txt
 * - Terms of Service
 * - Rate limits (add delays between requests)
 * - Legal compliance
 * 
 * Free sources:
 * - County Appraisal Districts (public records)
 * - County Clerk/Recorder (public records)
 * - City permit portals (public records)
 */
@Injectable()
export class WebScraperIngester {
  private readonly logger = new Logger(WebScraperIngester.name);

  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Scrape property data by address from public sources
   * 
   * This uses a combination of free sources:
   * 1. Geocoding API (free tier) for coordinates
   * 2. Public property databases
   * 3. County records
   */
  async scrapePropertyByAddress(address: string, city: string, state: string = 'TX') {
    try {
      // Step 1: Get coordinates using free geocoding
      const coords = await this.geocodeAddress(address, city, state);
      
      // Step 2: Try to find property in public databases
      // Note: Actual implementation depends on available public APIs
      const propertyData = await this.searchPublicPropertyDatabase(
        address,
        city,
        state,
        coords
      );

      if (propertyData) {
        // Step 3: Ingest the property
        const property = await this.ingestionService.ingestProperty(
          propertyData,
          'public_scraper',
          (propertyData as any).apn,
          propertyData
        );

        return property;
      }

      throw new Error(`Property not found in public sources: ${address}, ${city}, ${state}`);
    } catch (error) {
      this.logger.error(`Error scraping property: ${error.message}`);
      throw error;
    }
  }

  /**
   * Geocode address using free services
   * Uses Nominatim (OpenStreetMap) - free, no API key required
   */
  private async geocodeAddress(address: string, city: string, state: string) {
    try {
      const fullAddress = `${address}, ${city}, ${state}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
      
      // Add delay to respect rate limits (1 request per second)
      await this.delay(1000);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'TrueHome Property Scraper 1.0', // Required by Nominatim
        },
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      }

      return { latitude: null, longitude: null };
    } catch (error) {
      this.logger.warn(`Geocoding failed: ${error.message}`);
      return { latitude: null, longitude: null };
    }
  }

  /**
   * Search public property databases
   * 
   * This is a template - actual implementation depends on:
   * - Available public APIs
   * - Website structure if scraping
   * - Data format
   */
  private async searchPublicPropertyDatabase(
    address: string,
    city: string,
    state: string,
    coords: { latitude: number | null; longitude: number | null }
  ) {
    // For now, return a basic structure with geocoded coordinates
    // In production, you would:
    // 1. Scrape county CAD website
    // 2. Query public property databases
    // 3. Parse county records
    
    // This is a placeholder that creates a property with available data
    // You'll need to implement actual scraping based on your target sources
    return {
      address: address,
      city: city,
      state: state,
      zipCode: '', // Would need to get from geocoding or scraping
      latitude: coords.latitude,
      longitude: coords.longitude,
      // Other fields would come from actual scraping
    };
  }

  /**
   * Scrape Collin CAD website for property data
   * 
   * Note: This requires inspecting the actual website structure
   * and adapting the selectors accordingly
   */
  async scrapeCollinCad(apn: string) {
    let browser;
    try {
      this.logger.log(`Scraping Collin CAD for APN: ${apn}`);
      
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Navigate to Collin CAD search (adjust URL as needed)
      const searchUrl = `https://www.collincad.org/property-search?apn=${apn}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for property details to load (adjust selector based on actual site)
      await page.waitForSelector('body', { timeout: 10000 });
      
      // Get page content
      const html = await page.content();
      const $ = cheerio.load(html);
      
      // Extract property data (adjust selectors based on actual website structure)
      // This is a template - you'll need to inspect the actual site
      const propertyData = {
        apn: apn,
        address: this.extractText($, '.property-address, .address, [data-address]'),
        city: this.extractText($, '.property-city, .city, [data-city]') || 'Plano',
        state: 'TX',
        zipCode: this.extractText($, '.property-zip, .zip, [data-zip]') || '',
        lotSize: this.extractNumber($, '.lot-size, [data-lot-size]'),
        livingArea: this.extractNumber($, '.living-area, .square-feet, [data-living-area]'),
        bedrooms: this.extractNumber($, '.bedrooms, [data-bedrooms]'),
        bathrooms: this.extractNumber($, '.bathrooms, [data-bathrooms]'),
        yearBuilt: this.extractNumber($, '.year-built, [data-year-built]'),
        propertyType: this.extractText($, '.property-type, [data-property-type]'),
      };
      
      await browser.close();
      
      return propertyData;
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      this.logger.error(`Error scraping Collin CAD: ${error.message}`);
      throw new Error(`Failed to scrape Collin CAD: ${error.message}`);
    }
  }

  /**
   * Helper to extract text from Cheerio selector
   */
  private extractText($: cheerio.CheerioAPI, selector: string): string {
    const elements = selector.split(',').map(s => s.trim());
    for (const sel of elements) {
      const text = $(sel).first().text().trim();
      if (text) return text;
    }
    return '';
  }

  /**
   * Helper to extract number from Cheerio selector
   */
  private extractNumber($: cheerio.CheerioAPI, selector: string): number | null {
    const text = this.extractText($, selector);
    if (!text) return null;
    
    // Extract numbers from text (e.g., "2,500 sq ft" -> 2500)
    const match = text.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  /**
   * Scrape building permits from city portal
   * 
   * Template for city-specific permit scraping
   */
  async scrapeCityPermits(address: string, city: string) {
    // Each city has different portal structure
    // You'll need to implement city-specific logic
    
    const cityPortals: Record<string, string> = {
      plano: 'https://www.plano.gov/permits',
      frisco: 'https://www.friscotexas.gov/permits',
      mckinney: 'https://www.mckinneytexas.org/permits',
      allen: 'https://www.cityofallen.org/permits',
      richardson: 'https://www.cor.net/permits',
    };

    const portalUrl = cityPortals[city.toLowerCase()];
    if (!portalUrl) {
      throw new Error(`Permit portal not configured for city: ${city}`);
    }

    // Implementation would go here
    // 1. Navigate to permit search
    // 2. Search by address
    // 3. Extract permit data
    // 4. Return permits array

    this.logger.warn(`Permit scraping for ${city} not yet fully implemented`);
    return [];
  }

  /**
   * Ingest property from web scraping
   */
  async ingestPropertyByAddress(address: string, city: string, state: string = 'TX') {
    // First try to get coordinates
    const coords = await this.geocodeAddress(address, city, state);
    
    // Create basic property data
    const propertyData = {
      address,
      city,
      state,
      zipCode: '', // Would need additional lookup
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    // Ingest the property
    const property = await this.ingestionService.ingestProperty(
      propertyData,
      'public_scraper',
      undefined, // No APN from geocoding alone
      propertyData
    );

    return property;
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
