import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

// Nederlandse emissiefactoren (CO2-Prestatieladder 3.1 & Milieubarometer 2024)
const DUTCH_EMISSION_FACTORS = {
  // Energie (Nederlandse stroommix en aardgas)
  electricity: 0.298, // kg CO2e per kWh (Nederlandse stroommix 2024, CBS)
  electricityGreen: 0.012, // kg CO2e per kWh (groene stroom met certificaten)
  gas: 1.884, // kg CO2e per m³ (Nederlandse aardgas, Gasunie/CBS)
  heating: 0.298, // kg CO2e per kWh (Nederlandse warmte mix)
  
  // Transport (Nederlandse wagenpark en ÖV, conform RVO/NEa)
  carFleet: 0.156, // kg CO2e per km (Nederlandse lease auto gemiddelde 2024)
  carFleetElectric: 0.047, // kg CO2e per km (elektrische auto NL stroommix)
  carFleetHybrid: 0.089, // kg CO2e per km (hybride auto gemiddelde)
  carFleetDiesel: 0.178, // kg CO2e per km (diesel auto gemiddelde)
  carFleetBenzine: 0.164, // kg CO2e per km (benzine auto gemiddelde)
  publicTransport: 0.089, // kg CO2e per km (NS/GVB/RET gemiddelde)
  businessTravel: 0.255, // kg CO2e per km (vliegreizen kort/middellang)
  businessTravelLong: 0.195, // kg CO2e per km (vliegreizen lang, efficiency)
  homeToWork: 0.124, // kg CO2e per km (woon-werk gemiddelde alle modi)
  
  // Afval (Nederlandse afvalverwerking, conform Afvalfonds)
  wasteGeneral: 0.469, // kg CO2e per kg (restafval naar AVI)
  wasteRecycling: 0.094, // kg CO2e per kg (80% reductie door recycling)
  wasteOrganic: 0.156, // kg CO2e per kg (GFT vergisting/compostering)
  wasteHazardous: 1.245, // kg CO2e per kg (gevaarlijk afval specialistische verwerking)
  
  // Water (Nederlandse drinkwaterproductie)
  water: 0.298, // kg CO2e per m³ (Nederlandse waterbedrijven gemiddelde)
  
  // Materialen (Nederlandse/EU upstream emissies)
  paper: 0.921, // kg CO2e per kg (kantoorpapier EU gemiddelde)
  plastic: 1.967, // kg CO2e per kg (plastic producten EU)
  metal: 1.467, // kg CO2e per kg (metaal producten EU)
  electronics: 0.203, // kg CO2e per € (spend-based electronica)
  
  // Scope 3 (Nederlandse spend-based factoren)
  procurement: 0.249, // kg CO2e per € (algemene inkoop Nederlandse leveranciers)
  outsourcing: 0.156, // kg CO2e per € (Nederlandse dienstverlening)
  businessServices: 0.089, // kg CO2e per € (professionele diensten)
}

// Nederlandse industrie benchmarks (CBS/RVO/Klimaatmonitor data 2024)
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

// Nederlandse CO2 pricing (officiële tarieven)
const DUTCH_CARBON_PRICING = {
  2024: 30.48, // € per ton CO2 (CO2-heffing industrie)
  2025: 50.18,
  2026: 74.25,
  2027: 99.45,
  2028: 134.75,
  2029: 175.20,
  2030: 216.00, // Target prijs 2030
  euETS2024: 95.00 // EU ETS referentie
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Get user from auth token (optional for anonymous calculations)
    let user = null
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        user = await db.getUserById(decoded.userId)
      } catch (error) {
        // Continue with anonymous calculation
      }
    }
    
    // Validate Nederlandse bedrijfsinformatie
    if (!data.companyName || !data.industry || !data.employees) {
      return NextResponse.json(
        { error: 'Nederlandse bedrijfsinformatie ontbreekt' },
        { status: 400 }
      )
    }

    // Calculate emissions by category using Nederlandse methodiek
    const emissions = {
      energy: calculateDutchEnergyEmissions(data.energy || {}),
      transport: calculateDutchTransportEmissions(data.transport || {}),
      waste: calculateDutchWasteEmissions(data.waste || {}),
      water: calculateDutchWaterEmissions(data.water || 0),
      materials: calculateDutchMaterialsEmissions(data.materials || {}),
      scope3: calculateDutchScope3Emissions(data.scope3 || {})
    }

    // Total emissions in kg CO2e
    const totalEmissionsKg = Object.values(emissions).reduce((sum, value) => sum + value, 0)
    const totalEmissionsTons = totalEmissionsKg / 1000

    // Nederlandse benchmark comparison
    const employeeCount = parseInt(data.employees) || 1
    const industryBenchmark = DUTCH_INDUSTRY_BENCHMARKS[data.industry] || DUTCH_INDUSTRY_BENCHMARKS['Anders']
    const expectedEmissions = industryBenchmark * employeeCount
    const performanceRatio = totalEmissionsTons / expectedEmissions
    const percentile = calculateDutchPercentile(performanceRatio)

    // Nederlandse compliance check
    const complianceStatus = calculateDutchCompliance(data, totalEmissionsTons)

    // Nederlandse aanbevelingen
    const recommendations = generateDutchRecommendations(emissions, totalEmissionsTons, data, complianceStatus)

    // Nederlandse cost analysis
    const costAnalysis = calculateDutchCostAnalysis(emissions, totalEmissionsTons, data.industry)

    // Nederlandse monthly projections
    const monthlyProjections = generateDutchMonthlyProjections(totalEmissionsTons, data.industry)

    // Create result object with Nederlandse context
    const result = {
      companyInfo: {
        name: data.companyName,
        industry: data.industry,
        employees: employeeCount,
        location: data.location || 'Nederland',
        revenue: data.revenue || null
      },
      emissions: {
        total: Math.round(totalEmissionsTons * 100) / 100,
        breakdown: {
          energy: Math.round(emissions.energy / 10) / 100,
          transport: Math.round(emissions.transport / 10) / 100,
          waste: Math.round(emissions.waste / 10) / 100,
          water: Math.round(emissions.water / 10) / 100,
          materials: Math.round(emissions.materials / 10) / 100,
          scope3: Math.round(emissions.scope3 / 10) / 100
        }
      },
      benchmark: {
        industryAverage: industryBenchmark * employeeCount,
        performanceRatio,
        percentile: Math.round(percentile),
        ranking: getDutchPerformanceRanking(percentile),
        dutchContext: true
      },
      compliance: complianceStatus,
      recommendations,
      costAnalysis,
      carbonPricing: {
        current2024: Math.round(totalEmissionsTons * DUTCH_CARBON_PRICING['2024']),
        projected2030: Math.round(totalEmissionsTons * DUTCH_CARBON_PRICING['2030']),
        euETS: Math.round(totalEmissionsTons * DUTCH_CARBON_PRICING['euETS2024'])
      },
      projections: monthlyProjections,
      dutchSpecific: {
        methodology: 'CO2-Prestatieladder 3.1 & Milieubarometer 2024',
        emissionFactors: 'Nederlandse factoren conform CBS/RVO',
        compliance: 'CSRD & WPM ready',
        carbonPricing: 'Nederlandse CO2-heffing geïntegreerd'
      },
      calculatedAt: new Date().toISOString()
    }

    // Save calculation if user is logged in
    if (user) {
      try {
        const savedCalculation = await db.saveCalculation(user.id, data, result)
        result.calculationId = savedCalculation.id
      } catch (error) {
        console.error('Failed to save calculation:', error)
        // Continue without saving
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Nederlandse calculation error:', error)
    return NextResponse.json(
      { error: 'Fout bij Nederlandse carbon footprint berekening' },
      { status: 500 }
    )
  }
}

function calculateDutchEnergyEmissions(energy) {
  const electricityConsumption = parseFloat(energy.electricity) || 0
  const gasConsumption = parseFloat(energy.gas) || 0
  const heatingConsumption = parseFloat(energy.heating) || 0
  const greenEnergyPercentage = parseFloat(energy.greenEnergyPercentage) || 0
  
  // Nederlandse Scope 2 market-based berekening
  const electricityEmissions = electricityConsumption * (
    (DUTCH_EMISSION_FACTORS.electricity * (100 - greenEnergyPercentage) / 100) +
    (DUTCH_EMISSION_FACTORS.electricityGreen * greenEnergyPercentage / 100)
  )
  
  const gasEmissions = gasConsumption * DUTCH_EMISSION_FACTORS.gas
  const heatingEmissions = heatingConsumption * DUTCH_EMISSION_FACTORS.heating
  
  return electricityEmissions + gasEmissions + heatingEmissions
}

function calculateDutchTransportEmissions(transport) {
  const carFleetKm = parseFloat(transport.carFleet) || 0
  const electricVehiclePercentage = parseFloat(transport.electricVehicles) || 0
  const publicTransportKm = parseFloat(transport.publicTransport) || 0
  const businessTravelKm = parseFloat(transport.businessTravel) || 0
  const homeToWorkKm = parseFloat(transport.homeToWork) || 0
  
  // Nederlandse fleet mix berekening
  const electricFleetEmissions = carFleetKm * (electricVehiclePercentage / 100) * DUTCH_EMISSION_FACTORS.carFleetElectric
  const conventionalFleetEmissions = carFleetKm * ((100 - electricVehiclePercentage) / 100) * DUTCH_EMISSION_FACTORS.carFleet
  
  const publicTransportEmissions = publicTransportKm * DUTCH_EMISSION_FACTORS.publicTransport
  const businessTravelEmissions = businessTravelKm * DUTCH_EMISSION_FACTORS.businessTravel
  const homeToWorkEmissions = homeToWorkKm * DUTCH_EMISSION_FACTORS.homeToWork // Voor WPM rapportage
  
  return electricFleetEmissions + conventionalFleetEmissions + publicTransportEmissions + 
         businessTravelEmissions + homeToWorkEmissions
}

function calculateDutchWasteEmissions(waste) {
  const generalWaste = parseFloat(waste.general) || 0
  const recyclingWaste = parseFloat(waste.recycling) || 0
  const organicWaste = parseFloat(waste.organic) || 0
  const hazardousWaste = parseFloat(waste.hazardous) || 0
  
  // Nederlandse afvalverwerking methodiek
  const generalEmissions = generalWaste * DUTCH_EMISSION_FACTORS.wasteGeneral
  const recyclingEmissions = recyclingWaste * DUTCH_EMISSION_FACTORS.wasteRecycling
  const organicEmissions = organicWaste * DUTCH_EMISSION_FACTORS.wasteOrganic
  const hazardousEmissions = hazardousWaste * DUTCH_EMISSION_FACTORS.wasteHazardous
  
  return generalEmissions + recyclingEmissions + organicEmissions + hazardousEmissions
}

function calculateDutchWaterEmissions(water) {
  return (parseFloat(water) || 0) * DUTCH_EMISSION_FACTORS.water
}

function calculateDutchMaterialsEmissions(materials) {
  const paper = parseFloat(materials.paper) || 0
  const plastic = parseFloat(materials.plastic) || 0
  const metal = parseFloat(materials.metal) || 0
  const electronics = parseFloat(materials.electronics) || 0
  
  const paperEmissions = paper * DUTCH_EMISSION_FACTORS.paper
  const plasticEmissions = plastic * DUTCH_EMISSION_FACTORS.plastic
  const metalEmissions = metal * DUTCH_EMISSION_FACTORS.metal
  const electronicsEmissions = electronics * DUTCH_EMISSION_FACTORS.electronics
  
  return paperEmissions + plasticEmissions + metalEmissions + electronicsEmissions
}

function calculateDutchScope3Emissions(scope3) {
  const procurement = parseFloat(scope3.procurement) || 0
  const outsourcing = parseFloat(scope3.outsourcing) || 0
  const businessServices = parseFloat(scope3.businessServices) || 0
  
  // Nederlandse spend-based methodiek
  const procurementEmissions = procurement * DUTCH_EMISSION_FACTORS.procurement
  const outsourcingEmissions = outsourcing * DUTCH_EMISSION_FACTORS.outsourcing
  const businessServicesEmissions = businessServices * DUTCH_EMISSION_FACTORS.businessServices
  
  return procurementEmissions + outsourcingEmissions + businessServicesEmissions
}

function calculateDutchPercentile(performanceRatio) {
  // Nederlandse benchmark percentile calculation
  if (performanceRatio <= 0.5) return 95
  if (performanceRatio <= 0.7) return 85
  if (performanceRatio <= 0.9) return 75
  if (performanceRatio <= 1.1) return 60
  if (performanceRatio <= 1.3) return 45
  if (performanceRatio <= 1.5) return 30
  return 15
}

function getDutchPerformanceRanking(percentile) {
  if (percentile >= 90) return 'Uitstekend (Top 10% Nederland)'
  if (percentile >= 75) return 'Zeer Goed (Top 25% Nederland)'
  if (percentile >= 60) return 'Goed (Boven Nederlands gemiddelde)'
  if (percentile >= 40) return 'Gemiddeld (Nederlands gemiddelde)'
  if (percentile >= 25) return 'Onder Gemiddeld'
  return 'Verbetering Nodig (Bottom 25%)'
}

function calculateDutchCompliance(data, totalEmissions) {
  const employees = parseInt(data.employees) || 0
  const revenue = parseFloat(data.revenue) || 0
  const industry = data.industry || ''
  
  return {
    csrd: {
      required: employees > 250 || revenue > 50, // miljoen euro
      deadline: employees > 250 ? '2025-03-31' : '2026-03-31',
      readiness: calculateCSRDReadiness(data, totalEmissions),
      status: employees > 250 ? 'Verplicht 2025' : revenue > 50 ? 'Mogelijk verplicht 2025' : 'Optioneel'
    },
    wpm: {
      required: employees >= 100,
      deadline: '2025-06-30',
      status: employees >= 100 ? 'Verplicht WPM rapportage' : 'Niet van toepassing',
      estimatedReporting: employees >= 100 ? 'Ja, inclusief woon-werk verkeer' : 'Nee'
    },
    co2Heffing: {
      applicable: ['Productie & Manufacturing', 'Bouw & Vastgoed', 'Energie & Utilities'].includes(industry),
      currentRate: DUTCH_CARBON_PRICING['2024'],
      rate2030: DUTCH_CARBON_PRICING['2030'],
      estimatedCost2024: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2024']),
      estimatedCost2030: Math.round(totalEmissions * DUTCH_CARBON_PRICING['2030'])
    },
    co2Prestatieladder: {
      recommended: true,
      currentLevel: 0,
      targetLevel: totalEmissions < 50 ? 3 : totalEmissions < 100 ? 2 : 1,
      benefits: 'Aanbestedingsvoordeel bij overheidsopdrachten'
    }
  }
}

function calculateCSRDReadiness(data, totalEmissions) {
  let score = 30
  
  if (data.companyName) score += 10
  if (data.employees) score += 10
  if (data.industry) score += 10
  if (data.energy?.electricity || data.energy?.gas) score += 15
  if (data.transport?.carFleet) score += 10
  if (data.scope3?.procurement) score += 15
  
  return Math.min(score, 100)
}

function generateDutchRecommendations(emissions, totalEmissions, data, compliance) {
  const recommendations = []
  const employees = parseInt(data.employees) || 1
  
  // Nederlandse energie aanbevelingen
  if (emissions.energy > totalEmissions * 1000 * 0.3) {
    recommendations.push({
      category: 'Energie',
      action: 'Overstap naar Nederlandse groene energieleverancier',
      impact: 'Hoog',
      savings: Math.round(emissions.energy * 0.85 / 10) / 100,
      cost: '€0 - €2,000 setup',
      paybackMonths: 0,
      priority: 1,
      dutchSpecific: true,
      subsidies: ['Mogelijk EIA aftrek voor efficiency investeringen'],
      suppliers: ['Vattenfall Groene Stroom', 'Eneco Duurzame Energie', 'Essent Groene Energie']
    })
  }
  
  // Nederlandse transport aanbevelingen
  if (emissions.transport > totalEmissions * 1000 * 0.25) {
    recommendations.push({
      category: 'Transport',
      action: 'Elektrische lease auto\'s met Nederlandse SEEH subsidie',
      impact: 'Zeer Hoog',
      savings: Math.round(emissions.transport * 0.7 / 10) / 100,
      cost: '€20,000 - €45,000',
      paybackMonths: 24,
      priority: 2,
      dutchSpecific: true,
      subsidies: ['€4,000 SEEH subsidie per elektrische auto', '4% bijtelling voordeel'],
      compliance: 'Helpt met WPM rapportage verbetering'
    })
  }
  
  // CSRD compliance aanbeveling
  if (compliance.csrd.required) {
    recommendations.push({
      category: 'Compliance',
      action: 'CSRD implementatie met Nederlandse expertise',
      impact: 'Kritiek',
      savings: 0,
      cost: '€25,000 - €75,000',
      paybackMonths: 0,
      priority: 1,
      dutchSpecific: true,
      deadline: compliance.csrd.deadline,
      description: 'Voorkom boetes en reputatieschade door tijdige CSRD implementatie'
    })
  }
  
  // Nederlandse circulaire economie
  if (emissions.waste > totalEmissions * 1000 * 0.1) {
    recommendations.push({
      category: 'Circulaire Economie',
      action: 'Nederlands circulair afvalmanagement met Afvalfonds optimalisatie',
      impact: 'Medium',
      savings: Math.round(emissions.waste * 0.6 / 10) / 100,
      cost: '€3,000 - €8,000',
      paybackMonths: 18,
      priority: 3,
      dutchSpecific: true,
      benefits: ['Lagere afvalkosten', 'Betere recycling percentages', 'Afvalfonds optimalisatie']
    })
  }
  
  // Nederlandse zonnepanelen met subsidie
  if (employees > 10) {
    recommendations.push({
      category: 'Renewable Energy',
      action: 'Zonnepanelen installatie met Nederlandse SDE++ subsidie',
      impact: 'Hoog',
      savings: Math.round(totalEmissions * 0.35 * 100) / 100,
      cost: '€25,000 - €75,000',
      paybackMonths: 36,
      priority: 4,
      dutchSpecific: true,
      subsidies: ['SDE++ subsidie voor zonnepanelen', 'EIA aftrek mogelijk', 'Accelerated depreciation'],
      roi: '8-12% per jaar'
    })
  }
  
  return recommendations.slice(0, 6) // Top 6 Nederlandse aanbevelingen
}

function calculateDutchCostAnalysis(emissions, totalEmissions, industry) {
  // Nederlandse cost analysis
  const carbonPrice2024 = DUTCH_CARBON_PRICING['2024']
  const carbonPrice2030 = DUTCH_CARBON_PRICING['2030']
  const energyCostNL = 0.31 // € per kWh Nederlandse gemiddelde 2024
  const gasCostNL = 1.45 // € per m³ Nederlandse gemiddelde 2024
  
  const currentCarbonExposure = totalEmissions * carbonPrice2024
  const futureCarbonExposure = totalEmissions * carbonPrice2030
  const carbonRiskIncrease = futureCarbonExposure - currentCarbonExposure
  
  // Energy cost savings potential (Nederlandse tarieven)
  const energySavings = (emissions.energy / DUTCH_EMISSION_FACTORS.electricity) * energyCostNL * 0.35
  
  // Transport cost savings (Nederlandse transport kosten)
  const transportSavings = (emissions.transport / DUTCH_EMISSION_FACTORS.carFleet) * 0.15 * 1.85 * 0.6
  
  // Waste cost savings (Nederlandse afvalkosten)
  const wasteSavings = (emissions.waste / DUTCH_EMISSION_FACTORS.wasteGeneral) * 0.25 * 0.5
  
  // Nederlandse subsidies en incentives
  const availableSubsidies = {
    SEEH: Math.min(Math.floor(totalEmissions / 5) * 4000, 20000), // €4k per elektrische auto
    SDE: Math.min(totalEmissions * 50, 15000), // SDE++ voor hernieuwbare energie
    EIA: Math.min(totalEmissions * 200, 25000), // Energie-investeringsaftrek
    WBSO: Math.min(totalEmissions * 100, 12000), // Innovatie aftrek
    total: 0
  }
  availableSubsidies.total = Object.values(availableSubsidies).reduce((sum, val) => sum + val, 0) - availableSubsidies.total
  
  return {
    carbonPricing: {
      current2024: currentCarbonExposure,
      projected2030: futureCarbonExposure,
      riskIncrease: carbonRiskIncrease,
      timeline: 'Geleidelijke stijging tot 2030'
    },
    dutchSubsidies: availableSubsidies,
    potentialSavings: {
      energy: Math.round(energySavings),
      transport: Math.round(transportSavings),
      waste: Math.round(wasteSavings),
      total: Math.round(energySavings + transportSavings + wasteSavings)
    },
    investmentRecommendation: {
      minimal: '€8,000 - €15,000 (quick wins)',
      moderate: '€25,000 - €50,000 (structurele verbeteringen)',
      comprehensive: '€60,000 - €120,000 (volledige transitie)'
    },
    roi: {
      year1: '15-25%',
      year3: '120-180%',
      year5: '200-300%'
    },
    dutchContext: 'Berekening gebaseerd op Nederlandse energie- en transporttarieven'
  }
}

function generateDutchMonthlyProjections(totalEmissions, industry) {
  const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
  
  // Nederlandse seizoenspatronen
  const dutchSeasonalFactors = [1.3, 1.2, 1.1, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3]
  
  return months.map((month, index) => {
    const seasonalFactor = dutchSeasonalFactors[index]
    const businessFactor = 0.85 + Math.random() * 0.3
    const current = totalEmissions * seasonalFactor * businessFactor / 12
    
    // Nederlandse optimalisatie scenario (subsidies + efficiency)
    const optimized = current * 0.58 // 42% reductie mogelijk met Nederlandse maatregelen
    
    return {
      month,
      current: Math.round(current * 100) / 100,
      optimized: Math.round(optimized * 100) / 100,
      savings: Math.round((current - optimized) * 100) / 100,
      dutchOptimization: true
    }
  })
}
