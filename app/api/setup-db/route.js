import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function POST(request) {
  try {
    const { secret } = await request.json()
    
    // Simple security check
    if (secret !== 'setup123') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Test the database connection
    const healthCheck = await db.healthCheck()
    
    if (healthCheck.status === 'unhealthy') {
      return NextResponse.json({ 
        error: 'Database connection failed: ' + healthCheck.error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prisma database connection successful! Tables are managed automatically.',
      timestamp: healthCheck.timestamp
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed: ' + error.message },
      { status: 500 }
    )
  }
}
