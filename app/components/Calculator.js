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
  ExclamationTriangleIcon,
  CreditCardIcon,
  EyeIcon,
  UserPlusIcon,
  BoltIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  GlobeEuropeAfricaIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts'
import { useAuth } from '../../lib/AuthContext'
import toast from 'react-hot-toast'

const Calculator = ({ onClose }) => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [guestCalculationUsed, setGuestCalculationUsed] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showOneTimePayment, setShowOneTimePayment] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    industry: user?.industry || '',
    employees: user?.employees || '',
    revenue: '',
    location: 'Nederland',
    energy: {
      electricity: '',
      gas: '',
      heating: '',
      greenEnergyPercentage: '0'
    },
    transport: {
      carFleet: '',
      electricVehicles: '0',
      publicTransport: '',
      businessTravel: '',
      homeToWork: ''
    },
    waste: {
      general: '',
      recycling: '',
      organic: '',
      hazardous: ''
    },
    water: '',
    materials: {
      paper: '',
      plastic: '',
      metal: '',
      electronics: ''
    },
    scope3: {
      procurement: '',
      outsourcing: '',
      businessServices: ''
    }
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const totalSteps = 8
  const progress = (currentStep / totalSteps) * 100

  const dutchIndustries = [
    'Technologie & Software', 'Productie & Manufacturing', 'Retail & E-commerce', 
    'Financiële Diensten', 'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 
    'Bouw & Vastgoed', 'Agri & Food', 'Energie & Utilities', 'Consultancy', 'Anders'
  ]

  const dutchCities = [
    'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Tilburg',
    'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Apeldoorn', 'Anders'
  ]

  const calculateFootprint = async () => {
    // Check gratis berekening voor guests
    if (!isAuthenticated) {
      const hasUsedFree = localStorage.getItem('carbon_comply_free_calculation_used')
      if (hasUsedFree) {
        setShowUpgradePrompt(true)
        return
      }
    }

    setIsCalculating(true)
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...formData,
          dutch: true,
          csrdCompliance: true
        })
      })

      if (!response.ok) {
        throw new Error('Calculation failed')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
      
      // Mark free calculation als gebruikt voor guests
      if (!isAuthenticated) {
        localStorage.setItem('carbon_comply_free_calculation_used', Date.now().toString())
        setGuestCalculationUsed(true)
      }
      
      toast.success('Nederlandse carbon footprint berekend!')
      
      // Auto-genereer AI insights voor authenticated users
      if (isAuthenticated) {
        await generateAIInsights(data)
      }
      
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Er ging iets mis bij de berekening')
    } finally {
      setIsCalculating(false)
    }
  }

  const generateAIInsights = async (calculationData) => {
    if (!isAuthenticated) {
      toast.error('Log in voor geavanceerde AI-insights met Nederlandse compliance analyse')
      return
    }

    setLoadingAI(true)
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          emissions: calculationData.emissions,
          companyInfo: calculationData.companyInfo,
          industry: calculationData.companyInfo.industry,
          goals: {
            targetReduction: 30,
            timeline: 24,
            csrdCompliance: true,
            dutchMarket: true
          }
        })
      })

      if (!response.ok) {
        throw new Error('AI insights generation failed')
      }

      const insights = await response.json()
      setAiInsights(insights.insights)
      toast.success('AI insights met Nederlandse compliance analyse gegenereerd!')
      
    } catch (error) {
      console.error('AI insights error:', error)
      toast.error('Er ging iets mis bij het genereren van AI insights')
    } finally {
      setLoadingAI(false)
    }
  }

  const generateProfessionalPDF = async () => {
    if (!results?.calculationId) {
      toast.error('Je moet eerst ingelogd zijn om een professioneel PDF rapport te downloaden')
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
          reportType: 'dutch_professional',
          includeCSRD: true,
          includeAIInsights: !!aiInsights,
          dutchCompliance: true
        })
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `Nederlandse-Carbon-Footprint-Rapport-${results.companyInfo?.name || 'rapport'}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Professioneel Nederlands carbon footprint rapport gedownload!')
      
    } catch (error) {
      console.error('PDF error:', error)
      toast.error('Er ging iets mis bij het genereren van de PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleOneTimePayment = async () => {
    try {
      const response = await fetch('/api/create-onetime-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          calculationData: {
            companyInfo: results.companyInfo,
            results: results,
            calculationId: results.calculationId || 'guest',
            dutch: true,
            csrdCompliance: true
          },
          customerEmail: '',
          customerName: '',
          companyName: results.companyInfo.name,
          reportType: 'dutch_professional_csrd'
        })
      })

      const data = await response.json()
      
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        toast.error('Er ging iets mis bij het starten van de betaling')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Er ging iets mis bij het betalingsproces')
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
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Nederlandse Bedrijfsinformatie</h3>
              <p className="text-gray-400">Conform CSRD en Nederlandse rapportagestandaarden</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange(null, 'companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Voer uw Nederlandse bedrijfsnaam in"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Industrie *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange(null, 'industry', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    required
                  >
                    <option value="">Selecteer industrie</option>
                    {dutchIndustries.map(industry => (
                      <option key={industry} value={industry} className="bg-gray-800">
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Locatie</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange(null, 'location', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  >
                    {dutchCities.map(city => (
                      <option key={city} value={city} className="bg-gray-800">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aantal medewerkers *</label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => handleInputChange(null, 'employees', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 50"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {parseInt(formData.employees) >= 100 ? '⚠️ WPM rapportage verplicht' : 
                     parseInt(formData.employees) >= 250 ? '🔴 CSRD rapportage verplicht' : '✅ Geen directe rapportageplicht'}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Jaaromzet (optioneel)</label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange(null, 'revenue', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="€ miljoen"
                  />
                  <p className="text-xs text-gray-400 mt-1">Voor CSRD compliance check</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Energieverbruik (Scope 1 & 2)</h3>
              <p className="text-gray-400">Nederlandse emissiefactoren conform CO2-Prestatieladder</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Elektriciteit verbruik (kWh/jaar)</label>
                <input
                  type="number"
                  value={formData.energy.electricity}
                  onChange={(e) => handleInputChange('energy', 'electricity', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50000"
                />
                <p className="text-xs text-gray-400 mt-1">Nederlandse stroommix: 0.298 kg CO2/kWh</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aardgas verbruik (m³/jaar)</label>
                  <input
                    type="number"
                    value={formData.energy.gas}
                    onChange={(e) => handleInputChange('energy', 'gas', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 15000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Nederlandse aardgas: 1.884 kg CO2/m³</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Groene energie percentage (%)</label>
                  <input
                    type="number"
                    value={formData.energy.greenEnergyPercentage}
                    onChange={(e) => handleInputChange('energy', 'greenEnergyPercentage', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="0-100%"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Voor Scope 2 market-based berekening</p>
                </div>
              </div>
            </div>
          </div>
        )

      // Continue with other steps...
      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stap {currentStep}</h3>
            <p className="text-gray-400">Deze stap wordt nog ontwikkeld...</p>
          </div>
        )
    }
  }

  // Upgrade Prompt voor guests die gratis berekening hebben gebruikt
  if (showUpgradePrompt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Gratis Nederlandse berekening gebruikt</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              U heeft uw gratis carbon footprint berekening al gebruikt. Voor meer berekeningen, 
              geavanceerde Nederlandse compliance features en CSRD-conforme rapporten, 
              kies een van onderstaande opties:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Account aanmaken */}
              <div className="glass-effect-dark rounded-xl p-6 text-left">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <UserPlusIcon className="w-5 h-5 text-primary-400" />
                  Account Aanmaken
                </h4>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>✅ Onbeperkte berekeningen</li>
                  <li>✅ AI-powered Nederlandse insights</li>
                  <li>✅ CSRD & WPM compliance check</li>
                  <li>✅ Data opslag en tracking</li>
                  <li>✅ Basis PDF rapporten</li>
                </ul>
                <button className="w-full gradient-button py-3 rounded-lg font-semibold">
                  Gratis Account
                </button>
              </div>

              {/* Eenmalige aankoop */}
              <div className="glass-effect-dark rounded-xl p-6 text-left border border-primary-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-blue-400" />
                  Professioneel Rapport
                </h4>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>✅ CSRD-conform 25+ pagina rapport</li>
                  <li>✅ Nederlandse compliance analyse</li>
                  <li>✅ AI-powered actionable insights</li>
                  <li>✅ Implementation roadmap</li>
                  <li>✅ Risk assessment & benchmarking</li>
                </ul>
                <div className="text-center mb-3">
                  <span className="text-2xl font-bold text-primary-400">€149</span>
                  <span className="text-gray-400 ml-1">eenmalig</span>
                </div>
                <button 
                  onClick={handleOneTimePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Koop Rapport
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Later beslissen
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Results view
  if (showResults && results) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Carbon Footprint Resultaten</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-primary-400 mb-2">
              {results.emissions.total} ton CO2
            </div>
            <p className="text-gray-300">
              {results.companyInfo.name} • {results.companyInfo.industry}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {isAuthenticated && (
              <button
                onClick={generateProfessionalPDF}
                disabled={isGeneratingPDF}
                className="gradient-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {isGeneratingPDF ? 'Genereren...' : 'Download PDF Rapport'}
              </button>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={handleOneTimePayment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Koop Professioneel Rapport (€149)
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Main calculator form
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-effect rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center relative">
                <CalculatorIcon className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">NL</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nederlandse Carbon Footprint Calculator</h2>
                <p className="text-gray-400">
                  {isAuthenticated ? 'CSRD-conforme berekening met AI-insights' : 'Gratis Nederlandse berekening - 1x per gebruiker'}
                </p>
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
            <span className="text-sm text-gray-400">{Math.round(progress)}% voltooid</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 relative">
            <motion.div
              className="bg-gradient-to-r from-red-500 via-white to-blue-600 h-3 rounded-full"
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
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
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
              {isCalculating ? 'Nederlandse berekening...' : 
               currentStep === totalSteps ? 'Bereken Nederlandse Footprint' : 'Volgende'}
            </span>
            {!isCalculating && currentStep < totalSteps && <ChevronRightIcon className="w-5 h-5" />}
            {isCalculating && <div className="w-4 h-4 loading-spinner"></div>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Calculator
