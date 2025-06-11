'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  LeafIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Carbon Comply</span>
            </div>
            <button className="gradient-button px-6 py-2 rounded-lg font-semibold text-white">
              Start Nu
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
              🌱 #1 Carbon Compliance Platform Nederland
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Carbon Comply</span><br />
              <span className="text-gray-100">voor de Toekomst</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              De meest geavanceerde carbon footprint calculator met AI-powered insights, 
              professionele rapportages en compliance ondersteuning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="px-8 py-4 gradient-button rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Gratis Berekening
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 glass-effect rounded-xl font-semibold text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Bekijk Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Alles wat je nodig hebt</span><br />
              <span className="text-gray-100">voor Carbon Compliance</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ChartBarIcon,
                title: "Real-time Analytics",
                description: "Live dashboard met uitgebreide CO2 tracking en rapportages"
              },
              {
                icon: DocumentTextIcon,
                title: "Professional Reports", 
                description: "Professionele PDF rapporten met actieplannen en besparingen"
              },
              {
                icon: ShieldCheckIcon,
                title: "Compliance Ready",
                description: "Volledig compliant met EU en internationale standaarden"
              },
              {
                icon: GlobeAltIcon,
                title: "AI-Powered Insights",
                description: "Slimme aanbevelingen voor CO2 reductie en kostenbesparing"
              },
              {
                icon: SparklesIcon,
                title: "Lightning Fast",
                description: "Bereken complexe carbon footprints in seconden, niet uren"
              },
              {
                icon: CheckIcon,
                title: "Enterprise Security",
                description: "Bank-level beveiliging met end-to-end encryptie"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative bg-gradient-to-b from-dark-900 to-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <LeafIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Carbon Comply</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            De toonaangevende carbon footprint calculator voor Nederlandse bedrijven.
          </p>
          <div className="text-gray-400 text-sm">
            © 2024 Carbon Comply. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  )
}
