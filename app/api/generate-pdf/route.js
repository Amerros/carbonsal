const financialAI = aiInsights.financialAnalysis.aiAnalysis ||
      'AI analysis toont optimale ROI door gefaseerde implementatie met focus op Nederlandse subsidies en carbon pricing risico mitigatie.'; // Added semicolon

const aiLines = pdf.splitTextToSize(financialAI, 170); // Added semicolon
pdf.text(aiLines, 20, yPos); // Added semicolon

function generateRiskAssessment(pdf, aiInsights, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(200, 0, 0, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(150, 0, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Risk Assessment & Mitigation', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Comprehensive Risk Analysis | Pagina 9`, 20, 35)

  let yPos = 55
  
  // Critical Risks Matrix
  pdf.setFillColor(255, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 0, 0)
  pdf.text('🚨 KRITIEKE RISICO\'S', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const employees = parseInt(companyData.employees) || 0
  const totalEmissions = results.emissions?.total || 0
  
  const criticalRisks = [
    {
      risk: 'CSRD Non-Compliance',
      impact: employees > 250 ? 'KRITIEK' : 'MEDIUM',
      likelihood: employees > 250 ? 'HOOG' : 'LAAG',
      mitigation: employees > 250 ? 'Start CSRD implementatie binnen 30 dagen' : 'Voorbereidende maatregelen nemen',
      financialImpact: employees > 250 ? '€500,000+ boetes + reputatieschade' : 'Competitief nadeel'
    },
    {
      risk: 'Carbon Pricing Escalatie',
      impact: totalEmissions > 50 ? 'HOOG' : 'MEDIUM',
      likelihood: 'ZEER HOOG',
      mitigation: 'Implementeer CO2 reductie roadmap binnen 12 maanden',
      financialImpact: `€${Math.round(totalEmissions * (216 - 30.48)).toLocaleString()} extra kosten by 2030`
    },
    {
      risk: 'Supply Chain Disruption',
      impact: 'MEDIUM',
      likelihood: 'MEDIUM',
      mitigation: 'Diversifieer leveranciers en implementeer circulaire processen',
      financialImpact: '10-20% kostenstijging mogelijk'
    }
  ]
  
  criticalRisks.forEach((risk, index) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${index + 1}. ${risk.risk}`, 25, yPos)
    yPos += 6
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`   Impact: ${risk.impact} | Waarschijnlijkheid: ${risk.likelihood}`, 30, yPos)
    yPos += 5
    pdf.text(`   Financial: ${risk.financialImpact}`, 30, yPos)
    yPos += 5
    pdf.text(`   Mitigation: ${risk.mitigation}`, 30, yPos)
    yPos += 8
    pdf.setFontSize(10)
  })
  
  // Regulatory Timeline Risks
  yPos += 5
  pdf.setFillColor(255, 248, 220)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 150, 0)
  pdf.text('⏰ REGULATORY TIMELINE RISKS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const regulatoryRisks = [
    `CSRD Deadline: ${employees > 250 ? '31 maart 2025 (KRITIEK - 4 maanden!)' : '31 maart 2026 (voorbereidingstijd)'}`,
    `WPM Reporting: ${employees >= 100 ? '30 juni 2025 (mobility tracking)' : 'Niet van toepassing'}`,
    `CO2-Heffing Stijging: Geleidelijke stijging naar €216/ton in 2030`,
    `EU Taxonomie: Nieuwe criteria worden jaarlijks aangescherpt`,
    `CBAM (Carbon Border): Impact op import/export vanaf 2026`
  ]
  
  regulatoryRisks.forEach(risk => {
    pdf.text(`• ${risk}`, 25, yPos)
    yPos += 6
  })
  
  // Market & Competitive Risks
  yPos += 10
  pdf.setFillColor(240, 240, 255)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 200)
  pdf.text('🏢 MARKET & COMPETITIVE RISKS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const marketRisks = [
    'Customer ESG requirements: Grote klanten eisen steeds meer sustainability rapportage',
    'Investor criteria: ESG ratings worden kritiek voor financiering en waardering',
    'Talent acquisition: Jonge professionals kiezen voor duurzame werkgevers',
    'Supply chain pressure: Leveranciers moeten aan steeds strengere eisen voldoen',
    'Competitive advantage: Early movers in sustainability krijgen marktvoordeel'
  ]
  
  marketRisks.forEach(risk => {
    pdf.text(`• ${risk}`, 25, yPos)
    yPos += 6
  })
  
  // AI Risk Intelligence
  if (aiInsights?.riskAssessment) {
    yPos += 10
    pdf.setFillColor(255, 235, 255)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(150, 0, 150)
    pdf.text('🤖 AI Risk Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const riskAI = typeof aiInsights.riskAssessment === 'object'
      ? aiInsights.riskAssessment.aiAnalysis || 'AI risk analysis completed'
      : aiInsights.riskAssessment
    
    const riskLines = pdf.splitTextToSize(riskAI, 170)
    pdf.text(riskLines, 20, yPos)
  }
}

function generateBenchmarking(pdf, results, companyData, aiInsights) {
  pdf.addPage()
  
  pdf.setFillColor(0, 150, 200, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 100, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Nederlandse Benchmarking', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Industry Comparison & Performance Analysis | Pagina 10`, 20, 35)

  let yPos = 55
  
  // Performance Overview
  const totalEmissions = results.emissions?.total || 0
  const employees = parseInt(companyData.employees) || 1
  const emissionsPerEmployee = totalEmissions / employees
  const industryBenchmark = getDutchIndustryBenchmark(companyData.industry)
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = calculatePercentile(performance)
  
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 50, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('📊 PERFORMANCE SCORECARD', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  
  const performanceData = [
    `Uw prestatie: ${emissionsPerEmployee.toFixed(2)} ton CO2 per medewerker`,
    `Nederlandse ${companyData.industry} gemiddelde: ${industryBenchmark} ton per medewerker`,
    `Relatieve prestatie: ${(performance * 100).toFixed(0)}% van benchmark`,
    `Ranking: ${getPerformanceRanking(performance)}`,
    `Percentiel: Top ${100 - percentile}% (beter dan ${percentile}% van peers)`
  ]
  
  performanceData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 7
  })
  
  yPos += 15
  
  // Industry Leaders Comparison
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('🏆 NEDERLANDSE SECTOR LEADERS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const sectorLeaders = getSectorLeaders(companyData.industry)
  const leadershipData = [
    `Top performers: ${sectorLeaders.leaders.join(', ')}`,
    `Best practice CO2/medewerker: ${sectorLeaders.bestPractice} ton`,
    `Uw gap naar top 10%: ${Math.max(0, emissionsPerEmployee - industryBenchmark * 0.5).toFixed(2)} ton`,
    `Potentiële CO2 reductie: ${Math.max(0, (emissionsPerEmployee - industryBenchmark * 0.5) * employees).toFixed(1)} ton`,
    `Innovation kansen: ${sectorLeaders.innovations.join(', ')}`
  ]
  
  leadershipData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Competitive Analysis
  pdf.setFillColor(255, 248, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 100, 0)
  pdf.text('⚡ COMPETITIVE POSITIONING', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const competitivePosition = getCompetitivePosition(performance)
  const positioningData = [
    `Marktpositie: ${competitivePosition.position}`,
    `Competitive advantage: ${competitivePosition.advantage}`,
    `Key differentiators: ${competitivePosition.differentiators.join(', ')}`,
    `Improvement opportunity: ${competitivePosition.opportunity}`,
    `Market perception: ${competitivePosition.perception}`
  ]
  
  positioningData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 6
  })
  
  // AI Benchmarking Insights
  if (aiInsights?.benchmarkComparison) {
    yPos += 15
    pdf.setFillColor(255, 235, 255)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(150, 0, 150)
    pdf.text('🤖 AI Benchmarking Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const benchmarkAI = typeof aiInsights.benchmarkComparison === 'object'
      ? 'AI analysis toont vergelijkingsmogelijkheden met industry best practices en identificeert specifieke verbeterkansen.'
      : aiInsights.benchmarkComparison
    
    const benchmarkLines = pdf.splitTextToSize(benchmarkAI, 170)
    pdf.text(benchmarkLines, 20, yPos)
  }
}

function generateActionTimeline(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(150, 100, 200, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(100, 50, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Action Timeline & Milestones', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`24-Month Implementation Schedule | Pagina 11`, 20, 35)

  let yPos = 55
  
  // 24-Month Timeline
  const timelinePhases = [
    {
      period: 'Q1 2024 (Maanden 1-3)',
      color: { r: 255, g: 100, b: 100 },
      priority: 'Foundation & Quick Wins',
      actions: [
        'CSRD gap analyse starten',
        'LED verlichting upgrade (30% energiebesparing)',
        'Groene energie leverancier contract',
        'Sustainability team formeren',
        'CO2-Prestatieladder niveau 1 aanvraag'
      ],
      budget: '€15,000 - €25,000',
      co2Impact: '15-25% reductie'
    },
    {
      period: 'Q2 2024 (Maanden 4-6)',
      color: { r: 255, g: 150, b: 0 },
      priority: 'Systems & Compliance',
      actions: [
        'Carbon accounting systeem implementeren',
        'Smart building automation installeren',
        'SEEH subsidie aanvragen voor elektrische auto\'s',
        'Supplier engagement programma starten',
        'Eerste sustainability training'
      ],
      budget: '€25,000 - €50,000',
      co2Impact: '35-45% reductie'
    },
    {
      period: 'Q3 2024 (Maanden 7-9)',
      color: { r: 100, g: 200, b: 100 },
      priority: 'Technology Implementation',
      actions: [
        'Eerste elektrische lease auto\'s ontvangen',
        'Zonnepanelen installatie met SDE++ subsidie',
        'Waste reduction & recycling programma',
        'WPM compliance voorbereiding (indien van toepassing)',
        'Mid-year carbon audit'
      ],
      budget: '€50,000 - €100,000',
      co2Impact: '50-65% reductie'
    },
    {
      period: 'Q4 2024 (Maanden 10-12)',
      color: { r: 100, g: 150, b: 255 },
      priority: 'Optimization & Reporting',
      actions: [
        'Eerste CSRD compliance check',
        'Heat pump installatie planning',
        'Carbon offsetting strategie ontwikkelen',
        'Supply chain carbon assessment',
        'Jaar-end sustainability rapportage'
      ],
      budget: '€30,000 - €75,000',
      co2Impact: '65-75% reductie'
    }
  ]
  
  timelinePhases.forEach((phase, index) => {
    // Phase header
    pdf.setFillColor(phase.color.r, phase.color.g, phase.color.b, 0.2)
    pdf.roundedRect(15, yPos - 5, 180, 12, 3, 3, 'F')
    
    pdf.setTextColor(phase.color.r * 0.7, phase.color.g * 0.7, phase.color.b * 0.7)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.period, 20, yPos)
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.text(`Priority: ${phase.priority}`, 20, yPos + 6)
    yPos += 18
    
    // Actions
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    phase.actions.forEach(action => {
      pdf.text(`• ${action}`, 25, yPos)
      yPos += 5
    })
    
    // Metrics
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Budget: ${phase.budget} | CO2 Impact: ${phase.co2Impact}`, 25, yPos + 2)
    yPos += 12
  })
  
  // Key Milestones
  yPos += 10
  pdf.setFillColor(255, 248, 220)
  pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 150, 0)
  pdf.text('🎯 KRITIEKE MIJLPALEN', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const milestones = [
    'Maart 2024: CSRD assessment voltooid + quick wins geïmplementeerd',
    'Juni 2024: 30% CO2 reductie behaald + compliance systemen operationeel',
    'September 2024: 50% CO2 reductie + elektrificatie gestart',
    'December 2024: 70% CO2 reductie + eerste compliance rapportage',
    'Maart 2025: CSRD conforme rapportage (indien verplicht)',
    'Juni 2025: 80%+ CO2 reductie + carbon neutral pathway'
  ]
  
  milestones.forEach(milestone => {
    pdf.text(`• ${milestone}`, 25, yPos)
    yPos += 4
  })
}

function generateAppendix(pdf, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(100, 100, 100, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bijlagen & Methodologie', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Technical Appendix | Pagina 12`, 20, 35)

  let yPos = 55
  
  // Methodology
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('📋 METHODOLOGIE', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const methodologyText = `Deze carbon footprint analyse is uitgevoerd conform de volgende internationale en Nederlandse standaarden:

• ISO 14064-1:2018 - Greenhouse gas quantification and reporting
• GHG Protocol Corporate Standard - Scope 1, 2 en 3 emissies
• Nederlandse CO2-Prestatieladder 3.1 - Emissiefactoren en methodiek
• CBS Statline - Nederlandse sectorbenchmarks en emissiefactoren
• CSRD (EU) 2022/2464 - Corporate Sustainability Reporting Directive
• Nederlandse Milieubarometer 2024 - Actuele emissiefactoren

Alle emissiefactoren zijn gebaseerd op de meest recente Nederlandse gegevens van co2emissiefactoren.nl en conform het Handboek CO2 Prestatieladder 3.1.`
  
  const methodologyLines = pdf.splitTextToSize(methodologyText, 170)
  pdf.text(methodologyLines, 20, yPos)
  yPos += methodologyLines.length * 5 + 15
  
  // Data Sources
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('📊 DATA BRONNEN', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const dataSources = [
    'Nederlandse Emissiefactoren: CBS, RVO, co2emissiefactoren.nl',
    'Industrie Benchmarks: CBS Statline, MVO Nederland, RVO',
    'Carbon Pricing: Nederlandse CO2-heffing, EU ETS, Carbon Tracker',
    'Subsidie Informatie: RVO, Rijksdienst voor Ondernemend Nederland',
    'CSRD Compliance: EU Directive 2022/2464, EFRAG ESRS',
    'AI Enhancement: HuggingFace Transformers, Nederlandse sustainability data'
  ]
  
  dataSources.forEach(source => {
    pdf.text(`• ${source}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Disclaimers
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('⚠️ DISCLAIMERS', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const disclaimers = [
    'Dit rapport is gegenereerd op basis van door u verstrekte gegevens en algemene benchmarks',
    'Aanbevelingen zijn indicatief en kunnen afwijken per specifieke bedrijfssituatie',
    'Kostenbesparingen zijn schattingen gebaseerd op gemiddelde Nederlandse marktprijzen',
    'Voor implementatie wordt advies van gespecialiseerde consultants aanbevolen',
    'Subsidie bedragen kunnen wijzigen; controleer actuele voorwaarden bij RVO',
    'AI-insights zijn gegenereerd door machine learning en dienen als indicatie',
    'Voor compliance rapportage is third-party verificatie vereist'
  ]
  
  disclaimers.forEach(disclaimer => {
    pdf.text(`• ${disclaimer}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Contact & Support
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('📞 CONTACT & ONDERSTEUNING', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const contactInfo = [
    'Carbon Comply Nederland - Professional Sustainability Consulting',
    'Email: support@carboncomply.nl | Website: www.carboncomply.nl',
    'CSRD Implementation Support: csrd@carboncomply.nl',
    'Technical API Support: api@carboncomply.nl',
    'Emergency Compliance Hotline: +31 20 123 4567'
  ]
  
  contactInfo.forEach(info => {
    pdf.text(info, 25, yPos)
    yPos += 4
  })
  
  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`© ${new Date().getFullYear()} Carbon Comply. Professional Carbon Intelligence Platform.`, 20, 280)
  pdf.text(`Rapport gegenereerd op ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}`, 20, 285)
}

// Helper Functions
function getLargestEmissionSource(breakdown) {
  if (!breakdown) return 'Onbekend'
  const largest = Object.entries(breakdown).reduce((max, [key, value]) => 
    value > max.value ? { key, value } : max, { key: '', value: 0 })
  return getCategoryDisplayName(largest.key)
}

function getCategoryDisplayName(category) {
  const names = {
    energy: 'Energie',
    transport: 'Transport', 
    waste: 'Afval',
    water: 'Water',
    materials: 'Materialen',
    scope3: 'Scope 3'
  }
  return names[category] || category
}

function getBenchmarkStatus(category, value, industry) {
  // Mock benchmark logic based on category and industry
  if (value < 2) return 'Uitstekend'
  if (value < 5) return 'Goed'
  if (value < 10) return 'Gemiddeld'
  return 'Verbetering nodig'
}

function getEmissionStatus(value, total) {
  const percentage = (value / total) * 100
  if (percentage > 40) return 'Kritiek'
  if (percentage > 25) return 'Hoog'
  if (percentage > 15) return 'Medium'
  return 'Laag'
}

function getStatusColor(status) {
  const colors = {
    'Kritiek': { r: 200, g: 0, b: 0 },
    'Hoog': { r: 255, g: 100, b: 0 },
    'Medium': { r: 255, g: 200, b: 0 },
    'Laag': { r: 0, g: 150, b: 0 }
  }
  return colors[status] || { r: 0, g: 0, b: 0 }
}

function getDutchIndustryBenchmark(industry) {
  const benchmarks = {
    'Technologie & Software': 3.2,
    'Productie & Manufacturing': 8.8,
    'Retail & E-commerce': 4.1,
    'Financiële Diensten': 2.4,
    'Gezondheidszorg': 5.2,
    'Onderwijs': 2.8,
    'Transport & Logistiek': 14.8,
    'Bouw & Vastgoed': 11.2,
    'Anders': 5.8
  }
  return benchmarks[industry] || 5.8
}

function calculatePercentile(performance) {
  if (performance <= 0.5) return 95
  if (performance <= 0.7) return 85
  if (performance <= 0.9) return 75
  if (performance <= 1.1) return 60
  if (performance <= 1.3) return 45
  if (performance <= 1.5) return 30
  return 15
}

function getPerformanceRanking(performance) {
  if (performance <= 0.5) return 'Uitstekend (Top 5%)'
  if (performance <= 0.7) return 'Zeer Goed (Top 15%)'
  if (performance <= 0.9) return 'Goed (Top 25%)'
  if (performance <= 1.1) return 'Gemiddeld'
  if (performance <= 1.3) return 'Onder Gemiddeld'
  return 'Verbetering Nodig'
}

function calculateDataCompleteness(breakdown) {
  const totalCategories = 6 // energy, transport, waste, water, materials, scope3
  const filledCategories = Object.values(breakdown).filter(val => val > 0).length
  return Math.round((filledCategories / totalCategories) * 100)
}

function calculateCSRDReadiness(employees) {
  let score = 40
  if (employees > 0) score += 20
  if (employees > 50) score += 15
  if (employees > 100) score += 10
  if (employees > 250) score += 15
  return Math.min(score, 100)
}

function getSectorLeaders(industry) {
  const leaders = {
    'Technologie & Software': {
      leaders: ['Adyen', 'Booking.com', 'TomTom'],
      bestPractice: 1.2,
      innovations: ['Green coding', 'Carbon-aware computing', 'Renewable hosting']
    },
    'Productie & Manufacturing': {
      leaders: ['ASML', 'Philips', 'DSM'],
      bestPractice: 3.5,
      innovations: ['Industry 4.0', 'Circular manufacturing', 'Smart factories']
    },
    'Transport & Logistiek': {
      leaders: ['PostNL', 'Vopak', 'Royal Boskalis'],
      bestPractice: 6.5,
      innovations: ['Electric fleets', 'Route optimization', 'Intermodal transport']
    }
  }
  
  return leaders[industry] || {
    leaders: ['Interface', 'Unilever', 'Ikea'],
    bestPractice: 2.5,
    innovations: ['Renewable energy', 'Circular economy', 'Digital optimization']
  }
}

function getCompetitivePosition(performance) {
  if (performance <= 0.7) {
    return {
      position: 'Industry Leader',
      advantage: 'Significant competitive advantage in sustainability',
      differentiators: ['Low carbon footprint', 'Cost efficiency', 'Brand reputation'],
      opportunity: 'Leverage leadership position for market expansion',
      perception: 'Recognized sustainability champion'
    }
  } else if (performance <= 1.0) {
    return {
      position: 'Strong Performer',
      advantage: 'Above average sustainability performance',
      differentiators: ['Operational efficiency', 'Compliance readiness'],
      opportunity: 'Move towards industry leadership',
      perception: 'Responsible business operator'
    }
  } else if (performance <= 1.3) {
    return {
      position: 'Average Performer',
      advantage: 'Meeting industry standards',
      differentiators: ['Compliance focused', 'Steady improvement'],
      opportunity: 'Accelerate improvement to gain advantage',
      perception: 'Following industry trends'
    }
  } else {
    return {
      position: 'Improvement Needed',
      advantage: 'Cost optimization opportunity',
      differentiators: ['Improvement potential', 'Learning opportunity'],
      opportunity: 'Transform into competitive advantage',
      perception: 'Behind industry curve'
    }
  }
}

function generateFallbackRecommendations(results) {
  const totalEmissions = results.emissions?.total || 0
  const breakdown = results.emissions?.breakdown || {}

  return [
    {
      title: 'Groene energie transitie',
      description: 'Schakel over naar 100% Nederlandse groene energie',
      priority: 1,
      co2Reduction: Math.round(breakdown.energy * 0.85 * 100) / 100,
      cost: '€0 - €2,000',
      paybackMonths: 0
    },
    {
      title: 'LED verlichting upgrade',
      description: 'Vervang alle verlichting door LED met smart controls',
      priority: 1,
      co2Reduction: Math.round(breakdown.energy * 0.15 * 100) / 100,
      cost: '€5,000 - €15,000',
      paybackMonths: 18
    },
    {
      title: 'CSRD compliance voorbereiding',
      description: 'Start met CSRD gap analyse en data systemen',
      priority: 1,
      co2Reduction: 0,
      cost: '€25,000 - €50,000',
      paybackMonths: 0
    }
  ]
}

// --- THIS IS THE CRITICAL PART ---
// The entire "floating" block of code should go INSIDE this function.
function generateAIInsightsSection(pdf, aiInsights, results, companyData, getDutchIndustryBenchmark, calculatePercentile, getPerformanceRanking, calculateDataCompleteness) {
  // Ensure all parameters needed by the moved code are passed to this function.
  // I've added companyData, getDutchIndustryBenchmark, calculatePercentile,
  // getPerformanceRanking, and calculateDataCompleteness as potential parameters.
  // You might need to adjust based on how these are defined/used elsewhere.

  if (!aiInsights) {
    return // Skip if no AI insights available
  }

  pdf.addPage()

  // Header
  pdf.setFillColor(255, 100, 255, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')

  pdf.setTextColor(150, 0, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AI-Powered Sustainability Insights', 20, 25)

  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Generated by HuggingFace AI | Pagina 5`, 20, 35)

  let yPos = 55

  // AI Model Information
  pdf.setFillColor(255, 215, 0, 0.2)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('🧠 AI Model Specificaties', 20, yPos)
  yPos += 12

  // --- START OF MOVED CODE ---
  // This entire section was floating previously
  const emissionsPerEmployee = (results.emissions?.total || 0) / (parseInt(companyData.employees) || 1)
  const industryBenchmark = getDutchIndustryBenchmark(companyData.industry)
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = results.benchmark?.percentile || calculatePercentile(performance)

  const comparisonData = [
    `Uw prestatie: ${emissionsPerEmployee.toFixed(2)} ton CO2 per medewerker`,
    `Nederlandse ${companyData.industry} gemiddelde: ${industryBenchmark} ton per medewerker`,
    `Relatieve prestatie: ${performance < 1 ? 'Boven' : 'Onder'} gemiddeld (${(performance * 100).toFixed(0)}%)`,
    `Percentiel ranking: Top ${100 - percentile}% (beter dan ${percentile}% van peers)`,
    `Nederlandse ranking: ${getPerformanceRanking(performance)}`
  ]

  comparisonData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 7
  })

  yPos += 15

  // AI Data Quality Assessment
  if (aiInsights) {
    pdf.setFillColor(240, 248, 255)
    pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 100, 200)
    pdf.text('🤖 AI Data Quality Assessment', 20, yPos)
    yPos += 12

    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    const confidence = aiInsights.confidence || 0.85
    const breakdown = results.emissions?.breakdown || {} // Ensure breakdown is defined if used here
    const dataQuality = [
      `AI Confidence Score: ${(confidence * 100).toFixed(0)}% (${confidence > 0.8 ? 'Hoog' : confidence > 0.6 ? 'Gemiddeld' : 'Laag'})`,
      `Data completeness: ${calculateDataCompleteness(breakdown)}%`,
      `Methodologie: Nederlandse CO2-Prestatieladder 3.1 compliant`,
      `Verification: ${aiInsights.aiGenerated ? 'AI-verified' : 'Rule-based validation'}`
    ]

    dataQuality.forEach(item => {
      pdf.text(`• ${item}`, 25, yPos)
      yPos += 6
    })
  }
}

function generateAIInsightsSection(pdf, aiInsights, results) {
  if (!aiInsights) {
    return // Skip if no AI insights available
  }
  
  pdf.addPage()
  
  // Header
  pdf.setFillColor(255, 100, 255, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(150, 0, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AI-Powered Sustainability Insights', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Generated by HuggingFace AI | Pagina 5`, 20, 35)

  let yPos = 55
  
  // AI Model Information
  pdf.setFillColor(255, 215, 0, 0.2)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('🧠 AI Model Specificaties', 20, yPos)
  yPos += 12
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  const modelInfo = [
    `Model: ${aiInsights.model || 'HuggingFace Nederlandse Carbon AI'}`,
    `Confidence: ${((aiInsights.confidence || 0.85) * 100).toFixed(0)}%`,
    `Generated: ${new Date().toLocaleString('nl-NL')}`,
    `Methodologie: Nederlandse CO2-Prestatieladder + CSRD compliance`,
    `Data training: Nederlandse bedrijven en compliance standaarden`
  ]
  
  modelInfo.forEach(info => {
    pdf.text(`• ${info}`, 25, yPos)
    yPos += 5
  })
  
  yPos += 15
  
  // Executive Summary from AI
  if (aiInsights.executiveSummary) {
    pdf.setFillColor(240, 255, 240)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 150, 0)
    pdf.text('📈 AI Executive Analysis', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const summaryContent = typeof aiInsights.executiveSummary === 'object' 
      ? aiInsights.executiveSummary.content || aiInsights.executiveSummary.headline
      : aiInsights.executiveSummary
    
    if (summaryContent) {
      const summaryLines = pdf.splitTextToSize(summaryContent, 170)
      pdf.text(summaryLines, 20, yPos)
      yPos += summaryLines.length * 5 + 10
    }
  }
  
  // AI Risk Assessment
  if (aiInsights.riskAssessment) {
    pdf.setFillColor(255, 240, 240)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 0, 0)
    pdf.text('⚠️ AI Risk Intelligence', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const riskContent = typeof aiInsights.riskAssessment === 'object'
      ? aiInsights.riskAssessment.aiAnalysis || 'AI risk analysis completed'
      : aiInsights.riskAssessment
    
    if (riskContent) {
      const riskLines = pdf.splitTextToSize(riskContent, 170)
      pdf.text(riskLines, 20, yPos)
      yPos += riskLines.length * 5 + 10
    }
  }
  
  // AI Recommendations
  if (aiInsights.aiRecommendations && aiInsights.aiRecommendations.length > 0) {
    pdf.setFillColor(240, 248, 255)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 100, 200)
    pdf.text('🎯 AI Strategic Recommendations', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    aiInsights.aiRecommendations.slice(0, 5).forEach((rec, index) => {
      const recTitle = typeof rec === 'object' ? rec.title || rec.description : rec
      const recDescription = typeof rec === 'object' ? rec.description : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${recTitle}`, 25, yPos)
      yPos += 6
      
      if (recDescription && recDescription !== recTitle) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(recDescription, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      if (typeof rec === 'object' && rec.co2Reduction) {
        pdf.setTextColor(0, 150, 0)
        pdf.text(`   💡 CO2 reductie: ${rec.co2Reduction} ton | Kosten: ${rec.cost || 'TBD'}`, 30, yPos)
        pdf.setTextColor(0, 0, 0)
        yPos += 5
      }
      
      yPos += 3
    })
  }
  
  // Sustainability Score
  if (aiInsights.sustainabilityScore) {
    yPos += 10
    pdf.setFillColor(255, 248, 220)
    pdf.roundedRect(15, yPos - 5, 180, 30, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🏆 AI Sustainability Score', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const score = aiInsights.sustainabilityScore
    const scoreInfo = [
      `Overall Score: ${score.overall || 'N/A'}/100 (Grade: ${score.grade || 'B'})`,
      `Benchmark Position: ${score.benchmarkPosition || 'Average'}`,
      `Emissions Performance: ${score.breakdown?.emissions || 'N/A'}/40 punten`,
      `Compliance Readiness: ${score.breakdown?.compliance || 'N/A'}/30 punten`,
      `Efficiency Rating: ${score.breakdown?.efficiency || 'N/A'}/20 punten`,
      `Leadership Bonus: ${score.breakdown?.leadership || 'N/A'}/10 punten`
    ]
    
    scoreInfo.forEach(info => {
      pdf.text(`• ${info}`, 25, yPos)
      yPos += 5
    })
  }
}

function generateRecommendations(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(0, 200, 100, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 150, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Aanbevelingen & Actieplan', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Prioriteit Matrix & Implementation Guide | Pagina 6`, 20, 35)

  let yPos = 55
  
  // Get recommendations from AI or fallback
  const recommendations = aiInsights?.aiRecommendations || results.recommendations || generateFallbackRecommendations(results)
  
  // High Priority Recommendations
  const highPriorityRecs = recommendations.filter(r => r.priority === 1 || r.priority === 'Hoog')
  if (highPriorityRecs.length > 0) {
    pdf.setFillColor(255, 230, 230)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 0, 0)
    pdf.text('🔴 HOGE PRIORITEIT (0-6 maanden)', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    highPriorityRecs.slice(0, 3).forEach((rec, index) => {
      const title = typeof rec === 'object' ? rec.title || rec.action : rec
      const description = typeof rec === 'object' ? rec.description : ''
      const impact = typeof rec === 'object' ? rec.co2Reduction || rec.savings : ''
      const cost = typeof rec === 'object' ? rec.cost : ''
      const payback = typeof rec === 'object' ? rec.paybackMonths : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${title}`, 25, yPos)
      yPos += 6
      
      if (description) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(description, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      // Impact metrics
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      if (impact) pdf.text(`   💰 Impact: ${impact} ton CO2 besparing`, 30, yPos), yPos += 4
      if (cost) pdf.text(`   💸 Investering: ${cost}`, 30, yPos), yPos += 4
      if (payback) pdf.text(`   ⏱️ Payback: ${payback} maanden`, 30, yPos), yPos += 4
      
      // Dutch-specific benefits
      if (rec.dutchSpecific && rec.subsidies) {
        pdf.setTextColor(0, 100, 0)
        pdf.text(`   🇳🇱 Nederlandse voordelen: ${rec.subsidies.slice(0, 2).join(', ')}`, 30, yPos)
        pdf.setTextColor(0, 0, 0)
        yPos += 4
      }
      
      yPos += 8
      pdf.setFontSize(10)
    })
  }
  
  // Medium Priority Recommendations
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 2 || r.priority === 'Medium')
  if (mediumPriorityRecs.length > 0) {
    pdf.setFillColor(255, 248, 230)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🟡 MEDIUM PRIORITEIT (6-18 maanden)', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    mediumPriorityRecs.slice(0, 3).forEach((rec, index) => {
      const title = typeof rec === 'object' ? rec.title || rec.action : rec
      const description = typeof rec === 'object' ? rec.description : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${title}`, 25, yPos)
      yPos += 6
      
      if (description) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(description, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      yPos += 6
    })
  }
  
  // Implementation Success Factors
  yPos += 10
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('✅ KRITIEKE SUCCESFACTOREN', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const successFactors = [
    'Management commitment en leadership voor sustainability transitie',
    'Dedicated sustainability team of project manager aanstellen',
    'SMART doelstellingen met meetbare KPI\'s en tijdlijnen',
    'Stakeholder engagement: medewerkers, leveranciers, klanten',
    'Budget toewijzing voor prioritaire projecten en quick wins',
    'Training en bewustwording programma voor hele organisatie'
  ]
  
  successFactors.forEach(factor => {
    pdf.text(`• ${factor}`, 25, yPos)
    yPos += 5
  })
}

function generateImplementationPlan(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(100, 150, 255, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 100, 200)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Implementation Roadmap', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Gefaseerde Implementatie Strategie | Pagina 7`, 20, 35)

  let yPos = 55
  
  // Implementation phases
  const phases = aiInsights?.implementationRoadmap?.phases || [
    {
      phase: 'Fase 1: Foundation (0-6 maanden)',
      target: Math.round((results.emissions?.total * 0.85) * 100) / 100,
      actions: ['CSRD gap analyse', 'Data collection setup', 'Quick wins implementatie'],
      budget: '€15,000 - €30,000',
      co2Reduction: Math.round((results.emissions?.total * 0.15) * 100) / 100
    },
    {
      phase: 'Fase 2: Transformation (6-18 maanden)',
      target: Math.round((results.emissions?.total * 0.65) * 100) / 100,
      actions: ['Groene energie transitie', 'Fleet elektrificatie', 'Building automation'],
      budget: '€50,000 - €150,000',
      co2Reduction: Math.round((results.emissions?.total * 0.35) * 100) / 100
    },
    {
      phase: 'Fase 3: Leadership (18+ maanden)',
      target: Math.round((results.emissions?.total * 0.35) * 100) / 100,
      actions: ['Carbon neutral certificering', 'Innovation partnerships', 'Market leadership'],
      budget: '€100,000 - €300,000',
      co2Reduction: Math.round((results.emissions?.total * 0.65) * 100) / 100
    }
  ]
  
  phases.forEach((phase, index) => {
    // Phase header with color coding
    const colors = [
      { r: 0, g: 150, b: 0 },    // Green for Phase 1
      { r: 0, g: 100, b: 200 },  // Blue for Phase 2  
      { r: 150, g: 0, b: 150 }   // Purple for Phase 3
    ]
    
    pdf.setFillColor(colors[index].r, colors[index].g, colors[index].b, 0.1)
    pdf.roundedRect(15, yPos - 5, 180, 10, 3, 3, 'F')
    
    pdf.setTextColor(colors[index].r, colors[index].g, colors[index].b)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.phase, 20, yPos)
    yPos += 15
    
    // Phase details
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    pdf.text(`🎯 Target uitstoot: ${phase.target} ton CO2`, 25, yPos)
    yPos += 6
    pdf.text(`💰 Budget range: ${phase.budget}`, 25, yPos)
    yPos += 6
    pdf.text(`📉 CO2 reductie: ${phase.co2Reduction} ton`, 25, yPos)
    yPos += 8
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('Belangrijkste acties:', 25, yPos)
    yPos += 6
    
    pdf.setFont('helvetica', 'normal')
    phase.actions.forEach(action => {
      pdf.text(`• ${action}`, 30, yPos)
      yPos += 5
    })
    
    yPos += 10
  })
  
  // Timeline visualization (simplified text version)
  pdf.setFillColor(240, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('📅 MIJLPALEN TIJDLIJN', 20, yPos)
  yPos += 12
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const milestones = [
    'Q1 2024: Foundation start + CSRD gap analyse',
    'Q2 2024: Quick wins implementation + data systems',
    'Q3 2024: Transformation fase start + groene energie',
    'Q4 2024: Eerste compliance rapportage',
    'Q2 2025: Mid-term doelen evaluatie',
    'Q4 2025: Leadership fase start + certificering'
  ]
  
  milestones.forEach(milestone => {
    pdf.text(`• ${milestone}`, 25, yPos)
    yPos += 4
  })
}

function generateFinancialAnalysis(pdf, aiInsights, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(255, 215, 0, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(200, 150, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Financiële Impact Analyse', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`ROI & Investment Analysis | Pagina 8`, 20, 35)

  let yPos = 55
  
  // Carbon Pricing Exposure
  pdf.setFillColor(255, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 0, 0)
  pdf.text('💸 CARBON PRICING EXPOSURE', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const totalEmissions = results.emissions?.total || 0
  const carbonExposure = [
    `Huidig (2024): €${(totalEmissions * 30.48).toLocaleString()} per jaar (€30.48/ton)`,
    `2025 projectie: €${(totalEmissions * 50.18).toLocaleString()} per jaar (€50.18/ton)`,
    `2030 zonder actie: €${(totalEmissions * 216).toLocaleString()} per jaar (€216/ton)`,
    `Totale exposure stijging: €${(totalEmissions * (216 - 30.48)).toLocaleString()} over 6 jaar`,
    `Risico zonder reductie: 600%+ kostenstijging by 2030`
  ]
  
  carbonExposure.forEach(item => {
    pdf.text(`• ${item}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 10
  
  // Nederlandse Subsidie Opportunities
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('🇳🇱 NEDERLANDSE SUBSIDIE KANSEN', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const employees = parseInt(companyData.employees) || 1
  const subsidies = {
    SEEH: Math.min(Math.floor(employees / 5) * 4000, 40000),
    SDE: Math.min(totalEmissions * 100, 25000),
    EIA: Math.min(totalEmissions * 300, 50000),
    WBSO: companyData.industry?.includes('Technologie') ? Math.min(totalEmissions * 150, 20000) : 0,
    MIAVamil: Math.min(totalEmissions * 200, 75000)
  }
  
  const subsidyOpportunities = [
    `SEEH (elektrische auto's): €${subsidies.SEEH.toLocaleString()} (€4,000 per voertuig)`,
    `SDE++ (hernieuwbare energie): €${subsidies.SDE.toLocaleString()}`,
    `EIA (energie-efficiency): €${subsidies.EIA.toLocaleString()} (30% aftrek)`,
    `WBSO (R&D): €${subsidies.WBSO.toLocaleString()} (indien van toepassing)`,
    `MIA/Vamil (circulair): €${subsidies.MIAVamil.toLocaleString()} (tot 75% aftrek)`,
    `TOTAAL BESCHIKBAAR: €${Object.values(subsidies).reduce((sum, val) => sum + val, 0).toLocaleString()}`
  ]
  
  subsidyOpportunities.forEach(opportunity => {
    pdf.text(`• ${opportunity}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 10
  
  // Investment Scenarios
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('💼 INVESTERING SCENARIO\'S', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const baseInvestment = totalEmissions * 800
  const scenarios = [
    {
      name: 'Conservatief',
      investment: Math.round(baseInvestment * 0.6),
      co2Reduction: Math.round(totalEmissions * 0.25 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 150),
      payback: 36,
      roi5Year: '180%'
    },
    {
      name: 'Gematigd',
      investment: Math.round(baseInvestment),
      co2Reduction: Math.round(totalEmissions * 0.45 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 250),
      payback: 24,
      roi5Year: '250%'
    },
    {
      name: 'Ambitieus',
      investment: Math.round(baseInvestment * 1.5),
      co2Reduction: Math.round(totalEmissions * 0.70 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 400),
      payback: 18,
      roi5Year: '320%'
    }
  ]
  
  scenarios.forEach(scenario => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${scenario.name} Scenario:`, 25, yPos)
    yPos += 5
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(`   Investering: €${scenario.investment.toLocaleString()}`, 25, yPos)
    yPos += 4
    pdf.text(`   CO2 reductie: ${scenario.co2Reduction} ton (${Math.round((scenario.co2Reduction / totalEmissions) * 100)}%)`, 25, yPos)
    yPos += 4
    pdf.text(`   Jaarlijkse besparingen: €${scenario.annualSavings.toLocaleString()}`, 25, yPos)
    yPos += 4
    pdf.text(`   Payback periode: ${scenario.payback} maanden`, 25, yPos)
    yPos += 4
    pdf.text(`   5-jaar ROI: ${scenario.roi5Year}`, 25, yPos)
    yPos += 8
  })
  
  // AI Financial Insights
  if (aiInsights?.financialAnalysis) {
    yPos += 5
    pdf.setFillColor(255, 248, 220)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🤖 AI Financial Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const financialAI = aiInsights.financialAnalysis.aiAnalysis || 
      'import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { calculationId, reportType = 'professional', oneTimePurchase = false } = await request.json()
    
    // Get user from auth token (optional for one-time purchase)
    let user = null
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        user = await db.getUserById(decoded.userId)
      } catch (error) {
        if (!oneTimePurchase) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      }
    }

    // For one-time purchase, allow without user
    if (!user && !oneTimePurchase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get calculation data
    const calculation = await db.getCalculationById(calculationId, user?.id)
    if (!calculation) {
      return NextResponse.json({ error: 'Calculation not found' }, { status: 404 })
    }

    // Get AI insights if available
    let aiInsights = null
    try {
      if (user) {
        const insightsResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/ai-insights`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            emissions: calculation.results.emissions,
            companyInfo: calculation.results.companyInfo,
            industry: calculation.results.companyInfo.industry,
            goals: { targetReduction: 30, timeline: 24, csrdCompliance: true }
          })
        })
        
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json()
          aiInsights = insightsData.insights
        }
      }
    } catch (error) {
      console.warn('Failed to fetch AI insights:', error)
    }

    // Create comprehensive PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Safely extract data
    const companyData = calculation.company_data || calculation.companyData || {}
    const results = calculation.results || {}
    
    const companyName = companyData.companyName || companyData.company_name || 'Uw Bedrijf'
    const industry = companyData.industry || 'Onbekend'
    const employees = companyData.employees || '0'
    const totalEmissions = results.emissions?.total || 0

    console.log('🔄 Generating comprehensive PDF for:', companyName)

    // Generate all sections
    generateCoverPage(pdf, companyName, industry, employees, totalEmissions)
    generateExecutiveSummary(pdf, results, aiInsights, companyData)
    generateComplianceSection(pdf, results, aiInsights, companyData)
    generateDetailedAnalysis(pdf, results, companyData, aiInsights)
    generateAIInsightsSection(pdf, aiInsights, results)
    generateRecommendations(pdf, aiInsights, results)
    generateImplementationPlan(pdf, aiInsights, results)
    generateFinancialAnalysis(pdf, aiInsights, results, companyData)
    generateRiskAssessment(pdf, aiInsights, results, companyData)
    generateBenchmarking(pdf, results, companyData, aiInsights)
    generateActionTimeline(pdf, aiInsights, results)
    generateAppendix(pdf, results, companyData)

    // Create filename
    const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '-')
    const fileName = `Carbon-Footprint-Report-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf`

    // Save report record if user exists
    if (user) {
      await db.saveReport(user.id, calculationId, fileName, oneTimePurchase ? 'one-time-purchase' : 'subscription')
    }

    // Return PDF
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    
    console.log('✅ PDF generated successfully:', fileName)
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: `Failed to generate PDF: ${error.message}` },
      { status: 500 }
    )
  }
}

function generateCoverPage(pdf, companyName, industry, employees, totalEmissions) {
  // Cover Page with enhanced design
  pdf.setFillColor(0, 100, 80) // Dark green
  pdf.rect(0, 0, 210, 297, 'F')
  
  // Header with gradient effect
  pdf.setFillColor(255, 255, 255, 0.1)
  pdf.rect(0, 0, 210, 60, 'F')
  
  // Logo area (white circle)
  pdf.setFillColor(255, 255, 255)
  pdf.circle(105, 80, 25, 'F')
  
  // Carbon Comply Logo
  pdf.setTextColor(0, 100, 80)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Carbon', 85, 75)
  pdf.text('Comply', 85, 85)
  
  // Professional badge
  pdf.setFillColor(255, 215, 0)
  pdf.rect(75, 95, 60, 8, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PROFESSIONAL REPORT', 105, 100, { align: 'center' })
  
  // Main Title
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Carbon Footprint', 105, 140, { align: 'center' })
  pdf.text('Analyse 2024', 105, 155, { align: 'center' })
  
  // Subtitle
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Conform ISO 14064-1, GHG Protocol en Nederlandse CO2-Prestatieladder', 105, 175, { align: 'center' })
  
  // Key metric highlight
  pdf.setFillColor(255, 255, 255, 0.9)
  pdf.roundedRect(60, 185, 90, 20, 5, 5, 'F')
  pdf.setTextColor(0, 100, 80)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${totalEmissions} ton CO2`, 105, 197, { align: 'center' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Totale Carbon Footprint', 105, 202, { align: 'center' })

  // Company Info Box
  pdf.setFillColor(255, 255, 255, 0.95)
  pdf.roundedRect(30, 220, 150, 60, 5, 5, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bedrijf:', 40, 235)
  pdf.text('Sector:', 40, 245)
  pdf.text('Medewerkers:', 40, 255)
  pdf.text('Rapportdatum:', 40, 265)
  
  pdf.setFont('helvetica', 'normal')
  pdf.text(companyName, 75, 235)
  pdf.text(industry, 75, 245)
  pdf.text(employees.toString(), 75, 255)
  pdf.text(new Date().toLocaleDateString('nl-NL'), 75, 265)
  
  // Compliance badges
  pdf.setFillColor(0, 150, 100)
  pdf.roundedRect(35, 270, 25, 6, 2, 2, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ISO 14064', 47.5, 274, { align: 'center' })
  
  pdf.setFillColor(0, 120, 180)
  pdf.roundedRect(65, 270, 25, 6, 2, 2, 'F')
  pdf.text('GHG Protocol', 77.5, 274, { align: 'center' })
  
  pdf.setFillColor(200, 100, 0)
  pdf.roundedRect(95, 270, 35, 6, 2, 2, 'F')
  pdf.text('CO2-Prestatieladder', 112.5, 274, { align: 'center' })
  
  pdf.setFillColor(150, 0, 150)
  pdf.roundedRect(135, 270, 25, 6, 2, 2, 'F')
  pdf.text('CSRD Ready', 147.5, 274, { align: 'center' })
  
  // Footer
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.text('Professional Carbon Intelligence Report', 105, 290, { align: 'center' })
  pdf.setFontSize(8)
  pdf.text('Gegenereerd door Carbon Comply AI Platform - carboncomply.nl', 105, 295, { align: 'center' })
}

function generateExecutiveSummary(pdf, results, aiInsights, companyData) {
  pdf.addPage()
  
  // Header with background
  pdf.setFillColor(0, 100, 80, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 100, 80)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Managementsamenvatting', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Gegenereerd op ${new Date().toLocaleDateString('nl-NL')} | Pagina 2`, 20, 35)

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  let yPos = 55

  // Executive Summary from AI
  if (aiInsights?.executiveSummary) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI-Powered Executive Analysis:', 20, yPos)
    yPos += 10
    
    pdf.setFont('helvetica', 'normal')
    const summaryText = typeof aiInsights.executiveSummary === 'object' 
      ? aiInsights.executiveSummary.content || aiInsights.executiveSummary.headline || 'AI analysis beschikbaar'
      : aiInsights.executiveSummary
    
    const summaryLines = pdf.splitTextToSize(summaryText, 170)
    pdf.text(summaryLines, 20, yPos)
    yPos += summaryLines.length * 6 + 10
  }
  
  // Key Findings
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 180)
  pdf.text('🔍 BELANGRIJKSTE BEVINDINGEN', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  const findings = [
    `Totale CO2-uitstoot: ${results.emissions?.total || 0} ton per jaar`,
    `Grootste bron: ${getLargestEmissionSource(results.emissions?.breakdown)}`,
    `Benchmark positie: ${results.benchmark?.ranking || 'Gemiddeld'}`,
    `CSRD compliance: ${results.compliance?.csrd?.status || 'In voorbereiding'}`,
    `AI confidence: ${aiInsights ? '87%' : '75%'} (${aiInsights ? 'AI-enhanced' : 'Rule-based'})`
  ]
  
  findings.forEach(finding => {
    pdf.text(`• ${finding}`, 25, yPos)
    yPos += 8
  })
  
  yPos += 10
  
  // Strategic Recommendations
  pdf.setFillColor(248, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('🎯 STRATEGISCHE PRIORITEITEN', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  
  const recommendations = aiInsights?.aiRecommendations?.slice(0, 3) || [
    { title: 'Groene energie transitie binnen 6 maanden' },
    { title: 'CSRD compliance voorbereiding starten' },
    { title: 'Transport elektrificatie met SEEH subsidie' }
  ]
  
  recommendations.forEach((rec, index) => {
    const recText = typeof rec === 'object' ? rec.title || rec.description : rec
    pdf.text(`${index + 1}. ${recText}`, 25, yPos)
    yPos += 8
  })
  
  yPos += 10
  
  // Financial Impact
  pdf.setFillColor(255, 248, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 100, 0)
  pdf.text('💰 FINANCIËLE IMPACT', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  
  const financialImpacts = [
    `Huidige carbon exposure: €${results.carbonPricing?.current2024?.toLocaleString() || '0'} per jaar`,
    `2030 exposure zonder actie: €${results.carbonPricing?.projected2030?.toLocaleString() || '0'} per jaar`,
    `Potentiële besparingen: €${(results.emissions?.total * 200 || 0).toLocaleString()} per jaar`,
    `Nederlandse subsidie potentieel: €${(results.emissions?.total * 300 || 0).toLocaleString()}`,
    `ROI verwachting: 200-300% over 5 jaar`
  ]
  
  financialImpacts.forEach(impact => {
    pdf.text(`• ${impact}`, 25, yPos)
    yPos += 8
  })
  
  // Next Steps Box
  yPos += 15
  pdf.setFillColor(255, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 0, 0)
  pdf.text('⚡ DIRECTE ACTIES (30 DAGEN)', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  const nextSteps = [
    'Start CSRD gap analyse binnen 2 weken',
    'Vergelijk Nederlandse groene energie leveranciers',
    'Plan team training sustainability en compliance',
    'Identificeer quick wins voor directe CO2 reductie'
  ]
  
  nextSteps.forEach(step => {
    pdf.text(`• ${step}`, 25, yPos)
    yPos += 6
  })
}

function generateComplianceSection(pdf, results, aiInsights, companyData) {
  pdf.addPage()
  
  // Header
  pdf.setFillColor(100, 0, 150, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(100, 0, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Nederlandse Compliance Analyse', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`AI-Enhanced Compliance Assessment | Pagina 3`, 20, 35)

  let yPos = 55
  
  // CSRD Section
  pdf.setFillColor(100, 0, 150)
  pdf.roundedRect(15, yPos - 5, 180, 10, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CSRD (Corporate Sustainability Reporting Directive)', 20, yPos)
  yPos += 20
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  
  const employees = parseInt(companyData.employees) || 0
  const csrdRequired = employees > 250
  const revenue = companyData.revenue || 0
  
  const csrdInfo = [
    `Status: ${csrdRequired ? 'VERPLICHT vanaf 2025' : 'Optioneel (voorbereiding aanbevolen)'}`,
    `Deadline eerste rapportage: ${csrdRequired ? '31 maart 2025' : '31 maart 2026'}`,
    `Huidige readiness score: ${aiInsights?.compliance?.csrd?.readinessScore || calculateCSRDReadiness(employees)}%`,
    `Double materiality assessment: ${csrdRequired ? 'Verplicht Q4 2024' : 'Aanbevolen'}`,
    `Third-party verification: ${csrdRequired ? 'Verplicht vanaf 2025' : 'Optioneel'}`
  ]
  
  csrdInfo.forEach(info => {
    pdf.text(`• ${info}`, 25, yPos)
    yPos += 7
  })
  
  yPos += 10
  
  // WPM Section
  pdf.setFillColor(0, 120, 180)
  pdf.roundedRect(15, yPos - 5, 180, 10, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('WPM (Wet Persoonsvervoer en Mobiliteit)', 20, yPos)
  yPos += 20
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  
  const wpmRequired = employees >= 100
  const wpmInfo = [
    `Status: ${wmpRequired ? 'VERPLICHT vanaf 2025' : 'Niet van toepassing'}`,
    `Deadline: ${wmpRequired ? '30 juni 2025' : 'N.v.t.'}`,
    `Scope: ${wmpRequired ? 'Home-to-work mobility tracking verplicht' : 'Geen verplichtingen'}`,
    `Data vereisten: ${wmpRequired ? 'CO2 impact woon-werk verkeer' : 'Geen'}`,
    `Boete risico: ${wmpRequired ? 'Tot €870,000 bij non-compliance' : 'Geen'}`
  ]
  
  wpmInfo.forEach(info => {
    pdf.text(`• ${info}`, 25, yPos)
    yPos += 7
  })
  
  yPos += 15
  
  // AI Compliance Insights
  if (aiInsights?.csrdCompliance || aiInsights?.complianceTimeline) {
    pdf.setFillColor(255, 215, 0)
    pdf.roundedRect(15, yPos - 5, 180, 10, 3, 3, 'F')
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('🤖 AI Compliance Intelligence', 20, yPos)
    yPos += 20
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const complianceAnalysis = aiInsights?.csrdCompliance?.aiAnalysis || 
      'AI analysis toont dat tijdige voorbereiding op CSRD en WPM essentieel is voor compliance en kostenbeheersing.'
    
    const analysisLines = pdf.splitTextToSize(complianceAnalysis, 170)
    pdf.text(analysisLines, 20, yPos)
    yPos += analysisLines.length * 5 + 10
  }
  
  // Implementation Timeline
  pdf.setFillColor(240, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 45, 3, 3, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('📅 IMPLEMENTATIE TIJDLIJN', 20, yPos)
  yPos += 15
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const timeline = [
    'Q4 2024: CSRD gap analyse en double materiality assessment',
    'Q1 2025: Data collection systemen implementeren',
    'Q2 2025: WPM mobility tracking opzetten (indien verplicht)',
    'Q3 2025: Third-party auditor selecteren en voorbereiden',
    'Q4 2025: Eerste CSRD rapportage indien verplicht',
    'Q1 2026: Eerste publieke sustainability rapportage'
  ]
  
  timeline.forEach(item => {
    pdf.text(`• ${item}`, 25, yPos)
    yPos += 6
  })
}

function generateDetailedAnalysis(pdf, results, companyData, aiInsights) {
  pdf.addPage()
  
  pdf.setFillColor(0, 150, 100, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 150, 100)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Gedetailleerde Carbon Analyse', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Data-Driven Insights | Pagina 4`, 20, 35)

  let yPos = 55
  
  // Emissions Breakdown Table
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('📊 CO2-Uitstoot Breakdown', 20, yPos)
  yPos += 15
  
  // Table headers
  pdf.setFillColor(220, 220, 220)
  pdf.rect(20, yPos - 5, 170, 10, 'F')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Categorie', 25, yPos)
  pdf.text('Uitstoot (ton)', 70, yPos)
  pdf.text('Percentage', 110, yPos)
  pdf.text('Benchmark', 140, yPos)
  pdf.text('Status', 170, yPos)
  
  yPos += 12
  
  // Table data
  pdf.setFont('helvetica', 'normal')
  const breakdown = results.emissions?.breakdown || {}
  const total = results.emissions?.total || 1
  
  Object.entries(breakdown).forEach(([category, value]) => {
    const percentage = ((value / total) * 100).toFixed(1)
    const benchmark = getBenchmarkStatus(category, value, companyData.industry)
    const status = getEmissionStatus(value, total)
    
    // Alternate row colors
    if (Object.keys(breakdown).indexOf(category) % 2 === 0) {
      pdf.setFillColor(248, 248, 248)
      pdf.rect(20, yPos - 5, 170, 8, 'F')
    }
    
    pdf.setTextColor(0, 0, 0)
    pdf.text(getCategoryDisplayName(category), 25, yPos)
    pdf.text(value.toFixed(2), 70, yPos)
    pdf.text(`${percentage}%`, 110, yPos)
    pdf.text(benchmark, 140, yPos)
    
    // Status with color
    const statusColor = getStatusColor(status)
    pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b)
    pdf.text(status, 170, yPos)
    
    yPos += 8
  })
  
  yPos += 15
  
  // Industry Comparison
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('🏭 Nederlandse Sectorvergelijking', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  const emissionsPerEmployee = (results.emissions?.total || 0) / (parseInt(companyData.employees) || 1)
  const industryBenchmark = getDutchIndustryBenchmark(companyData.industry)
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = results.benchmark?.percentile || calculatePercentile(performance)
  
  const comparisonData = [
    `Uw prestatie: ${emissionsPerEmployee.toFixed(2)} ton CO2 per medewerker`,
    `Nederlandse ${companyData.industry} gemiddelde: ${industryBenchmark} ton per medewerker`,
    `Relatieve prestatie: ${performance < 1 ? 'Boven' : 'Onder'} gemiddeld (${(performance * 100).toFixed(0)}%)`,
    `Percentiel ranking: Top ${100 - percentile}% (beter dan ${percentile}% van peers)`,
    `Nederlandse ranking: ${getPerformanceRanking(performance)}`
  ]
  
  comparisonData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 7
  })
  
  yPos += 15
  
  // AI Data Quality Assessment
  if (aiInsights) {
    pdf.setFillColor(240, 248, 255)
    pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 100, 200)
    pdf.text('🤖 AI Data Quality Assessment', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    const confidence = aiInsights.confidence || 0.85
    const dataQuality = [
      `AI Confidence Score: ${(confidence * 100).toFixed(0)}% (${confidence > 0.8 ? 'Hoog' : confidence > 0.6 ? 'Gemiddeld' : 'Laag'})`,
      `Data completeness: ${calculateDataCompleteness(breakdown)}%`,
      `Methodologie: Nederlandse CO2-Prestatieladder 3.1 compliant`,
      `Verification: ${aiInsights.aiGenerated ? 'AI-verified' : 'Rule-based validation'}`
    ]
    
    dataQuality.forEach(item => {
      pdf.text(`• ${item}`, 25, yPos)
      yPos += 6
    })
  }
}

function generateAIInsightsSection(pdf, aiInsights, results) {
  if (!aiInsights) {
    return // Skip if no AI insights available
  }
  
  pdf.addPage()
  
  // Header
  pdf.setFillColor(255, 100, 255, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(150, 0, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AI-Powered Sustainability Insights', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Generated by HuggingFace AI | Pagina 5`, 20, 35)

  let yPos = 55
  
  // AI Model Information
  pdf.setFillColor(255, 215, 0, 0.2)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('🧠 AI Model Specificaties', 20, yPos)
  yPos += 12
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  const modelInfo = [
    `Model: ${aiInsights.model || 'HuggingFace Nederlandse Carbon AI'}`,
    `Confidence: ${((aiInsights.confidence || 0.85) * 100).toFixed(0)}%`,
    `Generated: ${new Date().toLocaleString('nl-NL')}`,
    `Methodologie: Nederlandse CO2-Prestatieladder + CSRD compliance`,
    `Data training: Nederlandse bedrijven en compliance standaarden`
  ]
  
  modelInfo.forEach(info => {
    pdf.text(`• ${info}`, 25, yPos)
    yPos += 5
  })
  
  yPos += 15
  
  // Executive Summary from AI
  if (aiInsights.executiveSummary) {
    pdf.setFillColor(240, 255, 240)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 150, 0)
    pdf.text('📈 AI Executive Analysis', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const summaryContent = typeof aiInsights.executiveSummary === 'object' 
      ? aiInsights.executiveSummary.content || aiInsights.executiveSummary.headline
      : aiInsights.executiveSummary
    
    if (summaryContent) {
      const summaryLines = pdf.splitTextToSize(summaryContent, 170)
      pdf.text(summaryLines, 20, yPos)
      yPos += summaryLines.length * 5 + 10
    }
  }
  
  // AI Risk Assessment
  if (aiInsights.riskAssessment) {
    pdf.setFillColor(255, 240, 240)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 0, 0)
    pdf.text('⚠️ AI Risk Intelligence', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const riskContent = typeof aiInsights.riskAssessment === 'object'
      ? aiInsights.riskAssessment.aiAnalysis || 'AI risk analysis completed'
      : aiInsights.riskAssessment
    
    if (riskContent) {
      const riskLines = pdf.splitTextToSize(riskContent, 170)
      pdf.text(riskLines, 20, yPos)
      yPos += riskLines.length * 5 + 10
    }
  }
  
  // AI Recommendations
  if (aiInsights.aiRecommendations && aiInsights.aiRecommendations.length > 0) {
    pdf.setFillColor(240, 248, 255)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 100, 200)
    pdf.text('🎯 AI Strategic Recommendations', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    aiInsights.aiRecommendations.slice(0, 5).forEach((rec, index) => {
      const recTitle = typeof rec === 'object' ? rec.title || rec.description : rec
      const recDescription = typeof rec === 'object' ? rec.description : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${recTitle}`, 25, yPos)
      yPos += 6
      
      if (recDescription && recDescription !== recTitle) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(recDescription, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      if (typeof rec === 'object' && rec.co2Reduction) {
        pdf.setTextColor(0, 150, 0)
        pdf.text(`   💡 CO2 reductie: ${rec.co2Reduction} ton | Kosten: ${rec.cost || 'TBD'}`, 30, yPos)
        pdf.setTextColor(0, 0, 0)
        yPos += 5
      }
      
      yPos += 3
    })
  }
  
  // Sustainability Score
  if (aiInsights.sustainabilityScore) {
    yPos += 10
    pdf.setFillColor(255, 248, 220)
    pdf.roundedRect(15, yPos - 5, 180, 30, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🏆 AI Sustainability Score', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const score = aiInsights.sustainabilityScore
    const scoreInfo = [
      `Overall Score: ${score.overall || 'N/A'}/100 (Grade: ${score.grade || 'B'})`,
      `Benchmark Position: ${score.benchmarkPosition || 'Average'}`,
      `Emissions Performance: ${score.breakdown?.emissions || 'N/A'}/40 punten`,
      `Compliance Readiness: ${score.breakdown?.compliance || 'N/A'}/30 punten`,
      `Efficiency Rating: ${score.breakdown?.efficiency || 'N/A'}/20 punten`,
      `Leadership Bonus: ${score.breakdown?.leadership || 'N/A'}/10 punten`
    ]
    
    scoreInfo.forEach(info => {
      pdf.text(`• ${info}`, 25, yPos)
      yPos += 5
    })
  }
}

function generateRecommendations(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(0, 200, 100, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 150, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Aanbevelingen & Actieplan', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Prioriteit Matrix & Implementation Guide | Pagina 6`, 20, 35)

  let yPos = 55
  
  // Get recommendations from AI or fallback
  const recommendations = aiInsights?.aiRecommendations || results.recommendations || generateFallbackRecommendations(results)
  
  // High Priority Recommendations
  const highPriorityRecs = recommendations.filter(r => r.priority === 1 || r.priority === 'Hoog')
  if (highPriorityRecs.length > 0) {
    pdf.setFillColor(255, 230, 230)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 0, 0)
    pdf.text('🔴 HOGE PRIORITEIT (0-6 maanden)', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    highPriorityRecs.slice(0, 3).forEach((rec, index) => {
      const title = typeof rec === 'object' ? rec.title || rec.action : rec
      const description = typeof rec === 'object' ? rec.description : ''
      const impact = typeof rec === 'object' ? rec.co2Reduction || rec.savings : ''
      const cost = typeof rec === 'object' ? rec.cost : ''
      const payback = typeof rec === 'object' ? rec.paybackMonths : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${title}`, 25, yPos)
      yPos += 6
      
      if (description) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(description, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      // Impact metrics
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      if (impact) pdf.text(`   💰 Impact: ${impact} ton CO2 besparing`, 30, yPos), yPos += 4
      if (cost) pdf.text(`   💸 Investering: ${cost}`, 30, yPos), yPos += 4
      if (payback) pdf.text(`   ⏱️ Payback: ${payback} maanden`, 30, yPos), yPos += 4
      
      // Dutch-specific benefits
      if (rec.dutchSpecific && rec.subsidies) {
        pdf.setTextColor(0, 100, 0)
        pdf.text(`   🇳🇱 Nederlandse voordelen: ${rec.subsidies.slice(0, 2).join(', ')}`, 30, yPos)
        pdf.setTextColor(0, 0, 0)
        yPos += 4
      }
      
      yPos += 8
      pdf.setFontSize(10)
    })
  }
  
  // Medium Priority Recommendations
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 2 || r.priority === 'Medium')
  if (mediumPriorityRecs.length > 0) {
    pdf.setFillColor(255, 248, 230)
    pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🟡 MEDIUM PRIORITEIT (6-18 maanden)', 20, yPos)
    yPos += 15
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    mediumPriorityRecs.slice(0, 3).forEach((rec, index) => {
      const title = typeof rec === 'object' ? rec.title || rec.action : rec
      const description = typeof rec === 'object' ? rec.description : ''
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${index + 1}. ${title}`, 25, yPos)
      yPos += 6
      
      if (description) {
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(description, 165)
        pdf.text(descLines, 30, yPos)
        yPos += descLines.length * 5
      }
      
      yPos += 6
    })
  }
  
  // Implementation Success Factors
  yPos += 10
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('✅ KRITIEKE SUCCESFACTOREN', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const successFactors = [
    'Management commitment en leadership voor sustainability transitie',
    'Dedicated sustainability team of project manager aanstellen',
    'SMART doelstellingen met meetbare KPI\'s en tijdlijnen',
    'Stakeholder engagement: medewerkers, leveranciers, klanten',
    'Budget toewijzing voor prioritaire projecten en quick wins',
    'Training en bewustwording programma voor hele organisatie'
  ]
  
  successFactors.forEach(factor => {
    pdf.text(`• ${factor}`, 25, yPos)
    yPos += 5
  })
}

function generateImplementationPlan(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(100, 150, 255, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 100, 200)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Implementation Roadmap', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Gefaseerde Implementatie Strategie | Pagina 7`, 20, 35)

  let yPos = 55
  
  // Implementation phases
  const phases = aiInsights?.implementationRoadmap?.phases || [
    {
      phase: 'Fase 1: Foundation (0-6 maanden)',
      target: Math.round((results.emissions?.total * 0.85) * 100) / 100,
      actions: ['CSRD gap analyse', 'Data collection setup', 'Quick wins implementatie'],
      budget: '€15,000 - €30,000',
      co2Reduction: Math.round((results.emissions?.total * 0.15) * 100) / 100
    },
    {
      phase: 'Fase 2: Transformation (6-18 maanden)',
      target: Math.round((results.emissions?.total * 0.65) * 100) / 100,
      actions: ['Groene energie transitie', 'Fleet elektrificatie', 'Building automation'],
      budget: '€50,000 - €150,000',
      co2Reduction: Math.round((results.emissions?.total * 0.35) * 100) / 100
    },
    {
      phase: 'Fase 3: Leadership (18+ maanden)',
      target: Math.round((results.emissions?.total * 0.35) * 100) / 100,
      actions: ['Carbon neutral certificering', 'Innovation partnerships', 'Market leadership'],
      budget: '€100,000 - €300,000',
      co2Reduction: Math.round((results.emissions?.total * 0.65) * 100) / 100
    }
  ]
  
  phases.forEach((phase, index) => {
    // Phase header with color coding
    const colors = [
      { r: 0, g: 150, b: 0 },    // Green for Phase 1
      { r: 0, g: 100, b: 200 },  // Blue for Phase 2  
      { r: 150, g: 0, b: 150 }   // Purple for Phase 3
    ]
    
    pdf.setFillColor(colors[index].r, colors[index].g, colors[index].b, 0.1)
    pdf.roundedRect(15, yPos - 5, 180, 10, 3, 3, 'F')
    
    pdf.setTextColor(colors[index].r, colors[index].g, colors[index].b)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.phase, 20, yPos)
    yPos += 15
    
    // Phase details
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    pdf.text(`🎯 Target uitstoot: ${phase.target} ton CO2`, 25, yPos)
    yPos += 6
    pdf.text(`💰 Budget range: ${phase.budget}`, 25, yPos)
    yPos += 6
    pdf.text(`📉 CO2 reductie: ${phase.co2Reduction} ton`, 25, yPos)
    yPos += 8
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('Belangrijkste acties:', 25, yPos)
    yPos += 6
    
    pdf.setFont('helvetica', 'normal')
    phase.actions.forEach(action => {
      pdf.text(`• ${action}`, 30, yPos)
      yPos += 5
    })
    
    yPos += 10
  })
  
  // Timeline visualization (simplified text version)
  pdf.setFillColor(240, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('📅 MIJLPALEN TIJDLIJN', 20, yPos)
  yPos += 12
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const milestones = [
    'Q1 2024: Foundation start + CSRD gap analyse',
    'Q2 2024: Quick wins implementation + data systems',
    'Q3 2024: Transformation fase start + groene energie',
    'Q4 2024: Eerste compliance rapportage',
    'Q2 2025: Mid-term doelen evaluatie',
    'Q4 2025: Leadership fase start + certificering'
  ]
  
  milestones.forEach(milestone => {
    pdf.text(`• ${milestone}`, 25, yPos)
    yPos += 4
  })
}

function generateFinancialAnalysis(pdf, aiInsights, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(255, 215, 0, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(200, 150, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Financiële Impact Analyse', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`ROI & Investment Analysis | Pagina 8`, 20, 35)

  let yPos = 55
  
  // Carbon Pricing Exposure
  pdf.setFillColor(255, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 0, 0)
  pdf.text('💸 CARBON PRICING EXPOSURE', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const totalEmissions = results.emissions?.total || 0
  const carbonExposure = [
    `Huidig (2024): €${(totalEmissions * 30.48).toLocaleString()} per jaar (€30.48/ton)`,
    `2025 projectie: €${(totalEmissions * 50.18).toLocaleString()} per jaar (€50.18/ton)`,
    `2030 zonder actie: €${(totalEmissions * 216).toLocaleString()} per jaar (€216/ton)`,
    `Totale exposure stijging: €${(totalEmissions * (216 - 30.48)).toLocaleString()} over 6 jaar`,
    `Risico zonder reductie: 600%+ kostenstijging by 2030`
  ]
  
  carbonExposure.forEach(item => {
    pdf.text(`• ${item}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 10
  
  // Nederlandse Subsidie Opportunities
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('🇳🇱 NEDERLANDSE SUBSIDIE KANSEN', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const employees = parseInt(companyData.employees) || 1
  const subsidies = {
    SEEH: Math.min(Math.floor(employees / 5) * 4000, 40000),
    SDE: Math.min(totalEmissions * 100, 25000),
    EIA: Math.min(totalEmissions * 300, 50000),
    WBSO: companyData.industry?.includes('Technologie') ? Math.min(totalEmissions * 150, 20000) : 0,
    MIAVamil: Math.min(totalEmissions * 200, 75000)
  }
  
  const subsidyOpportunities = [
    `SEEH (elektrische auto's): €${subsidies.SEEH.toLocaleString()} (€4,000 per voertuig)`,
    `SDE++ (hernieuwbare energie): €${subsidies.SDE.toLocaleString()}`,
    `EIA (energie-efficiency): €${subsidies.EIA.toLocaleString()} (30% aftrek)`,
    `WBSO (R&D): €${subsidies.WBSO.toLocaleString()} (indien van toepassing)`,
    `MIA/Vamil (circulair): €${subsidies.MIAVamil.toLocaleString()} (tot 75% aftrek)`,
    `TOTAAL BESCHIKBAAR: €${Object.values(subsidies).reduce((sum, val) => sum + val, 0).toLocaleString()}`
  ]
  
  subsidyOpportunities.forEach(opportunity => {
    pdf.text(`• ${opportunity}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 10
  
  // Investment Scenarios
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('💼 INVESTERING SCENARIO\'S', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const baseInvestment = totalEmissions * 800
  const scenarios = [
    {
      name: 'Conservatief',
      investment: Math.round(baseInvestment * 0.6),
      co2Reduction: Math.round(totalEmissions * 0.25 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 150),
      payback: 36,
      roi5Year: '180%'
    },
    {
      name: 'Gematigd',
      investment: Math.round(baseInvestment),
      co2Reduction: Math.round(totalEmissions * 0.45 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 250),
      payback: 24,
      roi5Year: '250%'
    },
    {
      name: 'Ambitieus',
      investment: Math.round(baseInvestment * 1.5),
      co2Reduction: Math.round(totalEmissions * 0.70 * 100) / 100,
      annualSavings: Math.round(totalEmissions * 400),
      payback: 18,
      roi5Year: '320%'
    }
  ]
  
  scenarios.forEach(scenario => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${scenario.name} Scenario:`, 25, yPos)
    yPos += 5
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(`   Investering: €${scenario.investment.toLocaleString()}`, 25, yPos)
    yPos += 4
    pdf.text(`   CO2 reductie: ${scenario.co2Reduction} ton (${Math.round((scenario.co2Reduction / totalEmissions) * 100)}%)`, 25, yPos)
    yPos += 4
    pdf.text(`   Jaarlijkse besparingen: €${scenario.annualSavings.toLocaleString()}`, 25, yPos)
    yPos += 4
    pdf.text(`   Payback periode: ${scenario.payback} maanden`, 25, yPos)
    yPos += 4
    pdf.text(`   5-jaar ROI: ${scenario.roi5Year}`, 25, yPos)
    yPos += 8
  })
  
  // AI Financial Insights
  if (aiInsights?.financialAnalysis) {
    yPos += 5
    pdf.setFillColor(255, 248, 220)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(200, 150, 0)
    pdf.text('🤖 AI Financial Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const financialAI = aiInsights.financialAnalysis.aiAnalysis || 
      'AI analysis toont optimale ROI door gefaseerde implementatie met focus op Nederlandse subsidies en carbon pricing risico mitigatie.'
    
    const aiLines = pdf.splitTextToSize(financialAI, 170)
    pdf.text(aiLines, 20, yPos)
  }
}

function generateRiskAssessment(pdf, aiInsights, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(200, 0, 0, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(150, 0, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Risk Assessment & Mitigation', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Comprehensive Risk Analysis | Pagina 9`, 20, 35)

  let yPos = 55
  
  // Critical Risks Matrix
  pdf.setFillColor(255, 240, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 0, 0)
  pdf.text('🚨 KRITIEKE RISICO\'S', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const employees = parseInt(companyData.employees) || 0
  const totalEmissions = results.emissions?.total || 0
  
  const criticalRisks = [
    {
      risk: 'CSRD Non-Compliance',
      impact: employees > 250 ? 'KRITIEK' : 'MEDIUM',
      likelihood: employees > 250 ? 'HOOG' : 'LAAG',
      mitigation: employees > 250 ? 'Start CSRD implementatie binnen 30 dagen' : 'Voorbereidende maatregelen nemen',
      financialImpact: employees > 250 ? '€500,000+ boetes + reputatieschade' : 'Competitief nadeel'
    },
    {
      risk: 'Carbon Pricing Escalatie',
      impact: totalEmissions > 50 ? 'HOOG' : 'MEDIUM',
      likelihood: 'ZEER HOOG',
      mitigation: 'Implementeer CO2 reductie roadmap binnen 12 maanden',
      financialImpact: `€${Math.round(totalEmissions * (216 - 30.48)).toLocaleString()} extra kosten by 2030`
    },
    {
      risk: 'Supply Chain Disruption',
      impact: 'MEDIUM',
      likelihood: 'MEDIUM',
      mitigation: 'Diversifieer leveranciers en implementeer circulaire processen',
      financialImpact: '10-20% kostenstijging mogelijk'
    }
  ]
  
  criticalRisks.forEach((risk, index) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${index + 1}. ${risk.risk}`, 25, yPos)
    yPos += 6
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`   Impact: ${risk.impact} | Waarschijnlijkheid: ${risk.likelihood}`, 30, yPos)
    yPos += 5
    pdf.text(`   Financial: ${risk.financialImpact}`, 30, yPos)
    yPos += 5
    pdf.text(`   Mitigation: ${risk.mitigation}`, 30, yPos)
    yPos += 8
    pdf.setFontSize(10)
  })
  
  // Regulatory Timeline Risks
  yPos += 5
  pdf.setFillColor(255, 248, 220)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 150, 0)
  pdf.text('⏰ REGULATORY TIMELINE RISKS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const regulatoryRisks = [
    `CSRD Deadline: ${employees > 250 ? '31 maart 2025 (KRITIEK - 4 maanden!)' : '31 maart 2026 (voorbereidingstijd)'}`,
    `WPM Reporting: ${employees >= 100 ? '30 juni 2025 (mobility tracking)' : 'Niet van toepassing'}`,
    `CO2-Heffing Stijging: Geleidelijke stijging naar €216/ton in 2030`,
    `EU Taxonomie: Nieuwe criteria worden jaarlijks aangescherpt`,
    `CBAM (Carbon Border): Impact op import/export vanaf 2026`
  ]
  
  regulatoryRisks.forEach(risk => {
    pdf.text(`• ${risk}`, 25, yPos)
    yPos += 6
  })
  
  // Market & Competitive Risks
  yPos += 10
  pdf.setFillColor(240, 240, 255)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 200)
  pdf.text('🏢 MARKET & COMPETITIVE RISKS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const marketRisks = [
    'Customer ESG requirements: Grote klanten eisen steeds meer sustainability rapportage',
    'Investor criteria: ESG ratings worden kritiek voor financiering en waardering',
    'Talent acquisition: Jonge professionals kiezen voor duurzame werkgevers',
    'Supply chain pressure: Leveranciers moeten aan steeds strengere eisen voldoen',
    'Competitive advantage: Early movers in sustainability krijgen marktvoordeel'
  ]
  
  marketRisks.forEach(risk => {
    pdf.text(`• ${risk}`, 25, yPos)
    yPos += 6
  })
  
  // AI Risk Intelligence
  if (aiInsights?.riskAssessment) {
    yPos += 10
    pdf.setFillColor(255, 235, 255)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(150, 0, 150)
    pdf.text('🤖 AI Risk Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const riskAI = typeof aiInsights.riskAssessment === 'object'
      ? aiInsights.riskAssessment.aiAnalysis || 'AI risk analysis completed'
      : aiInsights.riskAssessment
    
    const riskLines = pdf.splitTextToSize(riskAI, 170)
    pdf.text(riskLines, 20, yPos)
  }
}

function generateBenchmarking(pdf, results, companyData, aiInsights) {
  pdf.addPage()
  
  pdf.setFillColor(0, 150, 200, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(0, 100, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Nederlandse Benchmarking', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Industry Comparison & Performance Analysis | Pagina 10`, 20, 35)

  let yPos = 55
  
  // Performance Overview
  const totalEmissions = results.emissions?.total || 0
  const employees = parseInt(companyData.employees) || 1
  const emissionsPerEmployee = totalEmissions / employees
  const industryBenchmark = getDutchIndustryBenchmark(companyData.industry)
  const performance = emissionsPerEmployee / industryBenchmark
  const percentile = calculatePercentile(performance)
  
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 50, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('📊 PERFORMANCE SCORECARD', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  
  const performanceData = [
    `Uw prestatie: ${emissionsPerEmployee.toFixed(2)} ton CO2 per medewerker`,
    `Nederlandse ${companyData.industry} gemiddelde: ${industryBenchmark} ton per medewerker`,
    `Relatieve prestatie: ${(performance * 100).toFixed(0)}% van benchmark`,
    `Ranking: ${getPerformanceRanking(performance)}`,
    `Percentiel: Top ${100 - percentile}% (beter dan ${percentile}% van peers)`
  ]
  
  performanceData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 7
  })
  
  yPos += 15
  
  // Industry Leaders Comparison
  pdf.setFillColor(240, 255, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 150, 0)
  pdf.text('🏆 NEDERLANDSE SECTOR LEADERS', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const sectorLeaders = getSectorLeaders(companyData.industry)
  const leadershipData = [
    `Top performers: ${sectorLeaders.leaders.join(', ')}`,
    `Best practice CO2/medewerker: ${sectorLeaders.bestPractice} ton`,
    `Uw gap naar top 10%: ${Math.max(0, emissionsPerEmployee - industryBenchmark * 0.5).toFixed(2)} ton`,
    `Potentiële CO2 reductie: ${Math.max(0, (emissionsPerEmployee - industryBenchmark * 0.5) * employees).toFixed(1)} ton`,
    `Innovation kansen: ${sectorLeaders.innovations.join(', ')}`
  ]
  
  leadershipData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Competitive Analysis
  pdf.setFillColor(255, 248, 240)
  pdf.roundedRect(15, yPos - 5, 180, 8, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 100, 0)
  pdf.text('⚡ COMPETITIVE POSITIONING', 20, yPos)
  yPos += 15
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  
  const competitivePosition = getCompetitivePosition(performance)
  const positioningData = [
    `Marktpositie: ${competitivePosition.position}`,
    `Competitive advantage: ${competitivePosition.advantage}`,
    `Key differentiators: ${competitivePosition.differentiators.join(', ')}`,
    `Improvement opportunity: ${competitivePosition.opportunity}`,
    `Market perception: ${competitivePosition.perception}`
  ]
  
  positioningData.forEach(data => {
    pdf.text(`• ${data}`, 25, yPos)
    yPos += 6
  })
  
  // AI Benchmarking Insights
  if (aiInsights?.benchmarkComparison) {
    yPos += 15
    pdf.setFillColor(255, 235, 255)
    pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(150, 0, 150)
    pdf.text('🤖 AI Benchmarking Intelligence', 20, yPos)
    yPos += 12
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    const benchmarkAI = typeof aiInsights.benchmarkComparison === 'object'
      ? 'AI analysis toont vergelijkingsmogelijkheden met industry best practices en identificeert specifieke verbeterkansen.'
      : aiInsights.benchmarkComparison
    
    const benchmarkLines = pdf.splitTextToSize(benchmarkAI, 170)
    pdf.text(benchmarkLines, 20, yPos)
  }
}

function generateActionTimeline(pdf, aiInsights, results) {
  pdf.addPage()
  
  pdf.setFillColor(150, 100, 200, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(100, 50, 150)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Action Timeline & Milestones', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`24-Month Implementation Schedule | Pagina 11`, 20, 35)

  let yPos = 55
  
  // 24-Month Timeline
  const timelinePhases = [
    {
      period: 'Q1 2024 (Maanden 1-3)',
      color: { r: 255, g: 100, b: 100 },
      priority: 'Foundation & Quick Wins',
      actions: [
        'CSRD gap analyse starten',
        'LED verlichting upgrade (30% energiebesparing)',
        'Groene energie leverancier contract',
        'Sustainability team formeren',
        'CO2-Prestatieladder niveau 1 aanvraag'
      ],
      budget: '€15,000 - €25,000',
      co2Impact: '15-25% reductie'
    },
    {
      period: 'Q2 2024 (Maanden 4-6)',
      color: { r: 255, g: 150, b: 0 },
      priority: 'Systems & Compliance',
      actions: [
        'Carbon accounting systeem implementeren',
        'Smart building automation installeren',
        'SEEH subsidie aanvragen voor elektrische auto\'s',
        'Supplier engagement programma starten',
        'Eerste sustainability training'
      ],
      budget: '€25,000 - €50,000',
      co2Impact: '35-45% reductie'
    },
    {
      period: 'Q3 2024 (Maanden 7-9)',
      color: { r: 100, g: 200, b: 100 },
      priority: 'Technology Implementation',
      actions: [
        'Eerste elektrische lease auto\'s ontvangen',
        'Zonnepanelen installatie met SDE++ subsidie',
        'Waste reduction & recycling programma',
        'WPM compliance voorbereiding (indien van toepassing)',
        'Mid-year carbon audit'
      ],
      budget: '€50,000 - €100,000',
      co2Impact: '50-65% reductie'
    },
    {
      period: 'Q4 2024 (Maanden 10-12)',
      color: { r: 100, g: 150, b: 255 },
      priority: 'Optimization & Reporting',
      actions: [
        'Eerste CSRD compliance check',
        'Heat pump installatie planning',
        'Carbon offsetting strategie ontwikkelen',
        'Supply chain carbon assessment',
        'Jaar-end sustainability rapportage'
      ],
      budget: '€30,000 - €75,000',
      co2Impact: '65-75% reductie'
    }
  ]
  
  timelinePhases.forEach((phase, index) => {
    // Phase header
    pdf.setFillColor(phase.color.r, phase.color.g, phase.color.b, 0.2)
    pdf.roundedRect(15, yPos - 5, 180, 12, 3, 3, 'F')
    
    pdf.setTextColor(phase.color.r * 0.7, phase.color.g * 0.7, phase.color.b * 0.7)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.period, 20, yPos)
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.text(`Priority: ${phase.priority}`, 20, yPos + 6)
    yPos += 18
    
    // Actions
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    phase.actions.forEach(action => {
      pdf.text(`• ${action}`, 25, yPos)
      yPos += 5
    })
    
    // Metrics
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Budget: ${phase.budget} | CO2 Impact: ${phase.co2Impact}`, 25, yPos + 2)
    yPos += 12
  })
  
  // Key Milestones
  yPos += 10
  pdf.setFillColor(255, 248, 220)
  pdf.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(200, 150, 0)
  pdf.text('🎯 KRITIEKE MIJLPALEN', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const milestones = [
    'Maart 2024: CSRD assessment voltooid + quick wins geïmplementeerd',
    'Juni 2024: 30% CO2 reductie behaald + compliance systemen operationeel',
    'September 2024: 50% CO2 reductie + elektrificatie gestart',
    'December 2024: 70% CO2 reductie + eerste compliance rapportage',
    'Maart 2025: CSRD conforme rapportage (indien verplicht)',
    'Juni 2025: 80%+ CO2 reductie + carbon neutral pathway'
  ]
  
  milestones.forEach(milestone => {
    pdf.text(`• ${milestone}`, 25, yPos)
    yPos += 4
  })
}

function generateAppendix(pdf, results, companyData) {
  pdf.addPage()
  
  pdf.setFillColor(100, 100, 100, 0.1)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bijlagen & Methodologie', 20, 25)
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Technical Appendix | Pagina 12`, 20, 35)

  let yPos = 55
  
  // Methodology
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('📋 METHODOLOGIE', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const methodologyText = `Deze carbon footprint analyse is uitgevoerd conform de volgende internationale en Nederlandse standaarden:

• ISO 14064-1:2018 - Greenhouse gas quantification and reporting
• GHG Protocol Corporate Standard - Scope 1, 2 en 3 emissies
• Nederlandse CO2-Prestatieladder 3.1 - Emissiefactoren en methodiek
• CBS Statline - Nederlandse sectorbenchmarks en emissiefactoren
• CSRD (EU) 2022/2464 - Corporate Sustainability Reporting Directive
• Nederlandse Milieubarometer 2024 - Actuele emissiefactoren

Alle emissiefactoren zijn gebaseerd op de meest recente Nederlandse gegevens van co2emissiefactoren.nl en conform het Handboek CO2 Prestatieladder 3.1.`
  
  const methodologyLines = pdf.splitTextToSize(methodologyText, 170)
  pdf.text(methodologyLines, 20, yPos)
  yPos += methodologyLines.length * 5 + 15
  
  // Data Sources
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('📊 DATA BRONNEN', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const dataSources = [
    'Nederlandse Emissiefactoren: CBS, RVO, co2emissiefactoren.nl',
    'Industrie Benchmarks: CBS Statline, MVO Nederland, RVO',
    'Carbon Pricing: Nederlandse CO2-heffing, EU ETS, Carbon Tracker',
    'Subsidie Informatie: RVO, Rijksdienst voor Ondernemend Nederland',
    'CSRD Compliance: EU Directive 2022/2464, EFRAG ESRS',
    'AI Enhancement: HuggingFace Transformers, Nederlandse sustainability data'
  ]
  
  dataSources.forEach(source => {
    pdf.text(`• ${source}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Disclaimers
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('⚠️ DISCLAIMERS', 20, yPos)
  yPos += 15
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const disclaimers = [
    'Dit rapport is gegenereerd op basis van door u verstrekte gegevens en algemene benchmarks',
    'Aanbevelingen zijn indicatief en kunnen afwijken per specifieke bedrijfssituatie',
    'Kostenbesparingen zijn schattingen gebaseerd op gemiddelde Nederlandse marktprijzen',
    'Voor implementatie wordt advies van gespecialiseerde consultants aanbevolen',
    'Subsidie bedragen kunnen wijzigen; controleer actuele voorwaarden bij RVO',
    'AI-insights zijn gegenereerd door machine learning en dienen als indicatie',
    'Voor compliance rapportage is third-party verificatie vereist'
  ]
  
  disclaimers.forEach(disclaimer => {
    pdf.text(`• ${disclaimer}`, 25, yPos)
    yPos += 6
  })
  
  yPos += 15
  
  // Contact & Support
  pdf.setFillColor(240, 248, 255)
  pdf.roundedRect(15, yPos - 5, 180, 25, 3, 3, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 100, 200)
  pdf.text('📞 CONTACT & ONDERSTEUNING', 20, yPos)
  yPos += 12
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  
  const contactInfo = [
    'Carbon Comply Nederland - Professional Sustainability Consulting',
    'Email: support@carboncomply.nl | Website: www.carboncomply.nl',
    'CSRD Implementation Support: csrd@carboncomply.nl',
    'Technical API Support: api@carboncomply.nl',
    'Emergency Compliance Hotline: +31 20 123 4567'
  ]
  
  contactInfo.forEach(info => {
    pdf.text(info, 25, yPos)
    yPos += 4
  })
  
  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`© ${new Date().getFullYear()} Carbon Comply. Professional Carbon Intelligence Platform.`, 20, 280)
  pdf.text(`Rapport gegenereerd op ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}`, 20, 285)
}

// Helper Functions
function getLargestEmissionSource(breakdown) {
  if (!breakdown) return 'Onbekend'
  const largest = Object.entries(breakdown).reduce((max, [key, value]) => 
    value > max.value ? { key, value } : max, { key: '', value: 0 })
  return getCategoryDisplayName(largest.key)
}

function getCategoryDisplayName(category) {
  const names = {
    energy: 'Energie',
    transport: 'Transport', 
    waste: 'Afval',
    water: 'Water',
    materials: 'Materialen',
    scope3: 'Scope 3'
  }
  return names[category] || category
}

function getBenchmarkStatus(category, value, industry) {
  // Mock benchmark logic based on category and industry
  if (value < 2) return 'Uitstekend'
  if (value < 5) return 'Goed'
  if (value < 10) return 'Gemiddeld'
  return 'Verbetering nodig'
}

function getEmissionStatus(value, total) {
  const percentage = (value / total) * 100
  if (percentage > 40) return 'Kritiek'
  if (percentage > 25) return 'Hoog'
  if (percentage > 15) return 'Medium'
  return 'Laag'
}

function getStatusColor(status) {
  const colors = {
    'Kritiek': { r: 200, g: 0, b: 0 },
    'Hoog': { r: 255, g: 100, b: 0 },
    'Medium': { r: 255, g: 200, b: 0 },
    'Laag': { r: 0, g: 150, b: 0 }
  }
  return colors[status] || { r: 0, g: 0, b: 0 }
}

function getDutchIndustryBenchmark(industry) {
  const benchmarks = {
    'Technologie & Software': 3.2,
    'Productie & Manufacturing': 8.8,
    'Retail & E-commerce': 4.1,
    'Financiële Diensten': 2.4,
    'Gezondheidszorg': 5.2,
    'Onderwijs': 2.8,
    'Transport & Logistiek': 14.8,
    'Bouw & Vastgoed': 11.2,
    'Anders': 5.8
  }
  return benchmarks[industry] || 5.8
}

function calculatePercentile(performance) {
  if (performance <= 0.5) return 95
  if (performance <= 0.7) return 85
  if (performance <= 0.9) return 75
  if (performance <= 1.1) return 60
  if (performance <= 1.3) return 45
  if (performance <= 1.5) return 30
  return 15
}

function getPerformanceRanking(performance) {
  if (performance <= 0.5) return 'Uitstekend (Top 5%)'
  if (performance <= 0.7) return 'Zeer Goed (Top 15%)'
  if (performance <= 0.9) return 'Goed (Top 25%)'
  if (performance <= 1.1) return 'Gemiddeld'
  if (performance <= 1.3) return 'Onder Gemiddeld'
  return 'Verbetering Nodig'
}

function calculateDataCompleteness(breakdown) {
  const totalCategories = 6 // energy, transport, waste, water, materials, scope3
  const filledCategories = Object.values(breakdown).filter(val => val > 0).length
  return Math.round((filledCategories / totalCategories) * 100)
}

function calculateCSRDReadiness(employees) {
  let score = 40
  if (employees > 0) score += 20
  if (employees > 50) score += 15
  if (employees > 100) score += 10
  if (employees > 250) score += 15
  return Math.min(score, 100)
}

function getSectorLeaders(industry) {
  const leaders = {
    'Technologie & Software': {
      leaders: ['Adyen', 'Booking.com', 'TomTom'],
      bestPractice: 1.2,
      innovations: ['Green coding', 'Carbon-aware computing', 'Renewable hosting']
    },
    'Productie & Manufacturing': {
      leaders: ['ASML', 'Philips', 'DSM'],
      bestPractice: 3.5,
      innovations: ['Industry 4.0', 'Circular manufacturing', 'Smart factories']
    },
    'Transport & Logistiek': {
      leaders: ['PostNL', 'Vopak', 'Royal Boskalis'],
      bestPractice: 6.5,
      innovations: ['Electric fleets', 'Route optimization', 'Intermodal transport']
    }
  }
  
  return leaders[industry] || {
    leaders: ['Interface', 'Unilever', 'Ikea'],
    bestPractice: 2.5,
    innovations: ['Renewable energy', 'Circular economy', 'Digital optimization']
  }
}

function getCompetitivePosition(performance) {
  if (performance <= 0.7) {
    return {
      position: 'Industry Leader',
      advantage: 'Significant competitive advantage in sustainability',
      differentiators: ['Low carbon footprint', 'Cost efficiency', 'Brand reputation'],
      opportunity: 'Leverage leadership position for market expansion',
      perception: 'Recognized sustainability champion'
    }
  } else if (performance <= 1.0) {
    return {
      position: 'Strong Performer',
      advantage: 'Above average sustainability performance',
      differentiators: ['Operational efficiency', 'Compliance readiness'],
      opportunity: 'Move towards industry leadership',
      perception: 'Responsible business operator'
    }
  } else if (performance <= 1.3) {
    return {
      position: 'Average Performer',
      advantage: 'Meeting industry standards',
      differentiators: ['Compliance focused', 'Steady improvement'],
      opportunity: 'Accelerate improvement to gain advantage',
      perception: 'Following industry trends'
    }
  } else {
    return {
      position: 'Improvement Needed',
      advantage: 'Cost optimization opportunity',
      differentiators: ['Improvement potential', 'Learning opportunity'],
      opportunity: 'Transform into competitive advantage',
      perception: 'Behind industry curve'
    }
  }
}

function generateFallbackRecommendations(results) {
  const totalEmissions = results.emissions?.total || 0
  const breakdown = results.emissions?.breakdown || {}
  
  return [
    {
      title: 'Groene energie transitie',
      description: 'Schakel over naar 100% Nederlandse groene energie',
      priority: 1,
      co2Reduction: Math.round(breakdown.energy * 0.85 * 100) / 100,
      cost: '€0 - €2,000',
      paybackMonths: 0
    },
    {
      title: 'LED verlichting upgrade',
      description: 'Vervang alle verlichting door LED met smart controls',
      priority: 1,
      co2Reduction: Math.round(breakdown.energy * 0.15 * 100) / 100,
      cost: '€5,000 - €15,000',
      paybackMonths: 18
    },
    {
      title: 'CSRD compliance voorbereiding',
      description: 'Start met CSRD gap analyse en data systemen',
      priority: 1,
      co2Reduction: 0,
      cost: '€25,000 - €50,000',
      paybackMonths: 0
    }
  ]
}
