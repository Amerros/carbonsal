'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const Hero = ({ onShowCalculator }) => {
  const [currentStat, setCurrentStat] = useState(0)
  
  const stats = [
    { number: "500+", label: "Bedrijven", icon: UsersIcon },
    { number: "2.5M", label: "Ton CO2 Bespaard", icon: GlobeAltIcon },
    { number: "95%", label: "Nauwkeurigheid", icon: TrophyIcon },
    { number: "€50M", label: "Kostenbesparing", icon: SparklesIcon }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full text-primary-400 text-sm font-medium mb-6 border border-primary-500/30">
                <TrophyIcon className="w-4 h-4 mr-2" />
                #1 Carbon Compliance Platform Nederland
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text block">Carbon</span>
              <span className="gradient-text block">Comply</span>
              <span className="text-gray-100 block text-4xl md:text-5xl lg:text-6xl">
                voor de Toekomst
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              De meest geavanceerde carbon footprint calculator met 
              <span className="text-primary-400 font-semibold"> AI-powered insights</span>, 
              professionele rapportages en volledige compliance ondersteuning.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
            >
              <motion.button
                onClick={onShowCalculator}
                className="group px-8 py-4 gradient-button rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Gratis Berekening
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                className="group px-8 py-4 glass-effect rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Bekijk Demo
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-4 rounded-xl transition-all duration-500 ${
                    currentStat === index 
                      ? 'glass-effect scale-110 border-primary-500/50' 
                      : 'glass-effect-dark'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${
                    currentStat === index ? 'text-primary-400' : 'text-gray-400'
                  }`} />
                  <div className={`text-2xl font-bold ${
                    currentStat === index ? 'text-white' : 'text-gray-300'
                  }`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Dashboard Mockup */}
              <div className="glass-effect rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-400">Carbon Dashboard</span>
                </div>
                
                {/* Fake Chart */}
                <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-lg p-4 mb-4">
                  <div className="flex items-end space-x-2 h-24">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-sm flex-1"
                        style={{ height: `${height}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">-24%</div>
                    <div className="text-xs text-gray-400">CO2 Reductie</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-400">€50k</div>
                    <div className="text-xs text-gray-400">Besparing</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <SparklesIcon className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <TrophyIcon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
