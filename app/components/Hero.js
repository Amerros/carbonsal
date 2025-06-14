'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useAuth } from '../../lib/AuthContext'
import { 
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Hero = ({ onShowCalculator }) => {
  const { isAuthenticated, user } = useAuth()
  const [currentStat, setCurrentStat] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()
  
  const stats = [
    { number: "500+", label: "Bedrijven", icon: UsersIcon, color: "from-blue-500 to-blue-600" },
    { number: "2.5M", label: "Ton CO2 Bespaard", icon: GlobeAltIcon, color: "from-green-500 to-green-600" },
    { number: "95%", label: "Nauwkeurigheid", icon: TrophyIcon, color: "from-yellow-500 to-orange-500" },
    { number: "€50M", label: "Kostenbesparing", icon: SparklesIcon, color: "from-purple-500 to-purple-600" }
  ]

  const features = [
    { text: "AI-powered insights", icon: SparklesIcon },
    { text: "ISO 14064 compliant", icon: ShieldCheckIcon },
    { text: "Real-time berekening", icon: BoltIcon },
    { text: "Professionele rapporten", icon: CheckCircleIcon }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  useEffect(() => {
    setIsVisible(true)
    controls.start("visible")
  }, [controls])

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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate" 
        transition={{ delay: 2 }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full text-primary-400 text-sm font-medium mb-6 border border-primary-500/30 backdrop-blur-sm">
                <TrophyIcon className="w-4 h-4 mr-2" />
                <span className="relative">
                  #1 Carbon Platform Nederland
                  <motion.div
                    className="absolute -top-1 -right-6 w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </div>
            </motion.div>
            
            {/* Main Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <motion.span 
                  className="gradient-text block"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Carbon
                </motion.span>
                <motion.span 
                  className="gradient-text block"
                  animate={{ 
                    backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                  Comply
                </motion.span>
                <span className="text-gray-100 block text-4xl md:text-5xl lg:text-6xl">
                  voor de Toekomst
                </span>
              </h1>
            </motion.div>
            
            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              De meest geavanceerde carbon footprint calculator met{' '}
              <motion.span 
                className="text-primary-400 font-semibold"
                animate={{ color: ["#22c55e", "#16a34a", "#22c55e"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                AI-powered insights
              </motion.span>
              , professionele rapportages en volledige compliance ondersteuning.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-2 glass-effect rounded-full text-sm text-gray-300"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-4 h-4 text-primary-400" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
            >
              <motion.button
                onClick={onShowCalculator}
                className="group relative px-8 py-4 gradient-button rounded-xl font-semibold text-lg shadow-xl overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>{isAuthenticated ? 'Nieuwe Berekening' : 'Start Gratis Berekening'}</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button
                className="group px-8 py-4 glass-effect rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Bekijk Demo</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-4 rounded-xl transition-all duration-500 ${
                    currentStat === index 
                      ? 'glass-effect scale-110 border-primary-500/50' 
                      : 'glass-effect-dark'
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  animate={currentStat === index ? { 
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
                    borderColor: "rgba(34, 197, 94, 0.5)"
                  } : {}}
                >
                  <motion.div
                    className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-2 flex items-center justify-center`}
                    animate={currentStat === index ? { rotate: 360 } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <stat.icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.div 
                    className={`text-2xl font-bold ${
                      currentStat === index ? 'text-white' : 'text-gray-300'
                    }`}
                    animate={currentStat === index ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* User Status */}
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 p-4 glass-effect rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Welkom terug, {user.companyName}!</p>
                    <p className="text-gray-400 text-sm">Je volgende carbon footprint berekening wacht op je.</p>
                  </div>
                </div>
              </motion.div>
            )}
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
              <motion.div 
                className="glass-effect rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 bg-red-400 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 bg-yellow-400 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">Carbon Dashboard</span>
                </div>
                
                {/* Chart Area */}
                <motion.div 
                  className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-lg p-4 mb-4 backdrop-blur-sm"
                  whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                >
                  <div className="flex items-end space-x-2 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 60, 85].map((height, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-sm flex-1"
                        style={{ height: `${height}%` }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: 1 }}
                        transition={{ 
                          delay: i * 0.1 + 1, 
                          duration: 0.5,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "#16a34a",
                          transition: { duration: 0.2 }
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Chart Labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </motion.div>
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                  >
                    <motion.div 
                      className="text-2xl font-bold text-green-400 mb-1"
                      animate={{ color: ["#22c55e", "#16a34a", "#22c55e"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      -24%
                    </motion.div>
                    <div className="text-xs text-gray-400">CO2 Reductie</div>
                    <motion.div 
                      className="w-full bg-gray-600 rounded-full h-1 mt-2"
                    >
                      <motion.div
                        className="bg-green-400 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "76%" }}
                        transition={{ delay: 2, duration: 1 }}
                      />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  >
                    <motion.div 
                      className="text-2xl font-bold text-blue-400 mb-1"
                      animate={{ 
                        textShadow: ["0 0 0px #3b82f6", "0 0 10px #3b82f6", "0 0 0px #3b82f6"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      €50k
                    </motion.div>
                    <div className="text-xs text-gray-400">Besparing</div>
                    <motion.div 
                      className="w-full bg-gray-600 rounded-full h-1 mt-2"
                    >
                      <motion.div
                        className="bg-blue-400 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "89%" }}
                        transition={{ delay: 2.5, duration: 1 }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Status Indicators */}
                <div className="flex justify-between items-center mt-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-gray-400">Live Monitoring</span>
                  </div>
                  <span className="text-gray-500">Updated 2 min ago</span>
                </div>
              </motion.div>

              {/* Floating Achievement Badges */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                  boxShadow: [
                    "0 10px 30px rgba(34, 197, 94, 0.3)",
                    "0 20px 40px rgba(34, 197, 94, 0.4)",
                    "0 10px 30px rgba(34, 197, 94, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <SparklesIcon className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                  boxShadow: [
                    "0 10px 30px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px rgba(59, 130, 246, 0.4)",
                    "0 10px 30px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                whileHover={{ scale: 1.1, rotate: -15 }}
              >
                <TrophyIcon className="w-6 h-6 text-white" />
              </motion.div>

              {/* AI Insight Popup */}
              <motion.div
                className="absolute top-1/2 -right-8 glass-effect rounded-lg p-3 shadow-lg max-w-48"
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white mb-1">AI Insight</p>
                    <p className="text-xs text-gray-300">
                      Switch to LED lighting for instant 15% energy reduction
                    </p>
                  </div>
                </div>
                <motion.div
                  className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-white/20"
                />
              </motion.div>

              {/* Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-400/60 rounded-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${10 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div 
            className="w-1 h-3 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Scroll voor meer</p>
      </motion.div>

      {/* Freemium Banner for non-authenticated users */}
      {!isAuthenticated && (
        <motion.div
          className="absolute top-20 right-4 glass-effect rounded-lg p-4 max-w-64"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <SparklesIcon className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Gratis Starten!</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            1 gratis carbon footprint berekening zonder account vereist.
          </p>
          <motion.button
            onClick={onShowCalculator}
            className="w-full gradient-button py-2 rounded-lg text-sm font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Probeer Nu
          </motion.button>
        </motion.div>
      )}
    </section>
  )
}

export default Hero
