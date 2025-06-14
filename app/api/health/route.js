import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET() {
  try {
    // Test database connection
    const health = await db.healthCheck()
    
    // Railway-specific health information
    const railwayInfo = {
      environment: process.env.RAILWAY_ENVIRONMENT || 'development',
      service: process.env.RAILWAY_SERVICE_NAME || 'carbon-comply',
      deployment: process.env.RAILWAY_DEPLOYMENT_ID || 'local',
      replica: process.env.RAILWAY_REPLICA_ID || 'local',
      region: process.env.RAILWAY_REGION || 'unknown',
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: health.status,
      railway: railwayInfo,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      node_version: process.version,
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString(),
        railway: {
          environment: process.env.RAILWAY_ENVIRONMENT || 'development',
          service: process.env.RAILWAY_SERVICE_NAME || 'carbon-comply',
        }
      },
      { status: 500 }
    )
  }
}
