import { PrismaClient } from '@prisma/client'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { resolve } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

// Configure Prisma with connection pool settings
const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

interface CollinCADRow {
  // Address fields
  situsConcatShort?: string
  situsAddress?: string
  situsCity?: string
  situsZip?: string
  geoID?: string
  propID?: string
  
  // Property details
  imprvYearBuilt?: string
  imprvMainArea?: string // Living area in square feet
  landSizeAcres?: string
  landSizeSqft?: string
  
  // Property characteristics
  bedrooms?: string
  bathrooms?: string
  propertyType?: string
  propertyUse?: string
}

interface PropertyData {
  address: string
  city: string
  state: string
  zipCode: string
  county: string
  apn?: string
  yearBuilt?: number
  livingArea?: number
  lotSize?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

function cleanAddress(address: string | undefined): string | null {
  if (!address) return null
  return address.trim().replace(/\s+/g, ' ') || null
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null
  const cleaned = value.toString().replace(/,/g, '').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

function parseInteger(value: string | undefined): number | null {
  if (!value) return null
  const cleaned = value.toString().replace(/,/g, '').trim()
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? null : parsed
}

function acresToSqft(acres: string | undefined): number | null {
  if (!acres) return null
  const acresNum = parseFloat(acres.toString().replace(/,/g, ''))
  if (isNaN(acresNum)) return null
  return Math.round(acresNum * 43560) // 1 acre = 43,560 sq ft
}

function parsePropertyType(propertyUse: string | undefined, propertyType: string | undefined): string | null {
  if (propertyUse) {
    const use = propertyUse.toLowerCase()
    if (use.includes('single family') || use.includes('residential')) {
      return 'Single Family Residence'
    }
    if (use.includes('condo') || use.includes('condominium')) {
      return 'Condominium'
    }
    if (use.includes('townhouse') || use.includes('townhome')) {
      return 'Townhouse'
    }
    if (use.includes('multi') || use.includes('duplex') || use.includes('triplex')) {
      return 'Multi-Family'
    }
  }
  if (propertyType) {
    return propertyType.trim() || null
  }
  return null
}

function processRow(row: CollinCADRow): PropertyData | null {
  // Extract address
  const address = cleanAddress(row.situsConcatShort || row.situsAddress)
  if (!address) return null

  // Extract city and zip
  const city = row.situsCity?.trim() || 'Unknown'
  const zipCode = row.situsZip?.trim() || ''
  
  // Validate required fields
  if (!zipCode || zipCode.length < 5) return null

  // Extract APN (Assessor's Parcel Number) - geoID is the APN in this CSV
  const apn = row.geoID?.trim() || row.propID?.trim() || undefined

  // Extract property details
  const yearBuilt = parseInteger(row.imprvYearBuilt)
  const livingArea = parseNumber(row.imprvMainArea)
  
  // Lot size - prefer sqft, fallback to converting acres
  let lotSize: number | undefined = undefined
  if (row.landSizeSqft) {
    lotSize = parseNumber(row.landSizeSqft) || undefined
  } else if (row.landSizeAcres) {
    lotSize = acresToSqft(row.landSizeAcres) || undefined
  }

  const bedrooms = parseInteger(row.bedrooms) || undefined
  const bathrooms = parseNumber(row.bathrooms) || undefined
  const propertyType = parsePropertyType(row.propertyUse, row.propertyType) || undefined

  // Prepare property data
  const propertyData: PropertyData = {
    address,
    city,
    state: 'TX',
    zipCode,
    county: 'Collin',
  }
  
  // Add optional fields only if they have values
  if (apn) propertyData.apn = apn
  if (yearBuilt) propertyData.yearBuilt = yearBuilt
  if (livingArea) propertyData.livingArea = livingArea
  if (lotSize) propertyData.lotSize = lotSize
  if (bedrooms) propertyData.bedrooms = bedrooms
  if (bathrooms) propertyData.bathrooms = bathrooms
  if (propertyType) propertyData.propertyType = propertyType

  return propertyData
}

async function processBatch(batch: PropertyData[]): Promise<{ imported: number; skipped: number; errors: number }> {
  let imported = 0
  let skipped = 0
  let errors = 0

  if (batch.length === 0) return { imported, skipped, errors }

  try {
    // Get all APNs and addresses from batch
    const apns = batch.filter(p => p.apn).map(p => p.apn!)
    const addresses = batch.map(p => ({
      address: p.address.toLowerCase(),
      city: p.city.toLowerCase(),
      zipCode: p.zipCode,
    }))

    // Find existing properties in bulk
    const existingProperties = await prisma.property.findMany({
      where: {
        OR: [
          ...(apns.length > 0 ? [{ apn: { in: apns } }] : []),
          // For addresses, we'll check individually since Prisma doesn't support complex array matching
        ],
      },
      select: {
        id: true,
        apn: true,
        address: true,
        city: true,
        zipCode: true,
      },
    })

    // Create lookup maps
    const byApn = new Map(existingProperties.filter(p => p.apn).map(p => [p.apn!.toLowerCase(), p]))
    const byAddress = new Map(
      existingProperties.map(p => [
        `${p.address.toLowerCase()}|${p.city.toLowerCase()}|${p.zipCode}`,
        p,
      ])
    )

    // Process each property in the batch
    for (const propertyData of batch) {
      try {
        let existing = null

        // Check by APN first
        if (propertyData.apn) {
          existing = byApn.get(propertyData.apn.toLowerCase())
        }

        // Check by address if not found by APN
        if (!existing) {
          const addressKey = `${propertyData.address.toLowerCase()}|${propertyData.city.toLowerCase()}|${propertyData.zipCode}`
          existing = byAddress.get(addressKey)
        }

        if (existing) {
          // Update existing property
          await prisma.property.update({
            where: { id: existing.id },
            data: propertyData,
          })
          imported++
        } else {
          // Create new property
          try {
            await prisma.property.create({
              data: propertyData,
            })
            imported++
          } catch (err: any) {
            // If unique constraint fails, try to find and update
            if (err?.code === 'P2002') {
              try {
                const found = propertyData.apn
                  ? await prisma.property.findUnique({ where: { apn: propertyData.apn } })
                  : await prisma.property.findFirst({
                      where: {
                        address: { equals: propertyData.address, mode: 'insensitive' },
                        city: { equals: propertyData.city, mode: 'insensitive' },
                        zipCode: { equals: propertyData.zipCode },
                      },
                    })

                if (found) {
                  await prisma.property.update({
                    where: { id: found.id },
                    data: propertyData,
                  })
                  imported++
                } else {
                  skipped++
                }
              } catch (updateErr: any) {
                errors++
              }
            } else {
              errors++
            }
          }
        }
      } catch (err: any) {
        errors++
      }
    }
  } catch (err: any) {
    // If batch fails, process individually
    console.error(`Batch processing error, falling back to individual processing:`, err?.message)
    for (const propertyData of batch) {
      try {
        let existing = null
        if (propertyData.apn) {
          existing = await prisma.property.findUnique({ where: { apn: propertyData.apn } })
        }
        if (!existing) {
          existing = await prisma.property.findFirst({
            where: {
              address: { equals: propertyData.address, mode: 'insensitive' },
              city: { equals: propertyData.city, mode: 'insensitive' },
              zipCode: { equals: propertyData.zipCode },
            },
          })
        }

        if (existing) {
          await prisma.property.update({
            where: { id: existing.id },
            data: propertyData,
          })
          imported++
        } else {
          await prisma.property.create({ data: propertyData })
          imported++
        }
      } catch (err: any) {
        errors++
      }
    }
  }

  return { imported, skipped, errors }
}

async function importCSV(filePath: string) {
  console.log(`📂 Reading CSV file: ${filePath}`)
  
  let totalImported = 0
  let totalSkipped = 0
  let totalErrors = 0
  let processed = 0
  const BATCH_SIZE = 50 // Process 50 rows at a time
  const BATCH_DELAY = 200 // 200ms delay between batches

  let currentBatch: PropertyData[] = []

  return new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }))

    const processCurrentBatch = async () => {
      if (currentBatch.length === 0) return

      const batch = [...currentBatch]
      currentBatch = []

      const result = await processBatch(batch)
      totalImported += result.imported
      totalSkipped += result.skipped
      totalErrors += result.errors

      if (processed % 1000 === 0 || totalImported % 100 === 0) {
        console.log(`   Processed ${processed} rows... (${totalImported} imported, ${totalSkipped} skipped, ${totalErrors} errors)`)
      }

      // Delay before next batch to avoid overwhelming connection pool
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }

    stream.on('data', async (row: CollinCADRow) => {
      processed++
      
      const propertyData = processRow(row)
      if (propertyData) {
        currentBatch.push(propertyData)
      } else {
        totalSkipped++
      }

      // Process batch when it reaches the size limit
      if (currentBatch.length >= BATCH_SIZE) {
        // Pause the stream while processing
        stream.pause()
        await processCurrentBatch()
        stream.resume()
      }

      if (processed % 1000 === 0) {
        console.log(`   Processed ${processed} rows... (${totalImported} imported, ${totalSkipped} skipped, ${totalErrors} errors)`)
      }
    })

    stream.on('end', async () => {
      // Process remaining batch
      if (currentBatch.length > 0) {
        await processCurrentBatch()
      }

      console.log('\n✅ Import complete!')
      console.log(`   Total processed: ${processed}`)
      console.log(`   Imported/Updated: ${totalImported}`)
      console.log(`   Skipped: ${totalSkipped}`)
      console.log(`   Errors: ${totalErrors}`)
      
      await prisma.$disconnect()
      resolve()
    })

    stream.on('error', (error) => {
      console.error('❌ Stream error:', error)
      reject(error)
    })
  })
}

// Main execution
const filePath = process.argv[2]

if (!filePath) {
  console.error('❌ Please provide a CSV file path')
  console.error('Usage: tsx scripts/import-from-csv.ts <path-to-csv-file>')
  process.exit(1)
}

importCSV(filePath)
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
