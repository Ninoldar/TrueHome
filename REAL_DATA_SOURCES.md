# Real Property Data Sources Guide

This guide covers how to pull real property information for TrueHome.

## 🎯 Data Source Options

### 1. **Public Government Sources (Free, but may require scraping)**

#### A. County Appraisal Districts (CAD)
- **What you get**: Property details, assessed values, APNs, lot sizes, building info
- **Access**: Usually public websites, some have APIs
- **Example**: Collin CAD (https://www.collincad.org/)
- **Method**: Web scraping or API if available
- **Legal**: ✅ Public records, legal to scrape

#### B. County Clerk/Recorder Offices
- **What you get**: Deeds, ownership transfers, sales records, liens
- **Access**: Public records, may require in-person or online portal access
- **Example**: Collin County Clerk (https://www.collincountytx.gov/clerk/)
- **Method**: Document parsing, API if available, or manual data entry
- **Legal**: ✅ Public records

#### C. City Building Permit Portals
- **What you get**: Building permits, inspections, contractor info
- **Access**: City websites, varies by jurisdiction
- **Examples**: 
  - Plano: https://www.plano.gov/permits
  - Frisco: https://www.friscotexas.gov/permits
- **Method**: Web scraping or API
- **Legal**: ✅ Public records

### 2. **Commercial APIs (Paid, but easier)**

#### A. PropertyRadar / RealtyMole
- **Cost**: $50-500/month depending on volume
- **What you get**: Comprehensive property data, sales history, ownership
- **API**: RESTful API with good documentation
- **Best for**: Quick integration, reliable data

#### B. ATTOM Data Solutions
- **Cost**: Enterprise pricing ($$$)
- **What you get**: Comprehensive property, sales, ownership, permits
- **API**: Professional-grade API
- **Best for**: Production applications with budget

#### C. CoreLogic / Black Knight
- **Cost**: Enterprise only ($$$$)
- **What you get**: Industry-standard property data
- **Best for**: Large-scale commercial applications

### 3. **Real Estate APIs (Limited)**

#### A. Zillow API (Zillow Web Services)
- **Status**: Discontinued for new users (legacy only)
- **Alternative**: Zillow Group Marketplace API (requires partnership)

#### B. Redfin API
- **Status**: No public API, scraping prohibited

#### C. Realtor.com API
- **Status**: Limited API access, requires partnership

### 4. **Geocoding & Address APIs**

#### A. Google Maps Geocoding API
- **Cost**: Pay-as-you-go, $5 per 1000 requests
- **What you get**: Address validation, lat/long coordinates
- **Use case**: Convert addresses to coordinates

#### B. Mapbox Geocoding API
- **Cost**: Free tier available, then pay-as-you-go
- **What you get**: Address validation, coordinates, reverse geocoding

## 🚀 Implementation Strategies

### Strategy 1: Web Scraping (Free, but more work)

**Pros:**
- Free
- Access to public data
- No API limits (within reason)

**Cons:**
- Requires maintenance (sites change)
- Rate limiting needed
- Legal considerations (check ToS)
- More complex implementation

**Tools:**
- Puppeteer (headless browser)
- Cheerio (HTML parsing)
- Playwright (alternative to Puppeteer)

### Strategy 2: Public APIs (Free, if available)

**Pros:**
- Structured data
- More reliable
- Easier to maintain

**Cons:**
- Not all jurisdictions have APIs
- May have rate limits
- May require registration

### Strategy 3: Commercial APIs (Paid)

**Pros:**
- Reliable, structured data
- Good documentation
- Support available
- Often includes historical data

**Cons:**
- Cost
- May have usage limits
- Vendor lock-in

## 📋 Step-by-Step Implementation

### Option A: Implement Collin CAD Scraper

1. **Research the website structure**
   - Visit https://www.collincad.org/
   - Find property search functionality
   - Identify data endpoints

2. **Create scraper service**
   - Use Puppeteer for dynamic content
   - Parse HTML or JSON responses
   - Handle rate limiting

3. **Implement data transformation**
   - Map CAD data to our schema
   - Handle missing fields
   - Validate data

### Option B: Use PropertyRadar API (Recommended for MVP)

1. **Sign up for API access**
   - Visit PropertyRadar or RealtyMole
   - Get API key

2. **Implement API client**
   - Create service to call API
   - Handle authentication
   - Implement rate limiting

3. **Map to our schema**
   - Transform API responses
   - Store in database

### Option C: Manual CSV Import

1. **Get data exports**
   - Request CSV exports from county
   - Some counties provide bulk downloads

2. **Parse and import**
   - Use CSV parser
   - Batch import via ingestion API
   - Handle duplicates

## 🔧 Quick Start: PropertyRadar API Example

Here's how to implement PropertyRadar API integration:

```typescript
// apps/api/src/ingestion/sources/propertyradar.ingester.ts
import { Injectable } from '@nestjs/common';
import { IngestionService } from '../ingestion.service';

@Injectable()
export class PropertyRadarIngester {
  constructor(private readonly ingestionService: IngestionService) {}

  async fetchPropertyByAddress(address: string, city: string, state: string) {
    const apiKey = process.env.PROPERTY_RADAR_API_KEY;
    const response = await fetch(
      `https://api.propertyradar.com/v1/properties?address=${encodeURIComponent(address)}&city=${city}&state=${state}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const data = await response.json();
    return this.transformToProperty(data);
  }

  private transformToProperty(apiData: any) {
    return {
      apn: apiData.apn,
      address: apiData.address,
      city: apiData.city,
      state: apiData.state,
      zipCode: apiData.zip,
      latitude: apiData.latitude,
      longitude: apiData.longitude,
      lotSize: apiData.lotSize,
      livingArea: apiData.squareFeet,
      bedrooms: apiData.bedrooms,
      bathrooms: apiData.bathrooms,
      yearBuilt: apiData.yearBuilt,
      propertyType: apiData.propertyType,
    };
  }
}
```

## 🎯 Recommended Approach for MVP

1. **Start with PropertyRadar/RealtyMole API** (easiest, ~$50/month)
   - Quick to implement
   - Reliable data
   - Good for demo/MVP

2. **Add web scraping for permits** (free)
   - City permit portals
   - Lower volume, less critical

3. **Add county clerk data** (manual or scraping)
   - Sales records
   - Ownership transfers

4. **Scale up with commercial APIs** (when ready)
   - ATTOM or CoreLogic for production
   - More comprehensive data

## 📝 Legal Considerations

- ✅ **Public records are legal to access** - County records, permits, etc.
- ⚠️ **Check Terms of Service** - Some sites prohibit scraping
- ⚠️ **Rate limiting** - Don't overload servers
- ⚠️ **Respect robots.txt** - Check before scraping
- ✅ **Commercial APIs** - Always legal, you're paying for access

## 🔗 Useful Resources

- **PropertyRadar**: https://www.propertyradar.com/
- **RealtyMole**: https://realtymole.com/
- **ATTOM Data**: https://www.attomdata.com/
- **Collin CAD**: https://www.collincad.org/
- **Collin County Clerk**: https://www.collincountytx.gov/clerk/

## 💡 Next Steps

1. Choose a data source (recommend PropertyRadar for MVP)
2. Get API access / research scraping approach
3. Implement ingester service
4. Test with real addresses
5. Set up scheduled ingestion jobs
6. Monitor data quality

