// app/api/auth/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this'

// Register
export async function POST(request) {
  try {
    const { email, password, companyName, industry, employees } = await request.json()

    // Validate input
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Email, password en bedrijfsnaam zijn verplicht' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email adres is al in gebruik' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.createUser(email, passwordHash, companyName, industry, employees || 0)

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        industry: user.industry,
        employees: user.employees
      },
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registratie mislukt' },
      { status: 500 }
    )
  }
}

// Login
export async function PUT(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email en password zijn verplicht' },
        { status: 400 }
      )
    }

    // Get user
    const user = await db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 400 }
      )
    }

    // Debug logging
    console.log('User found:', { 
      id: user.id, 
      email: user.email, 
      hasPassword: !!user.passwordHash,
      passwordHashType: typeof user.passwordHash
    })

    // Check if password hash exists
    if (!user.passwordHash) {
      console.error('No password hash found for user:', user.email)
      return NextResponse.json(
        { error: 'Account configuratie probleem. Neem contact op met support.' },
        { status: 500 }
      )
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Verkeerd wachtwoord' },
        { status: 400 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        industry: user.industry,
        employees: user.employees
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login mislukt' },
      { status: 500 }
    )
  }
}

// Get current user
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Geen toegang' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    
    const user = await db.getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        industry: user.industry,
        employees: user.employees
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Ongeldige token' },
      { status: 401 }
    )
  }
}
