# Collin County Property Data Import Guide

## Quick Start

### Option 1: Import from CSV File

1. **Prepare your CSV file** with the following format:
```csv
address,city,state,zipCode,propertyType,yearBuilt,squareFeet,lotSize
123 Main St,Plano,TX,75023,Single Family Home,1990,2400,0.15
456 Oak Ave,McKinney,TX,75069,Single Family Home,2005,3200,0.25
```

2. **Run the import script**:
```bash
pnpm run import-csv data/your-file.csv
```

3. **Check the results**:
- The script will show how many properties were imported
- Duplicates will be skipped automatically
- Errors will be logged

### Option 2: Bulk Import via API (Admin Only)

1. **Prepare JSON data**:
```json
{
  "properties": [
    {
      "address": "123 Main St",
      "city": "Plano",
      "state": "TX",
      "zipCode": "75023",
      "propertyType": "Single Family Home",
      "yearBuilt": 1990,
      "squareFeet": 2400,
      "lotSize": 0.15
    }
  ]
}
```

2. **Make API request** (requires admin authentication):
```bash
curl -X POST https://your-domain.com/api/properties/bulk-import \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d @properties.json
```

## Getting Collin County Property Data

### Method 1: Collin County Appraisal District (CCAD)

**Website**: https://www.collincad.org/

**Steps**:
1. Visit CCAD website
2. Look for "Data Export" or "Public Records" section
3. Request property data export (may require FOIA request)
4. Export should include:
   - Property addresses
   - Property types
   - Square footage
   - Year built
   - Lot sizes
   - Owner information

**Contact**:
- Phone: (972) 562-5051
- Email: Check website for contact form

### Method 2: Web Scraping (Check Terms of Service)

**Tools**:
- Puppeteer (Node.js)
- BeautifulSoup (Python)
- Selenium

**Considerations**:
- Check CCAD's Terms of Service
- Implement rate limiting
- Respect robots.txt
- May need to handle CAPTCHAs

### Method 3: Real Estate APIs

#### Zillow API
- **Sign up**: https://www.zillow.com/howto/api/APIOverview.htm
- **Rate limits**: Check documentation
- **Cost**: May require paid access for bulk data

#### Realtor.com API
- **Sign up**: https://developer.realtor.com/
- **Coverage**: Excellent for Collin County
- **Cost**: Check pricing

### Method 4: County Records

#### Collin County Clerk
- **Website**: https://www.collincountytx.gov/clerk
- **Deed Records**: Property sales history
- **Access**: May require in-person visit or online portal

#### Building Permits
- **Cities**: Each city maintains its own permit database
- **Access**: Check individual city websites
- **Data**: Construction, renovations, contractor info

## Data Sources by City

### Plano (285,000+ residents)
- **ZIP Codes**: 75023, 75024, 75025, 75034, 75035, 75093, 75094
- **City Website**: https://www.plano.gov/
- **Permits**: https://www.plano.gov/Departments/Building-Inspection

### McKinney (200,000+ residents)
- **ZIP Codes**: 75069, 75070, 75071
- **City Website**: https://www.mckinneytexas.org/
- **Permits**: Check city website

### Frisco (200,000+ residents)
- **ZIP Codes**: 75033, 75034, 75035
- **City Website**: https://www.friscotexas.gov/
- **Permits**: Check city website

### Allen (105,000+ residents)
- **ZIP Codes**: 75002, 75013
- **City Website**: https://www.cityofallen.org/
- **Permits**: Check city website

### Richardson (120,000+ residents)
- **ZIP Codes**: 75080, 75081, 75082, 75083, 75085
- **City Website**: https://www.cor.net/
- **Permits**: Check city website

## Building Property History

Once addresses are imported, build history from:

### 1. Sales History
- **Source**: County deed records, CCAD sales data
- **Data Points**: Sale dates, prices, buyer/seller names
- **Frequency**: Update monthly

### 2. Work History
- **Source**: Building permits from each city
- **Data Points**: Work type, contractor, dates, costs
- **Frequency**: Update weekly

### 3. Insurance Claims
- **Source**: CLUE reports (if accessible), public records
- **Data Points**: Claim type, date, amount
- **Frequency**: Update as available

### 4. Title Issues
- **Source**: County clerk records, court records
- **Data Points**: Liens, judgments, easements
- **Frequency**: Update monthly

## Sample CSV File

A sample CSV file is included at `data/sample-collin-county.csv`. Use it as a template for your own data.

## Troubleshooting

### "File not found" error
- Ensure the CSV file path is correct
- Use absolute path if relative path doesn't work

### "Missing required fields" error
- Ensure CSV has: address, city, state, zipCode columns
- Check for empty rows

### Import is slow
- Large imports (>10,000 properties) may take time
- Consider splitting into smaller batches
- Use the API bulk import for better performance

### Duplicate properties
- The script automatically skips duplicates
- Check your CSV for duplicate addresses

## Next Steps

1. **Get Property Data**: Choose a method above to obtain Collin County addresses
2. **Format CSV**: Use the sample CSV as a template
3. **Import Data**: Run `pnpm run import-csv`
4. **Enrich Properties**: Use property enricher to add more details
5. **Build History**: Gradually add sales, work, and other history data

## Resources

- **CCAD**: https://www.collincad.org/
- **Collin County**: https://www.collincountytx.gov/
- **Zillow API**: https://www.zillow.com/howto/api/APIOverview.htm
- **Realtor.com API**: https://developer.realtor.com/

