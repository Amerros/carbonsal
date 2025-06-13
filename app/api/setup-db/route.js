import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function POST(request) {
  try {
    const { secret } = await request.json()
    
    // Simple security check
    if (secret !== 'setup123') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        employees INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create calculations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company_data JSONB NOT NULL,
        results JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255) UNIQUE,
        plan_name VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        calculation_id INTEGER REFERENCES calculations(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id)')

    await pool.end()

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed: ' + error.message },
      { status: 500 }
    )
  }
}
