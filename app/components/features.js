'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BoltIcon,
  SparklesIcon,
  CogIcon,
  CloudIcon,
  LockClosedIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const Features = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: "Real-time Analytics",
      description: "Live dashboard met uitgebreide CO2 tracking, trends en voorspellingen",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: DocumentTextIcon,
      title: "Professional Reports",
      description: "Professionele PDF rapporten met actieplannen en kostenbesparingen",
      gradient: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      icon: ShieldCheckIcon,
      title: "Compliance Ready",
      description: "Volledig compliant met EU taxonomie en internationale standaarden",
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: SparklesIcon,
      title: "AI-Powered Insights",
      description: "Machine learning algoritmes voor slimme aanbevelingen en optimalisaties",
      gradient: "from-yellow-500 to-orange-500",
      delay: 0.4
    },
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Bereken complexe carbon footprints in seconden, niet uren",
      gradient: "from-indigo-500 to-indigo-600",
      delay: 0.5
    },
    {
      icon: CogIcon,
      title: "API Integration",
      description: "Naadloze integratie met bestaande systemen via RESTful API",
      gradient: "from-gray-500 to-gray-600",
      delay: 0.6
    },
    {
      icon: CloudIcon,
      title: "Cloud Native",
      description: "Schaalbare cloud infrastructuur met 99.9% uptime garantie",
      gradient: "from-cyan-500 to-cyan-600",
      delay: 0.7
    },
    {
      icon: LockClosedIcon,
      title: "Enterprise Security",
      description: "Bank-level beveiliging met end-to-end encryptie",
      gradient: "from-red-500 to-red-600",
      delay: 0.8
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "Trend Analysis",
      description: "Geavanceerde trend analyses en benchmarking tegen concurrenten",
      gradient: "from-pink-500 to-pink-600",
      delay: 0.9
    },
    {
      icon: BanknotesIcon,
      title: "Cost Optimization",
      description: "Automatische identificatie van kostenbesparingen en ROI tracking",
      gradient: "from-emerald-500 to-emerald-600",
      delay: 1.0
    },
    {
      icon: BeakerIcon,
      title: "Carbon Science",
      description: "Gebaseerd op peer-reviewed wetenschappelijk onderzoek en methodieken",
      gradient: "from-violet-500 to-violet-600",
      delay: 1.1
    },
    {
      icon: GlobeAltIcon,
      title: "Global Standards",
      description: "Ondersteuning voor alle internationale carbon accounting standaarden",
      gradient: "from-teal-500 to-teal-600",
      delay: 1.2
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/10 to-transparent"></div>
      
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
            ✨ Geavanceerde Features
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Alles wat je nodig hebt</span><br />
            <span className="text-gray-100">voor Carbon Compliance</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Onze platform combineert de nieuwste technologieën met wetenschappelijke precisie 
            om je bedrijf te helpen bij het bereiken van carbon neutraliteit.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="glass-effect rounded-2xl p-6 h-full card-hover border border-white/10 hover:border-primary-500/30 transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Klaar om te beginnen met <span className="gradient-text">Carbon Compliance</span>?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ontdek waarom meer dan 500 bedrijven vertrouwen op Carbon Comply voor hun 
              sustainability doelstellingen en compliance rapportages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="gradient-button px-8 py-3 rounded-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Gratis Trial
              </motion.button>
              <motion.button
                className="glass-effect px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Plan een Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
