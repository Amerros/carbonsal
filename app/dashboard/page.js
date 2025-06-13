'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon, // This is the correct download icon
  PlusIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import Calculator from '../components/Calculator'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout, getAuthHeaders, loading } = useAuth()
  const router = useRouter()
  const [calculations, setCalculations] = useState([])
  const [reports, setReports] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }
    
    if (user) {
      loadDashboardData()
    }
  }, [user, loading])

  const loadDashboardData = async () => {
    try {
      // Load user calculations
      const calcResponse = await fetch('/api/calculations', {
        headers: getAuthHeaders()
      })
      if (calcResponse.ok) {
        const calcData = await calcResponse.json()
        setCalculations(calcData.calculations || [])
      }

      // Load user reports
      const reportsResponse = await fetch('/api/reports', {
        headers: getAuthHeaders()
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setReports(reportsData.reports || [])
      }

      // Load subscription info
      const subResponse = await fetch('/api/subscription', {
        headers: getAuthHeaders()
      })
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData.subscription)
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const downloadReport = async (reportId, fileName) => {
    try {
      const response = await fetch(`/api/download-pdf/${reportId}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Rapport gedownload!')
    } catch (error) {
      toast.error('Download mislukt')
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 loading-spinner"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const latestCalculation = calculations[0]
  const totalEmissions = latestCalculation ? latestCalculation.results.emissions.total : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black text-white">
      {/* Navigation */}
      <nav className="glass-effect backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Carbon Comply</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welkom, {user.companyName}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Beheer je carbon footprint en rapportages</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Huidige Footprint</p>
                <p className="text-2xl font-bold text-primary-400">{totalEmissions} ton</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-primary-400" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Berekeningen</p>
                <p className="text-2xl font-bold text-blue-400">{calculations.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rapporten</p>
                <p className="text-2xl font-bold text-green-400">{reports.length}</p>
              </div>
              <ArrowDownTrayIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Abonnement</p>
                <p className="text-2xl font-bold text-purple-400">
                  {subscription?.planName || 'Gratis'}
                </p>
              </div>
              <CreditCardIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.button
            onClick={() => setShowCalculator(true)}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <PlusIcon className="w-8 h-8 text-primary-400" />
              <ArrowRightIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nieuwe Berekening</h3>
            <p className="text-gray-400 text-sm">Start een nieuwe carbon footprint berekening</p>
          </motion.button>

          <motion.button
            onClick={() => router.push('/pricing')}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCardIcon className="w-8 h-8 text-blue-400" />
              <ArrowRightIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upgrade Plan</h3>
            <p className="text-gray-400 text-sm">Ontgrendel meer features en rapporten</p>
          </motion.button>

          <motion.button
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <UserCircleIcon className="w-8 h-8 text-green-400" />
              <ArrowRightIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Profiel Beheren</h3>
            <p className="text-gray-400 text-sm">Update je bedrijfsgegevens en instellingen</p>
          </motion.button>
        </div>

        {/* Recent Calculations */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recente Berekeningen</h2>
            {calculations.length > 0 ? (
              <div className="space-y-4">
                {calculations.slice(0, 5).map((calc) => (
                  <div key={calc.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{calc.companyData.companyName}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(calc.createdAt).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-400 font-semibold">
                        {calc.results.emissions.total} ton CO2
                      </p>
                      <p className="text-gray-400 text-sm">
                        {calc.companyData.industry}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChartBarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nog geen berekeningen</p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="mt-4 gradient-button px-6 py-2 rounded-lg"
                >
                  Start je eerste berekening
                </button>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Rapporten</h2>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{report.company_name}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(report.createdAt).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadReport(report.id, report.fileName)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nog geen rapporten</p>
                <p className="text-gray-500 text-sm mt-2">
                  Maak eerst een berekening om rapporten te genereren
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  )
}
