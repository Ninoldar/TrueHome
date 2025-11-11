import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'TrueHome API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}

