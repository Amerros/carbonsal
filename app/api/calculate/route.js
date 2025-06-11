import { NextResponse } from 'next/server'

// Carbon calculation coefficients (in kg CO2 per unit)
const EMISSION_FACTORS = {
  electricity: 0.5, // kg CO2 per kWh (NL grid mix)
  gas: 2.3, // kg CO2 per m³
  heating: 0.4, // kg CO2 per kWh
  carFleet: 0.21, // kg CO2 per km (average)
  publicTransport: 0.05, // kg CO2 per euro spent
  businessTravel: 0.15, // kg CO2 per euro spent
  waste: 0.8, // kg CO2 per kg waste
  water: 0.3, // kg CO2 per m³
  paper: 1.2, // kg CO2 per kg
  plastic: 2.1, // kg CO2 per kg
  metal: 1.8, // kg CO2 per kg
}

// Industry benchmarks (tons CO2 per employee per year)
const INDUSTRY_BENCHMARKS = {
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

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.companyName || !data.industry || !data.employees) {
      return NextResponse.json(
        { error: 'Missing required company information' },
        { status: 400 }
      )
    }

    // Calculate emissions by category
    const emissions = {
      energy: calculateEnergyEmissions(data.energy || {}),
      transport: calculateTransportEmissions(data.transport || {}),
      waste: calculateWasteEmissions(data.waste || {}),
      water: calculateWaterEmissions(data.water || 0),
      materials: calculateMaterialsEmissions(data.materials || {})
    }

    // Total emissions in kg CO2
    const totalEmissionsKg = Object.values(emissions).reduce((sum, value) => sum + value, 0)
    const totalEmissionsTons = totalEmissionsKg / 1000

    // Calculate benchmark comparison
    const employeeCount = parseInt(data.employees) || 1
    const industryBenchmark = INDUSTRY_BENCHMARKS[data.industry] || INDUSTRY_BENCHMARKS['Anders']
    const expectedEmissions = industryBenchmark * employeeCount
    const performanceRatio = totalEmissionsTons / expectedEmissions
    const percentile = calculatePercentile(performanceRatio)

    // Generate recommendations
    const recommendations = generateRecommendations(emissions, totalEmissionsTons)

    // Calculate cost savings potential
    const costSavings = calculateCostSavings(emissions, totalEmissionsTons)

    // Generate monthly projections
    const monthlyProjections = generateMonthlyProjections(totalEmissionsTons)

    // Create response
    const result = {
      companyInfo: {
        name: data.companyName,
        industry: data.industry,
        employees: employeeCount
      },
      emissions: {
        total: Math.round(totalEmissionsTons * 100) / 100,
        breakdown: {
          energy: Math.round(emissions.energy / 10) / 100, // Convert to tons
          transport: Math.round(emissions.transport / 10) / 100,
          waste: Math.round(emissions.waste / 10) / 100,
          water: Math.round(emissions.water / 10) / 100,
          materials: Math.round(emissions.materials / 10) / 100
        }
      },
      benchmark: {
        industryAverage: industryBenchmark * employeeCount,
        performanceRatio,
        percentile: Math.round(percentile),
        ranking: getPerformanceRanking(percentile)
      },
      recommendations,
      costSavings,
      projections: monthlyProjections,
      calculatedAt: new Date().toISOString()
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during calculation' },
      { status: 500 }
    )
  }
}

function calculateEnergyEmissions(energy) {
  const electricity = (parseFloat(energy.electricity) || 0) * EMISSION_FACTORS.electricity
  const gas = (parseFloat(energy.gas) || 0) * EMISSION_FACTORS.gas
  const heating = (parseFloat(energy.heating) || 0) * EMISSION_FACTORS.heating
  return electricity + gas + heating
}

function calculateTransportEmissions(transport) {
  const carFleet = (parseFloat(transport.carFleet) || 0) * EMISSION_FACTORS.carFleet
  const publicTransport = (parseFloat(transport.publicTransport) || 0) * EMISSION_FACTORS.publicTransport
  const businessTravel = (parseFloat(transport.businessTravel) || 0) * EMISSION_FACTORS.businessTravel
  return carFleet + publicTransport + businessTravel
}

function calculateWasteEmissions(waste) {
  const general = (parseFloat(waste.general) || 0) * EMISSION_FACTORS.waste
  const recycling = (parseFloat(waste.recycling) || 0) * EMISSION_FACTORS.waste * 0.3 // 70% reduction for recycling
  return general + recycling
}

function calculateWaterEmissions(water) {
  return (parseFloat(water) || 0) * EMISSION_FACTORS.water
}

function calculateMaterialsEmissions(materials) {
  const paper = (parseFloat(materials.paper) || 0) * EMISSION_FACTORS.paper
  const plastic = (parseFloat(materials.plastic) || 0) * EMISSION_FACTORS.plastic
  const metal = (parseFloat(materials.metal) || 0) * EMISSION_FACTORS.metal
  return paper + plastic + metal
}

function calculatePercentile(performanceRatio) {
  // Convert performance ratio to percentile (lower emissions = higher percentile)
  if (performanceRatio <= 0.5) return 95
  if (performanceRatio <= 0.7) return 85
  if (performanceRatio <= 0.9) return 75
  if (performanceRatio <= 1.1) return 60
  if (performanceRatio <= 1.3) return 45
  if (performanceRatio <= 1.5) return 30
  return 15
}

function getPerformanceRanking(percentile) {
  if (percentile >= 90) return 'Excellent'
  if (percentile >= 75) return 'Very Good'
  if (percentile >= 60) return 'Good'
  if (percentile >= 40) return 'Average'
  if (percentile >= 25) return 'Below Average'
  return 'Needs Improvement'
}

function generateRecommendations(emissions, totalEmissions) {
  const recommendations = []

  // Energy recommendations
  if (emissions.energy > totalEmissions * 1000 * 0.4) {
    recommendations.push({
      category: 'Energy',
      action: 'Overstap naar 100% groene energie',
      impact: 'Hoog',
      savings: Math.round(emissions.energy * 0.7 / 10) / 100, // tons CO2
      cost: '€2,500 - €5,000',
      paybackMonths: 18
    })
  }

  // Transport recommendations
  if (emissions.transport > totalEmissions * 1000 * 0.3) {
    recommendations.push({
      category: 'Transport',
      action: 'Elektrische bedrijfswagens en fietsplan',
      impact: 'Hoog',
      savings: Math.round(emissions.transport * 0.6 / 10) / 100,
      cost: '€15,000 - €30,000',
      paybackMonths: 24
    })
  }

  // Waste recommendations
  if (emissions.waste > totalEmissions * 1000 * 0.1) {
    recommendations.push({
      category: 'Waste',
      action: 'Circulair afvalmanagement programma',
      impact: 'Medium',
      savings: Math.round(emissions.waste * 0.5 / 10) / 100,
      cost: '€1,200 - €3,000',
      paybackMonths: 12
    })
  }

  // Always include efficiency recommendation
  recommendations.push({
    category: 'Efficiency',
    action: 'Smart building automation systeem',
    impact: 'Medium',
    savings: Math.round(totalEmissions * 0.15 * 100) / 100,
    cost: '€8,000 - €15,000',
    paybackMonths: 30
  })

  return recommendations.slice(0, 4) // Limit to top 4
}

function calculateCostSavings(emissions, totalEmissions) {
  const carbonPrice = 85 // €85 per ton CO2
  const energyCost = 0.25 // €0.25 per kWh
  const fuelCost = 1.8 // €1.8 per liter

  const potentialReduction = totalEmissions * 0.4 // 40% reduction potential
  const carbonSavings = potentialReduction * carbonPrice

  // Energy cost savings (approximate)
  const energySavings = (emissions.energy / EMISSION_FACTORS.electricity) * energyCost * 0.3

  // Transport cost savings (approximate)
  const transportSavings = (emissions.transport / EMISSION_FACTORS.carFleet) * 0.08 * fuelCost * 0.5

  return {
    total: Math.round(carbonSavings + energySavings + transportSavings),
    carbon: Math.round(carbonSavings),
    energy: Math.round(energySavings),
    transport: Math.round(transportSavings),
    timeline: '12 months'
  }
}

function generateMonthlyProjections(totalEmissions) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return months.map((month, index) => {
    // Add seasonal variation
    const seasonalFactor = 1 + 0.2 * Math.sin((index - 2) * Math.PI / 6)
    const current = totalEmissions * seasonalFactor * (0.9 + Math.random() * 0.2)
    const optimized = current * 0.75 // 25% reduction target
    
    return {
      month,
      current: Math.round(current * 100) / 100,
      optimized: Math.round(optimized * 100) / 100,
      savings: Math.round((current - optimized) * 100) / 100
    }
  })
}
