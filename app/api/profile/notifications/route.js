// app/api/profile/notifications/route.js
import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import jwt from 'jsonwebtoken'

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

    const notifications = await request.json()

    // Update notification preferences
    await db.updateNotificationPreferences(user.id, notifications)

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully'
    })

  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
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

    // Get notification preferences
    const preferences = await db.getNotificationPreferences(user.id)

    return NextResponse.json({
      success: true,
      preferences: preferences || {
        emailReports: true,
        calculationReminders: true,
        complianceAlerts: true,
        marketingEmails: false
      }
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    )
  }
}
