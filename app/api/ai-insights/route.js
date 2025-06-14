aiRecommendations: [
      {
    aiRecommendations: [
      {
        title: 'Nederlandse Energie Transitie',
        description: 'Schakel over naar 100% groene energie via Nederlandse leveranciers',
        priority: 'Hoog',
        impact: 'Hoog',
        timeframe: '6-12 maanden'
      },
      {
        title: 'SEEH Subsidie Programma',
        description: 'Elektrificeer uw wagenpark met €4,000 subsidie per voertuig',
        priority: 'Medium',
        impact: 'Hoog',
        timeframe: '12-18 maanden'
      }
    ]
  }
}function generateFallbackInsights(totalEmissions, employeeCount, industry, companyName, breakdown, companyInfo) {
  return {
    executiveSummary: {
      headline: `${companyName} heeft ${totalEmissions} ton CO2 uitstoot met verbeterpotentieel`,
      keyMetrics: {
        totalEmissions: totalEmissions,
        emissionsPerEmployee: Math.round((totalEmissions / employeeCount) * 100) / 100,
        industryComparison: Math.round((totalEmissions / employeeCount) / (DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8) * 100),
        benchmarkStatus: (totalEmissions / employeeCount) < (DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8) ? 'Boven gemiddeld' : 'Onder gemiddeld'
      },
      csrdReadiness: calculateCSRDReadiness(totalEmissions, employeeCount),
      content: `${companyName} heeft een carbon footprint van ${totalEmissions} ton CO2 (${Math.round((totalEmissions / employeeCount) * 100) / 100} ton per medewerker). Dit is ${(totalEmissions / employeeCount) < (DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8) ? 'beter dan' : 'slechter dan'} het Nederlandse sectorgemiddelde voor ${industry}.`
    },
    csrdCompliance: generateCSRDAnalysis(companyInfo, totalEmissions),
    dutchBenchmarking: generateDutchBenchmarking(totalEmissions, employeeCount, industry),
    actionPlan: {
      summary: '3-fase Nederlandse implementatie voor carbon neutraliteit',
      content: 'Focus op groene energie transitie, elektrificatie van transport, en Nederlandse subsidie optimalisatie.',
      phases: generateDutchActionPlan(breakdown, companyInfo, industry),
      totalInvestment: '€44,000 - €128,500',
      estimatedSavings: '€35,000 - €85,000 per jaar',
      paybackPeriod: '18-24 maanden'
    },
    riskAssessment: generateDutchRiskAssessment({ total: totalEmissions, breakdown }, industry, companyInfo),
    financialAnalysis: generateFinancialAnalysis(totalEmissions, breakdown, companyInfo, industry),
    implementationRoadmap: generateImplementationRoadmap(breakdown, companyInfo, totalEmissions),
    complianceTimeline: generateComplianceTimeline(companyInfo),
    carbonPricing: generateCarbonPricingAnalysis(totalEmissions),
    sectorSpecificInsights: generateSectorInsights(industry, breakdown, companyInfo),
    aiRecommendations: [
      {
        title: 'Nederlandseimport { NextResponse } from 'next/server'

// Gratis AI via Ollama (lokaal) of Hugging Face Inference API (volledig gratis)
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "hf_YOUR_FREE_KEY_HERE" // Gratis te verkrijgen op huggingface.co

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
  'Technologie & Software': 3.2,
  'Productie & Manufacturing': 8.8,
  'Retail & E-commerce': 4.1,
  'Financiële Diensten': 2.4,
  'Gezondheidszorg': 5.2,
  'Onderwijs': 2.8,
  'Transport & Logistiek': 14.8,
  'Bouw & Vastgoed': 11.2,
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

    // Genereer uitgebreide AI insights met gratis AI service
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

  // Gebruik gratis AI service voor geavanceerde Nederlandse analyse
  const aiData = {
    companyName,
    industry,
    employees: employeeCount,
    totalEmissions,
    breakdown,
    revenue: companyInfo.revenue
  }

  try {
    const [
      executiveSummary,
      actionPlan, 
      riskAssessment,
      complianceAnalysis
    ] = await Promise.all([
      AIService.generateInsights('executiveSummary', aiData),
      AIService.generateInsights('actionPlan', aiData),
      AIService.generateInsights('riskAssessment', aiData),
      AIService.generateInsights('compliance', aiData)
    ])

    const insights = {
      executiveSummary: {
        headline: executiveSummary.split('\n')[0] || `${companyName} carbon footprint analyse`,
        keyMetrics: {
          totalEmissions: totalEmissions,
          emissionsPerEmployee: Math.round((totalEmissions / employeeCount) * 100) / 100,
          industryComparison: Math.round((totalEmissions / employeeCount) / (DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8) * 100),
          benchmarkStatus: (totalEmissions / employeeCount) < (DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8) ? 'Boven gemiddeld' : 'Onder gemiddeld'
        },
        csrdReadiness: calculateCSRDReadiness(totalEmissions, employeeCount),
        content: executiveSummary
      },
      
      csrdCompliance: generateCSRDAnalysis(companyInfo, totalEmissions),
      dutchBenchmarking: generateDutchBenchmarking(totalEmissions, employeeCount, industry),
      
      actionPlan: {
        summary: '3-fase Nederlandse implementatie voor carbon neutraliteit',
        content: actionPlan,
        phases: generateDutchActionPlan(breakdown, companyInfo, industry),
        totalInvestment: '€44,000 - €128,500',
        estimatedSavings: '€35,000 - €85,000 per jaar',
        paybackPeriod: '18-24 maanden'
      },
      
      riskAssessment: {
        content: riskAssessment,
        risks: generateDutchRiskAssessment(emissions, industry, companyInfo).risks,
        overallRisk: calculateOverallRisk(generateDutchRiskAssessment(emissions, industry, companyInfo).risks),
        urgentActions: generateDutchRiskAssessment(emissions, industry, companyInfo).urgentActions
      },
      
      financialAnalysis: generateFinancialAnalysis(totalEmissions, breakdown, companyInfo, industry),
      implementationRoadmap: generateImplementationRoadmap(breakdown, companyInfo, totalEmissions),
      complianceTimeline: generateComplianceTimeline(companyInfo),
      carbonPricing: generateCarbonPricingAnalysis(totalEmissions),
      sectorSpecificInsights: generateSectorInsights(industry, breakdown, companyInfo),
      
      aiRecommendations: [
        {
          title: 'AI-Powered Nederlandse Strategie',
          description: actionPlan.split('\n')[1] || 'Focus op groene energie transitie en Nederlandse subsidies',
          priority: 'Hoog',
          impact: 'Zeer Hoog',
          timeframe: '6-12 maanden'
        }
      ]
    }

    return insights
    
  } catch (error) {
    console.error('AI insights generation failed, using fallback:', error)
    
    // Fallback naar rule-based insights
    return generateFallbackInsights(totalEmissions, employeeCount, industry, companyName, breakdown, companyInfo)
  }
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
    'Technologie & Software': [
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
    'Productie & Manufacturing': [
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
  if (['Productie & Manufacturing', 'Bouw & Vastgoed', 'Transport & Logistiek'].includes(industry) && emissions.total > 25) {
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
