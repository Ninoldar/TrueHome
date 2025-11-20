# CSV Import Script for Collin CAD Data

## Overview

The `scripts/import-from-csv.ts` script imports property data from Collin CAD CSV files into the database. It maps Collin CAD field names to our Property model fields.

## Field Mappings

The script maps the following Collin CAD CSV fields to database fields:

| Collin CAD Field | Database Field | Notes |
|-----------------|----------------|-------|
| `situsConcatShort` or `situsAddress` | `address` | Full street address |
| `situsCity` | `city` | City name |
| `situsZip` | `zipCode` | ZIP code |
| `situsState` | `state` | State (defaults to "TX") |
| `parcelNumber` or `accountNumber` | `apn` | Assessor's Parcel Number |
| `imprvYearBuilt` | `yearBuilt` | Year the property was built |
| `imprvMainArea` | `livingArea` | Living area in square feet |
| `landSizeSqft` | `lotSize` | Lot size in square feet (preferred) |
| `landSizeAcres` | `lotSize` | Lot size converted from acres to sq ft |
| `bedrooms` | `bedrooms` | Number of bedrooms |
| `bathrooms` | `bathrooms` | Number of bathrooms |
| `propertyUse` or `propertyType` | `propertyType` | Property type (Single Family, Condo, etc.) |

## Usage

```bash
# Import from a CSV file
pnpm run import-csv <path-to-csv-file>

# Example:
pnpm run import-csv ~/Downloads/collin-cad-data.csv
```

## Features

- **Streaming Processing**: Uses streaming to handle large CSV files without running out of memory
- **Duplicate Detection**: Checks for existing properties by APN or address combination
- **Data Updates**: Updates existing properties with new data if found
- **Error Handling**: Continues processing even if individual rows fail
- **Progress Reporting**: Shows progress every 1000 rows processed

## Data Processing

- Addresses are cleaned (extra spaces removed)
- Numeric fields are parsed and cleaned (commas removed)
- Lot size in acres is automatically converted to square feet
- Property types are normalized (e.g., "Single Family" → "Single Family Residence")
- Null/undefined values are excluded from database writes

## Output

The script provides:
- Total rows processed
- Number of properties imported/updated
- Number of rows skipped (missing required data)
- Number of errors encountered

## Notes

- The script requires a `.env.local` file with `DATABASE_URL` set
- Properties are matched by APN first, then by address+city+zipCode combination
- The script will update existing properties if they're found
- County is automatically set to "Collin" for all imported properties

