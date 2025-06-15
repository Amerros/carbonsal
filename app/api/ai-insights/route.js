// app/api/ai-insights/route.js - COMPLETE VERSION
import { NextResponse } from 'next/server'

// ENHANCED HuggingFace AI Implementation with Dutch Carbon Intelligence
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "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"

// Nederlandse emissiefactoren (conform Nederlandse CO2-Prestatieladder 3.1 & Milieubarometer 2024)
const DUTCH_EMISSION_FACTORS = {
  electricity: 0.370, // kg CO2e per kWh (Nederlandse stroommix 2024, actueel)
  electricityGreen: 0.012, // kg CO2e per kWh (groene stroom met certificaten)
  gas: 1.884, // kg CO2e per m³ (Nederlandse aardgas, Gasunie/CBS)
  heating: 0.298, // kg CO2e per kWh (Nederlandse warmte mix)
  carFleet: 0.156, // kg CO2e per km (Nederlandse wagenpark gemiddelde 2024)
  carFleetElectric: 0.047, // kg CO2e per km (elektrische auto NL stroommix)
  publicTransport: 0.089, // kg CO2e per km (Nederlandse ÖV gemiddelde)
  businessTravel: 0.255, // kg CO2e per km (vliegreizen kort/middellang)
  waste: 0.469, // kg CO2e per kg (Nederlandse afvalverwerking)
  water: 0.298, // kg CO2e per m³ (Nederlandse waterproductie)
  paper: 0.921, // kg CO2e per kg
  plastic: 1.967, // kg CO2e per kg
  metal: 1.467, // kg CO2e per kg
}

// Nederlandse industrie benchmarks (volgens CBS/RVO/Klimaatmonitor data 2024)
const DUTCH_INDUSTRY_BENCHMARKS = {
  'Technologie & Software': 3.2,
  'Productie & Manufacturing': 8.8,
  'Retail & E-commerce': 4.1,
  'Financiële Diensten': 2.4,
  'Gezondheidszorg': 5.2,
  'Onderwijs': 2.8,
  'Transport & Logistiek': 14.8,
  'Bouw & Vastgoed': 11.2,
  'Agri & Food': 12.4,
  'Energie & Utilities': 18.6,
  'Consultancy': 3.8,
  'Anders': 5.8
}

// Nederlandse CO2 pricing (officiële tarieven en projecties)
const DUTCH_CARBON_PRICING = {
  2024: 30.48, // € per ton CO2 (CO2-heffing industrie)
  2025: 50.18,
  2026: 74.25,
  2027: 99.45,
  2028: 134.75,
  2029: 175.20,
  2030: 216.00, // Target prijs 2030 volgens PBL
  euETS2024: 95.00 // EU ETS referentie
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

    console.log('🤖 Starting AI insights generation for:', companyInfo.name)

    // Generate comprehensive AI insights
    const insights = await generateComprehensiveAIInsights(emissions, companyInfo, industry, goals)

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
      model: 'huggingface-dutch-carbon-ai-enhanced',
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

async function generateComprehensiveAIInsights(emissions, companyInfo, industry, goals) {
  const totalEmissions = emissions.total || 0
  const breakdown = emissions.breakdown || {}
  const employeeCount = companyInfo.employees || 1
  const companyName = companyInfo.name || 'Uw bedrijf'

  console.log('📊 Generating insights for:', { totalEmissions, employeeCount, industry })

  // Generate multiple AI analyses in parallel for better performance
  const [
    executiveSummary,
    actionPlan,
    riskAssessment,
    complianceAnalysis,
    financialAnalysis
  ] = await Promise.all([
    generateExecutiveSummaryAI(companyInfo, emissions, industry),
    generateActionPlanAI(companyInfo, emissions, industry),
    generateRiskAssessmentAI(companyInfo, emissions, industry),
    generateComplianceAnalysisAI(companyInfo, emissions),
    generateFinancialAnalysisAI(companyInfo, emissions, industry)
  ])

  const insights = {
    // Core AI insights
    executiveSummary: executiveSummary,
    csrdCompliance: complianceAnalysis,
    
    // Dutch-specific analyses
    dutchBenchmarking: generateDutchBenchmarking(totalEmissions, employeeCount, industry),
    priorityMatrix: generatePriorityMatrix(breakdown, totalEmissions, industry),
    
    // Actionable insights
    actionPlan: actionPlan,
    financialAnalysis: financialAnalysis,
    riskAssessment: riskAssessment,
    
    // Implementation guidance
    implementationRoadmap: generateImplementationRoadmap(breakdown, companyInfo, totalEmissions),
    aiRecommendations: generateEnhancedRecommendations(breakdown, totalEmissions, industry, companyInfo),
    complianceTimeline: generateComplianceTimeline(companyInfo),
    
    // Financial projections
    carbonPricing: generateCarbonPricingAnalysis(totalEmissions),
    sectorSpecificInsights: generateSectorInsights(industry, breakdown, companyInfo),
    
    // Performance metrics
    sustainabilityScore: calculateSustainabilityScore(emissions, companyInfo, industry),
    benchmarkComparison: generateBenchmarkComparison(totalEmissions, employeeCount, industry),
    innovationOpportunities: generateInnovationOpportunities(industry, breakdown, companyInfo),
    
    // Metadata
    confidence: calculateConfidence(emissions, companyInfo),
    aiGenerated: true,
    methodology: 'CO2-Prestatieladder 3.1 + AI-enhanced Dutch insights'
  }

  console.log('✅ AI insights generated successfully')
  return insights
}

// Enhanced HuggingFace AI Integration with proper error handling
async function callHuggingFaceAI(prompt, context = '', maxRetries = 2) {
  const fullPrompt = `${context}\n\n${prompt}\n\nGeef een professionele Nederlandse analyse in maximaal 400 woorden:`

  console.log('🔗 Calling HuggingFace API...')

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Carbon-Comply-Dutch-AI/2.0'
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.75,
            do_sample: true,
            top_p: 0.9,
            top_k: 50,
            repetition_penalty: 1.15,
            return_full_text: false,
            pad_token_id: 50256,
            eos_token_id: 50256
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ HuggingFace API Error (attempt ${attempt}):`, response.status, errorText)
        
        if (attempt === maxRetries) {
          throw new Error(`HuggingFace API failed after ${maxRetries} attempts: ${response.status}`)
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }

      const result = await response.json()
      console.log('✅ HuggingFace AI Response received')
      
      // Handle different response formats
      let generatedText = ''
      if (Array.isArray(result)) {
        generatedText = result[0]?.generated_text || ''
      } else if (result.generated_text) {
        generatedText = result.generated_text
      } else if (result[0]?.generated_text) {
        generatedText = result[0].generated_text
      }
      
      return cleanAIResponse(generatedText)
      
    } catch (error) {
      console.warn(`⚠️ HuggingFace AI attempt ${attempt} failed:`, error.message)
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

function cleanAIResponse(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean multiple newlines
    .replace(/(.)\1{4,}/g, '$1$1$1') // Remove excessive repetition
    .slice(0, 2000) // Limit length
}

async function generateExecutiveSummaryAI(companyInfo, emissions, industry) {
  const context = `Je bent een Nederlandse sustainability expert die executive summaries schrijft voor carbon footprint analyses. Focus op Nederlandse context, compliance en business impact.`
  
  const prompt = `
Analyseer de carbon footprint van ${companyInfo.name} in de ${industry} sector:
- ${emissions.total} ton CO2 uitstoot totaal
- ${companyInfo.employees} medewerkers
- Nederlandse context met CSRD en WPM compliance

Schrijf een executive summary met:
1. Huidige positie vs Nederlandse sector benchmark
2. CSRD compliance status en urgentie
3. Top 3 strategische prioriteiten voor CO2 reductie
4. ROI potentieel binnen 12-24 maanden
5. Next steps voor management besluitvorming

Gebruik Nederlandse sustainability terminologie en focus op business impact.`

  try {
    const aiResponse = await callHuggingFaceAI(prompt, context)
    
    if (aiResponse && aiResponse.length > 50) {
      return {
        headline: `${companyInfo.name}: Strategische Carbon Roadmap Analyse`,
        content: aiResponse,
        keyMetrics: {
          totalEmissions: emissions.total,
          emissionsPerEmployee: Math.round((emissions.total / companyInfo.employees) * 100) / 100,
          industryComparison: calculateIndustryComparison(emissions.total, companyInfo.employees, industry),
          csrdReadiness: calculateCSRDReadiness(emissions.total, companyInfo.employees)
        },
        aiGenerated: true,
        confidence: 0.87
      }
    }
  } catch (error) {
    console.warn('AI Executive Summary failed, using enhanced fallback:', error.message)
  }

  // Enhanced fallback
  return generateExecutiveSummaryFallback(companyInfo, emissions, industry)
}

async function generateActionPlanAI(companyInfo, emissions, industry) {
  const context = `Je bent een Nederlandse carbon consultant die implementatie roadmaps maakt met focus op Nederlandse subsidies, regelgeving en best practices.`
  
  const prompt = `
Maak een concrete Nederlandse actieplan voor ${companyInfo.name} (${industry}, ${emissions.total} ton CO2):

DIRECTE ACTIES (0-6 maanden):
- Quick wins met Nederlandse subsidies (SEEH, EIA, WBSO)
- Kostenloze efficiency maatregelen
- Compliance voorbereidingen (CSRD/WPM indien van toepassing)

MIDDELLANGE TERMIJN (6-18 maanden):
- Structurele verbeteringen met SDE++ en MIA/Vamil subsidies
- Leverancier engagement en circulaire economie
- Technology implementatie en automatisering

LANGE TERMIJN (18+ maanden):
- Carbon neutral roadmap met science-based targets
- Innovation partnerships en R&D
- Market positioning en competitive advantage

Specificeer per actie: investering, Nederlandse subsidie, CO2 impact, payback periode en implementatie complexity.`

  try {
    const aiResponse = await callHuggingFaceAI(prompt, context)
    
    if (aiResponse && aiResponse.length > 50) {
      return {
        aiGeneratedPlan: aiResponse,
        structured: generateStructuredActionPlan(emissions, companyInfo, industry),
        timeline: generateActionTimeline(emissions, companyInfo),
        totalInvestment: calculateTotalInvestment(emissions, companyInfo),
        expectedROI: calculateExpectedROI(emissions, companyInfo, industry),
        aiGenerated: true,
        confidence: 0.85
      }
    }
  } catch (error) {
    console.warn('AI Action Plan failed, using enhanced fallback:', error.message)
  }

  return generateActionPlanFallback(emissions, companyInfo, industry)
}

async function generateRiskAssessmentAI(companyInfo, emissions, industry) {
  const context = `Je bent een Nederlandse risk consultant gespecialiseerd in carbon en climate risks voor Nederlandse bedrijven, met focus op compliance en business continuity.`
  
  const prompt = `
Analyseer carbon-gerelateerde risico's voor ${companyInfo.name}:

COMPLIANCE RISKS:
- CSRD rapportage verplichtingen (${companyInfo.employees > 250 ? 'VERPLICHT 2025' : 'Mogelijk verplicht 2026'})
- WPM mobility reporting (${companyInfo.employees >= 100 ? 'VERPLICHT' : 'Niet van toepassing'})
- CO2-heffing impact escalatie tot 2030 (€30.48 naar €216/ton)

BUSINESS RISKS:
- Supply chain carbon exposure en leverancier risks
- Customer ESG requirements en tender criteria
- Investor sustainability criteria en financing
- Regulatory changes en policy shifts

REPUTATIONAL & MARKET RISKS:
- Public sustainability commitments en greenwashing
- Competitor sustainability advantage
- Talent acquisition en employee engagement

Geef per risico: impact score (1-10), waarschijnlijkheid (%), concrete mitigation strategy, kosten en tijdlijn.`

  try {
    const aiResponse = await callHuggingFaceAI(prompt, context)
    
    if (aiResponse && aiResponse.length > 50) {
      return {
        aiAnalysis: aiResponse,
        riskMatrix: generateRiskMatrix(companyInfo, emissions, industry),
        criticalRisks: identifyCriticalRisks(companyInfo, emissions, industry),
        mitigationStrategies: generateMitigationStrategies(companyInfo, emissions, industry),
        totalRiskExposure: calculateTotalRiskExposure(companyInfo, emissions, industry),
        aiGenerated: true,
        confidence: 0.82
      }
    }
  } catch (error) {
    console.warn('AI Risk Assessment failed, using enhanced fallback:', error.message)
  }

  return generateRiskAssessmentFallback(companyInfo, emissions, industry)
}

async function generateComplianceAnalysisAI(companyInfo, emissions) {
  const context = `Je bent een Nederlandse compliance expert voor CSRD, WPM en carbon reporting regelgeving met diepgaande kennis van Nederlandse implementatie requirements.`
  
  const prompt = `
Beoordeel compliance readiness voor ${companyInfo.name}:

CSRD COMPLIANCE ASSESSMENT:
- Verplicht vanaf: ${companyInfo.employees > 250 ? '2025 (KRITIEK - 12 maanden!)' : '2026'}
- Current readiness: ${calculateCSRDReadiness(emissions.total, companyInfo.employees)}%
- Missing components voor volledige ESRS compliance
- Double materiality assessment requirements
- Third-party assurance preparedness

WPM COMPLIANCE (indien van toepassing):
- ${companyInfo.employees >= 100 ? 'VERPLICHT: Mobility reporting deadline 30 juni 2025' : 'Niet van toepassing - monitoring aanbevolen'}
- Home-to-work impact tracking en data collection
- Reporting systeem requirements en automation
- Integration met HR en fleet management

NEDERLANDSE CARBON REGULATION:
- CO2-Prestatieladder certificering levels en voordelen
- Aanbestedingsvoordeel potentieel en revenue impact
- Tax incentives, subsidie mogelijkheden en timing
- Sector-specific requirements en best practices

Geef concrete implementatie roadmap met deadlines, milestones, kosten en quick wins.`

  try {
    const aiResponse = await callHuggingFaceAI(prompt, context)
    
    if (aiResponse && aiResponse.length > 50) {
      return {
        aiAnalysis: aiResponse,
        csrdStatus: generateCSRDStatus(companyInfo, emissions),
        wmpStatus: generateWPMStatus(companyInfo),
        implementationSteps: generateComplianceSteps(companyInfo, emissions),
        deadlines: generateComplianceDeadlines(companyInfo),
        estimatedCosts: calculateComplianceCosts(companyInfo, emissions),
        aiGenerated: true,
        confidence: 0.89
      }
    }
  } catch (error) {
    console.warn('AI Compliance Analysis failed, using enhanced fallback:', error.message)
  }

  return generateComplianceAnalysisFallback(companyInfo, emissions)
}

async function generateFinancialAnalysisAI(companyInfo, emissions, industry) {
  const context = `Je bent een Nederlandse financial analyst gespecialiseerd in carbon economics, sustainability ROI en Nederlandse subsidie optimalisatie voor bedrijven.`
  
  const prompt = `
Analyseer de financial impact van carbon initiatives voor ${companyInfo.name}:

CARBON PRICING EXPOSURE ANALYSE:
- Huidige CO2 kosten 2024: ${Math.round(emissions.total * DUTCH_CARBON_PRICING['2024'])} euro (€30.48/ton)
- 2030 exposure escalatie: ${Math.round(emissions.total * DUTCH_CARBON_PRICING['2030'])} euro (€216/ton)
- Totale risk exposure growth en cash flow impact

NEDERLANDSE SUBSIDIE OPTIMIZATION:
- SEEH elektrische auto's: €4,000 per voertuig (max 5 auto's = €20k)
- SDE++ hernieuwbare energie projecten en ROI analysis
- EIA aftrek 30% op energie-efficiency investeringen
- MIA/Vamil aftrek tot 75% op circulaire investeringen  
- WBSO voor R&D innovation en green tech development

COMPREHENSIVE COST-BENEFIT ANALYSIS:
- Implementation costs vs operational carbon savings
- Payback periods voor verschillende maatregelen (LED, heat pumps, etc.)
- NPV van sustainability investeringen over 5-10 jaar
- Risk-adjusted ROI calculations met Nederlandse market context
- Cash flow impact en financing requirements

Geef concrete financial recommendations met Nederlandse subsidie timing, tax implications en market opportunities.`

  try {
    const aiResponse = await callHuggingFaceAI(prompt, context)
    
    if (aiResponse && aiResponse.length > 50) {
      return {
        aiAnalysis: aiResponse,
        carbonPricingExposure: calculateCarbonPricingExposure(emissions.total),
        subsidyOpportunities: calculateDutchSubsidies(emissions, companyInfo, industry),
        investmentScenarios: generateInvestmentScenarios(emissions, companyInfo, industry),
        roiProjections: calculateROIProjections(emissions, companyInfo, industry),
        cashFlowImpact: generateCashFlowAnalysis(emissions, companyInfo, industry),
        aiGenerated: true,
        confidence: 0.86
      }
    }
  } catch (error) {
    console.warn('AI Financial Analysis failed, using enhanced fallback:', error.message)
  }

  return generateFinancialAnalysisFallback(emissions, companyInfo, industry)
}

// Enhanced Helper Functions with Dutch Carbon Intelligence

function generateEnhancedRecommendations(breakdown, totalEmissions, industry, companyInfo) {
  const recommendations = []
  const employees = companyInfo.employees || 1

  // AI-Enhanced Energy Recommendations with Dutch subsidies
  if (breakdown.energy > totalEmissions * 0.3) {
    recommendations.push({
      category: 'Energie Transitie',
      title: 'Nederlandse Groene Energie Leverancier Transitie',
      description: 'Schakel over naar 100% groene energie via Nederlandse leveranciers zoals Vattenfall, Eneco of Essent. Elimineer direct alle Scope 2 emissies met Nederlandse Garanties van Oorsprong.',
      impact: 'Zeer Hoog',
      co2Reduction: Math.round(breakdown.energy * 0.85 * 100) / 100,
      cost: '€0 - €2,000 setup kosten',
      paybackMonths: 0,
      priority: 1,
      dutchSpecific: true,
      subsidies: ['Geen extra kosten', 'Vaak goedkoper dan grijze stroom', 'CO2-Prestatieladder punten'],
      suppliers: ['Vattenfall 100% Nederlandse wind', 'Eneco Nederlandse groene stroom', 'Essent Duurzame energie'],
      implementationSteps: [
        'Vergelijk aanbieders groene energie certificaten',
        'Onderhandel contract met Nederlandse garanties van oorsprong',
        'Implementeer binnen 30 dagen zonder downtime',
        'Monitor en rapporteer Scope 2 eliminatie voor CSRD'
      ],
      compliance: 'Direct CSRD Scope 2 market-based improvement'
    })
  }

  // AI-Enhanced Transport Recommendations with SEEH subsidie
  if (breakdown.transport > totalEmissions * 0.25) {
    const potentialVehicles = Math.min(Math.floor(employees / 5), 20)
    const seehSubsidy = Math.min(potentialVehicles * 4000, 20000)
    
    recommendations.push({
      category: 'Mobiliteit',
      title: 'SEEH Elektrische Fleet Transitie Programma',
      description: `Elektrificeer ${potentialVehicles} lease auto's met Nederlandse SEEH subsidie van €4,000 per voertuig. Profiteer van 4% bijtelling vs 22% voor diesel en elimineer motorrijtuigenbelasting.`,
      impact: 'Zeer Hoog',
      co2Reduction: Math.round(breakdown.transport * 0.7 * 100) / 100,
      cost: `€${(potentialVehicles * 25000).toLocaleString()} - €${(potentialVehicles * 45000).toLocaleString()}`,
      savings: `€${seehSubsidy.toLocaleString()} SEEH subsidie + €${potentialVehicles * 600}/jaar tax benefits`,
      paybackMonths: 18,
      priority: 1,
      dutchSpecific: true,
      subsidies: [`€${seehSubsidy.toLocaleString()} SEEH subsidie totaal`, '4% bijtelling voordeel vs 22%', 'Geen motorrijtuigenbelasting', 'CO2-Prestatieladder verbetering'],
      providers: ['LeasePlan Nederland EV specialists', 'Athlon Car Lease groene fleet', 'ALD Automotive sustainability'],
      implementationSteps: [
        'SEEH subsidie aanvraag indienen bij RVO',
        'Lease partner selecteren met EV expertise en charging solutions',
        'Laadinfrastructuur planning en installatie',
        'Gefaseerde implementatie over 6-12 maanden met training'
      ],
      wpmCompliance: 'Verbetert WPM rapportage scores significant'
    })
  }

  // AI-Enhanced Building Efficiency with EIA aftrek
  if (breakdown.energy > totalEmissions * 0.2) {
    recommendations.push({
      category: 'Building Efficiency',
      title: 'Smart Building Automation met EIA Belastingvoordeel',
      description: 'Implementeer smart thermostaten, LED verlichting en building automation systemen. 30% EIA belastingaftrek op energie-efficiency investeringen tot €2.4 miljoen.',
      impact: 'Hoog',
      co2Reduction: Math.round(breakdown.energy * 0.25 * 100) / 100,
      cost: '€15,000 - €35,000',
      savings: '€4,500 - €10,500 EIA aftrek + €3,000-8,000/jaar operationele besparing',
      paybackMonths: 24,
      priority: 2,
      dutchSpecific: true,
      subsidies: ['30% EIA belastingaftrek', 'Accelerated depreciation mogelijk', 'Lagere energiekosten direct'],
      technologies: ['Smart thermostaat systemen', 'LED verlichting met sensoren', 'HVAC optimization', 'Energy monitoring dashboard'],
      implementationSteps: [
        'Energy audit en ROI berekening',
        'EIA aftrek aanvraag voorbereiding',
        'Technology selectie en installatie planning',
        'Implementation met minimal business disruption'
      ]
    })
  }

  // Circulaire Economie met MIA/Vamil
  if (breakdown.waste > totalEmissions * 0.1 || breakdown.materials > totalEmissions * 0.15) {
    recommendations.push({
      category: 'Circulaire Economie',
      title: 'Circulair Business Model met MIA/Vamil Aftrek',
      description: 'Implementeer circulaire processen: waste-to-resource, material recovery, en closed-loop systems. Tot 75% MIA/Vamil belastingaftrek op circulaire investeringen.',
      impact: 'Medium-Hoog',
      co2Reduction: Math.round((breakdown.waste + breakdown.materials) * 0.6 * 100) / 100,
      cost: '€25,000 - €75,000',
      savings: '€18,750 - €56,250 MIA/Vamil aftrek + operationele besparingen',
      paybackMonths: 30,
      priority: 3,
      dutchSpecific: true,
      subsidies: ['Tot 75% MIA/Vamil aftrek circulaire investeringen', 'Innovation tax credits', 'Circular economy grants mogelijk'],
      strategies: ['Waste stream optimization', 'Material recovery systems', 'Supplier circularity requirements', 'Product lifecycle extension'],
      implementationSteps: [
        'Circularity assessment en quick wins identificatie',
        'MIA/Vamil qualification check en application',
        'Pilot project implementatie en measurement',
        'Scale-up en supply chain integration'
      ]
    })
  }

  // CO2-Prestatieladder Certificering
  recommendations.push({
    category: 'Compliance & Market Position',
    title: 'CO2-Prestatieladder Niveau 3+ Certificering',
    description: 'Behaal CO2-Prestatieladder niveau 3+ voor significante aanbestedingsvoordelen bij Nederlandse overheidsopdrachten. ROI binnen 6 maanden voor B2G bedrijven.',
    impact: 'Business Impact',
    co2Reduction: 0, // Process improvement, niet direct CO2 reductie
    cost: '€8,000 - €15,000 certificering + €5,000/jaar onderhoud',
    savings: 'Aanbestedingsvoordeel: 10-15% hogere win rate + premium pricing mogelijk',
    paybackMonths: 6,
    priority: 2,
    dutchSpecific: true,
    benefits: ['10-15% voordeel bij overheidstenders', 'Access tot groene aanbestedingen', 'Verbeterde market positioning', 'CSRD compliance preparation'],
    requirements: ['Carbon footprint berekening', 'Reduction plan ontwikkeling', 'Third-party verification', 'Annual monitoring en reporting'],
    implementationSteps: [
      'Gap analysis huidige carbon management',
      'CO2-Prestatieladder consultant selectie',
      'Data verzameling en verification',
      'Certificering aanvraag en audit'
    ]
  })

  return recommendations.slice(0, 6).map((rec, index) => ({
    ...rec,
    id: `ai-rec-${index + 1}`,
    confidence: 0.92,
    aiEnhanced: true,
    lastUpdated: new Date().toISOString(),
    dutchMarketContext: true
  }))
}

function calculateSustainabilityScore(emissions, companyInfo, industry) {
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const relativePerformance = Math.max(0, 1 - (emissionsPerEmployee / industryBenchmark))
  
  let score = Math.round(relativePerformance * 40) // Base 40 points for emissions performance
  
  // Compliance readiness bonus (Nederlandse context)
  if (companyInfo.employees > 250) score += 20 // CSRD ready
  else if (companyInfo.employees > 100) score += 15 // WPM ready
  else score += 10 // Proactive sustainability
  
  // Size efficiency bonus
  if (emissionsPerEmployee < 2) score += 15
  else if (emissionsPerEmployee < 3) score += 10
  else if (emissionsPerEmployee < 5) score += 5
  
  // Industry leadership bonus
  if (relativePerformance > 0.8) score += 10
  else if (relativePerformance > 0.6) score += 5
  
  // Data completeness bonus
  const dataCompleteness = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  if (dataCompleteness >= 5) score += 5
  
  return {
    overall: Math.min(score, 100),
    breakdown: {
      emissions: Math.round(relativePerformance * 40),
      compliance: companyInfo.employees > 250 ? 20 : companyInfo.employees >= 100 ? 15 : 10,
      efficiency: emissionsPerEmployee < 2 ? 15 : emissionsPerEmployee < 3 ? 10 : emissionsPerEmployee < 5 ? 5 : 0,
      leadership: relativePerformance > 0.8 ? 10 : relativePerformance > 0.6 ? 5 : 0,
      dataQuality: dataCompleteness >= 5 ? 5 : 0
    },
    grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C',
    benchmarkPosition: relativePerformance > 0.8 ? 'Top 20% Nederland' : relativePerformance > 0.6 ? 'Top 40% Nederland' : relativePerformance > 0.4 ? 'Nederlands gemiddelde' : 'Onder Nederlands gemiddelde',
    improvementPotential: Math.max(0, Math.round((industryBenchmark * 0.5 - emissionsPerEmployee) * companyInfo.employees * 100) / 100)
  }
}

// All helper functions for fallback scenarios
function generateExecutiveSummaryFallback(companyInfo, emissions, industry) {
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark

  let assessment = ""
  let urgency = ""
  
  if (performance < 0.7) {
    assessment = "uitstekend presterende organisatie die de Nederlandse industrie standaarden significant overtreft"
    urgency = "optimalisatie en market leadership"
  } else if (performance < 1.0) {
    assessment = "goed presterende organisatie met sterke sustainability fundamenten boven Nederlands gemiddelde"
    urgency = "strategische verbetering"
  } else if (performance < 1.3) {
    assessment = "gemiddeld presterende organisatie met belangrijke verbetermogelijkheden"
    urgency = "directe actie"
  } else {
    assessment = "organisatie die urgent actie moet ondernemen voor Nederlandse compliance en concurrentiepositie"
    urgency = "kritieke interventie"
  }

  return {
    headline: `${companyInfo.name} is een ${assessment}`,
    content: `Met ${emissions.total} ton CO2 uitstoot (${emissionsPerEmployee.toFixed(1)} ton per medewerker) staat ${companyInfo.name} op ${Math.round(performance * 100)}% van het Nederlandse ${industry} sectorgemiddelde.

**Nederlandse Compliance Status:**
${companyInfo.employees > 250 ? '🔴 CSRD rapportage VERPLICHT vanaf maart 2025 - implementatie kritiek' : '🟡 CSRD voorbereiding aanbevolen voor toekomstige verplichting'}
${companyInfo.employees >= 100 ? '🔴 WPM rapportage VERPLICHT vanaf juni 2025 - mobility tracking opstarten' : '✅ Geen directe WPM verplichting'}

**Top Strategische Prioriteiten:**
1. ${emissions.breakdown?.energy > 5 ? 'Groene energie transitie (direct 30-50% Scope 2 reductie mogelijk)' : 'Energie efficiency optimalisatie met smart building tech'}
2. ${emissions.breakdown?.transport > 3 ? 'Fleet elektrificatie met €4,000 SEEH subsidie per auto' : 'Sustainable mobility programma en WPM compliance'}
3. CO2-Prestatieladder certificering voor aanbestedingsvoordeel

**Financial Impact:**
- Huidige carbon exposure: €${Math.round(emissions.total * DUTCH_CARBON_PRICING['2024']).toLocaleString()}/jaar
- 2030 risico zonder actie: €${Math.round(emissions.total * DUTCH_CARBON_PRICING['2030']).toLocaleString()}/jaar
- Potentiële ROI: €${Math.round(emissions.total * 150).toLocaleString()}/jaar besparingen mogelijk
- Nederlandse subsidies beschikbaar: €${Math.round(emissions.total * 200).toLocaleString()}

**Next Steps:** Start binnen 30 dagen met ${urgency}, focus op Nederlandse subsidie deadlines en compliance timelines.`,
    keyMetrics: {
      totalEmissions: emissions.total,
      emissionsPerEmployee: Math.round(emissionsPerEmployee * 100) / 100,
      industryComparison: Math.round(performance * 100),
      csrdReadiness: calculateCSRDReadiness(emissions.total, companyInfo.employees),
      benchmarkStatus: performance < 1.0 ? 'Boven Nederlands gemiddelde' : 'Onder Nederlands gemiddelde'
    },
    urgencyLevel: urgency,
    nextSteps: [
      'Start CSRD gap analyse binnen 30 dagen',
      'Implementeer carbon accounting systeem',
      'Ontwikkel science-based reduction targets conform Nederlandse methodiek'
    ],
    aiGenerated: false,
    confidence: 0.75
  }
}

function generateActionPlanFallback(emissions, companyInfo, industry) {
  return {
    aiGeneratedPlan: 'Enhanced rule-based action plan generated with Dutch market focus',
    structured: generateStructuredActionPlan(emissions, companyInfo, industry),
    timeline: generateActionTimeline(emissions, companyInfo),
    totalInvestment: calculateTotalInvestment(emissions, companyInfo),
    expectedROI: calculateExpectedROI(emissions, companyInfo, industry),
    aiGenerated: false,
    confidence: 0.78
  }
}

function generateStructuredActionPlan(emissions, companyInfo, industry) {
  const immediate = []
  const shortTerm = []
  const longTerm = []

  // Immediate actions (0-6 months)
  immediate.push('CO2-Prestatieladder niveau 1 certificering aanvragen')
  if (emissions.breakdown?.energy > 2) {
    immediate.push('Groene energie contract onderhandelen met Nederlandse leveranciers')
  }
  if (companyInfo.employees >= 100) {
    immediate.push('WPM rapportage systeem opzetten (deadline juni 2025)')
  }
  if (companyInfo.employees > 250) {
    immediate.push('CSRD gap analyse starten (deadline maart 2025)')
  }

  // Short term actions (6-18 months)
  shortTerm.push('LED verlichting upgrade met EIA belastingvoordeel')
  shortTerm.push('Smart thermostaten installeren')
  if (companyInfo.employees > 25) {
    shortTerm.push('SEEH subsidie aanvragen voor elektrische lease auto\'s')
  }
  shortTerm.push('Building automation systeem implementeren')

  // Long term actions (18+ months)
  longTerm.push('Zonnepanelen met SDE++ subsidie')
  longTerm.push('Heat pump systeem voor aardgasvrij')
  longTerm.push('CO2-Prestatieladder niveau 3+ behalen')
  longTerm.push('Carbon neutral certificering nastreven')

  return { immediate, shortTerm, longTerm }
}

function generateActionTimeline(emissions, companyInfo) {
  return {
    'Q1 2025': 'CSRD compliance assessment + LED upgrade + groene energie',
    'Q2 2025': 'WPM implementatie + smart building tech + SEEH aanvragen',
    'Q3 2025': 'Elektrische auto\'s ontvangen + CO2-Prestatieladder audit',
    'Q4 2025': 'Heat pump planning + zonnepanelen design + compliance review'
  }
}

function calculateTotalInvestment(emissions, companyInfo) {
  return Math.round(emissions.total * 900) // Slightly higher for Dutch market
}

function calculateExpectedROI2(emissions, companyInfo, industry) {
  return {
    year1: '18-28% (Nederlandse subsidies geïncludeerd)',
    year3: '160-220% (inclusief CO2-heffing savings)',
    year5: '280-380% (full lifecycle benefits)'
  }
}

function generateRiskAssessmentFallback(companyInfo, emissions, industry) {
  return {
    aiAnalysis: 'Enhanced rule-based risk assessment completed with Dutch regulatory focus',
    riskMatrix: generateRiskMatrix(companyInfo, emissions, industry),
    criticalRisks: identifyCriticalRisks(companyInfo, emissions, industry),
    mitigationStrategies: generateMitigationStrategies(companyInfo, emissions, industry),
    totalRiskExposure: calculateTotalRiskExposure(companyInfo, emissions, industry),
    aiGenerated: false,
    confidence: 0.81
  }
}

function generateRiskMatrix(companyInfo, emissions, industry) {
  return [
    { 
      risk: 'CSRD Non-compliance', 
      impact: companyInfo.employees > 250 ? 9 : 4, 
      likelihood: companyInfo.employees > 250 ? 8 : 3,
      financialImpact: companyInfo.employees > 250 ? '€500,000+ boetes + reputatieschade' : 'Concurrentienadeel'
    },
    { 
      risk: 'CO2-heffing escalatie 2024-2030', 
      impact: emissions.total > 50 ? 8 : 5, 
      likelihood: 9,
      financialImpact: `€${Math.round(emissions.total * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024'])).toLocaleString()} extra kosten`
    },
    { 
      risk: 'Supply chain carbon disruption', 
      impact: 6, 
      likelihood: 5,
      financialImpact: '10-20% kostenstijging leveranciers'
    },
    {
      risk: 'Talent acquisition sustainability gap',
      impact: 5,
      likelihood: 7,
      financialImpact: '15-25% hogere recruitment kosten'
    }
  ]
}

function identifyCriticalRisks(companyInfo, emissions, industry) {
  const risks = []
  if (companyInfo.employees > 250) {
    risks.push('CSRD compliance deadline maart 2025 - 12 maanden om te implementeren')
  }
  if (emissions.total > 50) {
    risks.push('CO2-heffing escalatie naar €216/ton in 2030 - €' + Math.round(emissions.total * 185.52).toLocaleString() + ' extra kosten')
  }
  if (companyInfo.employees >= 100) {
    risks.push('WPM rapportage deadline juni 2025 - mobility tracking systeem nodig')
  }
  return risks
}

function generateMitigationStrategies(companyInfo, emissions, industry) {
  return [
    'Start CSRD implementation binnen 30 dagen met externe expertise',
    'Implementeer carbon reduction roadmap met 30%+ target',
    'Diversifieer supply chain met sustainability criteria',
    'Develop employee sustainability engagement programma'
  ]
}

function calculateTotalRiskExposure(companyInfo, emissions, industry) {
  let exposure = Math.round(emissions.total * DUTCH_CARBON_PRICING['2030'])
  if (companyInfo.employees > 250) exposure += 500000 // CSRD fine risk
  if (companyInfo.employees >= 100) exposure += 50000 // WPM compliance costs
  return exposure
}

function generateComplianceAnalysisFallback(companyInfo, emissions) {
  return {
    aiAnalysis: 'Enhanced compliance analysis completed with Nederlandse regulatory timeline',
    csrdStatus: generateCSRDStatus(companyInfo, emissions),
    wmpStatus: generateWPMStatus(companyInfo),
    implementationSteps: generateComplianceSteps(companyInfo, emissions),
    deadlines: generateComplianceDeadlines(companyInfo),
    estimatedCosts: calculateComplianceCosts(companyInfo, emissions),
    aiGenerated: false,
    confidence: 0.85
  }
}

function generateCSRDStatus(companyInfo, emissions) {
  const required = companyInfo.employees > 250 || (companyInfo.revenue && companyInfo.revenue > 50)
  return {
    required: required,
    readiness: calculateCSRDReadiness(emissions.total, companyInfo.employees),
    deadline: required ? '2025-03-31' : '2026-03-31',
    urgency: required ? 'KRITIEK - 12 maanden' : 'Medium - voorbereiden',
    scope: required ? 'Volledige ESRS compliance + third-party assurance' : 'Vrijwillige voorbereiding'
  }
}

function generateWPMStatus(companyInfo) {
  return {
    required: companyInfo.employees >= 100,
    deadline: '2025-06-30',
    status: companyInfo.employees >= 100 ? 'VERPLICHT - WPM rapportage 18 maanden' : 'Niet van toepassing',
    scope: 'Home-to-work mobility tracking + CO2 impact berekening',
    estimatedEffort: companyInfo.employees >= 100 ? '2-3 maanden implementatie' : 'Monitoring aanbevolen'
  }
}

function generateComplianceSteps(companyInfo, emissions) {
  const steps = []
  if (companyInfo.employees > 250) {
    steps.push('CSRD gap analysis binnen 4 weken')
    steps.push('Double materiality assessment Q1 2025')
    steps.push('ESRS data collection systemen implementeren')
    steps.push('Third-party assurance partner selecteren')
  }
  if (companyInfo.employees >= 100) {
    steps.push('WPM mobility tracking systeem opzetten')
    steps.push('Home-to-work survey en data collection')
  }
  steps.push('CO2-Prestatieladder certificering voorbereiden')
  steps.push('Carbon accounting systeem implementeren')
  return steps
}

function generateComplianceDeadlines(companyInfo) {
  return {
    'CSRD eerste rapportage': companyInfo.employees > 250 ? '2025-03-31' : '2026-03-31',
    'WPM rapportage': companyInfo.employees >= 100 ? '2025-06-30' : 'Niet van toepassing',
    'CO2-Prestatieladder audit': '2025-Q2 (aanbevolen)',
    'Third-party verification': companyInfo.employees > 250 ? '2025-Q1' : '2026-Q1'
  }
}

function calculateComplianceCosts(companyInfo, emissions) {
  return {
    csrd: companyInfo.employees > 250 ? 75000 : 25000,
    wmp: companyInfo.employees >= 100 ? 15000 : 0,
    co2Prestatieladder: 12000,
    carbonAccounting: 8000,
    total: (companyInfo.employees > 250 ? 75000 : 25000) + 
           (companyInfo.employees >= 100 ? 15000 : 0) + 12000 + 8000
  }
}

function generateFinancialAnalysisFallback(emissions, companyInfo, industry) {
  return {
    aiAnalysis: 'Enhanced financial analysis completed with Nederlandse subsidie optimization',
    carbonPricingExposure: calculateCarbonPricingExposure(emissions.total),
    subsidyOpportunities: calculateDutchSubsidies(emissions, companyInfo, industry),
    investmentScenarios: generateInvestmentScenarios(emissions, companyInfo, industry),
    roiProjections: calculateROIProjections(emissions, companyInfo, industry),
    cashFlowImpact: generateCashFlowAnalysis(emissions, companyInfo, industry),
    aiGenerated: false,
    confidence: 0.82
  }
}

function calculateCarbonPricingExposure(totalEmissions) {
  return {
    current2024: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2024']),
    projected2025: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2025']),
    projected2030: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2030']),
    totalRiskIncrease: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024'])),
    annualIncrease: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024']) / 6),
    euETSComparison: Math.round(totalEmissions * DUTCH_CARBON_PRICING['euETS2024'])
  }
}

function calculateDutchSubsidies(emissions, companyInfo, industry) {
  const employees = companyInfo.employees || 1
  const totalEmissions = emissions.total || 0
  
  const subsidies = {
    SEEH: Math.min(Math.floor(employees / 5) * 4000, 20000), // Max 5 auto's
    SDE: Math.min(totalEmissions * 100, 25000),
    EIA: Math.min(totalEmissions * 300, 50000),
    WBSO: industry.includes('Technologie') ? Math.min(totalEmissions * 150, 20000) : 0,
    MIAVamil: Math.min(totalEmissions * 200, 75000)
  }
  
  return {
    ...subsidies,
    total: Object.values(subsidies).reduce((sum, val) => sum + val, 0),
    description: {
      SEEH: 'Subsidie Elektrisch Rijden: €4,000 per elektrische auto',
      SDE: 'SDE++ hernieuwbare energie subsidie',
      EIA: 'Energie-investeringsaftrek 30% op efficiency investeringen',
      WBSO: 'Wet Bevordering Speur- en Ontwikkelingswerk voor innovatie',
      MIAVamil: 'Milieu-investeringsaftrek + Vamil voor circulaire investeringen'
    }
  }
}

function generateInvestmentScenarios(emissions, companyInfo, industry) {
  const baseInvestment = emissions.total * 900 // Slightly higher for Dutch market
  
  return {
    conservative: {
      investment: Math.round(baseInvestment * 0.6),
      co2Reduction: Math.round(emissions.total * 0.25 * 100) / 100,
      paybackMonths: 36,
      roi5Year: '190%',
      measures: ['LED upgrade', 'Smart thermostaten', 'Groene energie contract']
    },
    moderate: {
      investment: Math.round(baseInvestment),
      co2Reduction: Math.round(emissions.total * 0.45 * 100) / 100,
      paybackMonths: 24,
      roi5Year: '270%',
      measures: ['Building automation', 'Heat pump', 'Elektrische auto\'s', 'Zonnepanelen']
    },
    aggressive: {
      investment: Math.round(baseInvestment * 1.5),
      co2Reduction: Math.round(emissions.total * 0.70 * 100) / 100,
      paybackMonths: 18,
      roi5Year: '350%',
      measures: ['Volledige elektrificatie', 'Advanced automation', 'Carbon neutral certificering']
    }
  }
}

function calculateROIProjections(emissions, companyInfo, industry) {
  const baseInvestment = emissions.total * 900
  return {
    year1: { 
      investment: baseInvestment, 
      savings: Math.round(baseInvestment * 0.18), 
      roi: 18,
      subsidies: Math.round(baseInvestment * 0.25)
    },
    year3: { 
      investment: baseInvestment, 
      savings: Math.round(baseInvestment * 0.65), 
      roi: 65,
      cumulativeSavings: Math.round(baseInvestment * 1.2)
    },
    year5: { 
      investment: baseInvestment, 
      savings: Math.round(baseInvestment * 1.25), 
      roi: 125,
      cumulativeSavings: Math.round(baseInvestment * 2.7)
    }
  }
}

function generateCashFlowAnalysis(emissions, companyInfo, industry) {
  const baseInvestment = Math.round(emissions.total * 900)
  return {
    initialInvestment: baseInvestment,
    dutchSubsidies: Math.round(baseInvestment * 0.25),
    netInvestment: Math.round(baseInvestment * 0.75),
    annualSavings: Math.round(emissions.total * 220), // Higher for Dutch market
    paybackPeriod: 20, // months
    npv5Year: Math.round(baseInvestment * 1.8),
    carbonSavingsValue: Math.round(emissions.total * 0.6 * DUTCH_CARBON_PRICING['2030'])
  }
}

// Other helper functions remain the same as before...
function checkCSRDRequirement(companyInfo) {
  const isRequired = companyInfo.employees > 250 || (companyInfo.revenue && companyInfo.revenue > 50)
  return {
    required: isRequired,
    timeline: isRequired ? '2025' : '2026',
    urgency: isRequired ? 'Kritiek' : 'Medium',
    readinessScore: calculateCSRDReadiness(0, companyInfo.employees)
  }
}

function checkWPMRequirement(companyInfo) {
  const isRequired = companyInfo.employees >= 100
  return {
    required: isRequired,
    deadline: '2025-06-30',
    urgency: isRequired ? 'Hoog' : 'Laag',
    scope: 'Home-to-work mobility tracking + CO2 impact reporting'
  }
}

function checkCO2HeffingRequirement(emissions, industry) {
  const impactedIndustries = ['Productie & Manufacturing', 'Bouw & Vastgoed', 'Transport & Logistiek', 'Energie & Utilities']
  const isImpacted = impactedIndustries.some(sector => industry?.includes(sector)) && emissions.total > 25
  return {
    applicable: isImpacted,
    currentRate: `€${DUTCH_CARBON_PRICING['2024']} per ton`,
    rate2030: `€${DUTCH_CARBON_PRICING['2030']} per ton`,
    urgency: isImpacted ? 'Hoog' : 'Laag',
    estimatedCost2030: Math.round(emissions.total * DUTCH_CARBON_PRICING['2030'])
  }
}

function calculateConfidence(emissions, companyInfo) {
  let confidence = 0.75
  const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  confidence += Math.min(dataPoints * 0.04, 0.20)
  if (companyInfo.employees > 50) confidence += 0.05
  if (companyInfo.employees > 200) confidence += 0.05
  if (emissions.total > 0) confidence += 0.05
  return Math.min(confidence, 0.95)
}

function calculateIndustryComparison(totalEmissions, employees, industry) {
  const emissionsPerEmployee = totalEmissions / employees
  const benchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  return Math.round((emissionsPerEmployee / benchmark) * 100)
}

function calculateCSRDReadiness2(totalEmissions, employeeCount) {
  let score = 30
  if (totalEmissions > 0) score += 20
  if (employeeCount > 0) score += 15
  if (totalEmissions < 100) score += 10
  if (employeeCount > 50) score += 15
  if (employeeCount > 250) score += 10
  return Math.min(score, 100)
}

function generateDutchBenchmarking(totalEmissions, employeeCount, industry) {
  const emissionsPerEmployee = totalEmissions / employeeCount
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = calculatePercentile(performance)
  
  return {
    industryBenchmark: industryBenchmark,
    yourPerformance: Math.round(emissionsPerEmployee * 100) / 100,
    percentile: percentile,
    ranking: getPerformanceRanking(performance),
    dutchContext: true,
    sectorAverage: industryBenchmark,
    improvement: Math.max(0, Math.round((emissionsPerEmployee - industryBenchmark * 0.5) * 100) / 100)
  }
}

function calculatePercentile(performance) {
  if (performance <= 0.5) return 95
  if (performance <= 0.7) return 85
  if (performance <= 0.9) return 75
  if (performance <= 1.1) return 60
  if (performance <= 1.3) return 45
  if (performance <= 1.5) return 30
  return 15
}

function getPerformanceRanking(performance) {
  if (performance <= 0.5) return 'Uitstekend (Top 5% Nederland)'
  if (performance <= 0.7) return 'Zeer Goed (Top 15% Nederland)'
  if (performance <= 0.9) return 'Goed (Top 25% Nederland)'
  if (performance <= 1.1) return 'Nederlands gemiddelde'
  if (performance <= 1.3) return 'Onder gemiddeld'
  return 'Verbetering urgent nodig'
}

function generatePriorityMatrix(breakdown, totalEmissions, industry) {
  const priorities = []
  Object.entries(breakdown).forEach(([category, value]) => {
    if (value > totalEmissions * 0.1) {
      priorities.push({
        category: category,
        impact: value > totalEmissions * 0.3 ? 'Hoog' : 'Medium',
        effort: category === 'energy' ? 'Laag' : category === 'transport' ? 'Medium' : 'Hoog',
        priority: value > totalEmissions * 0.3 ? 1 : 2,
        co2Amount: value,
        percentage: Math.round((value / totalEmissions) * 100),
        dutchOpportunities: getDutchOpportunities(category, value)
      })
    }
  })
  return priorities.sort((a, b) => a.priority - b.priority)
}

function getDutchOpportunities(category, value) {
  const opportunities = {
    energy: ['Groene energie contract', 'EIA belastingvoordeel', 'LED upgrade'],
    transport: ['SEEH subsidie elektrische auto\'s', 'WPM compliance improvement'],
    waste: ['MIA/Vamil circulaire investeringen', 'Afvalfonds optimalisatie'],
    water: ['Water efficiency technologie', 'Circulair water management'],
    materials: ['MIA/Vamil circulaire procurement', 'Supplier sustainability requirements']
  }
  return opportunities[category] || ['Efficiency verbeteringen', 'Nederlandse subsidies checken']
}

function generateImplementationRoadmap(breakdown, companyInfo, totalEmissions) {
  return {
    phases: [
      {
        phase: 'Foundation & Compliance (0-6 maanden)',
        target: Math.round(totalEmissions * 0.85 * 100) / 100,
        actions: ['CSRD gap analyse', 'WPM implementatie setup', 'CO2-Prestatieladder start', 'Quick wins (LED, groene energie)'],
        budget: '€15,000 - €35,000',
        co2Reduction: Math.round(totalEmissions * 0.15 * 100) / 100,
        dutchFocus: 'Compliance deadlines en subsidie aanvragen'
      },
      {
        phase: 'Technology & Systems (6-18 maanden)',
        target: Math.round(totalEmissions * 0.65 * 100) / 100,
        actions: ['Building automation met EIA', 'SEEH elektrische auto\'s', 'Heat pump planning', 'Zonnepanelen met SDE++'],
        budget: '€50,000 - €120,000',
        co2Reduction: Math.round(totalEmissions * 0.35 * 100) / 100,
        dutchFocus: 'Structurele emissiereductie en subsidie optimalisatie'
      },
      {
        phase: 'Carbon Neutraliteit & Leadership (18+ maanden)',
        target: Math.round(totalEmissions * 0.20 * 100) / 100,
        actions: ['Science-based targets implementatie', 'Carbon offset programma', 'Supply chain engagement', 'Carbon neutral certificering'],
        budget: '€80,000 - €200,000',
        co2Reduction: Math.round(totalEmissions * 0.45 * 100) / 100,
        dutchFocus: 'Market leadership en competitive advantage'
      }
    ],
    totalInvestment: Math.round(totalEmissions * 1200),
    totalSubsidies: Math.round(totalEmissions * 300),
    netInvestment: Math.round(totalEmissions * 900),
    expectedROI: {
      year1: '18-25%',
      year3: '120-180%',
      year5: '280-350%'
    },
    co2ReductionTarget: Math.round(totalEmissions * 0.80 * 100) / 100,
    dutchSpecific: true,
    methodology: 'CO2-Prestatieladder 3.1 + CSRD compliance'
  }
}

function generateEnhancedRecommendations(breakdown, totalEmissions, industry, companyInfo) {
  const recommendations = []
  const employees = companyInfo.employees || 1

  // AI-Enhanced Energy Recommendations with Dutch subsidies
  if (breakdown.energy > totalEmissions * 0.3) {
    recommendations.push({
      category: 'Energie Transitie',
      title: 'Nederlandse Groene Energie Leverancier Transitie',
      description: 'Schakel over naar 100% groene energie via Nederlandse leveranciers zoals Vattenfall, Eneco of Essent. Elimineer direct alle Scope 2 emissies met Nederlandse Garanties van Oorsprong.',
      impact: 'Zeer Hoog',
      co2Reduction: Math.round(breakdown.energy * 0.85 * 100) / 100,
      cost: '€0 - €2,000 setup kosten',
      paybackMonths: 0,
      priority: 1,
      dutchSpecific: true,
      subsidies: ['Geen extra kosten', 'Vaak goedkoper dan grijze stroom', 'CO2-Prestatieladder punten'],
      suppliers: ['Vattenfall 100% Nederlandse wind', 'Eneco Nederlandse groene stroom', 'Essent Duurzame energie'],
      implementationSteps: [
        'Vergelijk aanbieders groene energie certificaten',
        'Onderhandel contract met Nederlandse garanties van oorsprong',
        'Implementeer binnen 30 dagen zonder downtime',
        'Monitor en rapporteer Scope 2 eliminatie voor CSRD'
      ],
      compliance: 'Direct CSRD Scope 2 market-based improvement'
    })
  }

  // AI-Enhanced Transport Recommendations with SEEH subsidie
  if (breakdown.transport > totalEmissions * 0.25) {
    const potentialVehicles = Math.min(Math.floor(employees / 5), 20)
    const seehSubsidy = Math.min(potentialVehicles * 4000, 20000)
    
    recommendations.push({
      category: 'Mobiliteit',
      title: 'SEEH Elektrische Fleet Transitie Programma',
      description: `Elektrificeer ${potentialVehicles} lease auto's met Nederlandse SEEH subsidie van €4,000 per voertuig. Profiteer van 4% bijtelling vs 22% voor diesel en elimineer motorrijtuigenbelasting.`,
      impact: 'Zeer Hoog',
      co2Reduction: Math.round(breakdown.transport * 0.7 * 100) / 100,
      cost: `€${(potentialVehicles * 25000).toLocaleString()} - €${(potentialVehicles * 45000).toLocaleString()}`,
      savings: `€${seehSubsidy.toLocaleString()} SEEH subsidie + €${potentialVehicles * 600}/jaar tax benefits`,
      paybackMonths: 18,
      priority: 1,
      dutchSpecific: true,
      subsidies: [`€${seehSubsidy.toLocaleString()} SEEH subsidie totaal`, '4% bijtelling voordeel vs 22%', 'Geen motorrijtuigenbelasting', 'CO2-Prestatieladder verbetering'],
      providers: ['LeasePlan Nederland EV specialists', 'Athlon Car Lease groene fleet', 'ALD Automotive sustainability'],
      implementationSteps: [
        'SEEH subsidie aanvraag indienen bij RVO',
        'Lease partner selecteren met EV expertise en charging solutions',
        'Laadinfrastructuur planning en installatie',
        'Gefaseerde implementatie over 6-12 maanden met training'
      ],
      wmpCompliance: 'Verbetert WPM rapportage scores significant'
    })
  }

  // AI-Enhanced Building Efficiency with EIA aftrek
  if (breakdown.energy > totalEmissions * 0.2) {
    recommendations.push({
      category: 'Building Efficiency',
      title: 'Smart Building Automation met EIA Belastingvoordeel',
      description: 'Implementeer smart thermostaten, LED verlichting en building automation systemen. 30% EIA belastingaftrek op energie-efficiency investeringen tot €2.4 miljoen.',
      impact: 'Hoog',
      co2Reduction: Math.round(breakdown.energy * 0.25 * 100) / 100,
      cost: '€15,000 - €35,000',
      savings: '€4,500 - €10,500 EIA aftrek + €3,000-8,000/jaar operationele besparing',
      paybackMonths: 24,
      priority: 2,
      dutchSpecific: true,
      subsidies: ['30% EIA belastingaftrek', 'Accelerated depreciation mogelijk', 'Lagere energiekosten direct'],
      technologies: ['Smart thermostaat systemen', 'LED verlichting met sensoren', 'HVAC optimization', 'Energy monitoring dashboard'],
      implementationSteps: [
        'Energy audit en ROI berekening',
        'EIA aftrek aanvraag voorbereiding',
        'Technology selectie en installatie planning',
        'Implementation met minimal business disruption'
      ]
    })
  }

  // Circulaire Economie met MIA/Vamil
  if (breakdown.waste > totalEmissions * 0.1 || breakdown.materials > totalEmissions * 0.15) {
    recommendations.push({
      category: 'Circulaire Economie',
      title: 'Circulair Business Model met MIA/Vamil Aftrek',
      description: 'Implementeer circulaire processen: waste-to-resource, material recovery, en closed-loop systems. Tot 75% MIA/Vamil belastingaftrek op circulaire investeringen.',
      impact: 'Medium-Hoog',
      co2Reduction: Math.round((breakdown.waste + breakdown.materials) * 0.6 * 100) / 100,
      cost: '€25,000 - €75,000',
      savings: '€18,750 - €56,250 MIA/Vamil aftrek + operationele besparingen',
      paybackMonths: 30,
      priority: 3,
      dutchSpecific: true,
      subsidies: ['Tot 75% MIA/Vamil aftrek circulaire investeringen', 'Innovation tax credits', 'Circular economy grants mogelijk'],
      strategies: ['Waste stream optimization', 'Material recovery systems', 'Supplier circularity requirements', 'Product lifecycle extension'],
      implementationSteps: [
        'Circularity assessment en quick wins identificatie',
        'MIA/Vamil qualification check en application',
        'Pilot project implementatie en measurement',
        'Scale-up en supply chain integration'
      ]
    })
  }

  // CO2-Prestatieladder Certificering
  recommendations.push({
    category: 'Compliance & Market Position',
    title: 'CO2-Prestatieladder Niveau 3+ Certificering',
    description: 'Behaal CO2-Prestatieladder niveau 3+ voor significante aanbestedingsvoordelen bij Nederlandse overheidsopdrachten. ROI binnen 6 maanden voor B2G bedrijven.',
    impact: 'Business Impact',
    co2Reduction: 0, // Process improvement, niet direct CO2 reductie
    cost: '€8,000 - €15,000 certificering + €5,000/jaar onderhoud',
    savings: 'Aanbestedingsvoordeel: 10-15% hogere win rate + premium pricing mogelijk',
    paybackMonths: 6,
    priority: 2,
    dutchSpecific: true,
    benefits: ['10-15% voordeel bij overheidstenders', 'Access tot groene aanbestedingen', 'Verbeterde market positioning', 'CSRD compliance preparation'],
    requirements: ['Carbon footprint berekening', 'Reduction plan ontwikkeling', 'Third-party verification', 'Annual monitoring en reporting'],
    implementationSteps: [
      'Gap analysis huidige carbon management',
      'CO2-Prestatieladder consultant selectie',
      'Data verzameling en verification',
      'Certificering aanvraag en audit'
    ]
  })

  return recommendations.slice(0, 6).map((rec, index) => ({
    ...rec,
    id: `ai-rec-${index + 1}`,
    confidence: 0.92,
    aiEnhanced: true,
    lastUpdated: new Date().toISOString(),
    dutchMarketContext: true
  }))
}

function calculateSustainabilityScore(emissions, companyInfo, industry) {
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const relativePerformance = Math.max(0, 1 - (emissionsPerEmployee / industryBenchmark))
  
  let score = Math.round(relativePerformance * 40) // Base 40 points for emissions performance
  
  // Compliance readiness bonus (Nederlandse context)
  if (companyInfo.employees > 250) score += 20 // CSRD ready
  else if (companyInfo.employees > 100) score += 15 // WPM ready
  else score += 10 // Proactive sustainability
  
  // Size efficiency bonus
  if (emissionsPerEmployee < 2) score += 15
  else if (emissionsPerEmployee < 3) score += 10
  else if (emissionsPerEmployee < 5) score += 5
  
  // Industry leadership bonus
  if (relativePerformance > 0.8) score += 10
  else if (relativePerformance > 0.6) score += 5
  
  // Data completeness bonus
  const dataCompleteness = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
  if (dataCompleteness >= 5) score += 5
  
  return {
    overall: Math.min(score, 100),
    breakdown: {
      emissions: Math.round(relativePerformance * 40),
      compliance: companyInfo.employees > 250 ? 20 : companyInfo.employees >= 100 ? 15 : 10,
      efficiency: emissionsPerEmployee < 2 ? 15 : emissionsPerEmployee < 3 ? 10 : emissionsPerEmployee < 5 ? 5 : 0,
      leadership: relativePerformance > 0.8 ? 10 : relativePerformance > 0.6 ? 5 : 0,
      dataQuality: dataCompleteness >= 5 ? 5 : 0
    },
    grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C',
    benchmarkPosition: relativePerformance > 0.8 ? 'Top 20% Nederland' : relativePerformance > 0.6 ? 'Top 40% Nederland' : relativePerformance > 0.4 ? 'Nederlands gemiddelde' : 'Onder Nederlands gemiddelde',
    improvementPotential: Math.max(0, Math.round((industryBenchmark * 0.5 - emissionsPerEmployee) * companyInfo.employees * 100) / 100)
  }
}

// All helper functions for fallback scenarios
function generateExecutiveSummaryFallback(companyInfo, emissions, industry) {
  const emissionsPerEmployee = emissions.total / companyInfo.employees
  const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
  const performance = emissionsPerEmployee / industryBenchmark

  let assessment = ""
  let urgency = ""
  
  if (performance < 0.7) {
    assessment = "uitstekend presterende organisatie die de Nederlandse industrie standaarden significant overtreft"
    urgency = "optimalisatie en market leadership"
  } else if (performance < 1.0) {
    assessment = "goed presterende organisatie met sterke sustainability fundamenten boven Nederlands gemiddelde"
    urgency = "strategische verbetering"
  } else if (performance < 1.3) {
    assessment = "gemiddeld presterende organisatie met belangrijke verbetermogelijkheden"
    urgency = "directe actie"
  } else {
    assessment = "organisatie die urgent actie moet ondernemen voor Nederlandse compliance en concurrentiepositie"
    urgency = "kritieke interventie"
  }

  return {
    headline: `${companyInfo.name} is een ${assessment}`,
    content: `Met ${emissions.total} ton CO2 uitstoot (${emissionsPerEmployee.toFixed(1)} ton per medewerker) staat ${companyInfo.name} op ${Math.round(performance * 100)}% van het Nederlandse ${industry} sectorgemiddelde.

**Nederlandse Compliance Status:**
${companyInfo.employees > 250 ? '🔴 CSRD rapportage VERPLICHT vanaf maart 2025 - implementatie kritiek' : '🟡 CSRD voorbereiding aanbevolen voor toekomstige verplichting'}
${companyInfo.employees >= 100 ? '🔴 WPM rapportage VERPLICHT vanaf juni 2025 - mobility tracking opstarten' : '✅ Geen directe WPM verplichting'}

**Top Strategische Prioriteiten:**
1. ${emissions.breakdown?.energy > 5 ? 'Groene energie transitie (direct 30-50% Scope 2 reductie mogelijk)' : 'Energie efficiency optimalisatie met smart building tech'}
2. ${emissions.breakdown?.transport > 3 ? 'Fleet elektrificatie met €4,000 SEEH subsidie per auto' : 'Sustainable mobility programma en WPM compliance'}
3. CO2-Prestatieladder certificering voor aanbestedingsvoordeel

**Financial Impact:**
- Huidige carbon exposure: €${Math.round(emissions.total * DUTCH_CARBON_PRICING['2024']).toLocaleString()}/jaar
- 2030 risico zonder actie: €${Math.round(emissions.total * DUTCH_CARBON_PRICING['2030']).toLocaleString()}/jaar
- Potentiële ROI: €${Math.round(emissions.total * 150).toLocaleString()}/jaar besparingen mogelijk
- Nederlandse subsidies beschikbaar: €${Math.round(emissions.total * 200).toLocaleString()}

**Next Steps:** Start binnen 30 dagen met ${urgency}, focus op Nederlandse subsidie deadlines en compliance timelines.`,
    keyMetrics: {
      totalEmissions: emissions.total,
      emissionsPerEmployee: Math.round(emissionsPerEmployee * 100) / 100,
      industryComparison: Math.round(performance * 100),
      csrdReadiness: calculateCSRDReadiness(emissions.total, companyInfo.employees),
      benchmarkStatus: performance < 1.0 ? 'Boven Nederlands gemiddelde' : 'Onder Nederlands gemiddelde'
    },
    urgencyLevel: urgency,
    nextSteps: [
      'Start CSRD gap analyse binnen 30 dagen',
      'Implementeer carbon accounting systeem',
      'Ontwikkel science-based reduction targets conform Nederlandse methodiek'
    ],
    aiGenerated: false,
    confidence: 0.75
  }
}

function generateActionPlanFallback(emissions, companyInfo, industry) {
  return {
    aiGeneratedPlan: 'Enhanced rule-based action plan generated with Dutch market focus',
    structured: generateStructuredActionPlan(emissions, companyInfo, industry),
    timeline: generateActionTimeline(emissions, companyInfo),
    totalInvestment: calculateTotalInvestment(emissions, companyInfo),
    expectedROI: calculateExpectedROI(emissions, companyInfo, industry),
    aiGenerated: false,
    confidence: 0.78
  }
}
function generateStructuredActionPlan(emissions, companyInfo, industry) {
 const immediate = []
 const shortTerm = []
 const longTerm = []

 // Immediate actions (0-6 months)
 immediate.push('CO2-Prestatieladder niveau 1 certificering aanvragen')
 if (emissions.breakdown?.energy > 2) {
   immediate.push('Groene energie contract onderhandelen met Nederlandse leveranciers')
 }
 if (companyInfo.employees >= 100) {
   immediate.push('WPM rapportage systeem opzetten (deadline juni 2025)')
 }
 if (companyInfo.employees > 250) {
   immediate.push('CSRD gap analyse starten (deadline maart 2025)')
 }

 // Short term actions (6-18 months)
 shortTerm.push('LED verlichting upgrade met EIA belastingvoordeel')
 shortTerm.push('Smart thermostaten installeren')
 if (companyInfo.employees > 25) {
   shortTerm.push('SEEH subsidie aanvragen voor elektrische lease auto\'s')
 }
 shortTerm.push('Building automation systeem implementeren')

 // Long term actions (18+ months)
 longTerm.push('Zonnepanelen met SDE++ subsidie')
 longTerm.push('Heat pump systeem voor aardgasvrij')
 longTerm.push('CO2-Prestatieladder niveau 3+ behalen')
 longTerm.push('Carbon neutral certificering nastreven')

 return { immediate, shortTerm, longTerm }
}

function generateActionTimeline(emissions, companyInfo) {
 return {
   'Q1 2025': 'CSRD compliance assessment + LED upgrade + groene energie',
   'Q2 2025': 'WPM implementatie + smart building tech + SEEH aanvragen',
   'Q3 2025': 'Elektrische auto\'s ontvangen + CO2-Prestatieladder audit',
   'Q4 2025': 'Heat pump planning + zonnepanelen design + compliance review'
 }
}

function calculateTotalInvestment(emissions, companyInfo) {
 return Math.round(emissions.total * 900) // Slightly higher for Dutch market
}

function calculateExpectedROI(emissions, companyInfo, industry) {
 return {
   year1: '18-28% (Nederlandse subsidies geïncludeerd)',
   year3: '160-220% (inclusief CO2-heffing savings)',
   year5: '280-380% (full lifecycle benefits)'
 }
}

function generateRiskAssessmentFallback(companyInfo, emissions, industry) {
 return {
   aiAnalysis: 'Enhanced rule-based risk assessment completed with Dutch regulatory focus',
   riskMatrix: generateRiskMatrix(companyInfo, emissions, industry),
   criticalRisks: identifyCriticalRisks(companyInfo, emissions, industry),
   mitigationStrategies: generateMitigationStrategies(companyInfo, emissions, industry),
   totalRiskExposure: calculateTotalRiskExposure(companyInfo, emissions, industry),
   aiGenerated: false,
   confidence: 0.81
 }
}

function generateRiskMatrix(companyInfo, emissions, industry) {
 return [
   { 
     risk: 'CSRD Non-compliance', 
     impact: companyInfo.employees > 250 ? 9 : 4, 
     likelihood: companyInfo.employees > 250 ? 8 : 3,
     financialImpact: companyInfo.employees > 250 ? '€500,000+ boetes + reputatieschade' : 'Concurrentienadeel'
   },
   { 
     risk: 'CO2-heffing escalatie 2024-2030', 
     impact: emissions.total > 50 ? 8 : 5, 
     likelihood: 9,
     financialImpact: `€${Math.round(emissions.total * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024'])).toLocaleString()} extra kosten`
   },
   { 
     risk: 'Supply chain carbon disruption', 
     impact: 6, 
     likelihood: 5,
     financialImpact: '10-20% kostenstijging leveranciers'
   },
   {
     risk: 'Talent acquisition sustainability gap',
     impact: 5,
     likelihood: 7,
     financialImpact: '15-25% hogere recruitment kosten'
   }
 ]
}

function identifyCriticalRisks(companyInfo, emissions, industry) {
 const risks = []
 if (companyInfo.employees > 250) {
   risks.push('CSRD compliance deadline maart 2025 - 12 maanden om te implementeren')
 }
 if (emissions.total > 50) {
   risks.push('CO2-heffing escalatie naar €216/ton in 2030 - €' + Math.round(emissions.total * 185.52).toLocaleString() + ' extra kosten')
 }
 if (companyInfo.employees >= 100) {
   risks.push('WPM rapportage deadline juni 2025 - mobility tracking systeem nodig')
 }
 return risks
}

function generateMitigationStrategies(companyInfo, emissions, industry) {
 return [
   'Start CSRD implementation binnen 30 dagen met externe expertise',
   'Implementeer carbon reduction roadmap met 30%+ target',
   'Diversifieer supply chain met sustainability criteria',
   'Develop employee sustainability engagement programma'
 ]
}

function calculateTotalRiskExposure(companyInfo, emissions, industry) {
 let exposure = Math.round(emissions.total * DUTCH_CARBON_PRICING['2030'])
 if (companyInfo.employees > 250) exposure += 500000 // CSRD fine risk
 if (companyInfo.employees >= 100) exposure += 50000 // WPM compliance costs
 return exposure
}

function generateComplianceAnalysisFallback(companyInfo, emissions) {
 return {
   aiAnalysis: 'Enhanced compliance analysis completed with Nederlandse regulatory timeline',
   csrdStatus: generateCSRDStatus(companyInfo, emissions),
   wmpStatus: generateWPMStatus(companyInfo),
   implementationSteps: generateComplianceSteps(companyInfo, emissions),
   deadlines: generateComplianceDeadlines(companyInfo),
   estimatedCosts: calculateComplianceCosts(companyInfo, emissions),
   aiGenerated: false,
   confidence: 0.85
 }
}

function generateCSRDStatus(companyInfo, emissions) {
 const required = companyInfo.employees > 250 || (companyInfo.revenue && companyInfo.revenue > 50)
 return {
   required: required,
   readiness: calculateCSRDReadiness(emissions.total, companyInfo.employees),
   deadline: required ? '2025-03-31' : '2026-03-31',
   urgency: required ? 'KRITIEK - 12 maanden' : 'Medium - voorbereiden',
   scope: required ? 'Volledige ESRS compliance + third-party assurance' : 'Vrijwillige voorbereiding'
 }
}

function generateWPMStatus(companyInfo) {
 return {
   required: companyInfo.employees >= 100,
   deadline: '2025-06-30',
   status: companyInfo.employees >= 100 ? 'VERPLICHT - WPM rapportage 18 maanden' : 'Niet van toepassing',
   scope: 'Home-to-work mobility tracking + CO2 impact berekening',
   estimatedEffort: companyInfo.employees >= 100 ? '2-3 maanden implementatie' : 'Monitoring aanbevolen'
 }
}

function generateComplianceSteps(companyInfo, emissions) {
 const steps = []
 if (companyInfo.employees > 250) {
   steps.push('CSRD gap analysis binnen 4 weken')
   steps.push('Double materiality assessment Q1 2025')
   steps.push('ESRS data collection systemen implementeren')
   steps.push('Third-party assurance partner selecteren')
 }
 if (companyInfo.employees >= 100) {
   steps.push('WPM mobility tracking systeem opzetten')
   steps.push('Home-to-work survey en data collection')
 }
 steps.push('CO2-Prestatieladder certificering voorbereiden')
 steps.push('Carbon accounting systeem implementeren')
 return steps
}

function generateComplianceDeadlines(companyInfo) {
 return {
   'CSRD eerste rapportage': companyInfo.employees > 250 ? '2025-03-31' : '2026-03-31',
   'WPM rapportage': companyInfo.employees >= 100 ? '2025-06-30' : 'Niet van toepassing',
   'CO2-Prestatieladder audit': '2025-Q2 (aanbevolen)',
   'Third-party verification': companyInfo.employees > 250 ? '2025-Q1' : '2026-Q1'
 }
}

function calculateComplianceCosts(companyInfo, emissions) {
 return {
   csrd: companyInfo.employees > 250 ? 75000 : 25000,
   wmp: companyInfo.employees >= 100 ? 15000 : 0,
   co2Prestatieladder: 12000,
   carbonAccounting: 8000,
   total: (companyInfo.employees > 250 ? 75000 : 25000) + 
          (companyInfo.employees >= 100 ? 15000 : 0) + 12000 + 8000
 }
}

function generateFinancialAnalysisFallback(emissions, companyInfo, industry) {
 return {
   aiAnalysis: 'Enhanced financial analysis completed with Nederlandse subsidie optimization',
   carbonPricingExposure: calculateCarbonPricingExposure(emissions.total),
   subsidyOpportunities: calculateDutchSubsidies(emissions, companyInfo, industry),
   investmentScenarios: generateInvestmentScenarios(emissions, companyInfo, industry),
   roiProjections: calculateROIProjections(emissions, companyInfo, industry),
   cashFlowImpact: generateCashFlowAnalysis(emissions, companyInfo, industry),
   aiGenerated: false,
   confidence: 0.82
 }
}

function calculateCarbonPricingExposure(totalEmissions) {
 return {
   current2024: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2024']),
   projected2025: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2025']),
   projected2030: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2030']),
   totalRiskIncrease: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024'])),
   annualIncrease: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024']) / 6),
   euETSComparison: Math.round(totalEmissions * DUTCH_CARBON_PRICING['euETS2024'])
 }
}

function calculateDutchSubsidies(emissions, companyInfo, industry) {
 const employees = companyInfo.employees || 1
 const totalEmissions = emissions.total || 0
 
 const subsidies = {
   SEEH: Math.min(Math.floor(employees / 5) * 4000, 20000), // Max 5 auto's
   SDE: Math.min(totalEmissions * 100, 25000),
   EIA: Math.min(totalEmissions * 300, 50000),
   WBSO: industry.includes('Technologie') ? Math.min(totalEmissions * 150, 20000) : 0,
   MIAVamil: Math.min(totalEmissions * 200, 75000)
 }
 
 return {
   ...subsidies,
   total: Object.values(subsidies).reduce((sum, val) => sum + val, 0),
   description: {
     SEEH: 'Subsidie Elektrisch Rijden: €4,000 per elektrische auto',
     SDE: 'SDE++ hernieuwbare energie subsidie',
     EIA: 'Energie-investeringsaftrek 30% op efficiency investeringen',
     WBSO: 'Wet Bevordering Speur- en Ontwikkelingswerk voor innovatie',
     MIAVamil: 'Milieu-investeringsaftrek + Vamil voor circulaire investeringen'
   }
 }
}

function generateInvestmentScenarios2(emissions, companyInfo, industry) {
 const baseInvestment = emissions.total * 900 // Slightly higher for Dutch market
 
 return {
   conservative: {
     investment: Math.round(baseInvestment * 0.6),
     co2Reduction: Math.round(emissions.total * 0.25 * 100) / 100,
     paybackMonths: 36,
     roi5Year: '190%',
     measures: ['LED upgrade', 'Smart thermostaten', 'Groene energie contract']
   },
   moderate: {
     investment: Math.round(baseInvestment),
     co2Reduction: Math.round(emissions.total * 0.45 * 100) / 100,
     paybackMonths: 24,
     roi5Year: '270%',
     measures: ['Building automation', 'Heat pump', 'Elektrische auto\'s', 'Zonnepanelen']
   },
   aggressive: {
     investment: Math.round(baseInvestment * 1.5),
     co2Reduction: Math.round(emissions.total * 0.70 * 100) / 100,
     paybackMonths: 18,
     roi5Year: '350%',
     measures: ['Volledige elektrificatie', 'Advanced automation', 'Carbon neutral certificering']
   }
 }
}

function calculateROIProjections(emissions, companyInfo, industry) {
 const baseInvestment = emissions.total * 900
 return {
   year1: { 
     investment: baseInvestment, 
     savings: Math.round(baseInvestment * 0.18), 
     roi: 18,
     subsidies: Math.round(baseInvestment * 0.25)
   },
   year3: { 
     investment: baseInvestment, 
     savings: Math.round(baseInvestment * 0.65), 
     roi: 65,
     cumulativeSavings: Math.round(baseInvestment * 1.2)
   },
   year5: { 
     investment: baseInvestment, 
     savings: Math.round(baseInvestment * 1.25), 
     roi: 125,
     cumulativeSavings: Math.round(baseInvestment * 2.7)
   }
 }
}

function generateCashFlowAnalysis(emissions, companyInfo, industry) {
 const baseInvestment = Math.round(emissions.total * 900)
 return {
   initialInvestment: baseInvestment,
   dutchSubsidies: Math.round(baseInvestment * 0.25),
   netInvestment: Math.round(baseInvestment * 0.75),
   annualSavings: Math.round(emissions.total * 220), // Higher for Dutch market
   paybackPeriod: 20, // months
   npv5Year: Math.round(baseInvestment * 1.8),
   carbonSavingsValue: Math.round(emissions.total * 0.6 * DUTCH_CARBON_PRICING['2030'])
 }
}

function generateDutchBenchmarking(totalEmissions, employeeCount, industry) {
 const emissionsPerEmployee = totalEmissions / employeeCount
 const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
 const performance = emissionsPerEmployee / industryBenchmark
 const percentile = calculatePercentile(performance)
 
 return {
   industryBenchmark: industryBenchmark,
   yourPerformance: Math.round(emissionsPerEmployee * 100) / 100,
   percentile: percentile,
   ranking: getPerformanceRanking(performance),
   dutchContext: true,
   sectorAverage: industryBenchmark,
   improvement: Math.max(0, Math.round((emissionsPerEmployee - industryBenchmark * 0.5) * 100) / 100)
 }
}

function calculatePercentile(performance) {
 if (performance <= 0.5) return 95
 if (performance <= 0.7) return 85
 if (performance <= 0.9) return 75
 if (performance <= 1.1) return 60
 if (performance <= 1.3) return 45
 if (performance <= 1.5) return 30
 return 15
}

function getPerformanceRanking(performance) {
 if (performance <= 0.5) return 'Uitstekend (Top 5% Nederland)'
 if (performance <= 0.7) return 'Zeer Goed (Top 15% Nederland)'
 if (performance <= 0.9) return 'Goed (Top 25% Nederland)'
 if (performance <= 1.1) return 'Nederlands gemiddelde'
 if (performance <= 1.3) return 'Onder gemiddeld'
 return 'Verbetering urgent nodig'
}

function generatePriorityMatrix(breakdown, totalEmissions, industry) {
 const priorities = []
 Object.entries(breakdown).forEach(([category, value]) => {
   if (value > totalEmissions * 0.1) {
     priorities.push({
       category: category,
       impact: value > totalEmissions * 0.3 ? 'Hoog' : 'Medium',
       effort: category === 'energy' ? 'Laag' : category === 'transport' ? 'Medium' : 'Hoog',
       priority: value > totalEmissions * 0.3 ? 1 : 2,
       co2Amount: value,
       percentage: Math.round((value / totalEmissions) * 100),
       dutchOpportunities: getDutchOpportunities(category, value)
     })
   }
 })
 return priorities.sort((a, b) => a.priority - b.priority)
}

function getDutchOpportunities2(category, value) {
 const opportunities = {
   energy: ['Groene energie contract', 'EIA belastingvoordeel', 'LED upgrade'],
   transport: ['SEEH subsidie elektrische auto\'s', 'WPM compliance improvement'],
   waste: ['MIA/Vamil circulaire investeringen', 'Afvalfonds optimalisatie'],
   water: ['Water efficiency technologie', 'Circulair water management'],
   materials: ['MIA/Vamil circulaire procurement', 'Supplier sustainability requirements']
 }
 return opportunities[category] || ['Efficiency verbeteringen', 'Nederlandse subsidies checken']
}

function generateSectorInsights(industry, breakdown, companyInfo) {
 const insights = {
   'Technologie & Software': {
     keyMetrics: ['Energy per server', 'Code efficiency', 'Cloud carbon optimization'],
     opportunities: ['Green software engineering', 'Carbon-aware algorithms', 'Renewable energy hosting'],
     dutchLeaders: ['Booking.com', 'Adyen', 'MessageBird'],
     specificChallenges: ['Data center efficiency', 'Remote work impact', 'Digital product lifecycle'],
     averageReduction: '25-40%',
     quickWins: ['Cloud optimization', 'Green hosting', 'Efficient coding practices']
   },
   'Productie & Manufacturing': {
     keyMetrics: ['Energy per unit', 'Waste per product', 'Supply chain emissions'],
     opportunities: ['Industry 4.0 automation', 'Circular manufacturing', 'Heat recovery systems'],
     dutchLeaders: ['ASML', 'Philips', 'DSM'],
     specificChallenges: ['Process heating', 'Material sourcing', 'Production efficiency'],
     averageReduction: '30-50%',
     quickWins: ['LED lighting', 'Equipment optimization', 'Waste stream analysis']
   },
   'Transport & Logistiek': {
     keyMetrics: ['Fuel per km', 'Load efficiency', 'Route optimization'],
     opportunities: ['Electric fleet', 'Route optimization AI', 'Multimodal transport'],
     dutchLeaders: ['PostNL', 'DHL Netherlands', 'Vos Logistics'],
     specificChallenges: ['Last-mile delivery', 'Fleet electrification', 'Warehouse efficiency'],
     averageReduction: '40-60%',
     quickWins: ['Route optimization', 'Driver training', 'Vehicle maintenance']
   },
   'Retail & E-commerce': {
     keyMetrics: ['Energy per m²', 'Packaging efficiency', 'Digital vs physical'],
     opportunities: ['Smart buildings', 'Sustainable packaging', 'Local sourcing'],
     dutchLeaders: ['Ahold Delhaize', 'Bol.com', 'Coolblue'],
     specificChallenges: ['Store lighting', 'Cold chain', 'Return logistics'],
     averageReduction: '20-35%',
     quickWins: ['LED upgrade', 'HVAC optimization', 'Packaging reduction']
   }
 }

 const defaultInsight = {
   keyMetrics: ['Energy efficiency', 'Waste reduction', 'Transport optimization'],
   opportunities: ['Groene energie transitie', 'Smart building tech', 'Circulaire processen'],
   dutchLeaders: ['Nederlandse sustainability pioneers'],
   specificChallenges: ['Energy costs', 'Compliance requirements', 'ROI optimization'],
   averageReduction: '25-40%',
   quickWins: ['LED lighting', 'Smart thermostats', 'Groene energie contract']
 }

 return insights[industry] || defaultInsight
}

function generateComplianceTimeline(companyInfo) {
 const currentYear = new Date().getFullYear()
 const timeline = {}
 
 // CSRD timeline
 if (companyInfo.employees > 250) {
   timeline['Q1 2025'] = ['CSRD gap analysis', 'Double materiality assessment', 'Data collection setup']
   timeline['Q2 2025'] = ['ESRS implementation', 'Third-party auditor selection']
   timeline['Q3 2025'] = ['Data verification', 'Report drafting']
   timeline['Q4 2025'] = ['Final CSRD report preparation']
   timeline['Q1 2026'] = ['CSRD report submission (maart 2025 deadline)']
 } else {
   timeline[currentYear] = ['Voluntary CSRD preparation', 'Basic carbon accounting']
   timeline[currentYear + 1] = ['Enhanced sustainability reporting']
 }

 // WPM timeline
 if (companyInfo.employees >= 100) {
   timeline['Q1 2025'] = [...(timeline['Q1 2025'] || []), 'WPM tracking system setup']
   timeline['Q2 2025'] = [...(timeline['Q2 2025'] || []), 'WPM first report (juni 2025 deadline)']
 }

 return timeline
}

function generateCarbonPricingAnalysis(totalEmissions) {
 return {
   current2024: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2024']),
   projected2025: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2025']),
   projected2030: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2030']),
   euEtsComparison: Math.round(totalEmissions * DUTCH_CARBON_PRICING['euETS2024']),
   escalationRisk: {
     annual: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024']) / 6),
     total: Math.round(totalEmissions * (DUTCH_CARBON_PRICING['2030'] - DUTCH_CARBON_PRICING['2024'])),
     percentage: Math.round(((DUTCH_CARBON_PRICING['2030'] / DUTCH_CARBON_PRICING['2024']) - 1) * 100)
   },
   mitigationValue: {
     per25PercentReduction: Math.round(totalEmissions * 0.25 * DUTCH_CARBON_PRICING['2030']),
     per50PercentReduction: Math.round(totalEmissions * 0.50 * DUTCH_CARBON_PRICING['2030']),
     per75PercentReduction: Math.round(totalEmissions * 0.75 * DUTCH_CARBON_PRICING['2030'])
   }
 }
}

// Final helper functions
function calculateCSRDReadiness(totalEmissions, employeeCount) {
 let score = 30
 if (totalEmissions > 0) score += 20
 if (employeeCount > 0) score += 15
 if (totalEmissions < 100) score += 10
 if (employeeCount > 50) score += 15
 if (employeeCount > 250) score += 10
 return Math.min(score, 100)
}

function calculateIndustryComparison(totalEmissions, employees, industry) {
 const emissionsPerEmployee = totalEmissions / employees
 const benchmark = DUTCH_INDUSTRY_BENCHMARKS[industry] || 5.8
 return Math.round((emissionsPerEmployee / benchmark) * 100)
}

function calculateConfidence(emissions, companyInfo) {
 let confidence = 0.75
 const dataPoints = Object.values(emissions.breakdown || {}).filter(val => val > 0).length
 confidence += Math.min(dataPoints * 0.04, 0.20)
 if (companyInfo.employees > 50) confidence += 0.05
 if (companyInfo.employees > 200) confidence += 0.05
 if (emissions.total > 0) confidence += 0.05
 return Math.min(confidence, 0.95)
}

// Clean AI response helper
function cleanAIResponse(text) {
 if (!text || typeof text !== 'string') return ''
 
 return text
   .replace(/^\s+|\s+$/g, '') // Trim whitespace
   .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean multiple newlines
   .replace(/(.)\1{4,}/g, '$1$1$1') // Remove excessive repetition
   .slice(0, 2000) // Limit length
}
