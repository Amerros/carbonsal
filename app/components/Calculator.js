'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const Calculator = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    employees: '',
    energy: {
      electricity: '',
      gas: '',
      heating: ''
    },
    transport: {
      carFleet: '',
      publicTransport: '',
      businessTravel: ''
    },
    waste: {
      general: '',
      recycling: '',
      organic: ''
    },
    water: '',
    materials: {
      paper: '',
      plastic: '',
      metal: ''
    }
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const industries = [
    'Technologie', 'Productie', 'Retail', 'Financiële Diensten', 
    'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 'Bouw', 'Anders'
  ]

  const calculateFootprint = async () => {
    setIsCalculating(true)
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock calculation results
    const electricityFootprint = parseFloat(formData.energy.electricity || 0) * 0.5
    const gasFootprint = parseFloat(formData.energy.gas || 0) * 2.3
    const transportFootprint = parseFloat(formData.transport.carFleet || 0) * 2.1
    const wasteFootprint = parseFloat(formData.waste.general || 0) * 0.8
    
    const totalCO2 = electricityFootprint + gasFootprint + transportFootprint + wasteFootprint
    const costSavings = totalCO2 * 85 // €85 per ton CO2
    const benchmarkPercentile = Math.floor(Math.random() * 30) + 40 // 40-70th percentile
    
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      current: totalCO2 + (Math.random() - 0.5) * totalCO2 * 0.3,
      optimized: (totalCO2 + (Math.random() - 0.5) * totalCO2 * 0.3) * 0.7
    }))

    const breakdownData = [
      { name: 'Energie', value: electricityFootprint + gasFootprint, color: '#22c55e' },
      { name: 'Transport', value: transportFootprint, color: '#3b82f6' },
      { name: 'Afval', value: wasteFootprint, color: '#f59e0b' },
      { name: 'Overig', value: totalCO2 * 0.1, color: '#8b5cf6' }
    ]

    setResults({
      totalCO2: Math.round(totalCO2),
      costSavings: Math.round(costSavings),
      benchmarkPercentile,
      monthlyData,
      breakdownData,
      recommendations: [
        { action: 'Overstap naar groene energie', savings: Math.round(totalCO2 * 0.4), cost: '€2,500' },
        { action: 'Elektrische bedrijfswagens', savings: Math.round(totalCO2 * 0.25), cost: '€15,000' },
        { action: 'Verbeterde isolatie', savings: Math.round(totalCO2 * 0.15), cost: '€8,000' },
        { action: 'Afval reductie programma', savings: Math.round(totalCO2 * 0.1), cost: '€1,200' }
      ]
    })
    
    setIsCalculating(false)
    setShowResults(true)
  }

  const handleInputChange = (category, field, value) => {
    if (category) {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateFootprint()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Bedrijfsinformatie</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange(null, 'companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Voer bedrijfsnaam in"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Industrie</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange(null, 'industry', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                >
                  <option value="">Selecteer industrie</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Aantal medewerkers</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => handleInputChange(null, 'employees', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Energieverbruik (per jaar)</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Elektriciteit (kWh)</label>
                <input
                  type="number"
                  value={formData.energy.electricity}
                  onChange={(e) => handleInputChange('energy', 'electricity', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Gas (m³)</label>
                <input
                  type="number"
                  value={formData.energy.gas}
                  onChange={(e) => handleInputChange('energy', 'gas', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 15000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Verwarming (kWh)</label>
                <input
                  type="number"
                  value={formData.energy.heating}
                  onChange={(e) => handleInputChange('energy', 'heating', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 25000"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Transport (per jaar)</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfswagens (km)</label>
                <input
                  type="number"
                  value={formData.transport.carFleet}
                  onChange={(e) => handleInputChange('transport', 'carFleet', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 100000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Openbaar vervoer (€)</label>
                <input
                  type="number"
                  value={formData.transport.publicTransport}
                  onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 5000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Zakelijke reizen (€)</label>
                <input
                  type="number"
                  value={formData.transport.businessTravel}
                  onChange={(e) => handleInputChange('transport', 'businessTravel', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 15000"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Afval & Water (per jaar)</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Algemeen afval (kg)</label>
                <input
                  type="number"
                  value={formData.waste.general}
                  onChange={(e) => handleInputChange('waste', 'general', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 5000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Recycling (kg)</label>
                <input
                  type="number"
                  value={formData.waste.recycling}
                  onChange={(e) => handleInputChange('waste', 'recycling', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 2000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Waterverbruik (m³)</label>
                <input
                  type="number"
                  value={formData.water}
                  onChange={(e) => handleInputChange(null, 'water', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 1000"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Materialen (per jaar)</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Papier (kg)</label>
                <input
                  type="number"
                  value={formData.materials.paper}
                  onChange={(e) => handleInputChange('materials', 'paper', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Plastic (kg)</label>
                <input
                  type="number"
                  value={formData.materials.plastic}
                  onChange={(e) => handleInputChange('materials', 'plastic', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 200"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Metaal (kg)</label>
                <input
                  type="number"
                  value={formData.materials.metal}
                  onChange={(e) => handleInputChange('materials', 'metal', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 100"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Bevestig je gegevens</h3>
            <div className="glass-effect-dark rounded-lg p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Bedrijf:</span>
                  <span className="text-white ml-2">{formData.companyName || 'Niet ingevuld'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Industrie:</span>
                  <span className="text-white ml-2">{formData.industry || 'Niet ingevuld'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Medewerkers:</span>
                  <span className="text-white ml-2">{formData.employees || '0'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Elektriciteit:</span>
                  <span className="text-white ml-2">{formData.energy.electricity || '0'} kWh</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-600">
                <p className="text-gray-300 text-sm">
                  Door op "Bereken Footprint" te klikken, ga je akkoord met onze voorwaarden 
                  en krijg je een gratis basis rapport. Voor uitgebreide analyses en AI-insights 
                  kun je upgraden naar een premium plan.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showResults && results) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-effect rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Carbon Footprint Resultaten</h2>
                  <p className="text-gray-400">Jouw bedrijf: {formData.companyName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {results.totalCO2} ton
                </div>
                <div className="text-gray-300">CO2 per jaar</div>
              </div>
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  €{results.costSavings.toLocaleString()}
                </div>
                <div className="text-gray-300">Mogelijke besparing</div>
              </div>
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {results.benchmarkPercentile}e
                </div>
                <div className="text-gray-300">Percentiel (industrie)</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Maandelijkse Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={results.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={2} name="Huidig" />
                    <Line type="monotone" dataKey="optimized" stroke="#22c55e" strokeWidth={2} name="Geoptimaliseerd" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown Pie Chart */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">CO2 Verdeling</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={results.breakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {results.breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Aanbevelingen</h3>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <SparklesIcon className="w-5 h-5 text-primary-400" />
                      <span className="text-white">{rec.action}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">-{rec.savings} ton CO2</div>
                      <div className="text-gray-400 text-sm">Investering: {rec.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Dit is een gratis basis rapport</span>
              </div>
              <p className="text-gray-300 mb-6">
                Upgrade naar Premium voor gedetailleerde AI-analyses, compliance rapporten, 
                en maandelijkse monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="gradient-button px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Download Premium PDF
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="glass-effect px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Sluiten
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isCalculating) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 loading-spinner mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-white mb-2">Berekenen van jouw Carbon Footprint</h3>
          <p className="text-gray-400 mb-6">
            Onze AI analyseert jouw gegevens en vergelijkt deze met duizenden andere bedrijven...
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <div>✓ Energieverbruik analyseren</div>
            <div>✓ Transport impact berekenen</div>
            <div>✓ Benchmark vergelijking</div>
            <div className="text-primary-400">⟳ AI aanbevelingen genereren</div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <CalculatorIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Carbon Footprint Calculator</h2>
                <p className="text-gray-400">Stap {currentStep} van {totalSteps}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex justify-between">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 glass-effect rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Vorige</span>
            </motion.button>

            <motion.button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 gradient-button rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{currentStep === totalSteps ? 'Bereken Footprint' : 'Volgende'}</span>
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Calculator
