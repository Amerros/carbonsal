'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  UserCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../lib/AuthContext'

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    industry: '',
    employees: ''
  })

  const industries = [
    'Technologie', 'Productie', 'Retail', 'Financiële Diensten', 
    'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 'Bouw', 'Anders'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(
          formData.email, 
          formData.password, 
          formData.companyName, 
          formData.industry, 
          parseInt(formData.employees) || 0
        )
      }

      if (result.success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-effect rounded-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Inloggen' : 'Account Aanmaken'}
                </h2>
                <p className="text-gray-400">
                  {isLogin ? 'Welkom terug!' : 'Start je sustainability journey'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
              placeholder="je@bedrijf.nl"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Wachtwoord</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Jouw Bedrijf BV"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Industrie</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
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
                <label className="block text-gray-300 mb-2">Aantal medewerkers</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="50"
                  min="1"
                  required
                />
              </div>
            </>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full gradient-button py-3 rounded-lg font-semibold disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Laden...' : isLogin ? 'Inloggen' : 'Account Aanmaken'}
          </motion.button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              {isLogin ? 'Nog geen account? Maak er een aan' : 'Al een account? Log in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AuthModal
