'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Features from './components/Features'
import Calculator from './components/Calculator'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'calculator', 'stats', 'testimonials', 'pricing']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setCurrentSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check for successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      // Redirect to dashboard after successful payment
      router.push('/dashboard')
    }
  }, [])

  const handleShowCalculator = () => {
    if (user) {
      setShowCalculator(true)
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    setShowCalculator(true)
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-element top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="floating-element top-40 right-20 w-24 h-24 bg-primary-400 rounded-full blur-2xl"></div>
        <div className="floating-element bottom-40 left-1/4 w-40 h-40 bg-primary-600 rounded-full blur-3xl"></div>
        <div className="floating-element bottom-20 right-1/3 w-28 h-28 bg-primary-500 rounded-full blur-2xl"></div>
      </div>

      <Navigation currentSection={currentSection} />
      
      <main>
        <Hero onShowCalculator={handleShowCalculator} />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
      </main>
      
      <Footer />

      {/* Calculator Modal */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
