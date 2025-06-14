import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET() {
  try {
    // Test database connection
    const health = await db.healthCheck()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: health.status,
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
