import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { calculationId, reportType = 'professional', oneTimePurchase = false } = await request.json()
    
    // Get user from auth token (optional for one-time purchase)
    let user = null
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        user = await db.getUserById(decoded.userId)
      } catch (error) {
        if (!oneTimePurchase) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      }
    }

    // For one-time purchase, allow without user
    if (!user && !oneTimePurchase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get calculation data
    const calculation = await db.getCalculationById(calculationId, user?.id)
    if (!calculation) {
      return NextResponse.json({ error: 'Calculation not found' }, { status: 404 })
    }

    // Generate AI insights for professional report
    let aiInsights = null
    if (reportType === 'professional') {
      aiInsights = await generateAIInsights(calculation)
    }

    // Create professional PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Safely extract data
    const companyData = calculation.company_data || calculation.companyData || {}
    const results = calculation.results || {}
    
    const companyName = companyData.companyName || companyData.company_name || 'Uw Bedrijf'
    const industry = companyData.industry || 'Onbekend'
    const employees = companyData.employees || '0'
    const totalEmissions = results.emissions?.total || 0

    // Generate professional report
    generateCoverPage(pdf, companyName, industry, employees)
    generateExecutiveSummary(pdf, results, aiInsights)
    generateDetailedAnalysis(pdf, results, companyData, aiInsights)
    generateRecommendations(pdf, aiInsights, results)
    generateImplementationPlan(pdf, aiInsights)
    generateAppendix(pdf, results)

    // Create filename
    const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '-')
    const fileName = `Carbon-Footprint-Report-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf`

    // Save report record if user exists
    if (user) {
      await db.saveReport(user.id, calculationId, fileName, oneTimePurchase ? 'one-time-purchase' : 'subscription')
    }

    // Return PDF
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: `Failed to generate PDF: ${error.message}` },
      { status: 500 }
    )
  }
}

function generateCoverPage(pdf, companyName, industry, employees) {
  // Cover Page
  pdf.setFillColor(0, 100, 80) // Dark green
  pdf.rect(0, 0, 210, 297, 'F')
  
  // Logo area (white circle)
  pdf.setFillColor(255, 255, 255)
  pdf.circle(105, 80, 25, 'F')
  
  // Carbon Comply Logo
  pdf.setTextColor(0, 100, 80)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Carbon', 85, 75)
  pdf.text('Comply', 85, 85)
  
  // Main Title
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Carbon Footprint', 105, 140, { align: 'center' })
  pdf.text('Rapport 2024', 105, 155, { align: 'center' })
  
  // Subtitle
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Opgesteld volgens ISO 14064-1 en het Greenhouse Gas Protocol', 105, 175, { align: 'center' })
  
  // Company Info Box
  pdf.setFillColor(255, 255, 255, 0.9)
  pdf.roundedRect(30, 200, 150, 60, 5, 5, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bedrijf:', 40, 215)
  pdf.text('Sector:', 40, 225)
  pdf.text('Medewerkers:', 40, 235)
  pdf.text('Rapportdatum:', 40, 245)
  
  pdf.setFont('helvetica', 'normal')
  pdf.text(companyName, 70, 215)
  pdf.text(industry, 70, 225)
  pdf.text(employees.toString(), 70, 235)
  pdf.text(new Date().toLocaleDateString('nl-NL'), 70, 245)
  
  // Footer
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.text('Gegenereerd door Carbon Comply - carboncomply.nl', 105, 285, { align: 'center' })
}

function generateExecutiveSummary(pdf, results, aiInsights) {
  pdf.addPage()
  
  // Header
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Managementsamenvatting', 20, 30)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  let yPos = 50
  
  // Key Findings
  pdf.setFont('helvetica', 'bold')
  pdf.text('Belangrijkste Bevindingen:', 20, yPos)
  yPos += 10
  
  pdf.setFont('helvetica', 'normal')
  const findings = [
    `Totale CO2-uitstoot: ${results.emissions?.total || 0} ton per jaar`,
    `Grootste bron: ${getLargestEmissionSource(results.emissions?.breakdown)}`,
    `Besparingspotentieel: €${results.costSavings?.total?.toLocaleString() || 0} per jaar`,
    `Aanbevolen prioriteit: ${aiInsights?.topPriority || 'Energie-efficiency'}`
  ]
  
  findings.forEach(finding => {
    pdf.text(`• ${finding}`, 25, yPos)
    yPos += 8
  })
  
  yPos += 10
  
  // Strategic Recommendations
  pdf.setFont('helvetica', 'bold')
  pdf.text('Strategische Aanbevelingen:', 20, yPos)
  yPos += 10
  
  pdf.setFont('helvetica', 'normal')
  const recommendations = aiInsights?.strategicRecommendations || [
    'Overstap naar 100% groene energie binnen 12 maanden',
    'Implementatie van smart building technologieën',
    'Elektrificatie van het wagenpark gefaseerd over 24 maanden'
  ]
  
  recommendations.forEach(rec => {
    const lines = pdf.splitTextToSize(`• ${rec}`, 170)
    pdf.text(lines, 25, yPos)
    yPos += lines.length * 6
  })
}

function generateDetailedAnalysis(pdf, results, companyData, aiInsights) {
  pdf.addPage()
  
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Gedetailleerde Analyse', 20, 30)
  
  let yPos = 50
  
  // Emissions Breakdown Table
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CO2-uitstoot per Categorie', 20, yPos)
  yPos += 15
  
  // Table headers
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Categorie', 20, yPos)
  pdf.text('Uitstoot (ton)', 80, yPos)
  pdf.text('Percentage', 130, yPos)
  pdf.text('Benchmark', 170, yPos)
  
  yPos += 8
  pdf.line(20, yPos-2, 190, yPos-2)
  
  // Table data
  pdf.setFont('helvetica', 'normal')
  const breakdown = results.emissions?.breakdown || {}
  const total = results.emissions?.total || 1
  
  Object.entries(breakdown).forEach(([category, value]) => {
    const percentage = ((value / total) * 100).toFixed(1)
    const benchmark = getBenchmarkStatus(category, value, companyData.industry)
    
    pdf.text(getCategoryDisplayName(category), 20, yPos)
    pdf.text(value.toFixed(2), 80, yPos)
    pdf.text(`${percentage}%`, 130, yPos)
    pdf.text(benchmark, 170, yPos)
    yPos += 8
  })
  
  yPos += 15
  
  // Industry Comparison
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Sectorvergelijking', 20, yPos)
  yPos += 10
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const comparisonText = `Uw bedrijf presteert ${results.benchmark?.ranking || 'gemiddeld'} vergeleken met andere bedrijven in de ${companyData.industry || 'technologie'} sector. U scoort beter dan ${results.benchmark?.percentile || 60}% van vergelijkbare organisaties.`
  
  const comparisonLines = pdf.splitTextToSize(comparisonText, 170)
  pdf.text(comparisonLines, 20, yPos)
}

function generateRecommendations(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Aanbevelingen & Actieplan', 20, 30)
  
  let yPos = 50
  
  // Priority Matrix
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Prioriteitsmatrix', 20, yPos)
  yPos += 15
  
  const recommendations = results.recommendations || []
  
  // High Priority
  pdf.setFillColor(220, 53, 69, 0.1)
  pdf.roundedRect(15, yPos-5, 180, 8, 2, 2, 'F')
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(220, 53, 69)
  pdf.text('HOGE PRIORITEIT', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  recommendations.filter(r => r.priority === 1).forEach(rec => {
    pdf.text(`• ${rec.action}`, 25, yPos)
    pdf.text(`💰 Besparing: ${rec.savings} ton CO2`, 30, yPos + 5)
    pdf.text(`💸 Investering: ${rec.cost}`, 30, yPos + 10)
    pdf.text(`⏱️ Terugverdientijd: ${rec.paybackMonths} maanden`, 30, yPos + 15)
    yPos += 25
  })
  
  // Medium Priority  
  pdf.setFillColor(255, 193, 7, 0.1)
  pdf.roundedRect(15, yPos-5, 180, 8, 2, 2, 'F')
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 193, 7)
  pdf.text('MEDIUM PRIORITEIT', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  recommendations.filter(r => r.priority === 2).forEach(rec => {
    pdf.text(`• ${rec.action}`, 25, yPos)
    pdf.text(`💰 Besparing: ${rec.savings} ton CO2`, 30, yPos + 5)
    pdf.text(`💸 Investering: ${rec.cost}`, 30, yPos + 10)
    yPos += 20
  })
}

function generateImplementationPlan(pdf, aiInsights) {
  pdf.addPage()
  
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Implementatieplan', 20, 30)
  
  let yPos = 50
  
  const phases = [
    {
      phase: 'Fase 1: Quick Wins (0-6 maanden)',
      color: [34, 197, 94],
      actions: [
        'LED verlichting upgrade',
        'Smart thermostaat installatie',
        'Energieaudit uitvoeren',
        'Medewerkers bewustzijnstraining'
      ]
    },
    {
      phase: 'Fase 2: Structurele Veranderingen (6-18 maanden)',
      color: [59, 130, 246],
      actions: [
        'Overstap naar groene energieleverancier',
        'Building automation systeem',
        'Elektrische bedrijfswagens lease',
        'Circulair afvalmanagement'
      ]
    },
    {
      phase: 'Fase 3: Strategische Investeringen (18-36 maanden)',
      color: [147, 51, 234],
      actions: [
        'Zonnepanelen installatie',
        'Volledige wagenpark elektrificatie',
        'Heat pump systeem',
        'Carbon monitoring dashboard'
      ]
    }
  ]
  
  phases.forEach(phase => {
    // Phase header
    pdf.setFillColor(phase.color[0], phase.color[1], phase.color[2], 0.1)
    pdf.roundedRect(15, yPos-5, 180, 10, 3, 3, 'F')
    
    pdf.setTextColor(phase.color[0], phase.color[1], phase.color[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.phase, 20, yPos)
    yPos += 15
    
    // Actions
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    phase.actions.forEach(action => {
      pdf.text(`• ${action}`, 25, yPos)
      yPos += 8
    })
    
    yPos += 10
  })
}

function generateAppendix(pdf, results) {
  pdf.addPage()
  
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bijlagen', 20, 30)
  
  let yPos = 50
  
  // Methodology
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Methodologie', 20, yPos)
  yPos += 10
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const methodologyText = `Deze carbon footprint analyse is uitgevoerd conform de internationale standaarden ISO 14064-1 en het Greenhouse Gas Protocol. Alle emissiefactoren zijn gebaseerd op de meest recente Nederlandse gegevens van co2emissiefactoren.nl en het Handboek CO2 Prestatieladder 3.1.`
  
  const methodologyLines = pdf.splitTextToSize(methodologyText, 170)
  pdf.text(methodologyLines, 20, yPos)
  yPos += methodologyLines.length * 5 + 15
  
  // Disclaimers
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Disclaimers', 20, yPos)
  yPos += 10
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const disclaimers = [
    'Dit rapport is gegenereerd op basis van door u verstrekte gegevens',
    'Aanbevelingen zijn indicatief en kunnen afwijken per specifieke situatie',
    'Kostenbesparingen zijn schattingen gebaseerd op gemiddelde marktprijzen',
    'Voor implementatie wordt advies van specialisten aanbevolen'
  ]
  
  disclaimers.forEach(disclaimer => {
    pdf.text(`• ${disclaimer}`, 25, yPos)
    yPos += 8
  })
  
  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Rapport gegenereerd op ${new Date().toLocaleDateString('nl-NL')} door Carbon Comply`, 20, 280)
  pdf.text('Voor vragen: info@carboncomply.nl | www.carboncomply.nl', 20, 285)
}

async function generateAIInsights(calculation) {
  // In production, integrate with OpenAI API
  // For now, return structured mock insights
  return {
    topPriority: 'Energie-efficiency optimalisatie',
    strategicRecommendations: [
      'Implementeer smart building technologie voor 15-20% energiebesparing',
      'Overweeg elektrificatie van het wagenpark binnen 24 maanden',
      'Investeer in zonnepanelen voor directe energiekostenbesparing'
    ],
    implementationSteps: [
      'Voer een gedetailleerde energieaudit uit',
      'Vergelijk leveranciers voor groene energie',
      'Plan gefaseerde LED verlichting upgrade'
    ]
  }
}

// Helper functions
function getLargestEmissionSource(breakdown) {
  if (!breakdown) return 'Onbekend'
  const largest = Object.entries(breakdown).reduce((max, [key, value]) => 
    value > max.value ? { key, value } : max, { key: '', value: 0 })
  return getCategoryDisplayName(largest.key)
}

function getCategoryDisplayName(category) {
  const names = {
    energy: 'Energie',
    transport: 'Transport', 
    waste: 'Afval',
    water: 'Water',
    materials: 'Materialen'
  }
  return names[category] || category
}

function getBenchmarkStatus(category, value, industry) {
  // Mock benchmark logic
  if (value < 2) return 'Uitstekend'
  if (value < 5) return 'Goed'
  if (value < 10) return 'Gemiddeld'
  return 'Verbetering nodig'
}
