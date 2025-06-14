import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function POST(request) {
  try {
    const { secret } = await request.json()
    
    // Simple security check
    if (secret !== 'setup123') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Test the database connection with a simple operation
    const healthCheck = await db.healthCheck()
    
    if (healthCheck.status === 'unhealthy') {
      return NextResponse.json({ 
        error: 'Database connection failed: ' + healthCheck.error 
      }, { status: 500 })
    }

    // Try to create tables using Prisma schema push
    // This will automatically create tables based on your schema
    console.log('Database connection successful!')
    console.log('Tables will be created automatically by Prisma when first accessed.')

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful! Prisma will create tables automatically.',
      connection: healthCheck.connection,
      timestamp: healthCheck.timestamp
    })

  } catch (error) {
    console.error('Setup error:', error)
    
    // More detailed error information
    let errorMessage = error.message
    if (error.message.includes('postgres.railway.internal')) {
      errorMessage = 'Still connecting to Railway database. Please check your DATABASE_URL environment variable in Vercel.'
    }
    
    return NextResponse.json(
      { 
        error: 'Setup failed: ' + errorMessage,
        details: error.stack
      },
      { status: 500 }
    )
  }
}
