# Free Property Data Sources - Implementation Guide

## ✅ What's Implemented

I've set up free web scraping infrastructure for pulling real property data from public sources.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/api
npm install
```

This will install:
- `puppeteer` - For browser automation/scraping
- `cheerio` - For HTML parsing
- `axios` - For HTTP requests

### 2. Use the Free Scraper

#### Option A: Basic Property (Geocoding Only)
```bash
# Fetch property with geocoding (free, no API key needed)
curl "http://localhost:4000/ingestion/fetch-free?address=1234%20Main%20St&city=Plano&state=TX"
```

This will:
- ✅ Geocode the address (get lat/long) using OpenStreetMap (free)
- ✅ Create a property record in your database
- ⚠️ Limited property details (you'll need to add more sources)

#### Option B: Scrape Collin CAD (Full Details)
```bash
# Scrape from Collin CAD website (requires website inspection)
curl "http://localhost:4000/ingestion/scrape-collin-cad?apn=123456789"
```

**Note**: You'll need to inspect the actual Collin CAD website and update the selectors in `web-scraper.ingester.ts` based on their HTML structure.

## 📋 Free Data Sources Available

### 1. **OpenStreetMap Geocoding** ✅ Implemented
- **What**: Address to coordinates (lat/long)
- **Cost**: Free, no API key
- **Rate Limit**: 1 request/second (respected automatically)
- **Status**: Working

### 2. **County Appraisal Districts** ⚠️ Template Ready
- **What**: Property details, assessed values, APNs
- **Cost**: Free (public records)
- **Method**: Web scraping
- **Status**: Template implemented, needs website-specific selectors

### 3. **County Clerk/Recorder** 📝 To Implement
- **What**: Sales records, ownership transfers
- **Cost**: Free (public records)
- **Method**: Web scraping or document parsing
- **Status**: Not yet implemented

### 4. **City Permit Portals** 📝 To Implement
- **What**: Building permits, inspections
- **Cost**: Free (public records)
- **Method**: Web scraping (city-specific)
- **Status**: Template ready, needs city-specific implementation

## 🔧 How to Implement Full Scraping

### Step 1: Inspect Target Website

For Collin CAD:
1. Visit https://www.collincad.org/
2. Search for a property
3. Open browser DevTools (F12)
4. Inspect the HTML structure
5. Find CSS selectors for:
   - Address
   - Property details (bedrooms, bathrooms, etc.)
   - Lot size
   - Year built
   - etc.

### Step 2: Update Scraper Selectors

Edit `apps/api/src/ingestion/sources/web-scraper.ingester.ts`:

```typescript
// Update the scrapeCollinCad method with actual selectors
const propertyData = {
  apn: apn,
  address: $('.actual-address-class').text().trim(), // Update selector
  city: $('.actual-city-class').text().trim(), // Update selector
  // ... etc
};
```

### Step 3: Test

```bash
curl "http://localhost:4000/ingestion/scrape-collin-cad?apn=YOUR_APN"
```

## 📊 Current Capabilities

### ✅ Working Now
- Geocoding addresses (free)
- Creating property records with coordinates
- Basic property ingestion

### ⚠️ Needs Website Inspection
- Full property details from CAD websites
- Need to inspect actual HTML structure
- Update CSS selectors in scraper

### 📝 To Be Implemented
- Sales history scraping
- Permit data scraping
- Ownership records scraping

## 🎯 Recommended Next Steps

1. **Start with geocoding** (already working):
   ```bash
   curl "http://localhost:4000/ingestion/fetch-free?address=YOUR_ADDRESS&city=YOUR_CITY"
   ```

2. **Inspect Collin CAD website**:
   - Visit https://www.collincad.org/
   - Find property search
   - Inspect HTML structure
   - Update selectors in `web-scraper.ingester.ts`

3. **Test scraping**:
   ```bash
   curl "http://localhost:4000/ingestion/scrape-collin-cad?apn=YOUR_APN"
   ```

4. **Add more sources**:
   - County clerk records
   - City permit portals
   - Other public databases

## ⚠️ Important Notes

### Rate Limiting
- OpenStreetMap: 1 request/second (automatically handled)
- Website scraping: Add delays between requests
- Don't overload servers

### Legal Considerations
- ✅ Public records are legal to access
- ⚠️ Check robots.txt before scraping
- ⚠️ Respect Terms of Service
- ✅ Use reasonable delays between requests

### Error Handling
- Websites change structure - scrapers may break
- Implement retry logic
- Log errors for debugging
- Have fallback methods

## 🔍 Example Usage

### Basic Property (Geocoding)
```bash
# This works right now - no setup needed
curl "http://localhost:4000/ingestion/fetch-free?address=1234%20Main%20Street&city=Plano&state=TX"
```

### Full CAD Scraping (Needs Selector Updates)
```bash
# This needs website inspection first
curl "http://localhost:4000/ingestion/scrape-collin-cad?apn=123456789"
```

## 💡 Tips

1. **Start Simple**: Use geocoding first to get properties in your database
2. **Inspect Websites**: Use browser DevTools to find selectors
3. **Test Incrementally**: Test each selector individually
4. **Add Delays**: Respect rate limits with delays
5. **Monitor Changes**: Websites change - scrapers need maintenance

## 🐛 Troubleshooting

**Scraper not working?**
- Check if website structure changed
- Verify selectors in DevTools
- Check for JavaScript-rendered content (may need different approach)

**Geocoding failing?**
- Check address format
- Verify city/state spelling
- Check rate limits (1 req/sec)

**No data returned?**
- Website may require login
- May need to handle CAPTCHA
- May need to use different approach

---

**You now have free scraping infrastructure!** Start with geocoding, then add full scraping as you inspect target websites.

