#!/usr/bin/env node

// scripts/setup.js - Automatische setup voor Carbon Comply
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Carbon Comply Setup Started...\n')

// Step 1: Check environment
console.log('1️⃣ Checking environment...')
try {
  execSync('node --version', { stdio: 'inherit' })
  execSync('npm --version', { stdio: 'inherit' })
  console.log('✅ Node.js and npm are installed\n')
} catch (error) {
  console.error('❌ Node.js or npm not found. Please install Node.js 18+ first.')
  process.exit(1)
}

// Step 2: Install dependencies
console.log('2️⃣ Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed\n')
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message)
  process.exit(1)
}

// Step 3: Setup environment variables
console.log('3️⃣ Setting up environment variables...')
const envExample = `
# Database (Railway PostgreSQL - update with your Railway database URL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@postgres.railway.internal:5432/railway"

# JWT Secret for authentication  
JWT_SECRET="carbon-comply-jwt-secret-${Math.random().toString(36).substr(2, 9)}"

# Setup secret for production database initialization
SETUP_SECRET="setup-secret-${Math.random().toString(36).substr(2, 9)}"

# AI Configuration (choose one - all are FREE!)
# Option 1: Ollama (local, completely free)
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama2"

# Option 2: Hugging Face (free account, 30k requests/month)
# Get free token at: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY="hf_your_free_token_here"

# Option 3: Cohere (free trial, good for Dutch)  
# Get free API key at: https://dashboard.cohere.ai/api-keys
COHERE_API_KEY="your_free_cohere_key"

# AI Provider (ollama/huggingface/cohere/fallback)
AI_PROVIDER="fallback"

# Stripe Configuration (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Application URL
NEXT_PUBLIC_URL="http://localhost:3000"

# File storage path
STORAGE_PATH="./storage"

# Nederlandse Carbon Settings
DUTCH_CARBON_METHODOLOGY="CO2_PRESTATIELADDER_3_1"
DUTCH_EMISSION_FACTORS_VERSION="2024"
ENABLE_CSRD_COMPLIANCE="true"
ENABLE_WPM_REPORTING="true"
`.trim()

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envExample)
  console.log('✅ .env file created with example values')
  console.log('⚠️  Please update .env with your actual values before running the app\n')
} else {
  console.log('✅ .env file already exists\n')
}

// Step 4: Generate Prisma client
console.log('4️⃣ Generating Prisma client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated\n')
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message)
  process.exit(1)
}

// Step 5: Create storage directory
console.log('5️⃣ Creating storage directory...')
const storageDir = path.join(__dirname, '..', 'storage')
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true })
  console.log('✅ Storage directory created\n')
} else {
  console.log('✅ Storage directory already exists\n')
}

// Step 6: Setup instructions
console.log('🎉 Carbon Comply setup completed!\n')
console.log('📋 Next steps:')
console.log('1. Update your .env file with real database and API keys')
console.log('2. If using Railway: Deploy to Railway and set environment variables')
console.log('3. If using local development:')
console.log('   - Set up PostgreSQL database')
console.log('   - Run: npm run db:push')
console.log('   - Run: npm run dev')
console.log('4. For AI features (optional):')
console.log('   - Install Ollama locally: https://ollama.ai')
console.log('   - OR get free Hugging Face token: https://huggingface.co/settings/tokens')
console.log('   - OR get free Cohere API key: https://dashboard.cohere.ai/api-keys')
console.log('5. For payments: Get Stripe keys from https://dashboard.stripe.com')
console.log('\n🚀 Ready to start your Nederlandse carbon compliance journey!')

// Step 7: AI Setup Check
console.log('\n🤖 AI Setup Options:')
console.log('Choose one of these FREE AI options:')
console.log('')
console.log('Option A: Ollama (Recommended - Completely Free & Private)')
console.log('- Install: curl -fsSL https://ollama.ai/install.sh | sh')
console.log('- Run: ollama pull llama2')
console.log('- Set AI_PROVIDER=ollama in .env')
console.log('')
console.log('Option B: Hugging Face (Free 30k requests/month)')
console.log('- Get token: https://huggingface.co/settings/tokens')
console.log('- Set HUGGINGFACE_API_KEY in .env')
console.log('- Set AI_PROVIDER=huggingface in .env')
console.log('')
console.log('Option C: Cohere (Free trial)')
console.log('- Get API key: https://dashboard.cohere.ai/api-keys')
console.log('- Set COHERE_API_KEY in .env')  
console.log('- Set AI_PROVIDER=cohere in .env')
console.log('')
console.log('Option D: Fallback (No AI needed - Rule-based insights)')
console.log('- Set AI_PROVIDER=fallback in .env')
console.log('- Works without any external AI service')
console.log('')
console.log('💡 You can change AI providers anytime by updating .env')
