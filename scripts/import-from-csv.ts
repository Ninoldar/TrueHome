import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

/**
 * Import properties from CSV file
 * 
 * Expected CSV format:
 * address,city,state,zipCode,propertyType,yearBuilt,squareFeet,lotSize
 * 
 * Example:
 * 123 Main St,Plano,TX,75023,Single Family Home,1990,2400,0.15
 */

interface CSVProperty {
  address: string
  city: string
  state: string
  zipCode: string
  propertyType?: string
  yearBuilt?: string
  squareFeet?: string
  lotSize?: string
}

async function importFromCSV(csvFilePath: string) {
  console.log(`📂 Reading CSV file: ${csvFilePath}\n`)

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ File not found: ${csvFilePath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

  const records: CSVProperty[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`📊 Found ${records.length} properties in CSV\n`)

  let imported = 0
  let skipped = 0
  let errors = 0

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    // Validate required fields
    if (!record.address || !record.city || !record.state || !record.zipCode) {
      console.error(`⚠️  Row ${i + 1}: Missing required fields, skipping`)
      errors++
      continue
    }

    try {
      // Check if property already exists
      const existing = await prisma.property.findUnique({
        where: {
          address_city_state_zipCode: {
            address: record.address.trim(),
            city: record.city.trim(),
            state: record.state.trim().toUpperCase(),
            zipCode: record.zipCode.trim(),
          },
        },
      })

      if (existing) {
        skipped++
        if ((i + 1) % 100 === 0) {
          console.log(`   Processed ${i + 1}/${records.length}... (${imported} imported, ${skipped} skipped)`)
        }
        continue
      }

      await prisma.property.create({
        data: {
          address: record.address.trim(),
          city: record.city.trim(),
          state: record.state.trim().toUpperCase(),
          zipCode: record.zipCode.trim(),
          propertyType: record.propertyType?.trim() || 'Unknown',
          yearBuilt: record.yearBuilt ? parseInt(record.yearBuilt, 10) : null,
          squareFeet: record.squareFeet ? parseInt(record.squareFeet, 10) : null,
          lotSize: record.lotSize ? parseFloat(record.lotSize) : null,
        },
      })

      imported++
      if ((i + 1) % 100 === 0) {
        console.log(`   Processed ${i + 1}/${records.length}... (${imported} imported, ${skipped} skipped)`)
      }
    } catch (error: any) {
      console.error(`❌ Row ${i + 1} (${record.address}):`, error.message)
      errors++
    }
  }

  console.log(`\n✅ Import complete!`)
  console.log(`   ✅ Imported: ${imported}`)
  console.log(`   ⏭️  Skipped (duplicates): ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📊 Total processed: ${records.length}`)
}

// Get CSV file path from command line argument
const csvFile = process.argv[2]

if (!csvFile) {
  console.error('Usage: pnpm run import-csv <path-to-csv-file>')
  console.error('Example: pnpm run import-csv data/collin-county-properties.csv')
  process.exit(1)
}

importFromCSV(csvFile)
  .catch((error) => {
    console.error('Import error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

