import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/**
 * Bulk import properties endpoint
 * 
 * POST /api/properties/bulk-import
 * Body: { properties: Array<{ address, city, state, zipCode, ... }> }
 * 
 * Requires ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { properties } = body

    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json(
        { error: 'Properties array is required' },
        { status: 400 }
      )
    }

    if (properties.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10,000 properties per request' },
        { status: 400 }
      )
    }

    let imported = 0
    let skipped = 0
    let errors = 0
    const errorDetails: string[] = []

    // Process in batches to avoid overwhelming the database
    const batchSize = 100
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize)

      for (const property of batch) {
        try {
          // Validate required fields
          if (!property.address || !property.city || !property.state || !property.zipCode) {
            errors++
            errorDetails.push(`Row ${i + batch.indexOf(property) + 1}: Missing required fields`)
            continue
          }

          // Check if property already exists
          const existing = await prisma.property.findUnique({
            where: {
              address_city_state_zipCode: {
                address: property.address.trim(),
                city: property.city.trim(),
                state: property.state.trim().toUpperCase(),
                zipCode: property.zipCode.trim(),
              },
            },
          })

          if (existing) {
            skipped++
            continue
          }

          // Create property
          await prisma.property.create({
            data: {
              address: property.address.trim(),
              city: property.city.trim(),
              state: property.state.trim().toUpperCase(),
              zipCode: property.zipCode.trim(),
              propertyType: property.propertyType?.trim() || 'Unknown',
              yearBuilt: property.yearBuilt ? parseInt(property.yearBuilt, 10) : null,
              squareFeet: property.squareFeet ? parseInt(property.squareFeet, 10) : null,
              lotSize: property.lotSize ? parseFloat(property.lotSize) : null,
            },
          })

          imported++
        } catch (error: any) {
          errors++
          errorDetails.push(`Row ${i + batch.indexOf(property) + 1}: ${error.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: properties.length,
        imported,
        skipped,
        errors,
      },
      errorDetails: errors > 0 ? errorDetails.slice(0, 50) : undefined, // Limit error details
    })
  } catch (error: any) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

