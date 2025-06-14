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
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
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
    // Check if guest user has already used free calculation
    if (!isAuthenticated) {
      const hasUsedFree = localStorage.getItem('carbon_comply_free_used')
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
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Calculation failed')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
      
      // Mark free calculation as used for guests
      if (!isAuthenticated) {
        localStorage.setItem('carbon_comply_free_used', 'true')
        setGuestCalculationUsed(true)
      }
      
      toast.success('Carbon footprint berekend!')
      
      // Auto-generate AI insights if user is authenticated
      if (isAuthenticated) {
        generateAIInsights(data)
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
      toast.error('Log in voor AI-powered insights')
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
            timeline: 24
          }
        })
      })

      if (!response.ok) {
        throw new Error('AI insights generation failed')
      }

      const insights = await response.json()
      setAiInsights(insights.insights)
      toast.success('AI insights gegenereerd!')
      
    } catch (error) {
      console.error('AI insights error:', error)
      toast.error('Er ging iets mis bij het genereren van AI insights')
    } finally {
      setLoadingAI(false)
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
          reportType: 'professional'
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
      a.download = `carbon-report-${results.companyInfo?.name || 'report'}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Professioneel PDF rapport gedownload!')
      
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
            calculationId: results.calculationId || 'guest'
          },
          customerEmail: '',
          customerName: '',
          companyName: results.companyInfo.name
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
            <h3 className="text-2xl font-bold text-white mb-6">Bedrijfsinformatie</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange(null, 'companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Voer bedrijfsnaam in"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Industrie *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange(null, 'industry', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                >
                  <option value="">Selecteer industrie</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry} className="bg-gray-800">
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
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
                <p className="text-xs text-gray-400 mt-1">Gemiddeld 5,000 kWh per medewerker per jaar</p>
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
                <p className="text-xs text-gray-400 mt-1">Gemiddeld 1,500 m³ per medewerker per jaar</p>
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
                <p className="text-xs text-gray-400 mt-1">Inclusief warmtepompen en elektrische verwarming</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Transport & Mobiliteit (per jaar)</h3>
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
                <p className="text-xs text-gray-400 mt-1">Totale kilometers van alle bedrijfsauto's</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Openbaar vervoer medewerkers (km)</label>
                <input
                  type="number"
                  value={formData.transport.publicTransport}
                  onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 25000"
                />
                <p className="text-xs text-gray-400 mt-1">Trein, bus en metro voor woon-werk verkeer</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Zakelijke vliegreizen (km)</label>
                <input
                  type="number"
                  value={formData.transport.businessTravel}
                  onChange={(e) => handleInputChange('transport', 'businessTravel', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50000"
                />
                <p className="text-xs text-gray-400 mt-1">Vliegafstand voor alle zakelijke reizen</p>
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
                <p className="text-xs text-gray-400 mt-1">Restafval dat niet gerecycled wordt</p>
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
                <p className="text-xs text-gray-400 mt-1">Papier, plastic, glas en metaal recycling</p>
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
                <p className="text-xs text-gray-400 mt-1">Gemiddeld 20 m³ per medewerker per jaar</p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Materialen & Inkoop (per jaar)</h3>
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
                <p className="text-xs text-gray-400 mt-1">Kantoorpapier, documenten en prints</p>
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
                <p className="text-xs text-gray-400 mt-1">Verpakkingsmaterialen en kantoorartikelen</p>
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
                <p className="text-xs text-gray-400 mt-1">Hardware, apparatuur en machines</p>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Controleer je gegevens</h3>
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
                <div>
                  <span className="text-gray-400">Gas:</span>
                  <span className="text-white ml-2">{formData.energy.gas || '0'} m³</span>
                </div>
                <div>
                  <span className="text-gray-400">Transport:</span>
                  <span className="text-white ml-2">{formData.transport.carFleet || '0'} km</span>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Gratis berekening</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Dit is je gratis carbon footprint berekening. Voor geavanceerde features zoals AI-insights, 
                    professionele rapporten en onbeperkte berekeningen, maak een account aan.
                  </p>
                  <div className="flex gap-2">
                    <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                      Account aanmaken
                    </button>
                    <span className="text-gray-500">•</span>
                    <button className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                      Later inloggen
                    </button>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Premium berekening</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Je berekening wordt opgeslagen en je krijgt automatisch AI-powered insights en een professioneel rapport.
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

  // Upgrade Prompt Modal for guests who used their free calculation
  if (showUpgradePrompt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl max-w-md w-full p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Gratis berekening gebruikt</h3>
            <p className="text-gray-300 mb-6">
              Je hebt je gratis carbon footprint berekening al gebruikt. Maak een account aan voor onbeperkte berekeningen en geavanceerde features.
            </p>
            <div className="space-y-3">
              <button className="w-full gradient-button py-3 rounded-lg font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <UserPlusIcon className="w-5 h-5" />
                  <span>Account Aanmaken</span>
                </div>
              </button>
              <button 
                onClick={onClose}
                className="w-full glass-effect py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Results view with enhanced features
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
          className="glass-effect rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Carbon Footprint Resultaten</h2>
                  <p className="text-gray-400">{results.companyInfo.name} • {results.companyInfo.industry}</p>
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
            {/* Key Metrics Row */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">
                  {results.emissions.total}
                </div>
                <div className="text-gray-400 mb-2">ton CO2 per jaar</div>
                <div className="text-xs text-gray-500">
                  {(results.emissions.total / results.companyInfo.employees).toFixed(1)} ton per medewerker
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {results.benchmark?.percentile || 0}%
                </div>
                <div className="text-gray-400 mb-2">Beter dan peers</div>
                <div className="text-xs text-gray-500">
                  {results.benchmark?.ranking || 'Gemiddeld'} prestatie
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  €{results.costSavings?.total?.toLocaleString() || 0}
                </div>
                <div className="text-gray-400 mb-2">Besparingspotentieel</div>
                <div className="text-xs text-gray-500">
                  ROI binnen {results.costSavings?.timeline || '12 maanden'}
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {results.recommendations?.length || 0}
                </div>
                <div className="text-gray-400 mb-2">Aanbevelingen</div>
                <div className="text-xs text-gray-500">
                  Geprioriteerd op impact
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Emissions Breakdown */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">CO2 Uitstoot per Categorie</h3>
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
                <h3 className="text-xl font-semibold text-white mb-4">Reductie Projecties</h3>
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

            {/* AI Insights Section */}
            {isAuthenticated && (
              <div className="glass-effect-dark rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-yellow-400" />
                    AI-Powered Insights
                  </h3>
                  {!aiInsights && !loadingAI && (
                    <motion.button
                      onClick={() => generateAIInsights(results)}
                      className="gradient-button px-4 py-2 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Genereer AI Insights
                    </motion.button>
                  )}
                </div>

                {loadingAI && (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 loading-spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">AI analyseert jouw carbon footprint...</p>
                  </div>
                )}

                {aiInsights && (
                  <div className="space-y-6">
                    {/* AI Summary */}
                    <div className="bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-lg p-4 border border-primary-500/20">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <BoltIcon className="w-5 h-5 text-primary-400" />
                        Executive Summary
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{aiInsights.summary?.text}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="text-xs text-gray-400">
                          AI Confidence: <span className="text-green-400">{Math.round((aiInsights.confidence || 0.85) * 100)}%</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Performance: <span className="text-primary-400">{aiInsights.summary?.category || 'Good'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Priority Matrix */}
                    {aiInsights.priorities && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Prioriteitsmatrix</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          {aiInsights.priorities.priorities.map((priority, index) => (
                            <div key={index} className="bg-black/20 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-white">{priority.category}</h5>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  priority.priority === 'Hoog' ? 'bg-red-500/20 text-red-400' :
                                  priority.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {priority.priority}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">Impact: {priority.impact}</p>
                              <p className="text-xs text-gray-300">{priority.percentage}% van totale uitstoot</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Opportunities */}
                    {aiInsights.opportunities && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">High-Impact Kansen</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {aiInsights.opportunities.opportunities.map((opp, index) => (
                            <div key={index} className="bg-black/20 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-white">{opp.type}</h5>
                                <div className="text-right">
                                  <div className="text-green-400 font-bold text-sm">{opp.potential}</div>
                                  <div className="text-xs text-gray-400">reductie</div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-300 mb-2">{opp.description}</p>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Investering: {opp.investment}</span>
                                <span>ROI: {opp.payback}</span>
                              </div>
                              <div className="mt-2 flex items-center">
                                <div className="flex-1 bg-gray-600 rounded-full h-1">
                                  <div 
                                    className="bg-primary-500 h-1 rounded-full" 
                                    style={{ width: `${opp.aiConfidence * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-400 ml-2">
                                  {Math.round(opp.aiConfidence * 100)}% zekerheid
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Implementation Roadmap */}
                    {aiInsights.actionPlan && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Implementatie Roadmap</h4>
                        <div className="space-y-3">
                          {Object.entries(aiInsights.actionPlan.phases).map(([phase, actions]) => (
                            <div key={phase} className="bg-black/20 rounded-lg p-4">
                              <h5 className="font-medium text-white mb-2 capitalize">
                                {phase === 'immediate' ? '🚀 Snelle wins (0-3 maanden)' :
                                 phase === 'shortTerm' ? '📈 Kortetermijn (3-12 maanden)' :
                                 '🎯 Langetermijn (1-3 jaar)'}
                              </h5>
                              <div className="grid md:grid-cols-2 gap-2">
                                {actions.map((action, index) => (
                                  <div key={index} className="text-sm">
                                    <div className="flex justify-between items-start">
                                      <span className="text-gray-300">{action.action}</span>
                                      <span className="text-green-400 text-xs font-medium ml-2">{action.impact}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {action.cost} • {action.effort} inspanning
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Top Aanbevelingen</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.recommendations.slice(0, 6).map((rec, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4 hover:bg-black/30 transition-colors">
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
                        <p>💰 Besparing: <span className="text-green-400">{rec.savings} ton CO2</span></p>
                        <p>💸 Investering: <span className="text-blue-400">{rec.cost}</span></p>
                        <p>⏱️ ROI: <span className="text-purple-400">{rec.paybackMonths} maanden</span></p>
                      </div>
                      <div className="mt-3 bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-green-400 h-1 rounded-full" 
                          style={{ width: `${Math.min(rec.priority * 20, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Section */}
            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Volgende Stappen</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* PDF Download */}
                {isAuthenticated && results.calculationId && (
                  <motion.button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="flex flex-col items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DocumentArrowDownIcon className="w-8 h-8 text-green-400 mb-2" />
                    <span className="font-medium text-white">
                      {isGeneratingPDF ? 'Genereren...' : 'Download PDF'}
                    </span>
                    <span className="text-xs text-gray-400 text-center">
                      Professioneel rapport met compliance certificering
                    </span>
                  </motion.button>
                )}

                {/* One-time PDF Purchase for guests */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={handleOneTimePayment}
                    className="flex flex-col items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCardIcon className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="font-medium text-white">Koop PDF - €50</span>
                    <span className="text-xs text-gray-400 text-center">
                      Eenmalige aankoop van professioneel rapport
                    </span>
                  </motion.button>
                )}

                {/* Account Creation CTA */}
                {!isAuthenticated && (
                  <motion.button
                    className="flex flex-col items-center p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserPlusIcon className="w-8 h-8 text-primary-400 mb-2" />
                    <span className="font-medium text-white">Maak Account</span>
                    <span className="text-xs text-gray-400 text-center">
                      Onbeperkte berekeningen + AI insights
                    </span>
                  </motion.button>
                )}

                {/* New Calculation */}
                <motion.button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentStep(1)
                    setResults(null)
                    setAiInsights(null)
                  }}
                  className="flex flex-col items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CalculatorIcon className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="font-medium text-white">Nieuwe Berekening</span>
                  <span className="text-xs text-gray-400 text-center">
                    Start een nieuwe carbon footprint analyse
                  </span>
                </motion.button>
              </div>

              {/* Guest limitations notice */}
              {!isAuthenticated && guestCalculationUsed && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Gratis berekening gebruikt</p>
                      <p className="text-gray-300 text-sm mt-1">
                        Je hebt je gratis berekening gebruikt. Maak een account aan voor onbeperkte toegang 
                        tot carbon footprint berekeningen, AI-insights en professionele rapportages.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                <p className="text-gray-400">
                  {isAuthenticated ? 'Professionele berekening met AI-insights' : 'Gratis berekening - 1x per gebruiker'}
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
          
          {/* Feature indicators */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">ISO 14064 compliant</span>
              </div>
              {isAuthenticated && (
                <div className="flex items-center space-x-1">
                  <SparklesIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400">AI-powered insights</span>
                </div>
              )}
            </div>
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <EyeIcon className="w-4 h-4" />
                <span>Gratis preview</span>
              </div>
            )}
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
              {isCalculating ? 'Berekenen...' : currentStep === totalSteps ? 'Bereken Footprint' : 'Volgende'}
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
