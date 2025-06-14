// lib/aiService.js - Gratis AI Service voor Nederlandse Carbon Insights

import { HfInference } from '@huggingface/inference'

// Gratis AI providers configuratie
const AI_PROVIDERS = {
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2'
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium'
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY,
    model: 'command-light' // Gratis tier
  }
}

// Nederlandse Carbon Intelligence Templates
const DUTCH_CARBON_TEMPLATES = {
  executiveSummary: (data) => `
Analyseer de carbon footprint van ${data.companyName} (${data.industry}, ${data.employees} medewerkers) 
met ${data.totalEmissions} ton CO2 uitstoot. Geef een Nederlandse executive summary met:
- CSRD compliance status
- Nederlandse benchmarking tegen sector gemiddelde
- Top 3 prioriteiten voor CO2 reductie
- ROI van voorgestelde maatregelen
Antwoord in professioneel Nederlands, max 200 woorden.
`,
  
  actionPlan: (data) => `
Maak een Nederlandse actieplan voor ${data.companyName} om van ${data.totalEmissions} ton CO2 
naar netto-zero te gaan. Inclusief:
- Directe acties (0-6 maanden) met Nederlandse subsidies
- Middellange termijn (6-18 maanden) 
- Lange termijn strategie (18+ maanden)
Focus op Nederlandse context: SEEH subsidie, SDE++, EIA aftrek, CO2-Prestatieladder.
`,

  riskAssessment: (data) => `
Analyseer carbon gerelateerde risico's voor ${data.companyName} in Nederlandse context:
- CSRD compliance risico's en deadlines
- WPM rapportage verplichtingen
- CO2-heffing industrie impact tot 2030 (€216/ton)
- Supply chain carbon risico's
Geef concrete mitigation strategies per risico.
`,

  compliance: (data) => `
Beoordeel CSRD readiness voor ${data.companyName}:
- Huidige compliance score van 100
- Ontbrekende data en processen  
- Timeline naar volledige CSRD compliance
- Kosten schatting voor implementatie
Nederlandse focus op ESRS standaarden en third-party verification.
`
}

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'fallback'
    this.hf = AI_PROVIDERS.huggingface.apiKey ? new HfInference(AI_PROVIDERS.huggingface.apiKey) : null
  }

  async generateInsights(type, data) {
    try {
      const prompt = DUTCH_CARBON_TEMPLATES[type](data)
      
      switch (this.provider) {
        case 'ollama':
          return await this.useOllama(prompt)
        case 'huggingface':
          return await this.useHuggingFace(prompt)
        case 'cohere':
          return await this.useCohere(prompt)
        default:
          return this.useFallback(type, data)
      }
    } catch (error) {
      console.warn(`AI provider ${this.provider} failed, using fallback:`, error)
      return this.useFallback(type, data)
    }
  }

  async useOllama(prompt) {
    try {
      const response = await fetch(`${AI_PROVIDERS.ollama.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_PROVIDERS.ollama.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      })

      if (!response.ok) throw new Error('Ollama API failed')
      
      const result = await response.json()
      return this.parseAIResponse(result.response)
    } catch (error) {
      throw new Error(`Ollama failed: ${error.message}`)
    }
  }

  async useHuggingFace(prompt) {
    try {
      if (!this.hf) throw new Error('Hugging Face API key not configured')
      
      const result = await this.hf.textGeneration({
        model: AI_PROVIDERS.huggingface.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })

      return this.parseAIResponse(result.generated_text)
    } catch (error) {
      throw new Error(`Hugging Face failed: ${error.message}`)
    }
  }

  async useCohere(prompt) {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_PROVIDERS.cohere.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_PROVIDERS.cohere.model,
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      })

      if (!response.ok) throw new Error('Cohere API failed')
      
      const result = await response.json()
      return this.parseAIResponse(result.generations[0].text)
    } catch (error) {
      throw new Error(`Cohere failed: ${error.message}`)
    }
  }

  useFallback(type, data) {
    // Regel-based AI als backup - volledig gratis
    const fallbackInsights = {
      executiveSummary: this.generateExecutiveSummaryFallback(data),
      actionPlan: this.generateActionPlanFallback(data),
      riskAssessment: this.generateRiskAssessmentFallback(data),
      compliance: this.generateComplianceFallback(data)
    }

    return fallbackInsights[type] || 'Nederlandse carbon insights gegenereerd met regel-based AI.'
  }

  generateExecutiveSummaryFallback(data) {
    const emissionsPerEmployee = data.totalEmissions / data.employees
    const isHighEmitter = emissionsPerEmployee > 10
    const csrdRequired = data.employees > 250

    return `
**Executive Summary voor ${data.companyName}**

Met ${data.totalEmissions} ton CO2 uitstoot (${emissionsPerEmployee.toFixed(1)} ton per medewerker) presteert uw organisatie ${isHighEmitter ? 'onder' : 'boven'} het Nederlandse sectorgemiddelde voor ${data.industry}.

**CSRD Status:** ${csrdRequired ? 'Rapportage verplicht vanaf 2025' : 'Vrijwillige rapportage aanbevolen'}

**Top Prioriteiten:**
1. ${data.breakdown?.energy > 5 ? 'Groene energie transitie (30-50% reductie mogelijk)' : 'Energie efficiency optimalisatie'}
2. ${data.breakdown?.transport > 3 ? 'Fleet elektrificatie met SEEH subsidie' : 'Sustainable mobility programma'}
3. Nederlandse CO2-Prestatieladder certificering voor aanbestedingsvoordeel

**ROI Schatting:** €${Math.round(data.totalEmissions * 120).toLocaleString()} jaarlijkse besparingen mogelijk binnen 24 maanden door Nederlandse subsidies en efficiency maatregelen.
    `.trim()
  }

  generateActionPlanFallback(data) {
    const quickWins = []
    const mediumTerm = []
    const longTerm = []

    // Quick wins (0-6 maanden)
    if (data.breakdown?.energy > 2) {
      quickWins.push('LED verlichting upgrade (€2,000 investering, €800/jaar besparing)')
    }
    quickWins.push('CO2-Prestatieladder niveau 1 certificering (€3,000, aanbestedingsvoordeel)')
    
    if (data.employees >= 100) {
      quickWins.push('WPM rapportage implementatie (deadline 30 juni 2025)')
    }

    // Medium term (6-18 maanden)
    if (data.breakdown?.energy > 5) {
      mediumTerm.push('Groene energie contract via Nederlandse leveranciers (0% extra kosten)')
    }
    
    if (data.employees > 25) {
      mediumTerm.push('Elektrische lease auto\'s met €4,000 SEEH subsidie per voertuig')
    }

    mediumTerm.push('Smart building automation met EIA aftrek (30% belastingvoordeel)')

    // Long term (18+ maanden)
    longTerm.push('Zonnepanelen installatie met SDE++ subsidie')
    longTerm.push('Heat pump systeem voor volledig aardgasvrij')
    longTerm.push('Carbon neutral certificering via erkende standaarden')

    return `
**Nederlandse Implementatie Roadmap**

**Fase 1 - Quick Wins (0-6 maanden):**
${quickWins.map(item => `• ${item}`).join('\n')}

**Fase 2 - Structurele Verbeteringen (6-18 maanden):**
${mediumTerm.map(item => `• ${item}`).join('\n')}

**Fase 3 - Carbon Neutraliteit (18+ maanden):**
${longTerm.map(item => `• ${item}`).join('\n')}

**Totale Investering:** €${Math.round(data.totalEmissions * 800).toLocaleString()}
**Nederlandse Subsidies:** €${Math.round(data.totalEmissions * 200).toLocaleString()}
**Netto Investering:** €${Math.round(data.totalEmissions * 600).toLocaleString()}
**Payback Periode:** 18-24 maanden
    `.trim()
  }

  generateRiskAssessmentFallback(data) {
    const risks = []

    // CSRD risico
    if (data.employees > 250) {
      risks.push({
        type: 'CSRD Non-Compliance',
        level: 'KRITIEK',
        impact: 'Boetes tot €500,000 + reputatieschade',
        deadline: 'Maart 2025',
        action: 'Start CSRD gap analyse binnen 30 dagen'
      })
    }

    // CO2-heffing risico
    if (['Productie', 'Manufacturing', 'Bouw', 'Transport'].some(sector => 
        data.industry?.includes(sector))) {
      risks.push({
        type: 'CO2-Heffing Escalatie', 
        level: 'HOOG',
        impact: `€${Math.round(data.totalEmissions * 216).toLocaleString()} extra kosten per jaar in 2030`,
        timeline: 'Geleidelijke stijging tot 2030',
        action: 'Implementeer carbon reduction roadmap'
      })
    }

    // WPM risico
    if (data.employees >= 100) {
      risks.push({
        type: 'WPM Rapportage',
        level: 'MEDIUM',
        impact: 'Boetes bij non-compliance',
        deadline: '30 juni 2025',
        action: 'Set up mobility tracking systeem'
      })
    }

    return `
**Nederlandse Carbon Risico Analyse**

${risks.map(risk => `
**${risk.type}** - ${risk.level}
• Impact: ${risk.impact}
• Timeline: ${risk.deadline || risk.timeline}
• Actie: ${risk.action}
`).join('\n')}

**Aanbevolen Verzekeringen:**
• Carbon liability coverage: €2M - €10M
• Directors & Officers: €5M voor CSRD compliance
• Cyber security: €1M voor carbon data bescherming

**Overall Risico Score: ${risks.length > 2 ? 'HOOG' : risks.length > 1 ? 'MEDIUM' : 'LAAG'}**
    `.trim()
  }

  generateComplianceFallback(data) {
    const isCSRDRequired = data.employees > 250 || (data.revenue && data.revenue > 50)
    const readinessScore = this.calculateCSRDReadiness(data)

    return `
**CSRD Compliance Assessment**

**Status:** ${isCSRDRequired ? 'VERPLICHT - Eerste rapportage maart 2025' : 'VRIJWILLIG - Voorbereiding aanbevolen'}

**Readiness Score:** ${readinessScore}/100

**Vereiste Stappen:**
${isCSRDRequired ? 
  `• Double materiality assessment (deadline: december 2024)
• ESRS standaarden implementatie
• Third-party audit partner selecteren  
• Carbon accounting systeem setup
• Scope 1, 2 en 3 emissions inventory` :
  `• Voluntary CSRD preparation voor toekomstige verplichting
• Basic carbon footprint tracking
• Sustainability governance structuur
• Stakeholder engagement proces`
}

**Geschatte Kosten:**
• Software platform: €12,000 - €35,000/jaar
• Consultancy support: €25,000 - €75,000 setup
• Third-party verification: €15,000 - €50,000/jaar
• **Totaal jaar 1: €52,000 - €160,000**

**Nederlandse Voordelen:**
• CO2-Prestatieladder voordeel bij aanbestedingen
• Access tot groene financiering
• Verbeterde ESG rating en investor appeal
• Operational cost savings door efficiency
    `.trim()
  }

  calculateCSRDReadiness(data) {
    let score = 40 // Base score
    
    if (data.totalEmissions > 0) score += 20
    if (data.employees > 0) score += 15
    if (data.breakdown && Object.keys(data.breakdown).length > 3) score += 15
    if (data.industry) score += 10
    
    return Math.min(score, 100)
  }

  parseAIResponse(text) {
    // Clean up AI response en format voor Nederlandse context
    return text
      .replace(/\n\s*\n/g, '\n\n') // Clean extra whitespace
      .replace(/^\s+|\s+$/g, '') // Trim
      .slice(0, 2000) // Limit length
  }
}

export default new AIService()
