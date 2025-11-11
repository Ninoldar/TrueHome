# Implementing Real Property Data - Quick Start

## 🚀 Fastest Path: PropertyRadar API

### Step 1: Sign Up for PropertyRadar
1. Visit https://www.propertyradar.com/
2. Sign up for API access (~$50-200/month)
3. Get your API key

### Step 2: Add API Key to Environment
Add to your `.env` file:
```bash
PROPERTY_RADAR_API_KEY=your_api_key_here
```

### Step 3: Test the Integration
```bash
# Fetch a real property
curl "http://localhost:4000/ingestion/fetch-propertyradar?address=1234%20Main%20St&city=Plano&state=TX"
```

### Step 4: Use in Your App
The property will be automatically:
- Fetched from PropertyRadar
- Stored in your database
- Sales history included (if available)
- Ready to search and display

## 🔧 Alternative: Web Scraping (Free but more work)

### Step 1: Install Scraping Tools
```bash
cd apps/api
npm install puppeteer cheerio
```

### Step 2: Implement Scraper
See `apps/api/src/ingestion/sources/web-scraper.ingester.ts` for template

### Step 3: Research Target Website
- Visit the CAD/city website
- Inspect HTML structure
- Identify data endpoints
- Check robots.txt and ToS

### Step 4: Implement & Test
- Write scraping logic
- Handle rate limiting
- Test with real addresses
- Monitor for website changes

## 📊 Data Sources Comparison

| Source | Cost | Ease | Data Quality | Best For |
|--------|------|------|-------------|----------|
| PropertyRadar API | $50-200/mo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | MVP, Production |
| Web Scraping | Free | ⭐⭐ | ⭐⭐⭐ | Budget-conscious |
| ATTOM Data | $$$$ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise |
| County CSV Export | Free | ⭐⭐⭐ | ⭐⭐⭐⭐ | Bulk import |

## 🎯 Recommended Next Steps

1. **For MVP/Demo**: Use PropertyRadar API
   - Quick to implement ✅
   - Reliable data ✅
   - Good documentation ✅

2. **For Production**: Combine multiple sources
   - PropertyRadar for property data
   - Web scraping for permits (lower volume)
   - County records for sales/ownership

3. **For Scale**: Consider commercial APIs
   - ATTOM or CoreLogic
   - More comprehensive
   - Better support

## 📝 Example Usage

### Via API Endpoint
```bash
# Fetch real property
curl "http://localhost:4000/ingestion/fetch-propertyradar?address=1234%20Main%20St&city=Plano&state=TX"
```

### Via Code
```typescript
// In your service
const property = await propertyRadarIngester.ingestPropertyByAddress(
  '1234 Main St',
  'Plano',
  'TX'
);
```

## ⚠️ Important Notes

- **Rate Limiting**: Respect API limits and implement delays for scraping
- **Legal**: Always check Terms of Service
- **Data Quality**: Validate data before storing
- **Error Handling**: Implement retry logic and error logging
- **Costs**: Monitor API usage to control costs

