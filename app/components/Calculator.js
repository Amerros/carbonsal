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
  ClockIcon,
  TruckIcon,
  TrashIcon,
  BeakerIcon,
  CubeIcon
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

  const wasteTypes = [
    { key: 'general', label: 'Restafval', description: 'Algemeen huisvuil en niet-recycleerbaar afval' },
    { key: 'recycling', label: 'PMD/Papier', description: 'Plastic, metaal, drankkartons en papier' },
    { key: 'organic', label: 'GFT', description: 'Groente-, fruit- en tuinafval' },
    { key: 'hazardous', label: 'Gevaarlijk Afval', description: 'Batterijen, verf, olie, chemicaliën' }
  ]

  const materialTypes = [
    { key: 'paper', label: 'Papier & Karton', unit: 'kg/jaar', description: 'Kantoorpapier, verpakkingen' },
    { key: 'plastic', label: 'Plastic Producten', unit: 'kg/jaar', description: 'Verpakkingen, kantoormateriaal' },
    { key: 'metal', label: 'Metalen', unit: 'kg/jaar', description: 'Aluminium, staal, kantoormateriaal' },
    { key: 'electronics', label: 'Elektronica', unit: '€/jaar', description: 'Computers, telefoons, apparatuur (spend-based)' }
  ]

  const scope3Categories = [
    { key: 'procurement', label: 'Inkoop & Leveranciers', unit: '€/jaar', description: 'Aankoop van goederen en diensten' },
    { key: 'outsourcing', label: 'Uitbesteding', unit: '€/jaar', description: 'Uitbestede processen en dienstverlening' },
    { key: 'businessServices', label: 'Zakelijke Diensten', unit: '€/jaar', description: 'Consultancy, juridisch, financieel' }
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
                    {parseInt(formData.employees) >= 250 ? '🔴 CSRD rapportage verplicht' : 
                     parseInt(formData.employees) >= 100 ? '⚠️ WPM rapportage verplicht' : '✅ Geen directe rapportageplicht'}
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
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
              <div>
                <label className="block text-gray-300 mb-2">Stadsverwarming/warmtenet (kWh/jaar)</label>
                <input
                  type="number"
                  value={formData.energy.heating}
                  onChange={(e) => handleInputChange('energy', 'heating', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 25000"
                />
                <p className="text-xs text-gray-400 mt-1">Nederlandse warmte mix: 0.298 kg CO2/kWh</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transport & Mobiliteit</h3>
              <p className="text-gray-400">Nederlandse transport emissies - conform WPM rapportage</p>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Zakelijke kilometers (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.carFleet}
                    onChange={(e) => handleInputChange('transport', 'carFleet', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 25000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Nederlandse wagenpark: 0.156 kg CO2/km</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Elektrische voertuigen (%)</label>
                  <input
                    type="number"
                    value={formData.transport.electricVehicles}
                    onChange={(e) => handleInputChange('transport', 'electricVehicles', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="0-100%"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-400 mt-1">EV NL stroommix: 0.047 kg CO2/km</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Woon-werk verkeer (km/jaar)</label>
                <input
                  type="number"
                  value={formData.transport.homeToWork}
                  onChange={(e) => handleInputChange('transport', 'homeToWork', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 100000"
                />
                <p className="text-xs text-gray-400 mt-1">Voor WPM rapportage - 0.124 kg CO2/km gemiddeld</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Openbaar vervoer (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.publicTransport}
                    onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 15000"
                  />
                  <p className="text-xs text-gray-400 mt-1">NS/GVB/RET gemiddelde: 0.089 kg CO2/km</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Zakelijke vliegreizen (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.businessTravel}
                    onChange={(e) => handleInputChange('transport', 'businessTravel', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 8000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Gemiddeld: 0.255 kg CO2/km</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Afvalbeheer</h3>
              <p className="text-gray-400">Nederlandse afvalverwerking conform Afvalfonds methodiek</p>
            </div>
            <div className="grid gap-4">
              {wasteTypes.map((type) => (
                <div key={type.key}>
                  <label className="block text-gray-300 mb-2">{type.label} (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.waste[type.key]}
                    onChange={(e) => handleInputChange('waste', type.key, e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 5000"
                  />
                  <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                </div>
              ))}
            </div>
            <div className="glass-effect-dark rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                Nederlandse Afval Tips
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• PMD gescheiden inzamelen bespaart 80% CO2 vs restafval</li>
                <li>• GFT vergisting produceert biogas (negatieve emissie mogelijk)</li>
                <li>• Papier recycling: 70% minder CO2 dan nieuwe productie</li>
                <li>• Gevaarlijk afval: specialistische verwerking in Nederland</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GlobeEuropeAfricaIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Waterverbruik</h3>
              <p className="text-gray-400">Nederlandse drinkwaterproductie en afvalwater</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Waterverbruik (m³/jaar)</label>
                <input
                  type="number"
                  value={formData.water}
                  onChange={(e) => handleInputChange(null, 'water', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 500"
                />
                <p className="text-xs text-gray-400 mt-1">Nederlandse waterbedrijven: 0.298 kg CO2/m³</p>
              </div>
            </div>
            <div className="glass-effect-dark rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                Nederlandse Water Efficiëntie
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Nederland heeft een van de laagste water CO2 footprints in Europa</li>
                <li>• Gemiddeld kantoorverbruik: 1 m³ per medewerker per jaar</li>
                <li>• Productieprocessen kunnen significant hoger zijn</li>
                <li>• Regenwater opvang kan tot 30% besparing opleveren</li>
              </ul>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CubeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Materialen & Producten</h3>
              <p className="text-gray-400">Upstream emissies van materiaalgebruik</p>
            </div>
            <div className="grid gap-4">
              {materialTypes.map((type) => (
                <div key={type.key}>
                  <label className="block text-gray-300 mb-2">{type.label} ({type.unit})</label>
                  <input
                    type="number"
                    value={formData.materials[type.key]}
                    onChange={(e) => handleInputChange('materials', type.key, e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 1000"
                  />
                  <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                </div>
              ))}
            </div>
            <div className="glass-effect-dark rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                Nederlandse Materiaal Tips
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Circulaire economie: 30% minder materiaalimpact</li>
                <li>• Nederlandse recycling: hoogste percentages Europa</li>
                <li>• Lokale sourcing vermindert transport emissies</li>
                <li>• Elektronics leasing vs kopen: 40% CO2 reductie</li>
              </ul>
            </div>
          </div>
        )

          {/* Emissions Breakdown Chart */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Emissie Verdeling</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(results.emissions.breakdown || {}).map(([key, value]) => ({
                        name: getCategoryDisplayName(key),
                        value: value,
                        fill: getCategoryColor(key)
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Nederlandse Benchmark</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Uw emissies per medewerker:</span>
                  <span className="text-white font-bold">
                    {(results.emissions.total / results.companyInfo.employees).toFixed(1)} ton
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Nederlandse {results.companyInfo.industry} gemiddelde:</span>
                  <span className="text-gray-400">
                    {results.benchmark?.industryAverage ? 
                      (results.benchmark.industryAverage / results.companyInfo.employees).toFixed(1) : 
                      '5.8'
                    } ton
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      results.benchmark?.performanceRatio < 1 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ 
                      width: `${Math.min((results.benchmark?.performanceRatio || 1) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {results.benchmark?.ranking || 'Gemiddelde prestatie'}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect-dark rounded-xl p-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                CSRD Status
              </h4>
              <div className="text-lg font-bold mb-2">
                {results.compliance?.csrd?.required ? (
                  <span className="text-red-400">Verplicht 2025</span>
                ) : (
                  <span className="text-green-400">Vrijwillig</span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {results.compliance?.csrd?.readiness}% readiness
              </p>
            </div>

            <div className="glass-effect-dark rounded-xl p-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-yellow-400" />
                WPM Status
              </h4>
              <div className="text-lg font-bold mb-2">
                {results.compliance?.wpm?.required ? (
                  <span className="text-yellow-400">Verplicht</span>
                ) : (
                  <span className="text-green-400">Niet verplicht</span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Mobiliteitsrapportage {results.compliance?.wmp?.deadline || '2025'}
              </p>
            </div>

            <div className="glass-effect-dark rounded-xl p-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-green-400" />
                CO2-Heffing
              </h4>
              <div className="text-lg font-bold mb-2">
                <span className="text-white">
                  €{results.carbonPricing?.current2024?.toLocaleString() || '0'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                2030: €{results.carbonPricing?.projected2030?.toLocaleString() || '0'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {isAuthenticated && (
              <button
                onClick={generateProfessionalPDF}
                disabled={isGeneratingPDF}
                className="gradient-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 loading-spinner"></div>
                    Genereren...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Download Nederlands PDF Rapport
                  </>
                )}
              </button>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={handleOneTimePayment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <CreditCardIcon className="w-5 h-5" />
                Koop Professioneel Rapport (€149)
              </button>
            )}

            {loadingAI ? (
              <button disabled className="glass-effect px-6 py-3 rounded-lg font-semibold opacity-50 flex items-center gap-2">
                <div className="w-4 h-4 loading-spinner"></div>
                AI Insights laden...
              </button>
            ) : aiInsights ? (
              <button
                onClick={() => setShowResults(false)}
                className="glass-effect px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                Bekijk AI Insights
              </button>
            ) : isAuthenticated ? (
              <button
                onClick={() => generateAIInsights(results)}
                className="glass-effect px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                Genereer AI Insights
              </button>
            ) : null}
          </div>

          {/* AI Insights Preview */}
          {aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-effect-dark rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                AI-Powered Nederlandse Insights
              </h3>
              
              {aiInsights.executiveSummary && (
                <div className="mb-4">
                  <h4 className="font-medium text-white mb-2">Executive Summary</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {typeof aiInsights.executiveSummary === 'object' 
                      ? aiInsights.executiveSummary.content?.substring(0, 300) + '...'
                      : aiInsights.executiveSummary.substring(0, 300) + '...'
                    }
                  </p>
                </div>
              )}

              {aiInsights.aiRecommendations && aiInsights.aiRecommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-white mb-2">Top Nederlandse Aanbevelingen</h4>
                  <div className="space-y-2">
                    {aiInsights.aiRecommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary-400 font-bold">{index + 1}.</span>
                        <span className="text-gray-300">
                          {typeof rec === 'object' ? rec.title || rec.action : rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiInsights.sustainabilityScore && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                  <span className="text-gray-300">Sustainability Score:</span>
                  <span className="text-2xl font-bold text-primary-400">
                    {aiInsights.sustainabilityScore.overall}/100
                  </span>
                </div>
              )}
            </motion.div>
          )}
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
          
          {/* Step indicators */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span className={currentStep >= 1 ? 'text-white' : ''}>Bedrijf</span>
            <span className={currentStep >= 2 ? 'text-white' : ''}>Energie</span>
            <span className={currentStep >= 3 ? 'text-white' : ''}>Transport</span>
            <span className={currentStep >= 4 ? 'text-white' : ''}>Afval</span>
            <span className={currentStep >= 5 ? 'text-white' : ''}>Water</span>
            <span className={currentStep >= 6 ? 'text-white' : ''}>Materialen</span>
            <span className={currentStep >= 7 ? 'text-white' : ''}>Scope 3</span>
            <span className={currentStep >= 8 ? 'text-white' : ''}>Verificatie</span>
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

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {!isAuthenticated && (
              <>
                <EyeIcon className="w-4 h-4" />
                <span>Gratis Nederlandse berekening</span>
              </>
            )}
            {isAuthenticated && (
              <>
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Premium features unlocked</span>
              </>
            )}
          </div>

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

        {/* Features banner */}
        {!isAuthenticated && (
          <div className="p-4 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-t border-primary-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-5 h-5 text-primary-400" />
                <span className="text-sm text-gray-300">
                  Upgrade voor AI-insights, onbeperkte berekeningen en CSRD rapporten
                </span>
              </div>
              <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Meer info →
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Helper functions
const getCategoryDisplayName = (category) => {
  const names = {
    energy: 'Energie',
    transport: 'Transport',
    waste: 'Afval',
    water: 'Water',
    materials: 'Materialen',
    scope3: 'Scope 3'
  }
  return names[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    energy: '#f59e0b',
    transport: '#3b82f6',
    waste: '#10b981',
    water: '#06b6d4',
    materials: '#8b5cf6',
    scope3: '#ef4444'
  }
  return colors[category] || '#6b7280'
}

export default Calculator'use client'
