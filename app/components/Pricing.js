'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../lib/AuthContext'
import toast from 'react-hot-toast'

const Pricing = () => {
  const { isAuthenticated, getAuthHeaders } = useAuth()
  const [isAnnual, setIsAnnual] = useState(true)
  const [loadingPlan, setLoadingPlan] = useState(null)

  const plans = [
    {
      name: "Starter",
      icon: BoltIcon,
      description: "Perfect voor kleine bedrijven die beginnen met carbon tracking",
      monthlyPrice: 49,
      annualPrice: 39,
      color: "from-blue-500 to-blue-600",
      popular: false,
      features: [
        "5 carbon footprint berekeningen per maand",
        "Basis PDF rapporten",
        "Email support", 
        "Tot 25 medewerkers",
        "Standaard compliance rapportage",
        "Maandelijkse updates"
      ],
      notIncluded: [
        "AI-powered insights",
        "API toegang",
        "Onbeperkte berekeningen",
        "Priority support"
      ]
    },
    {
      name: "Professional", 
      icon: SparklesIcon,
      description: "Voor groeiende bedrijven met uitgebreide sustainability doelen",
      monthlyPrice: 149,
      annualPrice: 119,
      color: "from-primary-500 to-primary-600",
      popular: true,
      features: [
        "Onbeperkte berekeningen",
        "Premium PDF rapporten met branding",
        "AI-powered aanbevelingen",
        "Priority support & phone support",
        "Tot 250 medewerkers", 
        "Geavanceerde analytics dashboard",
        "API toegang",
        "Compliance certificaten",
        "Benchmark rapportage",
        "Wekelijkse updates"
      ],
      notIncluded: [
        "White-label oplossing",
        "Dedicated account manager"
      ]
    },
    {
      name: "Enterprise",
      icon: StarIcon,
      description: "Voor grote organisaties met complexe carbon management behoeften",
      monthlyPrice: 399,
      annualPrice: 319,
      color: "from-purple-500 to-purple-600",
      popular: false,
      features: [
        "Alles uit Professional",
        "Onbeperkt aantal medewerkers",
        "Dedicated account manager",
        "White-label oplossing",
        "Custom integraties",
        "Advanced AI & predictive analytics",
        "Real-time monitoring",
        "Multi-location support",
        "Custom compliance rapportages",
        "24/7 priority support",
        "Dagelijkse updates",
        "Training & onboarding"
      ],
      notIncluded: []
    }
  ]

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice
  }

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12
    const annualCost = plan.annualPrice * 12
    return monthlyCost - annualCost
  }

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      toast.error('Je moet eerst inloggen om een abonnement te nemen')
      return
    }

    if (plan.name === 'Enterprise') {
      toast.success('Neem contact op via info@carboncomply.nl voor Enterprise pricing')
      return
    }

    setLoadingPlan(plan.name)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          priceId: `carbon-comply-${plan.name.toLowerCase()}`,
          planName: plan.name,
          isAnnual: isAnnual
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url

    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Er ging iets mis bij het starten van het betalingsproces')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            💰 Transparante Prijzen
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Kies het plan</span><br />
            <span className="text-gray-100">dat bij je past</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Geen verborgen kosten, geen setup fees. Start vandaag nog met carbon compliance 
            en zie resultaten binnen 30 dagen.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`font-medium ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Maandelijks
            </span>
            <motion.button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                isAnnual ? 'bg-primary-500' : 'bg-gray-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isAnnual ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.button>
            <span className={`font-medium ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Jaarlijks
            </span>
            {isAnnual && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Tot 25% korting
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:scale-105' : ''}`}
            >
              <div className={`glass-effect rounded-2xl p-8 h-full card-hover border transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary-500/50 shadow-2xl shadow-primary-500/20' 
                  : 'border-white/10 hover:border-primary-500/30'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      Meest Populair
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">€{getPrice(plan)}</span>
                    <span className="text-gray-400 mb-1">/maand</span>
                  </div>
                  {isAnnual && getSavings(plan) > 0 && (
                    <div className="text-green-400 text-sm font-medium">
                      Bespaar €{getSavings(plan)} per jaar
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-white">Inbegrepen:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <div className="pt-4 border-t border-gray-700">
                      <h5 className="font-medium text-gray-400 mb-3">Niet inbegrepen:</h5>
                      {plan.notIncluded.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3 mb-2">
                          <XMarkIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'gradient-button'
                      : 'glass-effect hover:bg-white/20'
                  } disabled:opacity-50`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loadingPlan === plan.name ? 'Laden...' : 
                   plan.name === 'Enterprise' ? 'Contact Opnemen' : 'Start Nu'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Nog vragen over onze <span className="gradient-text">prijzen</span>?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Alle plannen komen met een 14-dagen gratis proefperiode. 
              Geen setup kosten, geen langetermijn contracten, stop wanneer je wilt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="gradient-button px-8 py-3 rounded-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Gratis Proefperiode
              </motion.button>
              <motion.button
                className="glass-effect px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Neem Contact Op
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
