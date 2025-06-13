import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
  try {
    const reportId = params.id
    
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

    // Get report from database
    const reports = await db.getUserReports(user.id)
    const report = reports.find(r => r.id.toString() === reportId)
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Check if file exists
    if (!fs.existsSync(report.file_path)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(report.file_path)
    
    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.file_name}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('PDF download error:', error)
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    )
  }
}
