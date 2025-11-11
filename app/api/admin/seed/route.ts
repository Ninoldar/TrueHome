import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * One-time seed endpoint for production database
 * 
 * Usage: POST /api/admin/seed
 * Headers: Authorization: Bearer <SEED_SECRET>
 * 
 * Set SEED_SECRET in Vercel environment variables
 * After seeding, you can delete this endpoint or protect it further
 */
export async function POST(request: NextRequest) {
  // Check for authorization
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.SEED_SECRET
  
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'SEED_SECRET not configured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    console.log('Starting database seed...')
    const { stdout, stderr } = await execAsync('pnpm run db:seed')
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Seed stderr:', stderr)
    }
    
    console.log('Seed stdout:', stdout)
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout,
    })
  } catch (error: any) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      {
        error: 'Seeding failed',
        details: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      },
      { status: 500 }
    )
  }
}

