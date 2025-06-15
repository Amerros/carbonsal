'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  UserCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  KeyIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, getAuthHeaders, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    companyName: '',
    industry: '',
    employees: '',
    email: '',
    location: 'Nederland'
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    emailReports: true,
    calculationReminders: true,
    complianceAlerts: true,
    marketingEmails: false
  })
  const [stats, setStats] = useState({
    totalCalculations: 0,
    totalReports: 0,
    carbonSaved: 0,
    lastActivity: null
  })

  const dutchIndustries = [
    'Technologie & Software', 'Productie & Manufacturing', 'Retail & E-commerce', 
    'Financiële Diensten', 'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 
    'Bouw & Vastgoed', 'Agri & Food', 'Energie & Utilities', 'Consultancy', 'Anders'
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    
    if (user) {
      setProfileData({
        companyName: user.companyName || '',
        industry: user.industry || '',
        employees: user.employees?.toString() || '',
        email: user.email || '',
        location: 'Nederland'
      })
      loadUserStats()
    }
  }, [user, isAuthenticated])

  const loadUserStats = async () => {
    try {
      // Load calculations
      const calcResponse = await fetch('/api/calculations', {
        headers: getAuthHeaders()
      })
      if (calcResponse.ok) {
        const calcData = await calcResponse.json()
        const calculations = calcData.calculations || []
        
        // Load reports
        const reportsResponse = await fetch('/api/reports', {
          headers: getAuthHeaders()
        })
        const reportsData = reportsResponse.ok ? await reportsResponse.json() : { reports: [] }
        const reports = reportsData.reports || []

        // Calculate stats
        const totalCarbonSaved = calculations.reduce((sum, calc) => {
          return sum + (calc.results?.projectedSavings || 0)
        }, 0)

        const lastActivity = calculations.length > 0 
          ? new Date(calculations[0].createdAt)
          : null

        setStats({
          totalCalculations: calculations.length,
          totalReports: reports.length,
          carbonSaved: Math.round(totalCarbonSaved),
          lastActivity
        })
      }
    } catch (error) {
      console.error('Failed to load user stats:', error)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        toast.success('Profiel succesvol bijgewerkt!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Update mislukt')
      }
    } catch (error) {
      toast.error('Er ging iets mis bij het bijwerken')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Nieuwe wachtwoorden komen niet overeen')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Nieuw wachtwoord moet minimaal 6 karakters zijn')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Wachtwoord succesvol bijgewerkt!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Wachtwoord update mislukt')
      }
    } catch (error) {
      toast.error('Er ging iets mis bij het bijwerken van het wachtwoord')
    } finally {
      setLoading(false)
    }
  }

  const updateNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(notifications)
      })

      if (response.ok) {
        toast.success('Notificatie-instellingen bijgewerkt!')
      } else {
        toast.error('Update mislukt')
      }
    } catch (error) {
      toast.error('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (window.confirm('Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      try {
        const response = await fetch('/api/profile', {
          method: 'DELETE',
          headers: getAuthHeaders()
        })

        if (response.ok) {
          toast.success('Account succesvol verwijderd')
          logout()
          router.push('/')
        } else {
          toast.error('Account verwijderen mislukt')
        }
      } catch (error) {
        toast.error('Er ging iets mis')
      }
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profiel', icon: UserCircleIcon },
    { id: 'security', name: 'Beveiliging', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notificaties', icon: BellIcon },
    { id: 'overview', name: 'Overzicht', icon: ChartBarIcon }
  ]

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black text-white">
      {/* Navigation */}
      <nav className="glass-effect backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Terug naar Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <CogIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Profiel & Instellingen</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Welkom, {user.companyName}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-xl p-6 sticky top-8">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">{user.companyName}</h2>
                <p className="text-gray-400 text-sm">{user.industry}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Actief</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Berekeningen</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.totalCalculations}</p>
                      </div>
                      <ChartBarIcon className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Rapporten</p>
                        <p className="text-2xl font-bold text-green-400">{stats.totalReports}</p>
                      </div>
                      <DocumentTextIcon className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">CO2 Bespaard</p>
                        <p className="text-2xl font-bold text-purple-400">{stats.carbonSaved} ton</p>
                      </div>
                      <CheckCircleIcon className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Laatste Activiteit</p>
                        <p className="text-sm font-bold text-yellow-400">
                          {stats.lastActivity ? stats.lastActivity.toLocaleDateString('nl-NL') : 'Geen data'}
                        </p>
                      </div>
                      <UserCircleIcon className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Account Health */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="font-medium text-white">Account Geverifieerd</p>
                          <p className="text-sm text-gray-400">Je email adres is bevestigd</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ExclamationCircleIcon className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="font-medium text-white">Profiel Incompleet</p>
                          <p className="text-sm text-gray-400">Voeg meer bedrijfsgegevens toe voor betere insights</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                      >
                        Bijwerken
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Bedrijfsprofiel</h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Bedrijfsnaam</label>
                      <div className="relative">
                        <BuildingOfficeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.companyName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                          placeholder="Voer bedrijfsnaam in"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                          placeholder="je@bedrijf.nl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Industrie</label>
                      <select
                        value={profileData.industry}
                        onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
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
                      <label className="block text-gray-300 mb-2">Aantal medewerkers</label>
                      <input
                        type="number"
                        value={profileData.employees}
                        onChange={(e) => setProfileData(prev => ({ ...prev, employees: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                        placeholder="Bijv. 50"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Locatie</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                      placeholder="Nederland"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={updateProfile}
                      disabled={loading}
                      className="gradient-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Bijwerken...' : 'Profiel Bijwerken'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Change Password */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Wachtwoord Wijzigen</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Huidig wachtwoord</label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                          placeholder="Voer huidig wachtwoord in"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Nieuw wachtwoord</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                        placeholder="Voer nieuw wachtwoord in"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Bevestig nieuw wachtwoord</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                        placeholder="Bevestig nieuw wachtwoord"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={updatePassword}
                        disabled={loading}
                        className="gradient-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                      >
                        {loading ? 'Bijwerken...' : 'Wachtwoord Wijzigen'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-effect rounded-xl p-6 border border-red-500/30">
                  <h3 className="text-xl font-semibold text-red-400 mb-4">Gevarenzone</h3>
                  <p className="text-gray-300 mb-4">
                    Let op: deze acties kunnen niet ongedaan worden gemaakt.
                  </p>
                  
                  <button
                    onClick={deleteAccount}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Account Verwijderen
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Notificatie-instellingen</h3>
                
                <div className="space-y-6">
                  {Object.entries({
                    emailReports: 'Email rapporten',
                    calculationReminders: 'Berekening herinneringen',
                    complianceAlerts: 'Compliance waarschuwingen',
                    marketingEmails: 'Marketing emails'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{label}</p>
                        <p className="text-sm text-gray-400">
                          {key === 'emailReports' && 'Ontvang automatische rapporten per email'}
                          {key === 'calculationReminders' && 'Krijg herinneringen voor nieuwe berekeningen'}
                          {key === 'complianceAlerts' && 'Belangrijke compliance deadlines en updates'}
                          {key === 'marketingEmails' && 'Product updates en feature announcements'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[key]}
                          onChange={(e) => setNotifications(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      onClick={updateNotifications}
                      disabled={loading}
                      className="gradient-button px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Opslaan...' : 'Instellingen Opslaan'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
