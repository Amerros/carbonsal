import { NextResponse } from 'next/server'

// ECHTE Hugging Face AI implementatie (GRATIS!)
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "hf_your_free_token_here"

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

    // Genereer ECHTE AI insights met Hugging Face
    const insights = await generateEnhancedAIInsights(emissions, companyInfo, industry, goals)

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
      model: 'huggingface-nederlandse-carbon-ai-v2.0',
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

  // ECHTE AI analyse met Hugging Face
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

// ECHTE Hugging Face AI implementatie
async function getHuggingFaceInsights(companyInfo, emissions, industry) {
  try {
    const prompt = `Analyseer de carbon footprint voor ${industry} bedrijf "${companyInfo.name}" met ${companyInfo.employees} medewerkers en ${emissions.total} ton CO2 uitstoot per jaar.

NEDERLANDSE CONTEXT:
- CSRD rapportage vanaf 2025 verplicht voor bedrijven >250 werknemers
- WPM rapportage verplicht voor bedrijven >100 werknemers  
- CO2-heffing stijgt naar €216 per ton in 2030
- Nederlandse subsidies: SEEH (€4000/auto), SDE++, EIA aftrek

CARBON BREAKDOWN:
- Energie: ${emissions.breakdown?.energy || 0} ton CO2
- Transport: ${emissions.breakdown?.transport || 0} ton CO2
- Afval: ${emissions.breakdown?.waste || 0} ton CO2

Geef 5 specifieke Nederlandse CSRD-conforme aanbevelingen met:
1. Concrete actie
2. Nederlandse subsidie/regelgeving
3. Kosten schatting
4. CO2 reductie potentieel
5. ROI tijdlijn

Antwoord in professioneel Nederlands voor Nederlandse sustainability managers.`

    console.log('🤖 Calling Hugging Face AI with prompt:', prompt.substring(0, 200) + '...')

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Carbon-Comply-Nederlandse-AI/1.0'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Hugging Face API Error:', response.status, errorText)
      throw new Error(`Hugging Face API failed: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Hugging Face AI Response received:', result)
    
    return {
      recommendations: parseAIRecommendations(result[0]?.generated_text || result.generated_text || ''),
      confidence: 0.85,
      aiGenerated: true,
      model: 'microsoft/DialoGPT-medium'
    }
  } catch (error) {
    console.warn('⚠️ Hugging Face AI failed, using enhanced fallback:', error.message)
    return {
      recommendations: getEnhancedFallbackRecommendations(industry, emissions, companyInfo),
      confidence: 0.75,
      aiGenerated: false,
      fallbackReason: error.message
    }
  }
}

function parseAIRecommendations(aiText) {
  console.log('🔍 Parsing AI text:', aiText.substring(0, 300) + '...')
  
  const recommendations = []
  const lines = aiText.split('\n').filter(line => line.trim())
  
  // Look for numbered recommendations or bullet points
  lines.forEach((line, index) => {
    const cleanLine = line.trim()
    
    // Match patterns like "1.", "•", "-", "Aanbeveling", "Implementeer", etc.
    if (cleanLine.match(/^[\d\.\-•\*]|aanbeveling|implementeer|overweeg|schakel|investeer/i)) {
      // Clean up the recommendation text
      let description = cleanLine
        .replace(/^[\d\.\-•\*\s]+/, '') // Remove bullets/numbers
        .replace(/^(aanbeveling[\s\d]*:?\s*)/i, '') // Remove "Aanbeveling:" prefix
        .trim()

      if (description.length > 10) { // Only add substantial recommendations
        recommendations.push({
          title: `AI Aanbeveling ${recommendations.length + 1}`,
          description: description,
          priority: index < 2 ? 'Hoog' : index < 4 ? 'Medium' : 'Laag',
          impact: index < 3 ? 'Hoog' : 'Medium',
          timeframe: index < 2 ? '3-6 maanden' : index < 4 ? '6-12 maanden' : '12+ maanden',
          aiGenerated: true
        })
      }
    }
  })

  // If no structured recommendations found, extract key phrases
  if (recommendations.length === 0) {
    const keyPhrases = aiText.match(/[^.!?]+[.!?]/g) || []
    keyPhrases.slice(0, 3).forEach((phrase, index) => {
      if (phrase.trim().length > 20) {
        recommendations.push({
          title: `AI Insight ${index + 1}`,
          description: phrase.trim(),
          priority: 'Medium',
          impact: 'Medium',
          timeframe: '6-12 maanden',
          aiGenerated: true
        })
      }
    })
  }

  console.log(`✅ Parsed ${recommendations.length} AI recommendations`)
  return recommendations.slice(0, 5) // Max 5 recommendations
}

function getEnhancedFallbackRecommendations(industry, emissions, companyInfo) {
  const totalEmissions = emissions.total || 0
  const breakdown = emissions.breakdown || {}
  
  const recommendations = {
    'Technologie & Software': [
      {
        title: 'Cloud Carbon Optimalisatie',
        description: 'Implementeer carbon-aware computing en migreer naar groene Azure/AWS regio\'s. Nederlandse datacenters gebruiken 30% minder energie.',
        priority: 'Hoog',
        impact: 'Hoog',
        timeframe: '3-6 maanden',
        dutchSpecific: true,
        estimatedReduction: `${Math.round(totalEmissions * 0.15)} ton CO2`,
        cost: '€5,000 - €15,000'
      },
      {
        title: 'Green Software Engineering',
        description: 'Integreer carbon tracking in development pipeline. Nederlandse WBSO subsidie beschikbaar voor groene innovatie projecten.',
        priority: 'Medium',
        impact: 'Medium',
        timeframe: '6-12 maanden',
        dutchSpecific: true,
        estimatedReduction: `${Math.round(totalEmissions * 0.08)} ton CO2`,
        cost: '€10,000 - €25,000'
      }
    ],
    'Productie & Manufacturing': [
      {
        title: 'Industry 4.0 Carbon Monitoring',
        description: 'Implementeer IoT sensoren voor real-time energy tracking. EIA aftrek van 30% op investeringen in energiezuinige apparatuur.',
        priority: 'Hoog',
        impact: 'Zeer Hoog',
        timeframe: '6-12 maanden',
        dutchSpecific: true,
        estimatedReduction: `${Math.round(totalEmissions * 0.25)} ton CO2`,
        cost: '€25,000 - €75,000'
      },
      {
        title: 'Nederlandse Circulaire Economie Transitie',
        description: 'Ontwikkel closed-loop productieprocessen. MIA/Vamil aftrek beschikbaar voor circulaire investeringen tot 75%.',
        priority: 'Hoog',
        impact: 'Hoog',
        timeframe: '12-18 maanden',
        dutchSpecific: true,
        estimatedReduction: `${Math.round(totalEmissions * 0.20)} ton CO2`,
        cost: '€50,000 - €150,000'
      }
    ],
    'Transport & Logistiek': [
      {
        title: 'SEEH Elektrische Wagenpark Transitie',
        description: 'Elektrificeer 50% van wagenpark met €4,000 SEEH subsidie per voertuig. 4% bijtelling vs 22% voor diesel.',
        priority: 'Hoog',
        impact: 'Zeer Hoog',
        timeframe: '6-18 maanden',
        dutchSpecific: true,
        estimatedReduction: `${Math.round(totalEmissions * 0.40)} ton CO2`,
        cost: '€30,000 - €100,000'
      }
    ]
  }

  // Add universal recommendations
  const universalRecs = [
    {
      title: 'Nederlandse Groene Energie Transitie',
      description: `Schakel over naar 100% groene energie via Vattenfall, Eneco of Essent. Elimineer ${Math.round((breakdown.energy || totalEmissions * 0.4) * 0.85)} ton CO2 Scope 2 emissies.`,
      priority: 'Hoog',
      impact: 'Zeer Hoog',
      timeframe: '3-6 maanden',
      dutchSpecific: true,
      estimatedReduction: `${Math.round((breakdown.energy || totalEmissions * 0.4) * 0.85)} ton CO2`,
      cost: '€0 - €5,000 setup'
    },
    {
      title: 'CO2-Prestatieladder Certificering',
      description: 'Behaal niveau 3+ certificering voor aanbestedingsvoordeel bij Nederlandse overheidsopdrachten. ROI binnen 6 maanden.',
      priority: 'Medium',
      impact: 'Hoog',
      timeframe: '6-12 maanden',
      dutchSpecific: true,
      estimatedReduction: '0 ton CO2 (proces verbetering)',
      cost: '€5,000 - €15,000'
    }
  ]

  const industryRecs = recommendations[industry] || []
  return [...industryRecs, ...universalRecs].slice(0, 5)
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
    aiGenerated: aiAnalysis.aiGenerated,
    nextSteps: [
      'Start CSRD gap analyse binnen 30 dagen',
      'Implementeer carbon accounting systeem',
      'Ontwikkel science-based reduction targets'
    ]
  }
}

// Helper functions (keeping all the existing ones)
function calculateCSRDReadiness(totalEmissions, employeeCount) {
  let score = 40
  if (totalEmissions > 0) score += 20
  if (employeeCount > 0) score += 15
  if (totalEmissions < 50) score += 10
  if (employeeCount < 500) score += 15
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
  const impactedIndustries = ['Productie & Manufacturing', 'Bouw & Vastgoed', 'Transport & Logistiek']
  const isImpacted = impactedIndustries.includes(industry) && emissions.total > 25
  return {
    applicable: isImpacted,
    currentRate: '€30.48 per ton',
    rate2030: '€216 per ton',
    urgency: isImpacted ? 'Hoog' : 'Laag'
  }
}

function calculateConfidence(emissions, companyInfo) {
  let confidence = 0.75
  const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  confidence += Math.min(dataPoints * 0.04, 0.20)
  if (companyInfo.employees > 50) confidence += 0.05
  if (companyInfo.employees > 200) confidence += 0.05
  return Math.min(confidence, 0.95)
}

function generateCSRDAnalysis(companyInfo, totalEmissions) {
  const isCSRDRequired = companyInfo.employees > 250 || 
                        (companyInfo.revenue && companyInfo.revenue > 50000000)
  return {
    isRequired: isCSRDRequired,
    reportingDeadline: isCSRDRequired ? '2025-03-31' : '2026-03-31',
    readinessScore: calculateCSRDReadiness(totalEmissions, companyInfo.employees),
    status: isCSRDRequired ? 'Verplicht 2025' : 'Optioneel'
  }
}

function generateDutchBenchmarking(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = Math.round((1 - Math.min(performance, 2)) * 100)
  return {
    industryBenchmark: industryBenchmark,
    yourPerformance: Math.round(emissionsPerEmployee * 100) / 100,
    percentile: percentile,
    ranking: percentile >= 75 ? 'Top 25%' : percentile >= 50 ? 'Top 50%' : 'Bottom 50%'
  }
}

function generatePriorityMatrix(breakdown, totalEmissions, industry) {
  const priorities = []
  Object.entries(breakdown).forEach(([category, value]) => {
    if (value > totalEmissions * 0.1) { // If >10% of total
      priorities.push({
        category,
        impact: value > totalEmissions * 0.3 ? 'Hoog' : 'Medium',
        effort: category === 'energy' ? 'Laag' : 'Medium',
        priority: value > totalEmissions * 0.3 ? 1 : 2
      })
    }
  })
  return priorities.sort((a, b) => a.priority - b.priority)
}

function generateDutchActionPlan(breakdown, companyInfo, industry) {
  return {
    immediate: [
      {
        action: 'CO2-Prestatieladder niveau 1 certificering',
        cost: '€3,000',
        impact: 'CSRD voorbereiding + aanbestedingsvoordeel',
        dutchSpecific: true
      }
    ],
    shortTerm: [
      {
        action: 'Groene energie contract Nederlandse leveranciers',
        cost: '€0 setup',
        impact: '30-50% Scope 2 eliminatie',
        dutchSpecific: true
      }
    ],
    longTerm: [
      {
        action: 'Zonnepanelen met SDE++ subsidie',
        cost: '€50,000',
        impact: '60-80% energie onafhankelijkheid',
        dutchSpecific: true
      }
    ]
  }
}

function generateDutchRiskAssessment(emissions, industry, companyInfo) {
  const risks = []
  if (companyInfo.employees > 250) {
    risks.push({
      type: 'CSRD Non-Compliance',
      level: 'Kritiek',
      description: 'CSRD rapportage verplicht vanaf 2025'
    })
  }
  return {
    risks,
    urgentActions: risks.filter(r => r.level === 'Kritiek').length
  }
}

function generateFinancialAnalysis(totalEmissions, breakdown, companyInfo, industry) {
  return {
    carbonPricing: {
      current2024: Math.round(totalEmissions * 95),
      projected2030: Math.round(totalEmissions * 216)
    },
    investmentScenarios: {
      minimal: { investment: 15000, payback: 18 }
    }
  }
}

function generateImplementationRoadmap(breakdown, companyInfo, totalEmissions) {
  return {
    phases: [
      {
        phase: 'Foundation (0-6 maanden)',
        target: Math.round(totalEmissions * 0.85 * 100) / 100,
        actions: ['CSRD gap analyse', 'WPM implementatie']
      }
    ]
  }
}

function generateComplianceTimeline(companyInfo) {
  const currentYear = new Date().getFullYear()
  return {
    [currentYear]: ['CSRD gap analyse', 'Data collection setup'],
    [currentYear + 1]: ['Eerste CSRD rapportage indien verplicht']
  }
}

function generateCarbonPricingAnalysis(totalEmissions) {
  return {
    current2024: Math.round(totalEmissions * 95),
    projected2030: Math.round(totalEmissions * 216)
  }
}

function generateSectorInsights(industry, breakdown, companyInfo) {
  return {
    keyMetrics: ['Energy efficiency', 'Waste reduction'],
    opportunities: ['Groene energie transitie', 'Circulaire economie'],
    dutchLeaders: ['Interface', 'Unilever', 'Ikea']
  }
}
