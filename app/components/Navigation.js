'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../lib/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon,
  GlobeAltIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import AuthModal from './AuthModal'

const Navigation = ({ currentSection }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Custom Leaf Icon SVG
  const LeafIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  )

  const navItems = [
    { name: 'Home', href: '#hero', icon: GlobeAltIcon },
    { name: 'Features', href: '#features', icon: ChartBarIcon },
    { name: 'Calculator', href: '#calculator', icon: DocumentTextIcon },
    { name: 'Prijzen', href: '#pricing', icon: CurrencyEuroIcon },
    { name: 'Over Ons', href: '#testimonials', icon: UserGroupIcon },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleDashboard = () => {
    router.push('/dashboard')
    setShowUserMenu(false)
  }

  const handleProfile = () => {
    router.push('/profile')
    setShowUserMenu(false)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-effect backdrop-blur-md shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Carbon Comply</span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentSection === item.href.substring(1)
                      ? 'text-primary-400 bg-primary-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Logged in status indicator */}
                  <div className="flex items-center space-x-3 px-4 py-2 glass-effect rounded-lg border border-primary-500/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">Ingelogd</span>
                    </div>
                    <div className="w-px h-4 bg-gray-600"></div>
                    <span className="text-sm font-medium text-white truncate max-w-32">
                      {user?.companyName}
                    </span>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserCircleIcon className="w-6 h-6 text-white" />
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-56 glass-effect rounded-xl p-2 shadow-xl border border-white/20"
                        >
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white">{user?.companyName}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                            <p className="text-xs text-primary-400">{user?.industry}</p>
                          </div>
                          
                          <div className="py-2">
                            <button
                              onClick={handleDashboard}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <ChartBarIcon className="w-4 h-4" />
                              <span>Dashboard</span>
                            </button>
                            
                            <button
                              onClick={handleProfile}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Cog6ToothIcon className="w-4 h-4" />
                              <span>Profiel & Instellingen</span>
                            </button>
                            
                            <button
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <BellIcon className="w-4 h-4" />
                              <span>Notificaties</span>
                            </button>
                          </div>
                          
                          <div className="border-t border-white/10 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4" />
                              <span>Uitloggen</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Inloggen
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    className="gradient-button px-6 py-2 rounded-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Nu
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg glass-effect"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-effect-dark border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {/* User Status Mobile */}
                {isAuthenticated ? (
                  <div className="glass-effect rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.companyName}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleDashboard}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/10 rounded-lg text-sm"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleProfile}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/10 rounded-lg text-sm"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Profiel</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full mt-3 flex items-center justify-center space-x-2 py-2 px-3 bg-red-500/20 text-red-400 rounded-lg text-sm"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Uitloggen</span>
                    </button>
                  </div>
                ) : (
                  <div className="glass-effect rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-400 mb-3">Nog geen account?</p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full gradient-button py-3 rounded-lg font-semibold"
                    >
                      Inloggen / Registreren
                    </button>
                  </div>
                )}

                {/* Navigation Items */}
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentSection === item.href.substring(1)
                        ? 'text-primary-400 bg-primary-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ x: 10 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* User Menu Overlay */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  )
}

export default Navigation
