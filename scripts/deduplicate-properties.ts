import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

interface PropertyData {
  id: string
  address: string
  city: string
  zipCode: string
  yearBuilt: number | null
  livingArea: number | null
  lotSize: number | null
  bedrooms: number | null
  bathrooms: number | null
  propertyType: string | null
  apn: string | null
  county: string | null
}

function countDataFields(property: PropertyData): number {
  let count = 0
  if (property.yearBuilt) count++
  if (property.livingArea) count++
  if (property.lotSize) count++
  if (property.bedrooms) count++
  if (property.bathrooms) count++
  if (property.propertyType) count++
  if (property.apn) count++
  if (property.county) count++
  return count
}

function mergePropertyData(keep: PropertyData, merge: PropertyData): Partial<PropertyData> {
  const updates: any = {}
  
  // Merge data - keep existing if present, otherwise use merge data
  if (!keep.yearBuilt && merge.yearBuilt) updates.yearBuilt = merge.yearBuilt
  if (!keep.livingArea && merge.livingArea) updates.livingArea = merge.livingArea
  if (!keep.lotSize && merge.lotSize) updates.lotSize = merge.lotSize
  if (!keep.bedrooms && merge.bedrooms) updates.bedrooms = merge.bedrooms
  if (!keep.bathrooms && merge.bathrooms) updates.bathrooms = merge.bathrooms
  if (!keep.propertyType && merge.propertyType) updates.propertyType = merge.propertyType
  if (!keep.apn && merge.apn) updates.apn = merge.apn
  if (!keep.county && merge.county) updates.county = merge.county
  
  return updates
}

async function deduplicateProperties() {
  console.log('🔍 Finding duplicate properties...\n')
  
  // Get all properties
  const allProperties = await prisma.property.findMany({
    select: {
      id: true,
      address: true,
      city: true,
      zipCode: true,
      yearBuilt: true,
      livingArea: true,
      lotSize: true,
      bedrooms: true,
      bathrooms: true,
      propertyType: true,
      apn: true,
      county: true,
    },
    orderBy: {
      updatedAt: 'desc', // Prefer recently updated (imported) properties
    },
  })

  console.log(`Total properties: ${allProperties.length}\n`)

  // Group by address + city + zipCode (normalized)
  const groups = new Map<string, PropertyData[]>()
  
  for (const property of allProperties) {
    const key = `${property.address.toLowerCase().trim()}|${property.city.toLowerCase().trim()}|${property.zipCode.trim()}`
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(property as PropertyData)
  }

  // Find duplicates
  const duplicates: Array<{ key: string; properties: PropertyData[] }> = []
  for (const [key, properties] of groups.entries()) {
    if (properties.length > 1) {
      duplicates.push({ key, properties })
    }
  }

  console.log(`Found ${duplicates.length} groups with duplicates\n`)

  let merged = 0
  let deleted = 0
  let skipped = 0

  for (const { key, properties } of duplicates) {
    // Sort by data completeness (most complete first)
    properties.sort((a, b) => {
      const aCount = countDataFields(a)
      const bCount = countDataFields(b)
      if (bCount !== aCount) return bCount - aCount
      // If same data count, prefer the one with APN
      if (a.apn && !b.apn) return -1
      if (!a.apn && b.apn) return 1
      // If still same, prefer newer (lower ID = newer in cuid)
      return a.id.localeCompare(b.id)
    })

    const keep = properties[0]
    const toDelete = properties.slice(1)

    // Merge data from duplicates into the kept property
    let hasUpdates = false
    const updates: any = {}

    for (const duplicate of toDelete) {
      const mergeData = mergePropertyData(keep, duplicate)
      if (Object.keys(mergeData).length > 0) {
        Object.assign(updates, mergeData)
        hasUpdates = true
      }
    }

    // Update the kept property with merged data
    if (hasUpdates) {
      try {
        await prisma.property.update({
          where: { id: keep.id },
          data: updates,
        })
        merged++
        console.log(`✅ Merged data into: ${keep.address}, ${keep.city}`)
        console.log(`   Updated fields: ${Object.keys(updates).join(', ')}`)
      } catch (error) {
        console.error(`❌ Error merging ${keep.address}:`, error)
        skipped++
        continue
      }
    }

    // Delete duplicates
    for (const duplicate of toDelete) {
      try {
        // Check if duplicate has any related records
        const counts = await Promise.allSettled([
          prisma.sale.count({ where: { propertyId: duplicate.id } }),
          prisma.ownershipEvent.count({ where: { propertyId: duplicate.id } }),
          prisma.workEvent.count({ where: { propertyId: duplicate.id } }),
          prisma.permit.count({ where: { propertyId: duplicate.id } }),
          prisma.propertyClaim.count({ where: { propertyId: duplicate.id } }),
        ])
        
        const sales = counts[0].status === 'fulfilled' ? counts[0].value : 0
        const ownership = counts[1].status === 'fulfilled' ? counts[1].value : 0
        const workEvents = counts[2].status === 'fulfilled' ? counts[2].value : 0
        const permits = counts[3].status === 'fulfilled' ? counts[3].value : 0
        const claims = counts[4].status === 'fulfilled' ? counts[4].value : 0

        const hasRelatedData = sales > 0 || ownership > 0 || workEvents > 0 || permits > 0 || claims > 0

        if (hasRelatedData) {
          // Transfer related data to kept property
          await Promise.all([
            prisma.sale.updateMany({
              where: { propertyId: duplicate.id },
              data: { propertyId: keep.id },
            }),
            prisma.ownershipEvent.updateMany({
              where: { propertyId: duplicate.id },
              data: { propertyId: keep.id },
            }),
            prisma.workEvent.updateMany({
              where: { propertyId: duplicate.id },
              data: { propertyId: keep.id },
            }),
            prisma.permit.updateMany({
              where: { propertyId: duplicate.id },
              data: { propertyId: keep.id },
            }),
            prisma.propertyClaim.updateMany({
              where: { propertyId: duplicate.id },
              data: { propertyId: keep.id },
            }),
          ])
          console.log(`   Transferred ${sales + ownership + workEvents + permits + claims} related records`)
        }

        await prisma.property.delete({
          where: { id: duplicate.id },
        })
        deleted++
        console.log(`   Deleted duplicate: ${duplicate.address} (${duplicate.id.slice(0, 8)}...)`)
      } catch (error) {
        console.error(`❌ Error deleting ${duplicate.address}:`, error)
        skipped++
      }
    }
    console.log('')
  }

  console.log('\n✅ Deduplication complete!')
  console.log(`   Properties merged: ${merged}`)
  console.log(`   Duplicates deleted: ${deleted}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Total duplicates processed: ${duplicates.length}`)
}

deduplicateProperties()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Deduplication failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

