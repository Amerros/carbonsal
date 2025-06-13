import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

// Real emission factors (kg CO2 per unit) - Nederlandse data
const EMISSION_FACTORS = {
  electricity: 0.379, // kg CO2 per kWh (NL grid mix 2024)
  gas: 1.884, // kg CO2 per m³ (natural gas)
  heating: 0.379, // kg CO2 per kWh
  carFleet: 0.184, // kg CO2 per km (average EU)
  publicTransport: 0.089, // kg CO2 per km
  businessTravel: 0.255, // kg CO2 per km (flights)
  waste: 0.469, // kg CO2 per kg waste
  water: 0.298, // kg CO2 per m³
  paper: 0.921, // kg CO2 per kg
  plastic: 1.967, // kg CO2 per kg
  metal: 1.467, // kg CO2 per kg
}

// Industry benchmarks (tons CO2 per employee per year) - Nederlandse data
const INDUSTRY_BENCHMARKS = {
  'Technologie': 3.8,
  'Productie': 9.2,
  'Retail': 4.1,
  'Financiële Diensten': 2.7,
  'Gezondheidszorg': 5.4,
  'Onderwijs': 3.1,
  'Transport & Logistiek': 14.2,
  'Bouw': 11.1,
  'Anders': 5.8
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
    const recommendations = generateRecommendations(emissions, totalEmissionsTons, data.industry)

    // Calculate cost savings potential
    const costSavings = calculateCostSavings(emissions, totalEmissionsTons)

    // Generate monthly projections
    const monthlyProjections = generateMonthlyProjections(totalEmissionsTons)

    // Create result object
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
  const recycling = (parseFloat(waste.recycling) || 0) * EMISSION_FACTORS.waste * 0.2 // 80% reduction for recycling
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

function generateRecommendations(emissions, totalEmissions, industry) {
  const recommendations = []

  // Energy recommendations
  if (emissions.energy > totalEmissions * 1000 * 0.3) {
    recommendations.push({
      category: 'Energy',
      action: 'Overstap naar 100% groene energie',
      impact: 'Hoog',
      savings: Math.round(emissions.energy * 0.8 / 10) / 100, // tons CO2
      cost: '€2,000 - €4,000',
      paybackMonths: 15,
      priority: 1
    })
  }

  // Transport recommendations
  if (emissions.transport > totalEmissions * 1000 * 0.25) {
    recommendations.push({
      category: 'Transport',
      action: 'Elektrische bedrijfswagens implementeren',
      impact: 'Hoog',
      savings: Math.round(emissions.transport * 0.7 / 10) / 100,
      cost: '€20,000 - €40,000',
      paybackMonths: 36,
      priority: 2
    })
  }

  // Waste recommendations
  if (emissions.waste > totalEmissions * 1000 * 0.1) {
    recommendations.push({
      category: 'Waste',
      action: 'Circulair afvalmanagement programma',
      impact: 'Medium',
      savings: Math.round(emissions.waste * 0.6 / 10) / 100,
      cost: '€1,500 - €3,500',
      paybackMonths: 18,
      priority: 3
    })
  }

  // Industry-specific recommendations
  if (industry === 'Technologie') {
    recommendations.push({
      category: 'IT Infrastructure',
      action: 'Cloud optimalisatie en server consolidatie',
      impact: 'Medium',
      savings: Math.round(totalEmissions * 0.12 * 100) / 100,
      cost: '€5,000 - €12,000',
      paybackMonths: 24,
      priority: 4
    })
  }

  // Always include efficiency recommendation
  recommendations.push({
    category: 'Efficiency',
    action: 'Smart building automation systeem',
    impact: 'Medium',
    savings: Math.round(totalEmissions * 0.18 * 100) / 100,
    cost: '€8,000 - €18,000',
    paybackMonths: 30,
    priority: 5
  })

  return recommendations.slice(0, 5) // Top 5 recommendations
}

function calculateCostSavings(emissions, totalEmissions) {
  const carbonPrice = 95 // €95 per ton CO2 (current EU ETS price)
  const energyCost = 0.28 // €0.28 per kWh (NL average)
  const fuelCost = 1.85 // €1.85 per liter

  const potentialReduction = totalEmissions * 0.45 // 45% reduction potential
  const carbonSavings = potentialReduction * carbonPrice

  // Energy cost savings
  const energySavings = (emissions.energy / EMISSION_FACTORS.electricity) * energyCost * 0.35

  // Transport cost savings
  const transportSavings = (emissions.transport / EMISSION_FACTORS.carFleet) * 0.12 * fuelCost * 0.6

  // Waste cost savings
  const wasteSavings = (emissions.waste / EMISSION_FACTORS.waste) * 0.15 * 0.5

  return {
    total: Math.round(carbonSavings + energySavings + transportSavings + wasteSavings),
    carbon: Math.round(carbonSavings),
    energy: Math.round(energySavings),
    transport: Math.round(transportSavings),
    waste: Math.round(wasteSavings),
    timeline: '12-18 months'
  }
}

function generateMonthlyProjections(totalEmissions) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return months.map((month, index) => {
    // Add seasonal variation
    const seasonalFactor = 1 + 0.15 * Math.sin((index - 2) * Math.PI / 6)
    const businessFactor = 0.85 + Math.random() * 0.3 // Business variation
    const current = totalEmissions * seasonalFactor * businessFactor
    const optimized = current * 0.65 // 35% reduction target
    
    return {
      month,
      current: Math.round(current * 100) / 100,
      optimized: Math.round(optimized * 100) / 100,
      savings: Math.round((current - optimized) * 100) / 100
    }
  })
}
