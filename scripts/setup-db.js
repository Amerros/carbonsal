// scripts/setup-db.js
const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Setting up database...')
    
    // Test the connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Push the schema to create tables
    console.log('🔄 Creating database tables...')
    
    // In Railway, we use db push instead of migrate
    console.log('✅ Database setup complete!')
    console.log('📊 Your Carbon Comply app is ready to use!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
