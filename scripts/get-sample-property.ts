import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function getSampleProperty() {
  try {
    // Find a property with good data
    const property = await prisma.property.findFirst({
      where: {
        OR: [
          { yearBuilt: { not: null } },
          { livingArea: { not: null } },
          { bedrooms: { not: null } },
          { lotSize: { not: null } },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
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
    })

    if (property) {
      console.log('\n✅ Found property with imported data:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`Address: ${property.address}`)
      console.log(`City: ${property.city}, ${property.state} ${property.zipCode}`)
      console.log(`Property ID: ${property.id}`)
      console.log('\nImported Data:')
      console.log(`  Year Built: ${property.yearBuilt || 'N/A'}`)
      console.log(`  Living Area: ${property.livingArea ? `${property.livingArea.toLocaleString()} sq ft` : 'N/A'}`)
      console.log(`  Lot Size: ${property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : 'N/A'}`)
      console.log(`  Bedrooms: ${property.bedrooms || 'N/A'}`)
      console.log(`  Bathrooms: ${property.bathrooms || 'N/A'}`)
      console.log(`  Property Type: ${property.propertyType || 'N/A'}`)
      console.log(`  APN: ${property.apn || 'N/A'}`)
      console.log(`  County: ${property.county || 'N/A'}`)
      console.log('\n🔗 View this property at:')
      console.log(`   /property/${property.id}`)
      console.log(`   Or search for: ${property.address}, ${property.city}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    } else {
      console.log('No properties with imported data found yet.')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getSampleProperty()

