'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon,
  UsersIcon,
  GlobeAltIcon,
  BanknotesIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('stats')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      icon: UsersIcon,
      number: 500,
      suffix: '+',
      label: 'Actieve Bedrijven',
      description: 'Vertrouwen op ons platform',
      color: 'from-blue-500 to-blue-600',
      delay: 0.1
    },
    {
      icon: GlobeAltIcon,
      number: 2.5,
      suffix: 'M',
      label: 'Ton CO2 Bespaard',
      description: 'Equivalent aan 543,000 bomen',
      color: 'from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: TrophyIcon,
      number: 95,
      suffix: '%',
      label: 'Nauwkeurigheid',
      description: 'Peer-reviewed methodiek',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.3
    },
    {
      icon: BanknotesIcon,
      number: 50,
      suffix: 'M',
      label: 'Euro Kostenbesparing',
      description: 'Gerealiseerd door klanten',
      color: 'from-purple-500 to-purple-600',
      delay: 0.4
    },
    {
      icon: ChartBarIcon,
      number: 15,
      suffix: '',
      label: 'Gemiddelde ROI',
      description: 'Binnen 12 maanden',
      color: 'from-pink-500 to-pink-600',
      delay: 0.5
    },
    {
      icon: SparklesIcon,
      number: 24,
      suffix: '/7',
      label: 'AI Monitoring',
      description: 'Continue optimalisatie',
      color: 'from-cyan-500 to-cyan-600',
      delay: 0.6
    }
  ]

  const CountUpAnimation = ({ end, suffix, duration = 2 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOutCubic * end))

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    }, [isVisible, end, duration])

    return (
      <span className="text-4xl md:text-5xl font-bold">
        {count}{suffix}
      </span>
    )
  }

  return (
    <section id="stats" className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/20 via-transparent to-primary-950/20"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            📊 Bewezen Resultaten
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Cijfers die</span><br />
            <span className="text-gray-100">voor zich spreken</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Meer dan 500 bedrijven vertrouwen op Carbon Comply voor hun sustainability journey. 
            Ontdek waarom wij de #1 keuze zijn in Nederland.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: stat.delay,
                ease: "easeOut"
              }}
              className="group"
            >
              <div className="glass-effect rounded-2xl p-8 h-full card-hover border border-white/10 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Number */}
                <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2 relative z-10`}>
                  <CountUpAnimation 
                    end={stat.number} 
                    suffix={stat.suffix} 
                    duration={2.5} 
                  />
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors relative z-10">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors relative z-10">
                  {stat.description}
                </p>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br ${stat.color} rounded-full opacity-20 group-hover:animate-ping`}></div>
                  <div className={`absolute top-1/2 -left-2 w-4 h-4 bg-gradient-to-br ${stat.color} rounded-full opacity-30 group-hover:animate-pulse`}></div>
                  <div className={`absolute -bottom-2 right-1/3 w-6 h-6 bg-gradient-to-br ${stat.color} rounded-full opacity-25 group-hover:animate-bounce`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Vertrouwd door <span className="gradient-text">industry leaders</span>
            </h3>
            <p className="text-gray-400">
              Van startups tot Fortune 500 bedrijven - zij kozen voor Carbon Comply
            </p>
          </div>

          {/* Fake Company Logos */}
          <div className="glass-effect rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {[
                'TechCorp', 'GreenEnergy', 'SustainableCo', 
                'EcoTrans', 'CleanTech', 'FutureNL'
              ].map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">
                      {company.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">{company}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Industry Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-3">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Best Sustainability Tool 2024</h4>
                <p className="text-gray-400 text-sm">TechCrunch Awards</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Innovation Leader</h4>
                <p className="text-gray-400 text-sm">Climate Tech Europe</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Top 10 Climate Solutions</h4>
                <p className="text-gray-400 text-sm">Dutch Green Business</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
