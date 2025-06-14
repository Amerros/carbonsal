import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function POST(request) {
  try {
    const { secret } = await request.json()
    
    // Simple security check - only allow in development or with correct secret
    const isRailwayProduction = process.env.RAILWAY_ENVIRONMENT === 'production'
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isRailwayProduction && secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ 
        error: 'Unauthorized - setup not allowed in production without proper secret' 
      }, { status: 401 })
    }
    
    if (!isDevelopment && !isRailwayProduction && secret !== 'setup123') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Test the database connection
    const healthCheck = await db.healthCheck()
    
    if (healthCheck.status === 'unhealthy') {
      return NextResponse.json({ 
        error: 'Database connection failed: ' + healthCheck.error 
      }, { status: 500 })
    }

    // Railway automatically handles schema migration through Prisma
    console.log('Railway database connection successful!')
    console.log('Environment:', process.env.RAILWAY_ENVIRONMENT || 'development')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Railway database connection successful! Schema is auto-managed by Railway.',
      environment: process.env.RAILWAY_ENVIRONMENT || 'development',
      database: healthCheck.connection,
      timestamp: healthCheck.timestamp,
      railway: {
        service: process.env.RAILWAY_SERVICE_NAME || 'carbon-comply',
        deployment: process.env.RAILWAY_DEPLOYMENT_ID || 'local',
        region: process.env.RAILWAY_REGION || 'unknown',
      }
    })

  } catch (error) {
    console.error('Railway setup error:', error)
    
    // More detailed error information for Railway
    let errorMessage = error.message
    if (error.message.includes('connect ECONNREFUSED')) {
      errorMessage = 'Railway database connection refused. Check DATABASE_URL environment variable.'
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Railway database connection timeout. Please try again.'
    }
    
    return NextResponse.json(
      { 
        error: 'Railway setup failed: ' + errorMessage,
        environment: process.env.RAILWAY_ENVIRONMENT || 'development',
        service: process.env.RAILWAY_SERVICE_NAME || 'carbon-comply',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
