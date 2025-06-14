'use client'

import { useState } from 'react'
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
import { useAuth } from '../../lib/AuthContext'
import toast from 'react-hot-toast'

const Calculator = ({ onClose }) => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: user?.company_name || '',
    industry: user?.industry || '',
    employees: user?.employees || '',
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const industries = [
    'Technologie', 'Productie', 'Retail', 'Financiële Diensten', 
    'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 'Bouw', 'Anders'
  ]

  const calculateFootprint = async () => {
    setIsCalculating(true)
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Calculation failed')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
      toast.success('Carbon footprint berekend!')
      
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Er ging iets mis bij de berekening')
    } finally {
      setIsCalculating(false)
    }
  }

  const generatePDF = async () => {
  if (!results?.calculationId) {
    toast.error('Je moet eerst ingelogd zijn om een PDF te downloaden')
    return
  }

  setIsGeneratingPDF(true)
  
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        calculationId: results.calculationId,
        reportType: 'standard'
      })
    })

    if (!response.ok) {
      throw new Error('PDF generation failed')
    }

    // Get the PDF as a blob (binary data)
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `carbon-report-${results.companyInfo?.name || 'report'}-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success('PDF rapport gedownload!')
    
  } catch (error) {
    console.error('PDF error:', error)
    toast.error('Er ging iets mis bij het genereren van de PDF')
  } finally {
    setIsGeneratingPDF(false)
  }
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
                <label className="block text-gray-300 mb-2">Openbaar vervoer (km per jaar)</label>
                <input
                  type="number"
                  value={formData.transport.publicTransport}
                  onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 25000"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Zakelijke vliegreizen (km per jaar)</label>
                <input
                  type="number"
                  value={formData.transport.businessTravel}
                  onChange={(e) => handleInputChange('transport', 'businessTravel', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50000"
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
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-600">
                  <p className="text-yellow-400 text-sm">
                    💡 Log in om je berekening op te slaan en PDF rapporten te downloaden!
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showResults && results) {
    const breakdownData = Object.entries(results.emissions.breakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      color: {
        energy: '#22c55e',
        transport: '#3b82f6',
        waste: '#f59e0b',
        water: '#06b6d4',
        materials: '#8b5cf6'
      }[key] || '#6b7280'
    }))

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
                  <p className="text-gray-400">Jouw bedrijf: {results.companyInfo.name}</p>
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
                  {results.emissions.total} ton
                </div>
                <div className="text-gray-400 mb-4">CO2 Uitstoot per Jaar</div>
                <p className="text-sm text-gray-500">
                  Totale carbon footprint van je bedrijf
                </p>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {results.benchmark?.percentile || 0}%
                </div>
                <div className="text-gray-400 mb-4">Beter dan Gemiddelde</div>
                <p className="text-sm text-gray-500">
                  Vergeleken met {results.companyInfo.industry} sector
                </p>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  €{results.costSavings?.total?.toLocaleString() || 0}
                </div>
                <div className="text-gray-400 mb-4">Potentiële Besparing</div>
                <p className="text-sm text-gray-500">
                  Jaarlijkse kostenbesparing mogelijk
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Breakdown Chart */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Uitstoot per Categorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Projections */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Maandelijkse Projecties</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.projections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Huidige trend"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="optimized" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Met optimalisaties"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Top Aanbevelingen</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.recommendations.slice(0, 4).map((rec, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{rec.action}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.impact === 'Hoog' ? 'bg-red-500/20 text-red-400' :
                          rec.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {rec.impact}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>💰 Besparing: {rec.savings} ton CO2</p>
                        <p>💸 Kosten: {rec.cost}</p>
                        <p>⏱️ Terugverdientijd: {rec.paybackMonths} maanden</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated && results.calculationId && (
                <motion.button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center justify-center space-x-2 gradient-button px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>{isGeneratingPDF ? 'Genereren...' : 'Download PDF Rapport'}</span>
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setShowResults(false)}
                className="glass-effect px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Nieuwe Berekening
              </motion.button>
            </div>
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
        className="glass-effect rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                <p className="text-gray-400">Bereken de CO2 uitstoot van je bedrijf</p>
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

        {/* Progress Bar */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Stap {currentStep} van {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% compleet</span>
          </div>
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

        {/* Form Content */}
        <div className="p-6">
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

        {/* Navigation */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 glass-effect rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Vorige</span>
          </motion.button>

          <motion.button
            onClick={nextStep}
            disabled={isCalculating}
            className="flex items-center space-x-2 gradient-button px-6 py-3 rounded-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>
              {isCalculating ? 'Berekenen...' : currentStep === totalSteps ? 'Bereken' : 'Volgende'}
            </span>
            {!isCalculating && <ChevronRightIcon className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Calculator
