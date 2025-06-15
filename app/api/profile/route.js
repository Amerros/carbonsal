// app/api/profile/route.js
import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Update user profile
export async function PUT(request) {
  try {
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

    const { companyName, industry, employees, email, location } = await request.json()

    // Update user profile
    const updatedUser = await db.updateUserProfile(user.id, {
      companyName,
      industry,
      employees: parseInt(employees) || 0,
      email,
      location
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        industry: updatedUser.industry,
        employees: updatedUser.employees
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// Delete user account
export async function DELETE(request) {
  try {
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

    // Delete user and all associated data
    await db.deleteUser(user.id)

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted'
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
