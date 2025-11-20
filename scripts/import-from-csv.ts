import { PrismaClient } from '@prisma/client'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { resolve } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

interface CollinCADRow {
  // Address fields
  situsConcatShort?: string
  situsAddress?: string
  situsCity?: string
  situsZip?: string
  situsState?: string
  
  // Property identification
  accountNumber?: string
  parcelNumber?: string
  
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
  
  // Additional fields
  ownerName?: string
  ownerType?: string
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

async function importCSV(filePath: string) {
  console.log(`📂 Reading CSV file: ${filePath}`)
  
  let imported = 0
  let skipped = 0
  let errors = 0
  let processed = 0

  return new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }))

    stream.on('data', async (row: CollinCADRow) => {
      processed++
      
      try {
        // Extract address
        const address = cleanAddress(row.situsConcatShort || row.situsAddress)
        if (!address) {
          skipped++
          if (processed % 1000 === 0) {
            console.log(`   Processed ${processed} rows... (${imported} imported, ${skipped} skipped, ${errors} errors)`)
          }
          return
        }

        // Extract city and zip
        const city = row.situsCity?.trim() || 'Unknown'
        const zipCode = row.situsZip?.trim() || ''
        const state = 'TX' // Texas data, always TX

        // Extract APN (Assessor's Parcel Number) - geoID is the APN in this CSV
        const apn = row.geoID?.trim() || row.propID?.trim() || null

        // Extract property details
        const yearBuilt = parseInteger(row.imprvYearBuilt)
        const livingArea = parseNumber(row.imprvMainArea)
        
        // Lot size - prefer sqft, fallback to converting acres
        let lotSize: number | null = null
        if (row.landSizeSqft) {
          lotSize = parseNumber(row.landSizeSqft)
        } else if (row.landSizeAcres) {
          lotSize = acresToSqft(row.landSizeAcres)
        }

        const bedrooms = parseInteger(row.bedrooms)
        const bathrooms = parseNumber(row.bathrooms)
        const propertyType = parsePropertyType(row.propertyUse, row.propertyType)

        // Validate required fields
        if (!zipCode || zipCode.length < 5) {
          skipped++
          if (processed % 1000 === 0) {
            console.log(`   Processed ${processed} rows... (${imported} imported, ${skipped} skipped, ${errors} errors)`)
          }
          return
        }

        // Prepare property data
        const propertyData: any = {
          address,
          city,
          state,
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

        // Check if property already exists (by APN first, then by address)
        let existing = null
        if (apn) {
          existing = await prisma.property.findUnique({
            where: { apn },
          })
        }
        
        if (!existing) {
          existing = await prisma.property.findFirst({
            where: {
              address: { equals: address, mode: 'insensitive' },
              city: { equals: city, mode: 'insensitive' },
              zipCode: { equals: zipCode },
            },
          })
        }

        if (existing) {
          // Update existing property with new data
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
            // If unique constraint fails (e.g., duplicate APN), try to find and update
            if (err?.code === 'P2002') {
              try {
                const found = apn 
                  ? await prisma.property.findUnique({ where: { apn } })
                  : await prisma.property.findFirst({
                      where: {
                        address: { equals: address, mode: 'insensitive' },
                        city: { equals: city, mode: 'insensitive' },
                        zipCode: { equals: zipCode },
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
              } catch (updateErr) {
                errors++
                if (errors <= 10 || errors % 1000 === 0) {
                  console.error(`[Row ${processed}] Error updating property:`, updateErr?.message || updateErr)
                }
              }
            } else {
              errors++
              if (errors <= 10 || errors % 1000 === 0) {
                console.error(`[Row ${processed}] Error creating property:`, err?.message || err, `Address: ${address}`)
              }
            }
          }
        }

        if (processed % 1000 === 0) {
          console.log(`   Processed ${processed} rows... (${imported} imported, ${skipped} skipped, ${errors} errors)`)
        }
      } catch (error) {
        errors++
        if (processed % 1000 === 0) {
          console.log(`   Processed ${processed} rows... (${imported} imported, ${skipped} skipped, ${errors} errors)`)
        }
      }
    })

    stream.on('end', async () => {
      console.log('\n✅ Import complete!')
      console.log(`   Total processed: ${processed}`)
      console.log(`   Imported/Updated: ${imported}`)
      console.log(`   Skipped: ${skipped}`)
      console.log(`   Errors: ${errors}`)
      
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

