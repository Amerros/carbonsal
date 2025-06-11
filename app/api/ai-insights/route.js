import { NextResponse } from 'next/server'

// Mock AI service - in production, integrate with OpenAI or similar
export async function POST(request) {
  try {
    const { emissions, companyInfo, industry, goals } = await request.json()

    // Validate input
    if (!emissions || !companyInfo) {
      return NextResponse.json(
        { error: 'Missing required data for AI analysis' },
        { status: 400 }
      )
    }

    // Generate AI-powered insights
    const insights = await generateAIInsights(emissions, companyInfo, industry, goals)

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
      model: 'carbon-ai-v2.1',
      confidence: calculateConfidence(emissions, companyInfo)
    })

  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}

async function generateAIInsights(emissions, companyInfo, industry, goals) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  const totalEmissions = emissions.total || 0
  const breakdown = emissions.breakdown || {}
  const employeeCount = companyInfo.employees || 1

  // Generate insights based on data patterns
  const insights = {
    summary: generateSummaryInsight(totalEmissions, employeeCount, industry),
    priorities: generatePriorityInsights(breakdown, totalEmissions),
    opportunities: generateOpportunityInsights(breakdown, companyInfo, industry),
    predictions: generatePredictiveInsights(emissions, companyInfo),
    benchmarks: generateBenchmarkInsights(totalEmissions, employeeCount, industry),
    actionPlan: generateActionPlan(breakdown, companyInfo, goals),
    riskAssessment: generateRiskAssessment(emissions, industry),
    customRecommendations: generateCustomRecommendations(emissions, companyInfo, industry)
  }

  return insights
}

function generateSummaryInsight(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  const industryAverages = {
    'Technologie': 4.2,
    'Productie': 8.5,
    'Retail': 3.8,
    'Financiële Diensten': 2.9,
    'Gezondheidszorg': 5.1,
    'Onderwijs': 3.2,
    'Transport & Logistiek': 12.3,
    'Bouw': 9.7,
    'Anders': 5.5
  }

  const industryAvg = industryAverages[industry] || 5.5
  const performance = emissionsPerEmployee / industryAvg

  let assessment = ""
  if (performance < 0.7) {
    assessment = "uitstekend - significant beter dan de industrie gemiddelde"
  } else if (performance < 1.0) {
    assessment = "goed - boven gemiddeld voor jouw sector"
  } else if (performance < 1.3) {
    assessment = "gemiddeld met duidelijke verbetermogelijkheden"
  } else {
    assessment = "onder gemiddeld - prioriteit voor verbetering"
  }

  return {
    text: `Op basis van AI-analyse van vergelijkbare ${industry.toLowerCase()} bedrijven is jouw carbon footprint van ${totalEmissions} ton CO2 (${emissionsPerEmployee.toFixed(1)} ton per medewerker) ${assessment}. De AI heeft ${Math.floor(Math.random() * 15 + 25)} specifieke optimalisatiekansen geïdentificeerd.`,
    score: Math.round((2 - performance) * 50),
    category: performance < 0.7 ? 'excellent' : performance < 1.0 ? 'good' : performance < 1.3 ? 'average' : 'improvement_needed'
  }
}

function generatePriorityInsights(breakdown, totalEmissions) {
  const categories = Object.entries(breakdown).map(([key, value]) => ({
    category: key,
    emissions: value,
    percentage: (value / totalEmissions) * 100
  })).sort((a, b) => b.emissions - a.emissions)

  const priorities = categories.slice(0, 3).map((cat, index) => {
    const priority = ['Hoog', 'Medium', 'Laag'][index]
    const impact = cat.percentage > 40 ? 'Zeer Hoog' : cat.percentage > 25 ? 'Hoog' : 'Medium'
    
    return {
      category: getCategoryName(cat.category),
      priority,
      impact,
      percentage: Math.round(cat.percentage),
      recommendations: generateCategoryRecommendations(cat.category, cat.emissions)
    }
  })

  return {
    text: `AI prioritering toont dat ${getCategoryName(categories[0].category)} (${Math.round(categories[0].percentage)}% van totaal) de hoogste impact heeft. Focus op deze categorie kan tot 35% reductie leiden.`,
    priorities
  }
}

function generateOpportunityInsights(breakdown, companyInfo, industry) {
  const opportunities = []

  // Energy opportunities
  if (breakdown.energy > 0) {
    opportunities.push({
      type: 'Groene Energie Transitie',
      potential: '25-40%',
      investment: '€2,500 - €5,000',
      payback: '12-18 maanden',
      aiConfidence: 0.92,
      description: 'AI detecteert optimale timing voor groene energie overstap gebaseerd op jouw verbruiksprofiel'
    })
  }

  // Transport opportunities  
  if (breakdown.transport > 0) {
    opportunities.push({
      type: 'Smart Mobility Programma',
      potential: '30-50%',
      investment: '€8,000 - €15,000',
      payback: '18-24 maanden',
      aiConfidence: 0.87,
      description: 'Elektrische leaseauto\'s en fietsplan op maat voor jouw team en locaties'
    })
  }

  // Industry-specific opportunities
  if (industry === 'Technologie') {
    opportunities.push({
      type: 'Cloud Optimalisatie',
      potential: '15-25%',
      investment: '€1,000 - €3,000',
      payback: '6-12 maanden',
      aiConfidence: 0.94,
      description: 'AI-geoptimaliseerde cloud infrastructuur met carbon-aware scheduling'
    })
  }

  return {
    text: `AI heeft ${opportunities.length} high-impact kansen geïdentificeerd met gemiddeld ${Math.round(opportunities.reduce((sum, opp) => sum + parseFloat(opp.potential), 0) / opportunities.length)}% reductie potentieel.`,
    opportunities: opportunities.slice(0, 4)
  }
}

function generatePredictiveInsights(emissions, companyInfo) {
  const currentYear = new Date().getFullYear()
  const projections = []

  for (let year = 1; year <= 5; year++) {
    const baseGrowth = 1 + (companyInfo.employees > 50 ? 0.15 : 0.08) // Growth factor
    const efficiencyGain = 1 - (0.05 * year) // 5% efficiency gain per year
    const projected = emissions.total * Math.pow(baseGrowth, year) * Math.pow(efficiencyGain, year)
    
    projections.push({
      year: currentYear + year,
      baseline: Math.round(emissions.total * Math.pow(baseGrowth, year) * 100) / 100,
      optimized: Math.round(projected * 100) / 100,
      savings: Math.round((emissions.total * Math.pow(baseGrowth, year) - projected) * 100) / 100
    })
  }

  return {
    text: `AI voorspelt dat zonder actie jouw uitstoot met ${Math.round(((projections[4].baseline / emissions.total) - 1) * 100)}% toeneemt in 5 jaar. Met optimalisatie: ${Math.round(((projections[4].optimized / emissions.total) - 1) * 100)}% verandering.`,
    projections
  }
}

function generateBenchmarkInsights(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  
  // Mock peer data
  const peers = [
    { name: 'Innovatieve Tech BV', employees: employeeCount * 1.2, emissions: emissionsPerEmployee * 0.8 },
    { name: 'GreenFirst Solutions', employees: employeeCount * 0.9, emissions: emissionsPerEmployee * 0.6 },
    { name: 'Sustainable Corp', employees: employeeCount * 1.5, emissions: emissionsPerEmployee * 1.1 },
    { name: 'EcoLeader NL', employees: employeeCount * 0.7, emissions: emissionsPerEmployee * 0.5 }
  ]

  const betterThan = peers.filter(peer => peer.emissions > emissionsPerEmployee).length
  const percentage = Math.round((betterThan / peers.length) * 100)

  return {
    text: `Jouw prestaties zijn beter dan ${percentage}% van vergelijkbare ${industry.toLowerCase()} bedrijven. AI identificeert top performers in jouw sector als benchmark.`,
    ranking: percentage,
    peers: peers.slice(0, 3),
    topPerformer: peers.reduce((best, peer) => peer.emissions < best.emissions ? peer : best)
  }
}

function generateActionPlan(breakdown, companyInfo, goals) {
  const plan = {
    immediate: [], // 0-3 months
    shortTerm: [], // 3-12 months  
    longTerm: [] // 1-3 years
  }

  // Immediate actions
  plan.immediate.push({
    action: 'Energy audit en smart meter installatie',
    cost: '€500 - €1,500',
    impact: '5-10% reductie',
    effort: 'Laag'
  })

  // Short term actions
  plan.shortTerm.push({
    action: 'Groene energie contract en LED verlichting',
    cost: '€2,000 - €5,000', 
    impact: '20-30% reductie',
    effort: 'Medium'
  })

  // Long term actions
  plan.longTerm.push({
    action: 'Volledig elektrische wagenpark',
    cost: '€15,000 - €30,000',
    impact: '30-45% reductie',
    effort: 'Hoog'
  })

  return {
    text: `AI genereert gefaseerd actieplan: ${plan.immediate.length} snelle wins, ${plan.shortTerm.length} medium-term projecten, ${plan.longTerm.length} strategische initiatieven.`,
    phases: plan
  }
}

function generateRiskAssessment(emissions, industry) {
  const risks = []

  // Regulatory risks
  if (emissions.total > 100) {
    risks.push({
      type: 'Regulatory',
      level: 'Hoog',
      description: 'CSRD rapportage verplicht vanaf 2024 - voorbereiding nodig',
      timeline: '6-12 maanden',
      mitigation: 'Start nu met data verzameling en systeem implementatie'
    })
  }

  // Financial risks
  const carbonTax = emissions.total * 50 // €50 per ton estimated future tax
  if (carbonTax > 5000) {
    risks.push({
      type: 'Financial',
      level: 'Medium',
      description: `Geschatte carbon tax impact: €${Math.round(carbonTax).toLocaleString()} per jaar`,
      timeline: '2-5 jaar',
      mitigation: 'Vroege reductie bespaart toekomstige kosten'
    })
  }

  // Reputation risks
  risks.push({
    type: 'Reputational',
    level: 'Medium',
    description: 'Stakeholder verwachtingen voor sustainability transparantie stijgen',
    timeline: 'Continu',
    mitigation: 'Proactieve communicatie over sustainability inspanningen'
  })

  return {
    text: `AI risk analyse identificeert ${risks.length} belangrijke risico's. Hoogste prioriteit: ${risks[0]?.type || 'Regulatory compliance'}.`,
    risks
  }
}

function generateCustomRecommendations(emissions, companyInfo, industry) {
  const recommendations = []

  // Size-based recommendations
  if (companyInfo.employees < 25) {
    recommendations.push({
      category: 'Small Business Focus',
      title: 'Groene hosting en cloud-first strategie',
      description: 'Als klein bedrijf kun je snel schakelen naar groene cloud services',
      impact: 'Medium',
      ease: 'Hoog'
    })
  } else if (companyInfo.employees > 100) {
    recommendations.push({
      category: 'Enterprise Strategy',
      title: 'Dedicated sustainability officer aanstellen',
      description: 'Schaal rechtvaardigt fulltime focus op carbon management',
      impact: 'Hoog',
      ease: 'Medium'
    })
  }

  // Industry-specific
  if (industry === 'Technologie') {
    recommendations.push({
      category: 'Tech Innovation',
      title: 'Carbon-aware software development',
      description: 'Implementeer carbon tracking in je development pipeline',
      impact: 'Hoog',
      ease: 'Medium'
    })
  }

  return {
    text: `AI genereert ${recommendations.length} op maat gemaakte aanbevelingen specifiek voor jouw bedrijfsprofiel en industrie.`,
    recommendations
  }
}

function getCategoryName(category) {
  const names = {
    energy: 'Energie',
    transport: 'Transport',
    waste: 'Afval', 
    water: 'Water',
    materials: 'Materialen'
  }
  return names[category] || category
}

function generateCategoryRecommendations(category, emissions) {
  const recommendations = {
    energy: ['Zonnepanelen installatie', 'LED verlichting upgrade', 'Smart thermostaat'],
    transport: ['Elektrische leaseauto\'s', 'Fietsplan', 'Remote work beleid'],
    waste: ['Circulair afvalbeleid', 'Papier reductie', 'Compostering'],
    water: ['Water-besparende kranen', 'Regenwater opvang', 'Bewustzijn campagne'],
    materials: ['Duurzame inkoop beleid', 'Lokale leveranciers', 'Circulaire materialen']
  }
  return recommendations[category] || ['Algemene optimalisatie', 'Monitoring implementeren', 'Best practices onderzoek']
}

function calculateConfidence(emissions, companyInfo) {
  let confidence = 0.8 // Base confidence
  
  // More data points = higher confidence
  const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  confidence += Math.min(dataPoints * 0.03, 0.15)
  
  // Company size affects confidence
  if (companyInfo.employees > 50) confidence += 0.05
  if (companyInfo.employees > 200) confidence += 0.05
  
  return Math.min(confidence, 0.99)
}
