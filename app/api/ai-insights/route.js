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
      model: 'carbon-ai-v3.2',
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
  // Simulate AI processing time for realistic UX
  await new Promise(resolve => setTimeout(resolve, 2500))

  const totalEmissions = emissions.total || 0
  const breakdown = emissions.breakdown || {}
  const employeeCount = companyInfo.employees || 1
  const companyName = companyInfo.name || 'Uw bedrijf'

  // Generate comprehensive insights based on data patterns
  const insights = {
    summary: generateSummaryInsight(totalEmissions, employeeCount, industry, companyName),
    priorities: generatePriorityInsights(breakdown, totalEmissions, industry),
    opportunities: generateOpportunityInsights(breakdown, companyInfo, industry),
    predictions: generatePredictiveInsights(emissions, companyInfo, goals),
    benchmarks: generateBenchmarkInsights(totalEmissions, employeeCount, industry),
    actionPlan: generateActionPlan(breakdown, companyInfo, goals, industry),
    riskAssessment: generateRiskAssessment(emissions, industry, companyInfo),
    customRecommendations: generateCustomRecommendations(emissions, companyInfo, industry),
    implementationRoadmap: generateImplementationRoadmap(breakdown, companyInfo, totalEmissions),
    costBenefitAnalysis: generateCostBenefitAnalysis(totalEmissions, breakdown, industry),
    sustainabilityScore: calculateSustainabilityScore(emissions, companyInfo, industry),
    complianceCheck: generateComplianceCheck(totalEmissions, companyInfo, industry)
  }

  return insights
}

function generateSummaryInsight(totalEmissions, employeeCount, industry, companyName) {
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
  let category = ""
  let color = ""

  if (performance < 0.7) {
    assessment = "uitstekend - significant beter dan de industrie gemiddelde"
    category = "excellent"
    color = "green"
  } else if (performance < 1.0) {
    assessment = "goed - boven gemiddeld voor jouw sector"
    category = "good"
    color = "blue"
  } else if (performance < 1.3) {
    assessment = "gemiddeld met duidelijke verbetermogelijkheden"
    category = "average"
    color = "yellow"
  } else {
    assessment = "onder gemiddeld - prioriteit voor verbetering"
    category = "improvement_needed"
    color = "red"
  }

  const optimizationOpportunities = Math.floor(Math.random() * 15 + 25)
  const potentialSavings = Math.round(totalEmissions * (0.25 + Math.random() * 0.3) * 100) / 100

  return {
    text: `${companyName} heeft een carbon footprint van ${totalEmissions} ton CO2 (${emissionsPerEmployee.toFixed(1)} ton per medewerker), wat ${assessment}. Onze AI heeft ${optimizationOpportunities} specifieke optimalisatiekansen geïdentificeerd met een potentiële reductie van ${potentialSavings} ton CO2 per jaar.`,
    score: Math.round((2 - performance) * 50),
    category: category,
    color: color,
    performanceRatio: performance,
    industryBenchmark: industryAvg,
    optimizationOpportunities: optimizationOpportunities,
    potentialSavings: potentialSavings,
    keyInsights: [
      `${emissionsPerEmployee.toFixed(1)} ton CO2 per medewerker vs. ${industryAvg} ton industrie gemiddelde`,
      `${optimizationOpportunities} AI-geïdentificeerde optimalisatiekansen`,
      `Geschatte besparingspotentieel van €${Math.round(potentialSavings * 95).toLocaleString()} per jaar`
    ]
  }
}

function generatePriorityInsights(breakdown, totalEmissions, industry) {
  const categories = Object.entries(breakdown).map(([key, value]) => ({
    category: key,
    emissions: value,
    percentage: (value / totalEmissions) * 100
  })).sort((a, b) => b.emissions - a.emissions)

  const priorities = categories.slice(0, 3).map((cat, index) => {
    const priority = ['Hoog', 'Medium', 'Laag'][index]
    const impact = cat.percentage > 40 ? 'Zeer Hoog' : cat.percentage > 25 ? 'Hoog' : 'Medium'
    const urgency = cat.percentage > 35 ? 'Urgent' : cat.percentage > 20 ? 'Belangrijk' : 'Monitor'
    
    return {
      category: getCategoryName(cat.category),
      categoryKey: cat.category,
      priority,
      impact,
      urgency,
      percentage: Math.round(cat.percentage),
      emissions: cat.emissions,
      recommendations: generateCategoryRecommendations(cat.category, cat.emissions, industry),
      quickWins: generateQuickWins(cat.category),
      timeframe: cat.percentage > 30 ? '0-6 maanden' : '6-12 maanden',
      effort: cat.percentage > 35 ? 'Hoog' : 'Medium'
    }
  })

  const totalOptimizationPotential = Math.round(
    priorities.reduce((sum, p) => sum + (p.percentage * 0.3), 0)
  )

  return {
    text: `AI prioritering toont dat ${getCategoryName(categories[0].category)} (${Math.round(categories[0].percentage)}% van totaal) de hoogste impact heeft. Focus op deze categorie kan tot ${totalOptimizationPotential}% reductie leiden binnen 12 maanden.`,
    priorities,
    totalOptimizationPotential,
    strategicFocus: categories[0].category,
    actionableSteps: priorities.length
  }
}

function generateOpportunityInsights(breakdown, companyInfo, industry) {
  const opportunities = []
  const employeeCount = companyInfo.employees || 1

  // Energy opportunities
  if (breakdown.energy > 0) {
    const energyPotential = Math.round(breakdown.energy * (0.25 + Math.random() * 0.15) * 100) / 100
    const energyInvestment = Math.round((employeeCount * 100 + Math.random() * 2000) / 100) * 100
    
    opportunities.push({
      id: 'green_energy',
      type: 'Groene Energie Transitie',
      category: 'energy',
      potential: `${Math.round((energyPotential / breakdown.energy) * 100)}%`,
      absolutePotential: energyPotential,
      investment: `€${energyInvestment.toLocaleString()} - €${Math.round(energyInvestment * 1.5).toLocaleString()}`,
      payback: '12-18 maanden',
      aiConfidence: 0.92,
      difficulty: 'Medium',
      timeframe: '3-6 maanden',
      description: 'AI detecteert optimale timing voor groene energie overstap gebaseerd op jouw verbruiksprofiel en huidige energiecontracten',
      benefits: [
        'Directe CO2 reductie tot 40%',
        'Bescherming tegen energieprijsvolatiliteit', 
        'Verbeterde ESG score en reputatie',
        'Mogelijk voor groene financiering kwalificatie'
      ],
      implementation: [
        'Analyse huidige energiecontracten',
        'Vergelijking groene energieleveranciers',
        'Implementatie smart monitoring systemen',
        'Certificering en rapportage setup'
      ]
    })
  }

  // Transport opportunities  
  if (breakdown.transport > 0) {
    const transportPotential = Math.round(breakdown.transport * (0.3 + Math.random() * 0.2) * 100) / 100
    const transportInvestment = Math.round(employeeCount * 800 + Math.random() * 5000)
    
    opportunities.push({
      id: 'smart_mobility',
      type: 'Smart Mobility Programma',
      category: 'transport',
      potential: `${Math.round((transportPotential / breakdown.transport) * 100)}%`,
      absolutePotential: transportPotential,
      investment: `€${transportInvestment.toLocaleString()} - €${Math.round(transportInvestment * 1.8).toLocaleString()}`,
      payback: '18-24 maanden',
      aiConfidence: 0.87,
      difficulty: 'Hoog',
      timeframe: '6-12 maanden',
      description: 'Gefaseerde elektrificatie van wagenpark en implementatie van smart mobility beleid aangepast aan jouw bedrijfsactiviteiten',
      benefits: [
        'Tot 50% reductie transport-gerelateerde emissies',
        'Lagere operationele kosten per kilometer',
        'Verbeterde werknemerstevredenheid',
        'Compliance met toekomstige emissieregelgeving'
      ],
      implementation: [
        'Analyse huidige wagenpark en rijgedrag',
        'Gefaseerde overstap naar elektrische voertuigen',
        'Installatie laadinfrastructuur',
        'Training en change management programma'
      ]
    })
  }

  // Industry-specific opportunities
  if (industry === 'Technologie') {
    opportunities.push({
      id: 'cloud_optimization',
      type: 'Carbon-Aware Cloud Optimalisatie',
      category: 'technology',
      potential: '15-25%',
      absolutePotential: Math.round(breakdown.energy * 0.2 * 100) / 100,
      investment: '€3,000 - €12,000',
      payback: '6-12 maanden',
      aiConfidence: 0.94,
      difficulty: 'Laag',
      timeframe: '1-3 maanden',
      description: 'AI-geoptimaliseerde cloud infrastructuur met carbon-aware scheduling en efficient resource management',
      benefits: [
        'Automatische optimalisatie van cloud resources',
        'Real-time carbon impact monitoring',
        'Kostenreductie van 20-30% op cloud uitgaven',
        'Verbeterde application performance'
      ],
      implementation: [
        'Cloud carbon footprint audit',
        'Implementatie carbon-aware tooling',
        'Optimalisatie van deployment strategieën',
        'Continuous monitoring en rapportage'
      ]
    })
  }

  if (industry === 'Productie') {
    opportunities.push({
      id: 'circular_manufacturing',
      type: 'Circulaire Productie Optimalisatie',
      category: 'manufacturing',
      potential: '20-35%',
      absolutePotential: Math.round((breakdown.materials || 0 + breakdown.waste || 0) * 0.3 * 100) / 100,
      investment: '€15,000 - €45,000',
      payback: '24-36 maanden',
      aiConfidence: 0.88,
      difficulty: 'Hoog',
      timeframe: '12-18 maanden',
      description: 'Implementatie van circulaire economie principes in productieprocessen met waste-to-energy oplossingen',
      benefits: [
        'Significante reductie in materiaalkosten',
        'Minimalisatie van afvalstromen',
        'Nieuwe revenue streams uit bijproducten',
        'Verbeterde supply chain resilience'
      ],
      implementation: [
        'Materiaalstroom analyse',
        'Design for circularity implementatie',
        'Partnership ontwikkeling met leveranciers',
        'Certificering en stakeholder communicatie'
      ]
    })
  }

  // Always include efficiency opportunity
  opportunities.push({
    id: 'smart_building',
    type: 'Smart Building Automation',
    category: 'efficiency',
    potential: '18-28%',
    absolutePotential: Math.round(breakdown.energy * 0.22 * 100) / 100,
    investment: `€${Math.round(employeeCount * 160).toLocaleString()} - €${Math.round(employeeCount * 300).toLocaleString()}`,
    payback: '24-30 maanden',
    aiConfidence: 0.91,
    difficulty: 'Medium',
    timeframe: '6-9 maanden',
    description: 'AI-gedreven building management systeem met predictive controls en occupancy-based optimization',
    benefits: [
      'Geautomatiseerde energie optimalisatie',
      'Verbeterde indoor air quality en comfort',
      'Predictive maintenance en kostenbesparing',
      'Real-time energy monitoring en alerts'
    ],
    implementation: [
      'Building energy audit en sensor installatie',
      'AI algoritme configuratie en training',
      'Integratie met bestaande HVAC systemen',
      'User training en continuous optimization'
    ]
  })

  const totalPotential = opportunities.reduce((sum, opp) => sum + opp.absolutePotential, 0)
  const avgConfidence = opportunities.reduce((sum, opp) => sum + opp.aiConfidence, 0) / opportunities.length

  return {
    text: `AI heeft ${opportunities.length} high-impact kansen geïdentificeerd met totaal ${Math.round(totalPotential * 100) / 100} ton CO2 besparingspotentieel en gemiddeld ${Math.round(avgConfidence * 100)}% betrouwbaarheid.`,
    opportunities: opportunities.slice(0, 5), // Limit to top 5
    totalPotential,
    averageConfidence: avgConfidence,
    implementationTimeline: '6-18 maanden',
    totalInvestmentRange: {
      min: opportunities.reduce((sum, opp) => sum + parseInt(opp.investment.split('€')[1].split(' ')[0].replace(',', '')), 0),
      max: opportunities.reduce((sum, opp) => sum + parseInt(opp.investment.split('€')[2].replace(',', '')), 0)
    }
  }
}

function generatePredictiveInsights(emissions, companyInfo, goals) {
  const currentYear = new Date().getFullYear()
  const projections = []
  const targetReduction = goals?.targetReduction || 30
  const timeline = goals?.timeline || 24

  for (let year = 1; year <= 5; year++) {
    const baseGrowth = 1 + (companyInfo.employees > 50 ? 0.12 : 0.08) // Company growth factor
    const efficiencyGain = 1 - (0.04 * year) // 4% efficiency gain per year with initiatives
    const marketTrend = 1 - (0.02 * year) // Market-driven efficiency improvements
    
    const baseline = emissions.total * Math.pow(baseGrowth, year)
    const withOptimization = baseline * Math.pow(efficiencyGain, year) * Math.pow(marketTrend, year)
    const withAggressive = baseline * Math.pow(0.85, year) // Aggressive 15% YoY reduction
    
    projections.push({
      year: currentYear + year,
      baseline: Math.round(baseline * 100) / 100,
      optimized: Math.round(withOptimization * 100) / 100,
      aggressive: Math.round(withAggressive * 100) / 100,
      savings: Math.round((baseline - withOptimization) * 100) / 100,
      aggressiveSavings: Math.round((baseline - withAggressive) * 100) / 100,
      cumulativeSavings: year === 1 ? Math.round((baseline - withOptimization) * 100) / 100 : 
        Math.round(((baseline - withOptimization) + projections[year-2]?.cumulativeSavings || 0) * 100) / 100
    })
  }

  const fiveYearReduction = Math.round(((emissions.total - projections[4].optimized) / emissions.total) * 100)
  const complianceRisk = fiveYearReduction < 25 ? 'Hoog' : fiveYearReduction < 40 ? 'Medium' : 'Laag'

  return {
    text: `AI voorspelt ${fiveYearReduction}% emissiereductie in 5 jaar met optimalisatie (vs. ${Math.round(((projections[4].baseline - emissions.total) / emissions.total) * 100)}% groei zonder actie). Compliance risico: ${complianceRisk}.`,
    projections,
    fiveYearReduction,
    complianceRisk,
    recommendedPath: fiveYearReduction >= targetReduction ? 'optimized' : 'aggressive',
    keyMilestones: [
      { year: currentYear + 1, target: projections[0].optimized, description: 'Quick wins implementatie' },
      { year: currentYear + 2, target: projections[1].optimized, description: 'Structurele veranderingen' },
      { year: currentYear + 5, target: projections[4].optimized, description: 'Langetermijn duurzaamheid' }
    ]
  }
}

function generateBenchmarkInsights(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  
  // Enhanced peer data with realistic variations
  const peerData = generatePeerBenchmarks(industry, employeeCount, emissionsPerEmployee)
  
  const betterThan = peerData.filter(peer => peer.emissionsPerEmployee > emissionsPerEmployee).length
  const percentage = Math.round((betterThan / peerData.length) * 100)
  
  const quartile = percentage >= 75 ? '1st (Top 25%)' : 
                   percentage >= 50 ? '2nd (Top 50%)' : 
                   percentage >= 25 ? '3rd (Bottom 50%)' : '4th (Bottom 25%)'

  return {
    text: `Jouw prestaties zijn beter dan ${percentage}% van vergelijkbare ${industry.toLowerCase()} bedrijven. Je zit in het ${quartile} kwartiel van de sector.`,
    ranking: percentage,
    quartile,
    peers: peerData.slice(0, 5),
    topPerformer: peerData.reduce((best, peer) => peer.emissionsPerEmployee < best.emissionsPerEmployee ? peer : best),
    industryAverage: peerData.reduce((sum, peer) => sum + peer.emissionsPerEmployee, 0) / peerData.length,
    improvementPotential: peerData[0].emissionsPerEmployee, // Best in class
    sectorTrends: {
      avgReduction: '12% YoY',
      topPerformers: '25% YoY',
      regulatoryPressure: 'Increasing',
      investmentFlow: '€2.3B in 2024'
    }
  }
}

function generateActionPlan(breakdown, companyInfo, goals, industry) {
  const plan = {
    immediate: [], // 0-3 months
    shortTerm: [], // 3-12 months  
    longTerm: [] // 1-3 years
  }

  // Immediate actions (0-3 months)
  plan.immediate.push({
    action: 'Smart meter installatie en energie monitoring setup',
    category: 'energy',
    cost: '€500 - €1,500',
    impact: '5-10% insight-driven reductie',
    effort: 'Laag',
    roi: '300%',
    description: 'Real-time energy monitoring voor data-driven besluitvorming'
  })

  plan.immediate.push({
    action: 'Employee awareness programma en green team vorming',
    category: 'culture',
    cost: '€200 - €800',
    impact: '8-15% gedragsverandering',
    effort: 'Laag',
    roi: '400%',
    description: 'Bewustwording en engagement van medewerkers voor duurzaamheid'
  })

  if (breakdown.waste > 2) {
    plan.immediate.push({
      action: 'Waste audit en recycling programma optimalisatie',
      category: 'waste',
      cost: '€300 - €1,000',
      impact: '20-30% waste reductie',
      effort: 'Laag',
      roi: '250%',
      description: 'Systematische aanpak van afvalstromen en recycling efficiency'
    })
  }

  // Short term actions (3-12 months)
  plan.shortTerm.push({
    action: 'Groene energie contract en LED verlichting upgrade',
    category: 'energy',
    cost: '€3,000 - €8,000', 
    impact: '25-35% energie gerelateerde reductie',
    effort: 'Medium',
    roi: '180%',
    description: 'Structurele energie optimalisatie met zichtbare resultaten'
  })

  if (breakdown.transport > 3) {
    plan.shortTerm.push({
      action: 'Hybrid/elektrische lease auto programma start',
      category: 'transport',
      cost: '€5,000 - €15,000',
      impact: '30-45% transport reductie',
      effort: 'Medium',
      roi: '160%',
      description: 'Gefaseerde overstap naar schonere mobiliteit'
    })
  }

  plan.shortTerm.push({
    action: 'Smart building automation implementatie',
    category: 'efficiency',
    cost: '€8,000 - €20,000',
    impact: '18-25% operationele efficiency',
    effort: 'Medium',
    roi: '140%',
    description: 'AI-gedreven building management voor automatische optimalisatie'
  })

  // Long term actions (1-3 years)
  plan.longTerm.push({
    action: 'Volledig elektrische wagenpark transitie',
    category: 'transport',
    cost: '€25,000 - €60,000',
    impact: '50-70% transport emissie eliminatie',
    effort: 'Hoog',
    roi: '120%',
    description: 'Complete elektrificatie met laadinfrastructuur'
  })

  if (companyInfo.employees > 20) {
    plan.longTerm.push({
      action: 'On-site renewable energy (zonnepanelen/windenergie)',
      category: 'energy',
      cost: '€30,000 - €80,000',
      impact: '40-60% energie onafhankelijkheid',
      effort: 'Hoog',
      roi: '110%',
      description: 'Eigen duurzame energieopwekking voor lange termijn stabiliteit'
    })
  }

  plan.longTerm.push({
    action: 'Circulaire economie en supply chain optimalisatie',
    category: 'materials',
    cost: '€15,000 - €40,000',
    impact: '30-50% materiaal footprint reductie',
    effort: 'Hoog',
    roi: '130%',
    description: 'Systematische herziening van inkoop en materiaalstromen'
  })

  const totalImpact = {
    immediate: Math.round((breakdown.energy * 0.08 + breakdown.waste * 0.25) * 100) / 100,
    shortTerm: Math.round((breakdown.energy * 0.3 + breakdown.transport * 0.35) * 100) / 100,
    longTerm: Math.round((breakdown.transport * 0.6 + breakdown.energy * 0.5) * 100) / 100
  }

  return {
    text: `AI genereert gefaseerd actieplan: ${plan.immediate.length} quick wins (${totalImpact.immediate} ton CO2), ${plan.shortTerm.length} medium-term projecten (${totalImpact.shortTerm} ton CO2), ${plan.longTerm.length} strategische initiatieven (${totalImpact.longTerm} ton CO2).`,
    phases: plan,
    totalImpact,
    timeline: '36 maanden voor volledige implementatie',
    investmentTotal: {
      min: 50000,
      max: 150000,
      roi: '150% gemiddeld over 3 jaar'
    }
  }
}

function generateRiskAssessment(emissions, industry, companyInfo) {
  const risks = []

  // Regulatory risks
  if (emissions.total > 100 || companyInfo.employees > 250) {
    risks.push({
      type: 'Regulatory',
      level: 'Hoog',
      probability: '90%',
      impact: 'Zeer Hoog',
      description: 'CSRD rapportage verplicht vanaf 2024, CBAM uitbreiding, en nationale carbon tax implementatie',
      timeline: '6-18 maanden',
      financialImpact: `€${Math.round(emissions.total * 75).toLocaleString()} - €${Math.round(emissions.total * 120).toLocaleString()} jaarlijks`,
      mitigation: [
        'Start nu met CSRD-conforme data verzameling',
        'Implementeer carbon accounting systemen',
        'Ontwikkel compliance roadmap met externe experts',
        'Monitor regelgevingsontwikkelingen actief'
      ]
    })
  }

  // Financial risks
  const carbonTax = emissions.total * 75 // €75 per ton estimated future tax
  if (carbonTax > 5000) {
    risks.push({
      type: 'Financial',
      level: 'Hoog',
      probability: '85%',
      impact: 'Hoog',
      description: `Geschatte carbon tax impact: €${Math.round(carbonTax).toLocaleString()} per jaar bij €75/ton CO2`,
      timeline: '2-4 jaar',
      financialImpact: `€${Math.round(carbonTax * 0.8).toLocaleString()} - €${Math.round(carbonTax * 1.5).toLocaleString()} jaarlijks`,
      mitigation: [
        'Vroege emissiereductie voorkomt toekomstige kosten',
        'Investeer in carbon offset programma\'s',
        'Ontwikkel carbon-efficient business model',
        'Hedge tegen carbon price volatiliteit'
      ]
    })
  }

  // Supply chain risks
  if (industry === 'Productie' || industry === 'Retail') {
    risks.push({
      type: 'Supply Chain',
      level: 'Medium',
      probability: '70%',
      impact: 'Medium',
      description: 'Leveranciers onder druk voor scope 3 emissierapportage en carbon footprint reductie',
      timeline: '12-24 maanden',
      financialImpact: '5-15% stijging inkoopkosten',
      mitigation: [
        'Ontwikkel supplier carbon scorecard',
        'Integreer sustainability in procurement criteria',
        'Werk samen met leveranciers aan reductiedoelen',
        'Diversifieer naar groene leveranciers'
      ]
    })
  }

  // Reputation and market risks
  risks.push({
    type: 'Reputational',
    level: 'Medium',
    probability: '75%',
    impact: 'Medium',
    description: 'Toenemende stakeholder verwachtingen voor transparantie en duurzaamheidsprestaties',
    timeline: 'Continu',
    financialImpact: 'Potentieel verlies van klanten en talent',
    mitigation: [
      'Proactieve sustainability communicatie',
      'Third-party verificatie van carbon data',
      'Stakeholder engagement programma',
      'Ontwikkel sustainability storytelling'
    ]
  })

  // Technology transition risks
  if (breakdown.energy > 10) {
    risks.push({
      type: 'Technology Transition',
      level: 'Medium',
      probability: '60%',
      impact: 'Medium',
      description: 'Risico van stranded assets bij versnelde transitie naar groene technologieën',
      timeline: '3-7 jaar',
      financialImpact: '10-25% van asset waarde',
      mitigation: [
        'Geleidelijke transitie planning',
        'Asset life cycle assessment',
        'Investeer in flexibele, future-proof technologie',
        'Ontwikkel asset disposal strategie'
      ]
    })
  }

  const overallRisk = risks.reduce((sum, risk) => {
    const levelScore = { 'Laag': 1, 'Medium': 2, 'Hoog': 3, 'Zeer Hoog': 4 }
    return sum + levelScore[risk.level]
  }, 0) / risks.length

  return {
    text: `AI risk analyse identificeert ${risks.length} belangrijke risico's met gemiddelde score ${overallRisk.toFixed(1)}/4. Hoogste prioriteit: ${risks[0]?.type || 'Regulatory compliance'}.`,
    risks,
    overallRiskScore: overallRisk,
    riskLevel: overallRisk >= 3 ? 'Hoog' : overallRisk >= 2 ? 'Medium' : 'Laag',
    criticalActions: risks.filter(r => r.level === 'Hoog').length,
    timeline: 'Maatregelen nodig binnen 6-18 maanden'
  }
}

function generateCustomRecommendations(emissions, companyInfo, industry) {
  const recommendations = []

  // Size-based recommendations
  if (companyInfo.employees < 25) {
    recommendations.push({
      category: 'Small Business Advantage',
      title: 'Leverage agility voor snelle sustainability wins',
      description: 'Als klein bedrijf kun je snel schakelen naar groene oplossingen en profiteren van SME subsidies',
      impact: 'Hoog',
      ease: 'Hoog',
      timeframe: '3-6 maanden',
      specifics: [
        'Toegang tot MKB sustainability subsidies (tot €50k)',
        'Snelle besluitvorming voor groene investeringen',
        'Personal approach naar employee engagement',
        'Flexibiliteit in werkplek en mobiliteit beleid'
      ]
    })
  } else if (companyInfo.employees > 100) {
    recommendations.push({
      category: 'Enterprise Scale Benefits',
      title: 'Dedicated sustainability function en systematische aanpak',
      description: 'Schaal rechtvaardigt gespecialiseerde resources en enterprise sustainability programma\'s',
      impact: 'Zeer Hoog',
      ease: 'Medium',
      timeframe: '6-12 maanden',
      specifics: [
        'Fulltime sustainability officer/team aanstellen',
        'Enterprise carbon management platform implementeren',
        'Systematische supplier engagement programma',
        'Internal carbon pricing mechanisme'
      ]
    })
  }

  // Industry-specific recommendations
  if (industry === 'Technologie') {
    recommendations.push({
      category: 'Tech Innovation Leadership',
      title: 'Carbon-aware software development en green coding',
      description: 'Implementeer cutting-edge carbon tracking in development pipeline en product design',
      impact: 'Hoog',
      ease: 'Medium',
      timeframe: '6-9 maanden',
      specifics: [
        'Green software engineering principles implementeren',
        'Carbon tracking in CI/CD pipeline',
        'Edge computing voor efficiency optimalisatie',
        'AI/ML model efficiency optimization'
      ]
    })
  }

  if (industry === 'Financiële Diensten') {
    recommendations.push({
      category: 'Financial Sector Leadership',
      title: 'Green finance en climate risk integration',
      description: 'Integreer climate impact in investment en lending decisions',
      impact: 'Zeer Hoog',
      ease: 'Medium',
      timeframe: '12-18 maanden',
      specifics: [
        'TCFD compliance en climate risk disclosure',
        'Green bond en sustainable investment producten',
        'Scope 3 financed emissions tracking',
        'Climate scenario analysis implementatie'
      ]
    })
  }

  if (industry === 'Productie') {
    recommendations.push({
      category: 'Manufacturing Excellence',
      title: 'Industry 4.0 voor carbon optimization',
      description: 'Leverage IoT en AI voor real-time carbon optimization in productieprocessen',
      impact: 'Zeer Hoog',
      ease: 'Hoog',
      timeframe: '9-15 maanden',
      specifics: [
        'Digital twin voor carbon impact modeling',
        'Predictive maintenance voor efficiency',
        'Circular design principles implementatie',
        'Real-time energy en materials tracking'
      ]
    })
  }

  // Performance-based recommendations
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  if (emissionsPerEmployee > 8) {
    recommendations.push({
      category: 'High Impact Opportunity',
      title: 'Accelerated decarbonization programma',
      description: 'Je carbon intensity is hoog - dit biedt significante reductiekansen en potentiële cost savings',
      impact: 'Zeer Hoog',
      ease: 'Medium',
      timeframe: '12-24 maanden',
      specifics: [
        'Comprehensive energy audit en optimization',
        'Rapid implementation van renewable energy',
        'Transport electrification versnelling',
        'Employee behaviour change programma'
      ]
    })
  }

  return {
    text: `AI genereert ${recommendations.length} op maat gemaakte aanbevelingen specifiek voor jouw bedrijfsprofiel, industrie en groeifase.`,
    recommendations,
    priorityFocus: recommendations[0]?.category || 'General Optimization',
    implementationComplexity: 'Medium',
    expectedROI: '150-250% over 3 jaar'
  }
}

function generateImplementationRoadmap(breakdown, companyInfo, totalEmissions) {
  const phases = [
    {
      phase: 'Foundation (Maanden 1-6)',
      color: [34, 197, 94], // Green
      focus: 'Quick wins en data foundation',
      target: Math.round(totalEmissions * 0.9 * 100) / 100,
      investment: '€5,000 - €15,000',
      actions: [
        'Carbon accounting systeem implementatie',
        'Employee awareness training programma',
        'Energy monitoring en smart meters',
        'Waste audit en recycling optimalisatie',
        'Green team formatie en governance'
      ],
      kpis: [
        '10% emissiereductie',
        '100% data coverage',
        '80% employee engagement'
      ]
    },
    {
      phase: 'Acceleration (Maanden 6-18)',
      color: [59, 130, 246], // Blue
      focus: 'Structurele veranderingen en efficiency',
      target: Math.round(totalEmissions * 0.7 * 100) / 100,
      investment: '€20,000 - €50,000',
      actions: [
        'Groene energie contract implementatie',
        'LED verlichting en building automation',
        'Hybrid/elektrische lease programma start',
        'Supplier engagement en screening',
        'Carbon offset portfolio ontwikkeling'
      ],
      kpis: [
        '30% emissiereductie',
        '50% groene energie',
        '25% transport electrification'
      ]
    },
    {
      phase: 'Transformation (Maanden 18-36)',
      color: [147, 51, 234], // Purple
      focus: 'Strategische investeringen en innovation',
      target: Math.round(totalEmissions * 0.5 * 100) / 100,
      investment: '€50,000 - €120,000',
      actions: [
        'On-site renewable energy installatie',
        'Volledige wagenpark elektrificatie',
        'Circulaire economie implementatie',
        'Advanced carbon management platform',
        'Industry partnership en innovation'
      ],
      kpis: [
        '50% emissiereductie',
        '100% renewable energy',
        'Carbon neutral operations'
      ]
    }
  ]

  const totalInvestment = phases.reduce((sum, phase) => {
    const min = parseInt(phase.investment.split('€')[1].split(' ')[0].replace(',', ''))
    return sum + min
  }, 0)

  return {
    phases,
    totalTimeframe: '36 maanden',
    totalInvestment: `€${totalInvestment.toLocaleString()} - €${Math.round(totalInvestment * 2.4).toLocaleString()}`,
    expectedReduction: '50%',
    roi: '180% over 3 jaar',
    criticalSuccessFactors: [
      'Senior management commitment en sponsorship',
      'Cross-functional team met dedicated resources',
      'Continuous monitoring en data-driven optimization',
      'Employee engagement en culture change',
      'Strategic partner selection en collaboration'
    ]
  }
}

function generateCostBenefitAnalysis(totalEmissions, breakdown, industry) {
  const carbonPrice = 95 // Current EU ETS price
  const projectedCarbonPrice = 150 // Projected 2030 price
  
  const currentCarbonValue = totalEmissions * carbonPrice
  const futureCarbonValue = totalEmissions * projectedCarbonPrice
  
  // Calculate potential savings by category
  const energySavings = {
    co2Reduction: breakdown.energy * 0.35,
    costSaving: (breakdown.energy / 2.5) * 0.28 * 0.35 * 8760, // kWh saved * price * hours
    investment: Math.round(breakdown.energy * 500),
    payback: 24
  }
  
  const transportSavings = {
    co2Reduction: breakdown.transport * 0.45,
    costSaving: (breakdown.transport * 100) * 0.12 * 0.45, // km * cost per km * reduction
    investment: Math.round(breakdown.transport * 200),
    payback: 36
  }
  
  const efficiencySavings = {
    co2Reduction: totalEmissions * 0.18,
    costSaving: currentCarbonValue * 0.18 + (totalEmissions * 0.18 * 200), // Carbon + operational savings
    investment: Math.round(totalEmissions * 300),
    payback: 30
  }

  const totalSavings = {
    annualCo2Reduction: energySavings.co2Reduction + transportSavings.co2Reduction + efficiencySavings.co2Reduction,
    annualCostSaving: energySavings.costSaving + transportSavings.costSaving + efficiencySavings.costSaving,
    totalInvestment: energySavings.investment + transportSavings.investment + efficiencySavings.investment,
    netPresentValue: 0,
    roi: 0,
    paybackPeriod: 0
  }

  // Calculate NPV and ROI over 5 years
  let cumulativeCashFlow = -totalSavings.totalInvestment
  for (let year = 1; year <= 5; year++) {
    const yearlyBenefit = totalSavings.annualCostSaving * Math.pow(1.03, year) // 3% inflation
    cumulativeCashFlow += yearlyBenefit / Math.pow(1.06, year) // 6% discount rate
  }
  
  totalSavings.netPresentValue = Math.round(cumulativeCashFlow)
  totalSavings.roi = Math.round((totalSavings.netPresentValue / totalSavings.totalInvestment) * 100)
  totalSavings.paybackPeriod = Math.round(totalSavings.totalInvestment / totalSavings.annualCostSaving * 12)

  return {
    summary: `Investering van €${totalSavings.totalInvestment.toLocaleString()} genereert €${Math.round(totalSavings.annualCostSaving).toLocaleString()} jaarlijkse besparing met ${totalSavings.roi}% ROI en ${totalSavings.paybackPeriod} maanden terugverdientijd.`,
    breakdown: {
      energy: energySavings,
      transport: transportSavings,
      efficiency: efficiencySavings
    },
    totals: totalSavings,
    carbonPricing: {
      current: carbonPrice,
      projected2030: projectedCarbonPrice,
      riskMitigation: Math.round((futureCarbonValue - currentCarbonValue) * 0.5)
    },
    financialIncentives: [
      'EIA (Energie-investeringsaftrek) tot 45% van investering',
      'WBSO voor innovatieve sustainability projecten',
      'Groene leningen met 0.5-1.5% lagere rente',
      'Carbon credits verkoop potentieel'
    ]
  }
}

function calculateSustainabilityScore(emissions, companyInfo, industry) {
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  const industryBenchmark = {
    'Technologie': 4.2,
    'Productie': 8.5,
    'Retail': 3.8,
    'Financiële Diensten': 2.9,
    'Gezondheidszorg': 5.1,
    'Onderwijs': 3.2,
    'Transport & Logistiek': 12.3,
    'Bouw': 9.7,
    'Anders': 5.5
  }[industry] || 5.5

  // Calculate component scores (0-100)
  const carbonEfficiency = Math.max(0, Math.min(100, (2 - emissionsPerEmployee / industryBenchmark) * 50))
  const dataQuality = 85 // Assumed based on calculation completeness
  const transparancy = companyInfo.employees > 50 ? 70 : 60 // Larger companies typically more transparent
  const governance = companyInfo.employees > 100 ? 80 : 65 // Governance typically better in larger orgs
  
  const overallScore = Math.round((carbonEfficiency * 0.4 + dataQuality * 0.25 + transparancy * 0.2 + governance * 0.15))
  
  const rating = overallScore >= 85 ? 'A+' :
                 overallScore >= 75 ? 'A' :
                 overallScore >= 65 ? 'B+' :
                 overallScore >= 55 ? 'B' :
                 overallScore >= 45 ? 'C+' :
                 overallScore >= 35 ? 'C' : 'D'

  return {
    overallScore,
    rating,
    components: {
      carbonEfficiency: Math.round(carbonEfficiency),
      dataQuality: Math.round(dataQuality),
      transparancy: Math.round(transparancy),
      governance: Math.round(governance)
    },
    industryComparison: overallScore > 70 ? 'Above Average' : overallScore > 50 ? 'Average' : 'Below Average',
    improvementAreas: [
      carbonEfficiency < 60 ? 'Carbon efficiency optimization' : null,
      dataQuality < 80 ? 'Data collection and accuracy' : null,
      transparancy < 70 ? 'Stakeholder communication' : null,
      governance < 70 ? 'Sustainability governance' : null
    ].filter(Boolean),
    nextLevel: overallScore < 85 ? {
      target: rating === 'A' ? 'A+' : String.fromCharCode(rating.charCodeAt(0) + 1) + (rating.includes('+') ? '' : '+'),
      requirements: overallScore < 55 ? 'Focus op carbon efficiency en data kwaliteit' :
                   overallScore < 75 ? 'Verbeter transparantie en governance' :
                   'Optimize alle aspecten voor top rating'
    } : null
  }
}

function generateComplianceCheck(totalEmissions, companyInfo, industry) {
  const compliance = {
    csrd: checkCSRDCompliance(companyInfo),
    cbam: checkCBAMCompliance(industry, totalEmissions),
    ets: checkETSCompliance(totalEmissions, industry),
    taxonomy: checkTaxonomyAlignment(industry),
    national: checkNationalRequirements(companyInfo, totalEmissions)
  }

  const overallCompliance = Object.values(compliance).reduce((sum, item) => sum + item.score, 0) / Object.keys(compliance).length
  const urgentActions = Object.values(compliance).filter(item => item.urgency === 'High').length

  return {
    overallScore: Math.round(overallCompliance),
    rating: overallCompliance >= 80 ? 'Compliant' : overallCompliance >= 60 ? 'Mostly Compliant' : 'Non-Compliant',
    urgentActions,
    frameworks: compliance,
    timeline: urgentActions > 0 ? '6-12 maanden voor compliance' : '12-24 maanden voor optimalisatie',
    recommendations: generateComplianceRecommendations(compliance)
  }
}

// Helper functions
function generatePeerBenchmarks(industry, employeeCount, emissionsPerEmployee) {
  const baseNames = [
    'GreenTech Solutions', 'Sustainable Dynamics', 'EcoInnovate', 'CleanEdge Corp',
    'NextGen Sustainable', 'Carbon Neutral Co', 'Green Future BV', 'Eco Excellence',
    'Sustainable Growth', 'Climate Forward', 'Green Impact Solutions', 'Eco Pioneers'
  ]

  return baseNames.map((name, index) => {
    const variation = 0.7 + Math.random() * 0.6 // 0.7 to 1.3 multiplier
    const sizeVariation = 0.8 + Math.random() * 0.4 // Company size variation
    
    return {
      name,
      employees: Math.round(employeeCount * sizeVariation),
      emissionsPerEmployee: Math.round(emissionsPerEmployee * variation * 100) / 100,
      industry,
      score: Math.round((2 - variation) * 50 + 50)
    }
  }).sort((a, b) => a.emissionsPerEmployee - b.emissionsPerEmployee)
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

function generateCategoryRecommendations(category, emissions, industry) {
  const recommendations = {
    energy: [
      'Smart meter installatie voor real-time monitoring',
      'LED verlichting upgrade (ROI 18 maanden)',
      'Building automation en HVAC optimalisatie',
      'Groene energie contract onderhandeling'
    ],
    transport: [
      'Elektrische lease auto programma',
      'Fiets-van-de-zaak regeling implementatie',
      'Remote work beleid uitbreiding',
      'Public transport stimulering programma'
    ],
    waste: [
      'Circulair afvalbeleid ontwikkeling',
      'Papierloze kantoor transitie',
      'Compostering en organisch afval programma',
      'Supplier packaging reduction agreements'
    ],
    water: [
      'Water-besparende sanitair installatie',
      'Regenwater opvang systeem',
      'Employee awareness campagne',
      'Smart irrigation systemen'
    ],
    materials: [
      'Duurzame inkoop beleid implementatie',
      'Lokale leveranciers prioritering',
      'Circulaire materialen transitie',
      'Product lifecycle assessment'
    ]
  }
  
  return recommendations[category] || [
    'Algemene optimalisatie maatregelen',
    'Monitoring en reporting implementeren',
    'Best practices onderzoek en implementatie'
  ]
}

function generateQuickWins(category) {
  const quickWins = {
    energy: [
      'Programmeerbare thermostaten (€200, 8% besparing)',
      'Power strips met timers (€50, 5% besparing)',
      'Desktop power management (€0, 10% besparing)'
    ],
    transport: [
      'Carpool programma stimulering (€100, 15% reductie)',
      'Video conferencing optimalisatie (€300, 20% travel reductie)',
      'Flexibele werktijden (€0, 12% commute reductie)'
    ],
    waste: [
      'Dubbelzijdig printen default (€0, 50% papier besparing)',
      'Reusable water bottles (€200, 80% plastic reductie)',
      'Digital document workflow (€500, 60% papier reductie)'
    ]
  }
  
  return quickWins[category] || [
    'Energy awareness training (€100, 5-10% general reduction)',
    'Baseline measurement setup (€200, insight generation)',
    'Employee suggestion program (€50, engagement boost)'
  ]
}

function checkCSRDCompliance(companyInfo) {
  const isLarge = companyInfo.employees > 250
  const needsCompliance = isLarge || companyInfo.revenue > 40000000 // €40M threshold
  
  return {
    applicable: needsCompliance,
    score: needsCompliance ? 30 : 100, // Low score if applicable but not ready
    urgency: needsCompliance ? 'High' : 'Low',
    deadline: '2024-2025',
    requirements: needsCompliance ? [
      'Double materiality assessment',
      'Sustainability reporting standards (ESRS)',
      'Third-party audit and assurance',
      'Digital taxonomy alignment'
    ] : ['Monitor threshold criteria'],
    status: needsCompliance ? 'Preparation Required' : 'Not Applicable'
  }
}

function checkCBAMCompliance(industry, totalEmissions) {
  const impactedIndustries = ['Productie', 'Bouw', 'Transport & Logistiek']
  const isImpacted = impactedIndustries.includes(industry)
  
  return {
    applicable: isImpacted,
    score: isImpacted ? 40 : 100,
    urgency: isImpacted ? 'Medium' : 'Low',
    deadline: '2026 (transitional 2023-2026)',
    requirements: isImpacted ? [
      'Carbon content documentation',
      'Emissions monitoring per product',
      'Certificate of compliance',
      'Supply chain carbon tracking'
    ] : ['Monitor industry developments'],
    status: isImpacted ? 'Monitoring Required' : 'Not Applicable'
  }
}

function checkETSCompliance(totalEmissions, industry) {
  const threshold = 25000 // 25k tons CO2 threshold
  const needsETS = totalEmissions > threshold || ['Productie', 'Transport & Logistiek'].includes(industry)
  
  return {
    applicable: needsETS,
    score: needsETS ? 50 : 100,
    urgency: needsETS ? 'High' : 'Low',
    deadline: 'Ongoing',
    requirements: needsETS ? [
      'Emissions monitoring and reporting',
      'Allowance allocation and trading',
      'Verified emissions reporting',
      'Compliance surrender'
    ] : ['Monitor emission levels'],
    status: needsETS ? 'Compliance Required' : 'Below Threshold'
  }
}

function checkTaxonomyAlignment(industry) {
  const alignedIndustries = ['Technologie', 'Gezondheidszorg', 'Onderwijs']
  const isAligned = alignedIndustries.includes(industry)
  
  return {
    applicable: true,
    score: isAligned ? 70 : 50,
    urgency: 'Medium',
    deadline: '2025-2026',
    requirements: [
      'Economic activity alignment assessment',
      'Do No Significant Harm (DNSH) evaluation',
      'Minimum social safeguards compliance',
      'KPI disclosure and reporting'
    ],
    status: isAligned ? 'Partially Aligned' : 'Assessment Required'
  }
}

function checkNationalRequirements(companyInfo, totalEmissions) {
  const needsReporting = companyInfo.employees > 100 || totalEmissions > 50
  
  return {
    applicable: needsReporting,
    score: needsReporting ? 60 : 90,
    urgency: needsReporting ? 'Medium' : 'Low',
    deadline: '2024-2025',
    requirements: needsReporting ? [
      'Klimaatwet compliance (95% reductie 2050)',
      'Lange termijn strategie ontwikkeling',
      'Jaarlijkse monitoring en rapportage',
      'Stakeholder consultation'
    ] : ['Monitor regulatory developments'],
    status: needsReporting ? 'Preparation Needed' : 'Monitoring Required'
  }
}

function generateComplianceRecommendations(compliance) {
  const recommendations = []
  
  Object.entries(compliance).forEach(([framework, details]) => {
    if (details.applicable && details.score < 80) {
      recommendations.push({
        framework: framework.toUpperCase(),
        urgency: details.urgency,
        action: `Implement ${framework} compliance program`,
        timeline: details.deadline,
        priority: details.urgency === 'High' ? 1 : details.urgency === 'Medium' ? 2 : 3
      })
    }
  })
  
  return recommendations.sort((a, b) => a.priority - b.priority)
}

function calculateConfidence(emissions, companyInfo) {
  let confidence = 0.75 // Base confidence
  
  // More data points = higher confidence
  const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  confidence += Math.min(dataPoints * 0.04, 0.20)
  
  // Company size affects confidence (more structured data expected)
  if (companyInfo.employees > 50) confidence += 0.05
  if (companyInfo.employees > 200) confidence += 0.05
  
  // Industry experience factor
  const matureIndustries = ['Financiële Diensten', 'Productie', 'Gezondheidszorg']
  if (matureIndustries.includes(companyInfo.industry)) confidence += 0.03
  
  return Math.min(confidence, 0.98) // Cap at 98%
}
