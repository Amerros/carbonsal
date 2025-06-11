'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuoteIcon
} from '@heroicons/react/24/solid'
import { 
  UserCircleIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      name: "Sarah van der Berg",
      position: "Sustainability Director",
      company: "GreenTech Solutions",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "Carbon Comply heeft ons geholpen om 40% CO2 reductie te behalen in slechts 6 maanden. De AI-insights zijn ongelooflijk accuraat en de ROI was zichtbaar binnen 30 dagen.",
      metrics: {
        co2Reduction: "40%",
        savings: "€125,000",
        timeframe: "6 maanden"
      }
    },
    {
      name: "Michael Janssen", 
      position: "CEO",
      company: "Sustainable Manufacturing",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "De meest uitgebreide en accurate carbon footprint tool die we hebben gebruikt. Het dashboard geeft ons real-time inzicht in onze impact en de compliance rapporten zijn perfect voor onze audits.",
      metrics: {
        co2Reduction: "35%",
        savings: "€89,000", 
        timeframe: "4 maanden"
      }
    },
    {
      name: "Emma de Vries",
      position: "Operations Manager", 
      company: "EcoLogistics",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "Fantastische ROI en gebruiksvriendelijk platform. De automatische rapportages bespaaren ons 20 uur per maand en de kostenbespaaringen waren direct zichtbaar.",
      metrics: {
        co2Reduction: "50%",
        savings: "€200,000",
        timeframe: "8 maanden"
      }
    },
    {
      name: "David Chen",
      position: "Environmental Consultant",
      company: "Future Energy Group",
      image: "/api/placeholder/64/64", 
      rating: 5,
      text: "Als consultant adviseer ik Carbon Comply aan al mijn klanten. De wetenschappelijke basis is solide en de implementatie is naadloos. Beste tool op de markt.",
      metrics: {
        co2Reduction: "45%",
        savings: "€156,000",
        timeframe: "5 maanden"
      }
    },
    {
      name: "Lisa Vermeulen",
      position: "CFO",
      company: "Smart Buildings Inc",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "De business case was duidelijk vanaf dag 1. Carbon Comply heeft niet alleen onze uitstoot verminderd, maar ook onze operationele kosten met 25% verlaagd.",
      metrics: {
        co2Reduction: "38%", 
        savings: "€175,000",
        timeframe: "7 maanden"
      }
    }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
  }

  return (
    <section id="testimonials" className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/10 via-transparent to-primary-950/20"></div>
      
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
            💬 Klantenverhalen
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Wat onze klanten</span><br />
            <span className="text-gray-100">zeggen</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ontdek hoe bedrijven zoals het jouwe hun sustainability doelen bereiken 
            met Carbon Comply en tegelijkertijd kosten besparen.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Quote Section */}
                <div className="lg:col-span-2">
                  <QuoteIcon className="w-12 h-12 text-primary-400 mb-6" />
                  
                  <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-6 font-medium">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-primary-400 font-medium">
                        {testimonials[currentTestimonial].position}
                      </div>
                      <div className="text-gray-400 flex items-center gap-1">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-400" />
                    Behaalde Resultaten
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="glass-effect-dark rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400">
                        {testimonials[currentTestimonial].metrics.co2Reduction}
                      </div>
                      <div className="text-gray-400 text-sm">CO2 Reductie</div>
                    </div>
                    
                    <div className="glass-effect-dark rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-400">
                        {testimonials[currentTestimonial].metrics.savings}
                      </div>
                      <div className="text-gray-400 text-sm">Kostenbesparing</div>
                    </div>
                    
                    <div className="glass-effect-dark rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-400">
                        {testimonials[currentTestimonial].metrics.timeframe}
                      </div>
                      <div className="text-gray-400 text-sm">Tijdsduur</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </motion.button>
            
            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">
            Meer <span className="gradient-text">succesverhalen</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect-dark rounded-xl p-6 card-hover"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  "{testimonial.text.substring(0, 120)}..."
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Klaar om jouw <span className="gradient-text">succesverhaal</span> te schrijven?
            </h3>
            <p className="text-gray-300 mb-6">
              Sluit je aan bij meer dan 500 bedrijven die al hun CO2 doelen hebben behaald 
              met Carbon Comply.
            </p>
            <motion.button
              className="gradient-button px-8 py-3 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start je gratis trial
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
