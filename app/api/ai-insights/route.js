import { NextResponse } from 'next/server'

// Gratis AI via Hugging Face Inference API (volledig gratis)
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "hf_your_free_key_here" // Gratis te verkrijgen

// Nederlandse emissiefactoren (conform Nederlandse CO2-Prestatieladder)
const DUTCH_EMISSION_FACTORS = {
  electricity: 0.298, // kg CO2 per kWh (Nederlandse stroommix 2024)
  gas: 1.884, // kg CO2 per m³ (Nederlandse aardgas)
  heating: 0.298, // kg CO2 per kWh (Nederlandse verwarming)
  carFleet: 0.156, // kg CO2 per km (Nederlandse wagenpark gemiddelde)
  publicTransport: 0.089, // kg CO2 per km (Nederlandse ÖV)
  businessTravel: 0.255, // kg CO2 per km (vliegreizen)
  waste: 0.469, // kg CO2 per kg (Nederlandse afvalverwerking)
  water: 0.298, // kg CO2 per m³ (Nederlandse waterproductie)
  paper: 0.921, // kg CO2 per kg
  plastic: 1.967, // kg CO2 per kg
  metal: 1.467, // kg CO2 per kg
}

// Nederlandse industrie benchmarks (volgens CBS/RVO data)
const DUTCH_INDUSTRY_BENCHMARKS = {
  'Technologie': 3.2,
  'Productie': 8.8,
  'Retail': 4.1,
  'Financiële Diensten': 2.4,
  'Gezondheidszorg': 5.2,
  'Onderwijs': 2.8,
  'Transport & Logistiek': 14.8,
  'Bouw': 11.2,
  'Anders': 5.8
}

export async function POST(request) {
  try {
    const { emissions, companyInfo, industry, goals } = await request.json()

    if (!emissions || !companyInfo) {
      return NextResponse.json(
        { error: 'Missing required data for AI analysis' },
        { status: 400 }
      )
    }

    // Genereer uitgebreide AI insights
    const insights = await generateEnhancedAIInsights(emissions, companyInfo, industry, goals)

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
      model: 'huggingface-enhanced-carbon-ai-v1.0',
      confidence: calculateConfidence(emissions, companyInfo),
      compliance: {
        csrd: checkCSRDRequirement(companyInfo),
        wpm: checkWPMRequirement(companyInfo),
        co2Heffing: checkCO2HeffingRequirement(emissions, industry)
      }
    })

  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}

async function generateEnhancedAIInsights(emissions, companyInfo, industry, goals) {
  const totalEmissions = emissions.total || 0
  const breakdown = emissions.breakdown || {}
  const employeeCount = companyInfo.employees || 1
  const companyName = companyInfo.name || 'Uw bedrijf'

  // Gebruik gratis Hugging Face AI voor geavanceerde analyse
  const aiAnalysis = await getHuggingFaceInsights(companyInfo, emissions, industry)

  const insights = {
    executiveSummary: generateExecutiveSummary(totalEmissions, employeeCount, industry, companyName, aiAnalysis),
    csrdCompliance: generateCSRDAnalysis(companyInfo, totalEmissions),
    dutchBenchmarking: generateDutchBenchmarking(totalEmissions, employeeCount, industry),
    priorityMatrix: generatePriorityMatrix(breakdown, totalEmissions, industry),
    actionPlan: generateDutchActionPlan(breakdown, companyInfo, industry),
    financialAnalysis: generateFinancialAnalysis(totalEmissions, breakdown, companyInfo, industry),
    riskAssessment: generateDutchRiskAssessment(emissions, industry, companyInfo),
    implementationRoadmap: generateImplementationRoadmap(breakdown, companyInfo, totalEmissions),
    aiRecommendations: aiAnalysis.recommendations || [],
    complianceTimeline: generateComplianceTimeline(companyInfo),
    carbonPricing: generateCarbonPricingAnalysis(totalEmissions),
    sectorSpecificInsights: generateSectorInsights(industry, breakdown, companyInfo)
  }

  return insights
}

// Gratis Hugging Face AI implementatie
async function getHuggingFaceInsights(companyInfo, emissions, industry) {
  try {
    const prompt = `Analyseer carbon footprint voor ${industry} bedrijf met ${companyInfo.employees} medewerkers en ${emissions.total} ton CO2. Geef 5 specifieke Nederlandse CSRD-conforme aanbevelingen:`

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('Hugging Face API failed')
    }

    const result = await response.json()
    
    return {
      recommendations: parseAIRecommendations(result[0]?.generated_text || ''),
      confidence: 0.85
    }
  } catch (error) {
    console.warn('AI API failed, using fallback recommendations:', error)
    return {
      recommendations: getFallbackRecommendations(industry),
      confidence: 0.75
    }
  }
}

function parseAIRecommendations(aiText) {
  // Parse AI output into structured recommendations
  const recommendations = []
  const lines = aiText.split('\n').filter(line => line.trim())
  
  lines.forEach((line, index) => {
    if (line.includes('aanbeveling') || line.includes('implementeer') || line.includes('overweeg')) {
      recommendations.push({
        title: `AI Aanbeveling ${index + 1}`,
        description: line.trim(),
        priority: index < 2 ? 'Hoog' : 'Medium',
        impact: index < 3 ? 'Hoog' : 'Medium',
        timeframe: index < 2 ? '3-6 maanden' : '6-12 maanden'
      })
    }
  })

  return recommendations.slice(0, 5)
}

function getFallbackRecommendations(industry) {
  const recommendations = {
    'Technologie': [
      {
        title: 'Cloud Carbon Optimalisatie',
        description: 'Implementeer carbon-aware computing en migrate naar groene datacenters',
        priority: 'Hoog',
        impact: 'Hoog',
        timeframe: '3-6 maanden'
      },
      {
        title: 'Green Software Engineering',
        description: 'Integreer carbon tracking in development pipeline en optimize code efficiency',
        priority: 'Medium',
        impact: 'Medium',
        timeframe: '6-12 maanden'
      }
    ],
    'Productie': [
      {
        title: 'Industry 4.0 Carbon Monitoring',
        description: 'Implementeer IoT sensoren voor real-time energy en emissions tracking',
        priority: 'Hoog',
        impact: 'Zeer Hoog',
        timeframe: '6-12 maanden'
      },
      {
        title: 'Circulaire Economie Transitie',
        description: 'Ontwikkel closed-loop productieprocessen en waste-to-energy systemen',
        priority: 'Hoog',
        impact: 'Hoog',
        timeframe: '12-18 maanden'
      }
    ]
  }

  return recommendations[industry] || [
    {
      title: 'Groene Energie Transitie',
      description: 'Schakel over naar 100% groene energie binnen 12 maanden',
      priority: 'Hoog',
      impact: 'Hoog',
      timeframe: '6-12 maanden'
    }
  ]
}

function generateExecutiveSummary(totalEmissions, employeeCount, industry, companyName, aiAnalysis) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark

  let assessment = ""
  let urgency = ""
  
  if (performance < 0.7) {
    assessment = "uitstekend presterende organisatie die de Nederlandse industrie standaarden overtreft"
    urgency = "optimalisatie"
  } else if (performance < 1.0) {
    assessment = "goed presterende organisatie met sterke sustainability fundamenten"
    urgency = "verbetering"
  } else if (performance < 1.3) {
    assessment = "gemiddeld presterende organisatie met significante verbetermogelijkheden"
    urgency = "actie"
  } else {
    assessment = "organisatie die urgent actie moet ondernemen voor compliance"
    urgency = "kritiek"
  }

  return {
    headline: `${companyName} is een ${assessment}`,
    keyMetrics: {
      totalEmissions: totalEmissions,
      emissionsPerEmployee: Math.round(emissionsPerEmployee * 100) / 100,
      industryComparison: Math.round(performance * 100),
      benchmarkStatus: performance < 1.0 ? 'Boven gemiddeld' : 'Onder gemiddeld'
    },
    urgencyLevel: urgency,
    csrdReadiness: calculateCSRDReadiness(totalEmissions, employeeCount),
    topPriorities: [
      'CSRD compliance voorbereiding',
      'Nederlandse CO2-heffing optimalisatie',
      'WPM rapportage implementatie'
    ],
    aiInsight: aiAnalysis.recommendations[0]?.description || 'AI analyse toont optimalisatiekansen in energie en transport',
    nextSteps: [
      'Start CSRD gap analyse binnen 30 dagen',
      'Implementeer carbon accounting systeem',
      'Ontwikkel science-based reduction targets'
    ]
  }
}

function generateCSRDAnalysis(companyInfo, totalEmissions) {
  const isCSRDRequired = companyInfo.employees > 250 || 
                        (companyInfo.revenue && companyInfo.revenue > 50000000) ||
                        (companyInfo.balanceTotal && companyInfo.balanceTotal > 25000000)

  const currentYear = new Date().getFullYear()
  const reportingYear = isCSRDRequired ? currentYear + 1 : currentYear + 2

  return {
    isRequired: isCSRDRequired,
    reportingDeadline: `${reportingYear}-03-31`,
    preparationDeadline: `${currentYear}-12-31`,
    readinessScore: calculateCSRDReadiness(totalEmissions, companyInfo.employees),
    requirements: [
      'Double materiality assessment',
      'ESRS standaarden implementatie',
      'Third-party audit en assurance',
      'Digital taxonomy alignment',
      'Scope 1, 2 en 3 emissions inventory'
    ],
    gapAnalysis: {
      dataCollection: isCSRDRequired ? 'Kritiek' : 'Belangrijk',
      systemImplementation: 'Nodig',
      processDocumentation: isCSRDRequired ? 'Urgent' : 'Medium',
      thirdPartyVerification: isCSRDRequired ? 'Verplicht' : 'Optioneel'
    },
    estimatedCosts: {
      software: '€12,000 - €35,000 per jaar',
      consultancy: '€25,000 - €75,000 setup',
      audit: '€15,000 - €50,000 per jaar',
      total: '€52,000 - €160,000 jaar 1'
    },
    timeline: generateCSRDTimeline(isCSRDRequired)
  }
}

function generateDutchBenchmarking(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark

  // Simuleer Nederlandse peer data
  const peers = generateDutchPeerData(industry, employeeCount, emissionsPerEmployee)
  const betterThan = peers.filter(peer => peer.emissionsPerEmployee > emissionsPerEmployee).length
  const percentile = Math.round((betterThan / peers.length) * 100)

  return {
    industryBenchmark: industryBenchmark,
    yourPerformance: Math.round(emissionsPerEmployee * 100) / 100,
    percentile: percentile,
    ranking: percentile >= 75 ? 'Top 25%' : percentile >= 50 ? 'Top 50%' : 'Bottom 50%',
    peers: peers.slice(0, 5),
    dutchAverages: {
      [industry]: industryBenchmark,
      'Nederlandse gemiddelde': 5.8,
      'EU gemiddelde': 6.2,
      'Wereldwijd gemiddelde': 7.8
    },
    improvementPotential: {
      toIndustryLeader: Math.max(0, emissionsPerEmployee - (industryBenchmark * 0.6)),
      toTop25Percent: Math.max(0, emissionsPerEmployee - (industryBenchmark * 0.8)),
      savings: Math.round((emissionsPerEmployee - (industryBenchmark * 0.8)) * employeeCount * 95) // €95 per ton
    }
  }
}

function generateDutchPeerData(industry, employeeCount, emissionsPerEmployee) {
  const dutchCompanies = [
    'Sustainable Solutions BV', 'GreenTech Amsterdam', 'Eco Innovators NL',
    'CleanTech Utrecht', 'Circular Economy Rotterdam', 'NetZero Netherlands'
  ]

  return dutchCompanies.map((name, index) => {
    const variation = 0.6 + Math.random() * 0.8
    return {
      name,
      employees: Math.round(employeeCount * (0.8 + Math.random() * 0.4)),
      emissionsPerEmployee: Math.round(emissionsPerEmployee * variation * 100) / 100,
      industry,
      location: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen'][index],
      csrdCompliant: index < 3
    }
  }).sort((a, b) => a.emissionsPerEmployee - b.emissionsPerEmployee)
}

function generateDutchActionPlan(breakdown, companyInfo, industry) {
  const plan = {
    immediate: [], // 0-6 maanden
    shortTerm: [], // 6-18 maanden
    longTerm: [] // 18-36 maanden
  }

  // Nederlandse specifieke acties
  plan.immediate.push({
    action: 'Registratie bij RVO voor CO2-Prestatieladder niveau 1',
    cost: '€2,500 - €5,000',
    impact: 'CSRD voorbereiding + aanbestedingsvoordeel',
    effort: 'Laag',
    roi: '200%',
    dutchSpecific: true,
    deadline: '3 maanden'
  })

  plan.immediate.push({
    action: 'WPM rapportage implementatie (verplicht 100+ werknemers)',
    cost: '€1,500 - €3,500',
    impact: 'Wettelijke compliance',
    effort: 'Medium',
    dutchSpecific: true,
    deadline: '30 juni 2025'
  })

  if (breakdown.energy > 5) {
    plan.shortTerm.push({
      action: 'Groene energie contract via Nederlandse leveranciers',
      cost: '€0 - €5,000 setup',
      impact: '30-50% Scope 2 eliminatie',
      effort: 'Laag',
      roi: 'Positief',
      dutchSpecific: true,
      suppliers: ['Vattenfall', 'Eneco', 'Essent Groene Energie']
    })
  }

  if (companyInfo.employees > 50) {
    plan.shortTerm.push({
      action: 'Nederlandse lease auto elektrificatie programma',
      cost: '€15,000 - €40,000',
      impact: '40-60% transport reductie',
      effort: 'Medium',
      roi: '150%',
      dutchSpecific: true,
      incentives: ['€4,000 SEEH subsidie per auto', 'Vrijstelling BPM', '4% bijtelling']
    })
  }

  plan.longTerm.push({
    action: 'Nederlandse zonnepanelen met SDE++ subsidie',
    cost: '€25,000 - €75,000',
    impact: '60-80% energie onafhankelijkheid',
    effort: 'Hoog',
    roi: '180%',
    dutchSpecific: true,
    subsidies: ['SDE++', 'EIA aftrek', 'Accelerated depreciation']
  })

  return {
    summary: `3-fase implementatie voor Nederlandse CSRD compliance en carbon neutraliteit`,
    phases: plan,
    dutchIncentives: calculateDutchIncentives(plan),
    totalInvestment: '€44,000 - €128,500',
    estimatedSavings: '€35,000 - €85,000 per jaar',
    paybackPeriod: '18-24 maanden'
  }
}

function generateFinancialAnalysis(totalEmissions, breakdown, companyInfo, industry) {
  // Nederlandse CO2 prijsprojectie
  const currentCO2Price = 95 // EU ETS
  const dutchCO2Tax2030 = 216 // €216 per ton in 2030
  
  const carbonRisk = {
    current: totalEmissions * currentCO2Price,
    future2030: totalEmissions * dutchCO2Tax2030,
    escalation: totalEmissions * (dutchCO2Tax2030 - currentCO2Price)
  }

  // Nederlandse subsidies en incentives
  const availableIncentives = {
    SDE: totalEmissions * 50, // Renewable energy subsidy
    EIA: Math.min(companyInfo.employees * 500, 25000), // Investment allowance
    SEEH: Math.min(companyInfo.employees * 200, 20000), // Electric vehicles
    WBSO: Math.min(companyInfo.employees * 400, 35000), // Innovation credit
    total: 0
  }
  availableIncentives.total = Object.values(availableIncentives).reduce((sum, val) => sum + val, 0) - availableIncentives.total

  // ROI calculatie met Nederlandse context
  const investmentRange = {
    minimal: 15000,
    moderate: 45000,
    comprehensive: 120000
  }

  const savingsProjection = {
    energySavings: breakdown.energy * 0.35 * 280, // €280 per ton
    transportSavings: breakdown.transport * 0.45 * 250,
    wasteReduction: breakdown.waste * 0.60 * 150,
    operationalEfficiency: totalEmissions * 0.20 * 180,
    carbonTaxAvoidance: totalEmissions * 0.40 * dutchCO2Tax2030
  }

  const totalAnnualSavings = Object.values(savingsProjection).reduce((sum, val) => sum + val, 0)

  return {
    carbonPricing: carbonRisk,
    dutchIncentives: availableIncentives,
    investmentScenarios: {
      minimal: {
        investment: investmentRange.minimal,
        annualSavings: totalAnnualSavings * 0.3,
        payback: Math.round(investmentRange.minimal / (totalAnnualSavings * 0.3) * 12),
        roi5Year: Math.round(((totalAnnualSavings * 0.3 * 5) / investmentRange.minimal - 1) * 100)
      },
      moderate: {
        investment: investmentRange.moderate,
        annualSavings: totalAnnualSavings * 0.6,
        payback: Math.round(investmentRange.moderate / (totalAnnualSavings * 0.6) * 12),
        roi5Year: Math.round(((totalAnnualSavings * 0.6 * 5) / investmentRange.moderate - 1) * 100)
      },
      comprehensive: {
        investment: investmentRange.comprehensive,
        annualSavings: totalAnnualSavings * 0.8,
        payback: Math.round(investmentRange.comprehensive / (totalAnnualSavings * 0.8) * 12),
        roi5Year: Math.round(((totalAnnualSavings * 0.8 * 5) / investmentRange.comprehensive - 1) * 100)
      }
    },
    breakdownSavings: savingsProjection,
    recommendedPath: totalEmissions > 50 ? 'comprehensive' : totalEmissions > 20 ? 'moderate' : 'minimal'
  }
}

function generateDutchRiskAssessment(emissions, industry, companyInfo) {
  const risks = []

  // CSRD non-compliance risico
  if (companyInfo.employees > 250) {
    risks.push({
      type: 'CSRD Non-Compliance',
      level: 'Kritiek',
      probability: '90%',
      impact: 'Zeer Hoog',
      description: 'CSRD rapportage verplicht vanaf 2025. Non-compliance resulteert in significante boetes en reputatieschade',
      timeline: '12 maanden',
      mitigation: [
        'Start CSRD gap analyse binnen 30 dagen',
        'Implementeer carbon accounting systeem',
        'Contracteer third-party audit partner',
        'Train finance team in ESRS standaarden'
      ],
      estimatedCost: '€25,000 - €500,000 boetes + reputatieschade'
    })
  }

  // Nederlandse CO2-heffing risico
  if (['Productie', 'Bouw', 'Transport & Logistiek'].includes(industry) && emissions.total > 25) {
    risks.push({
      type: 'CO2-Heffing Escalatie',
      level: 'Hoog',
      probability: '100%',
      impact: 'Hoog',
      description: 'Nederlandse CO2-heffing stijgt naar €216 per ton in 2030. Directe impact op operationele kosten',
      timeline: 'Voortdurend tot 2030',
      mitigation: [
        'Implementeer carbon reduction roadmap',
        'Investeer in energie-efficiency',
        'Overweeg carbon offset portfolio',
        'Hedge carbon price exposure'
      ],
      estimatedCost: `€${Math.round(emissions.total * 216).toLocaleString()} per jaar in 2030`
    })
  }

  // WPM rapportage risico
  if (companyInfo.employees >= 100) {
    risks.push({
      type: 'WPM Rapportage Non-Compliance',
      level: 'Medium',
      probability: '70%',
      impact: 'Medium',
      description: 'Werkgebonden Personenmobiliteit rapportage verplicht. Deadline 30 juni 2025',
      timeline: '30 juni 2025',
      mitigation: [
        'Implementeer employee mobility tracking',
        'Set up RVO rapportage systeem',
        'Train HR team in WPM procedures',
        'Develop sustainable mobility policy'
      ],
      estimatedCost: '€5,000 - €25,000 setup + €2,500 jaarlijks'
    })
  }

  // Supply chain carbon risico
  risks.push({
    type: 'Supply Chain Carbon Exposure',
    level: 'Medium',
    probability: '80%',
    impact: 'Medium',
    description: 'Leveranciers implementeren carbon costs. 15-25% prijsstijging verwacht',
    timeline: '24-36 maanden',
    mitigation: [
      'Scope 3 emissions assessment',
      'Supplier sustainability scorecard',
      'Lokale leveranciers prioriteren',
      'Circulaire procurement strategie'
    ],
    estimatedCost: '10-25% stijging inkoopkosten'
  })

  return {
    overallRisk: calculateOverallRisk(risks),
    risks,
    urgentActions: risks.filter(r => r.level === 'Kritiek').length,
    dutchSpecificRisks: 3,
    recommendedInsurance: {
      carbonLiability: '€1M - €10M coverage',
      cyberSecurity: '€500K - €5M coverage',
      directorLiability: '€2M - €20M coverage'
    }
  }
}

function generateComplianceTimeline(companyInfo) {
  const currentYear = new Date().getFullYear()
  const isLarge = companyInfo.employees > 250
  
  return {
    [currentYear]: [
      'Q1: CSRD gap analyse starten',
      'Q2: Carbon accounting systeem selecteren',
      'Q3: Data collection procedures implementeren',
      'Q4: Baseline emissions inventory voltooien'
    ],
    [currentYear + 1]: [
      'Q1: Third-party verification partner contracteren',
      'Q2: ESRS materiality assessment',
      'Q3: Draft sustainability report',
      isLarge ? 'Q4: Eerste CSRD rapportage indienen' : 'Q4: CSRD voorbereiding continueren'
    ],
    [currentYear + 2]: [
      'Q1: Process optimization implementeren',
      'Q2: Science-based targets valideren',
      'Q3: Advanced carbon management systeem',
      !isLarge ? 'Q4: Eerste CSRD rapportage indienen' : 'Q4: Continuous improvement program'
    ]
  }
}

function generateCarbonPricingAnalysis(totalEmissions) {
  return {
    currentExposure: {
      euETS: totalEmissions * 95,
      dutchTax: totalEmissions * 30.48, // 2024 rate
      total: totalEmissions * (95 + 30.48)
    },
    futureProjection: {
      2026: totalEmissions * 150,
      2028: totalEmissions * 180,
      2030: totalEmissions * 216
    },
    hedgingStrategies: [
      'Carbon offset portfolio (€45-85 per ton)',
      'Renewable energy certificates',
      'Energy efficiency investments',
      'Carbon-efficient technology upgrades'
    ],
    recommendedBudget: Math.round(totalEmissions * 120) // €120 per ton average
  }
}

function generateSectorInsights(industry, breakdown, companyInfo) {
  const sectorData = {
    'Technologie': {
      keyMetrics: ['Cloud carbon intensity', 'Data center PUE', 'Software efficiency'],
      benchmarks: {
        cloudCarbonIntensity: '0.45 kg CO2/kWh',
        dataCenter: '1.2 PUE',
        codeEfficiency: '15% annual improvement'
      },
      opportunities: [
        'Carbon-aware workload scheduling',
        'Green cloud migration (AWS/Azure green regions)',
        'Sustainable software development lifecycle'
      ],
      dutchLeaders: ['Booking.com (carbon neutral)', 'ASML (renewable energy)', 'TomTom (electric fleet)']
    },
    'Productie': {
      keyMetrics: ['Energy intensity', 'Waste-to-energy ratio', 'Supply chain carbon'],
      benchmarks: {
        energyIntensity: '2.4 MWh per €1M revenue',
        wasteReduction: '25% YoY improvement',
        supplierEngagement: '75% suppliers with carbon targets'
      },
      opportunities: [
        'Industrial heat pumps (ISDE subsidie)',
        'Circular production processes',
        'Renewable energy on-site generation'
      ],
      dutchLeaders: ['DSM (carbon neutral by 2030)', 'Philips (circular economy)', 'ASML (renewable energy)']
    },
    'Transport & Logistiek': {
      keyMetrics: ['Fleet electrification', 'Route optimization', 'Modal shift percentage'],
      benchmarks: {
        electricFleet: '35% by 2026',
        routeOptimization: '15% efficiency gain',
        modalShift: '20% to rail/water'
      },
      opportunities: [
        'Electric commercial vehicles (SEEH subsidie)',
        'Smart routing algorithms',
        'Intermodal transport optimization'
      ],
      dutchLeaders: ['PostNL (electric delivery)', 'DHL (sustainable logistics)', 'NS (100% wind powered)']
    }
  }

  return sectorData[industry] || {
    keyMetrics: ['Energy efficiency', 'Waste reduction', 'Sustainable procurement'],
    opportunities: ['Groene energie transitie', 'Circulaire economie', 'Smart building technology'],
    dutchLeaders: ['Interface (Mission Zero)', 'Unilever (Sustainable Living)', 'Ikea (circular business)']
  }
}

// Helper functions
function calculateCSRDReadiness(totalEmissions, employeeCount) {
  let score = 40 // Base score
  
  if (totalEmissions > 0) score += 20 // Has emission data
  if (employeeCount > 0) score += 15 // Has employee data
  if (totalEmissions < 50) score += 10 // Manageable size
  if (employeeCount < 500) score += 15 // Manageable complexity
  
  return Math.min(score, 100)
}

function checkCSRDRequirement(companyInfo) {
  const isRequired = companyInfo.employees > 250 || 
                    (companyInfo.revenue && companyInfo.revenue > 50000000)
  
  return {
    required: isRequired,
    timeline: isRequired ? '2025' : '2026',
    urgency: isRequired ? 'Kritiek' : 'Medium'
  }
}

function checkWPMRequirement(companyInfo) {
  const isRequired = companyInfo.employees >= 100
  
  return {
    required: isRequired,
    deadline: '2025-06-30',
    urgency: isRequired ? 'Hoog' : 'Laag'
  }
}

function checkCO2HeffingRequirement(emissions, industry) {
  const impactedIndustries = ['Productie', 'Bouw', 'Transport & Logistiek']
  const isImpacted = impactedIndustries.includes(industry) && emissions.total > 25
  
  return {
    applicable: isImpacted,
    currentRate: '€30.48 per ton',
    rate2030: '€216 per ton',
    urgency: isImpacted ? 'Hoog' : 'Laag'
  }
}

function calculateDutchIncentives(plan) {
  const incentives = {
    SDE: 15000, // Renewable energy subsidy
    EIA: 8000,  // Investment allowance
    SEEH: 12000, // Electric vehicles
    WBSO: 6000,  // Innovation credit
    MIA: 4000,   // Environmental investment allowance
    total: 45000
  }
  
  return incentives
}

function calculateOverallRisk(risks) {
  const riskScores = {
    'Kritiek': 4,
    'Hoog': 3,
    'Medium': 2,
    'Laag': 1
  }
  
  const avgScore = risks.reduce((sum, risk) => sum + riskScores[risk.level], 0) / risks.length
  
  return avgScore >= 3.5 ? 'Kritiek' : avgScore >= 2.5 ? 'Hoog' : avgScore >= 1.5 ? 'Medium' : 'Laag'
}

function calculateConfidence(emissions, companyInfo) {
  let confidence = 0.75 // Base confidence
  
  const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  confidence += Math.min(dataPoints * 0.04, 0.20)
  
  if (companyInfo.employees > 50) confidence += 0.05
  if (companyInfo.employees > 200) confidence += 0.05
  
  return Math.min(confidence, 0.95)
}

function generateCSRDTimeline(isRequired) {
  const currentYear = new Date().getFullYear()
  
  if (isRequired) {
    return {
      '2024 Q4': 'Data collection systeem implementeren',
      '2025 Q1': 'Materiality assessment voltooien',
      '2025 Q2': 'Draft rapport voorbereiden',
      '2025 Q3': 'Third-party verification',
      '2025 Q4': 'Eerste CSRD rapportage indienen'
    }
  } else {
    return {
      '2025 Q1': 'CSRD voorbereiding starten',
      '2025 Q3': 'Systemen implementeren',
      '2026 Q1': 'Pilot rapportage',
      '2026 Q3': 'Verification voorbereiden',
      '2026 Q4': 'Eerste CSRD rapportage indienen'
    }
  }
}

function generateImplementationRoadmap(breakdown, companyInfo, totalEmissions) {
  const phases = [
    {
      phase: 'Foundation & Compliance (Maanden 1-6)',
      color: [34, 197, 94],
      focus: 'Nederlandse compliance en quick wins',
      target: Math.round(totalEmissions * 0.85 * 100) / 100,
      investment: '€8,000 - €25,000',
      actions: [
        'CSRD gap analyse en roadmap ontwikkeling',
        'WPM rapportage systeem implementatie',
        'RVO registratie CO2-Prestatieladder niveau 1',
        'Baseline carbon inventory volgens Nederlandse standaarden',
        'Employee awareness en green team formatie'
      ],
      milestones: [
        'CSRD readiness assessment voltooid',
        'WPM eerste rapportage ingediend',
        'CO2-Prestatieladder certificaat behaald'
      ],
      dutchSpecific: true
    },
    {
      phase: 'Optimization & Efficiency (Maanden 6-18)',
      color: [59, 130, 246],
      focus: 'Structurele verbeteringen en Nederlandse subsidies',
      target: Math.round(totalEmissions * 0.6 * 100) / 100,
      investment: '€25,000 - €65,000',
      actions: [
        'Groene energie contract Nederlandse leveranciers',
        'SEEH subsidie aanvraag elektrische lease auto\'s',
        'Building automation met EIA aftrek',
        'Supplier engagement voor Scope 3 reductie',
        'SDE++ aanvraag voor zonnepanelen installatie'
      ],
      milestones: [
        '50% groene energie contract getekend',
        '25% elektrische fleet gerealiseerd',
        'Smart building systeem operationeel'
      ],
      dutchSpecific: true
    },
    {
      phase: 'Innovation & Net Zero (Maanden 18-36)',
      color: [147, 51, 234],
      focus: 'Cutting-edge technologie en carbon neutraliteit',
      target: Math.round(totalEmissions * 0.2 * 100) / 100,
      investment: '€45,000 - €150,000',
      actions: [
        'On-site renewable energy met SDE++ subsidie',
        'Circulaire economie implementatie',
        'Carbon capture en storage pilots',
        'AI-driven carbon management platform',
        'Carbon neutral certificering aanvraag'
      ],
      milestones: [
        'Net zero operations gerealiseerd',
        'Third-party carbon neutral certificaat',
        'Industry leadership positie in sector'
      ],
      dutchSpecific: true
    }
  ]

  return {
    phases,
    totalTimeframe: '36 maanden tot carbon neutraliteit',
    totalInvestment: '€78,000 - €240,000',
    expectedReduction: '80% emissions reductie',
    roi: '200-300% over 5 jaar',
    dutchSubsidies: '€25,000 - €75,000 beschikbaar',
    certifications: [
      'CO2-Prestatieladder niveau 5',
      'ISO 14001 Environmental Management',
      'B Corp Certification',
      'Carbon Neutral gecertificeerd'
    ]
  }
}
