import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Get user from auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await db.getUserById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user calculations
    const calculations = await db.getUserCalculations(user.id)

    return NextResponse.json({
      success: true,
      calculations
    })

  } catch (error) {
    console.error('Get calculations error:', error)
    return NextResponse.json(
      { error: 'Failed to get calculations' },
      { status: 500 }
    )
  }
}
