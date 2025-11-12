import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Test endpoint to verify database connection and data
 * Access at: /api/test-db
 */
export async function GET() {
  try {
    // Debug: Check DATABASE_URL format
    const dbUrl = process.env.DATABASE_URL || ''
    const dbUrlPreview = dbUrl.substring(0, 30) + '...'
    const isValidUrl = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')
    
    if (!isValidUrl && dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'Invalid DATABASE_URL format',
        details: {
          urlLength: dbUrl.length,
          urlPreview: dbUrlPreview,
          startsWithPostgres: dbUrl.startsWith('postgres'),
          firstChars: dbUrl.substring(0, 50),
          hasQuotes: dbUrl.includes('"') || dbUrl.includes("'"),
          trimmedLength: dbUrl.trim().length,
        },
        fix: 'DATABASE_URL should start with postgresql:// or postgres://. Check for extra quotes or whitespace in Vercel environment variables.',
      }, { status: 500 })
    }
    
    // Test 1: Count properties
    const propertyCount = await prisma.property.count()
    
    // Test 2: Get sample properties
    const sampleProperties = await prisma.property.findMany({
      take: 5,
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
      },
    })

    // Test 3: Test autocomplete query
    const autocompleteTest = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: 'Oak' } },
          { city: { contains: 'Oak' } },
        ],
      },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      database: process.env.DATABASE_URL ? 'Connected' : 'No DATABASE_URL set',
      propertyCount,
      sampleProperties,
      autocompleteTest: autocompleteTest.length,
      autocompleteResults: autocompleteTest,
      envCheck: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'Not set',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      },
      { status: 500 }
    )
  }
}

