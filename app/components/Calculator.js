// Upgrade Prompt voor guests die gratis berekening hebben gebruikt
  if (showUpgradePrompt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Gratis Nederlandse berekening gebruikt</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              U heeft uw gratis carbon footprint berekening al gebruikt. Voor meer berekeningen, 
              geavanceerde Nederlandse compliance features en CSRD-conforme rapporten, 
              kies een van onderstaande opties:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Account aanmaken */}
              <div className="glass-effect-dark rounded-xl p-6 text-left">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <UserPlusIcon className="w-5 h-5 text-primary-400" />
                  Account Aanmaken
                </h4>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>✅ Onbeperkte berekeningen</li>
                  <li>✅ AI-powered Nederlandse insights</li>
                  <li>✅ CSRD & WPM compliance check</li>
                  <li>✅ Data opslag en tracking</li>
                  <li>✅ Basis PDF rapporten</li>
                </ul>
                <button className="w-full gradient-button py-3 rounded-lg font-semibold">
                  Gratis Account
                </button>
              </div>

              {/* Eenmalige aankoop */}
              <div className="glass-effect-dark rounded-xl p-6 text-left border border-primary-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-blue-400" />
                  Professioneel Rapport
                </h4>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>✅ CSRD-conform 25+ pagina rapport</li>
                  <li>✅ Nederlandse compliance analyse</li>
                  <li>✅ AI-powered actionable insights</li>
                  <li>✅ Implementation roadmap</li>
                  <li>✅ Risk assessment & benchmarking</li>
                </ul>
                <div className="text-xs text-gray-500">
                  ROI binnen {results.costSavings?.timeline || '18 maanden'}
                </div>
              </div>
            </div>

            {/* Nederlandse Compliance Dashboard */}
            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-400" />
                Nederlandse Compliance Status
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">CSRD Rapportage</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      (results.companyInfo.employees > 250) ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    // Main calculator form
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-effect rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header met Nederlandse branding */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center relative">
                <CalculatorIcon className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">NL</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nederlandse Carbon Footprint Calculator</h2>
                <p className="text-gray-400">
                  {isAuthenticated ? 'CSRD-conforme berekening met AI-insights' : 'Gratis Nederlandse berekening - 1x per gebruiker'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar met Nederlandse indicatoren */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Stap {currentStep} van {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% voltooid</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 relative">
            <motion.div
              className="bg-gradient-to-r from-red-500 via-white to-blue-600 h-3 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
            {/* Nederlandse vlag accent */}
            <div className="absolute top-0 right-0 w-6 h-3 bg-orange-500 rounded-r-full opacity-60"></div>
          </div>
          
          {/* Feature indicators */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Nederlandse emissiefactoren</span>
              </div>
              <div className="flex items-center space-x-1">
                <BuildingOfficeIcon className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">CSRD & WPM compliance</span>
              </div>
              {isAuthenticated && (
                <div className="flex items-center space-x-1">
                  <SparklesIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400">AI-powered Nederlandse insights</span>
                </div>
              )}
            </div>
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <EyeIcon className="w-4 h-4" />
                <span>Gratis Nederlandse preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation met Nederlandse styling */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 glass-effect rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Vorige</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            {/* Nederlandse compliance indicatoren */}
            <div className="hidden md:flex items-center space-x-3 text-xs text-gray-400">
              {currentStep >= 2 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Nederlandse metodiek</span>
                </div>
              )}
              {currentStep >= 7 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>CSRD ready</span>
                </div>
              )}
            </div>

            <motion.button
              onClick={nextStep}
              disabled={isCalculating}
              className="flex items-center space-x-2 gradient-button px-6 py-3 rounded-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {isCalculating ? 'Nederlandse berekening...' : 
                 currentStep === totalSteps ? 'Bereken Nederlandse Footprint' : 'Volgende'}
              </span>
              {!isCalculating && currentStep < totalSteps && <ChevronRightIcon className="w-5 h-5" />}
              {isCalculating && <div className="w-4 h-4 loading-spinner"></div>}
            </motion.button>
          </div>
        </div>

        {/* Nederlandse footer info */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>🇳🇱 Nederlandse methodiek</span>
              <span>📊 CSRD compliant</span>
              <span>🔒 Privacy conform GDPR</span>
            </div>
            <div className="flex items-center space-x-1">
              <GlobeEuropeAfricaIcon className="w-3 h-3" />
              <span>CO2-Prestatieladder conform</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Calculator`}>
                      {(results.companyInfo.employees > 250) ? 'Verplicht 2025' : 'Optioneel'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {(results.companyInfo.employees > 250) ? 
                      'Eerste rapportage deadline maart 2025' : 
                      'Voorbereiding aanbevolen voor toekomst'}
                  </p>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">WPM Rapportage</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      (results.companyInfo.employees >= 100) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {(results.companyInfo.employees >= 100) ? 'Verplicht' : 'N.v.t.'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {(results.companyInfo.employees >= 100) ? 
                      'Deadline: 30 juni 2025' : 
                      'Niet van toepassing (<100 werknemers)'}
                  </p>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">CO2 Prestatieladder</h4>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                      Aanbevolen
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Aanbestedingsvoordeel bij overheidsopdrachten
                  </p>
                </div>
              </div>
            </div>

            {/* Charts met Nederlandse context */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* CO2 Breakdown */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">CO2 Uitstoot per Categorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Nederlandse CO2 Prijs Projectie */}
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">CO2 Prijs Ontwikkeling Nederland</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { year: '2024', prijs: 30.48, eu_ets: 95 },
                    { year: '2025', prijs: 50, eu_ets: 110 },
                    { year: '2026', prijs: 75, eu_ets: 125 },
                    { year: '2027', prijs: 100, eu_ets: 140 },
                    { year: '2028', prijs: 135, eu_ets: 155 },
                    { year: '2029', prijs: 175, eu_ets: 170 },
                    { year: '2030', prijs: 216, eu_ets: 185 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prijs" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="NL CO2-heffing (€/ton)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eu_ets" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="EU ETS (€/ton)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights met Nederlandse focus */}
            {isAuthenticated && (
              <div className="glass-effect-dark rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-yellow-400" />
                    AI-Powered Nederlandse Compliance Insights
                  </h3>
                  {!aiInsights && !loadingAI && (
                    <motion.button
                      onClick={() => generateAIInsights(results)}
                      className="gradient-button px-4 py-2 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Genereer Nederlandse AI Insights
                    </motion.button>
                  )}
                </div>

                {loadingAI && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 loading-spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">AI analyseert uw Nederlandse carbon footprint...</p>
                    <p className="text-gray-500 text-sm mt-2">Inclusief CSRD, WPM en CO2-heffing analyse</p>
                  </div>
                )}

                {aiInsights && (
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    {aiInsights.executiveSummary && (
                      <div className="bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-lg p-6 border border-primary-500/20">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <BoltIcon className="w-5 h-5 text-primary-400" />
                          Executive Summary
                        </h4>
                        <p className="text-gray-300 leading-relaxed mb-4">{aiInsights.executiveSummary.headline}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-black/20 rounded p-3">
                            <div className="text-2xl font-bold text-primary-400">{aiInsights.executiveSummary.keyMetrics?.totalEmissions} ton</div>
                            <div className="text-sm text-gray-400">Totale CO2 uitstoot</div>
                          </div>
                          <div className="bg-black/20 rounded p-3">
                            <div className="text-2xl font-bold text-blue-400">{aiInsights.executiveSummary.keyMetrics?.emissionsPerEmployee} ton</div>
                            <div className="text-sm text-gray-400">Per medewerker</div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-400">
                          CSRD Readiness Score: <span className="text-primary-400 font-medium">{aiInsights.executiveSummary.csrdReadiness}%</span>
                        </div>
                      </div>
                    )}

                    {/* Nederlandse Action Plan */}
                    {aiInsights.actionPlan && (
                      <div>
                        <h4 className="font-semibold text-white mb-4">Nederlandse Implementatie Roadmap</h4>
                        <div className="space-y-4">
                          {Object.entries(aiInsights.actionPlan.phases).map(([phase, actions]) => (
                            <div key={phase} className="bg-black/20 rounded-lg p-4">
                              <h5 className="font-medium text-white mb-3 capitalize">
                                {phase === 'immediate' ? '🚀 Directe actie (0-6 maanden)' :
                                 phase === 'shortTerm' ? '📈 Kortetermijn (6-18 maanden)' :
                                 '🎯 Langetermijn (18-36 maanden)'}
                              </h5>
                              <div className="space-y-2">
                                {actions.map((action, index) => (
                                  <div key={index} className="text-sm bg-black/20 rounded p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-gray-300 font-medium">{action.action}</span>
                                      {action.dutchSpecific && <span className="text-orange-400 text-xs">🇳🇱 NL</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                      <span>💰 {action.cost}</span>
                                      <span>📊 {action.impact}</span>
                                    </div>
                                    {action.subsidies && (
                                      <div className="mt-2 text-xs text-blue-400">
                                        Subsidies: {action.subsidies.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nederlandse Risk Assessment */}
                    {aiInsights.riskAssessment && (
                      <div>
                        <h4 className="font-semibold text-white mb-4">Nederlandse Risico Analyse</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {aiInsights.riskAssessment.risks.slice(0, 4).map((risk, index) => (
                            <div key={index} className="bg-black/20 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-white">{risk.type}</h5>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  risk.level === 'Kritiek' ? 'bg-red-500/20 text-red-400' :
                                  risk.level === 'Hoog' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {risk.level}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">{risk.description}</p>
                              <div className="text-xs text-gray-400">
                                <div>⏱️ Timeline: {risk.timeline}</div>
                                <div>💸 Impact: {risk.estimatedCost}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Nederlandse Aanbevelingen */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="glass-effect-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Nederlandse Sustainability Aanbevelingen</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.recommendations.slice(0, 6).map((rec, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4 hover:bg-black/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{rec.action}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.impact === 'Hoog' ? 'bg-red-500/20 text-red-400' :
                          rec.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {rec.impact}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>🌱 Besparing: <span className="text-green-400">{rec.savings} ton CO2</span></p>
                        <p>💰 Investering: <span className="text-blue-400">{rec.cost}</span></p>
                        <p>⏱️ ROI: <span className="text-purple-400">{rec.paybackMonths} maanden</span></p>
                      </div>
                      <div className="mt-2 bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-green-400 h-1 rounded-full" 
                          style={{ width: `${Math.min(rec.priority * 20, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Sectie */}
            <div className="glass-effect-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Volgende Stappen voor Nederlandse Compliance</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Professional PDF */}
                {isAuthenticated && results.calculationId && (
                  <motion.button
                    onClick={generateProfessionalPDF}
                    disabled={isGeneratingPDF}
                    className="flex flex-col items-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DocumentArrowDownIcon className="w-8 h-8 text-green-400 mb-3" />
                    <span className="font-medium text-white mb-2">
                      {isGeneratingPDF ? 'Genereren...' : 'Download Nederlands Rapport'}
                    </span>
                    <span className="text-xs text-gray-400 text-center">
                      25+ pagina CSRD-conform rapport met Nederlandse compliance analyse
                    </span>
                  </motion.button>
                )}

                {/* One-time Purchase voor guests */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={handleOneTimePayment}
                    className="flex flex-col items-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCardIcon className="w-8 h-8 text-blue-400 mb-3" />
                    <span className="font-medium text-white mb-2">Professioneel Rapport - €149</span>
                    <span className="text-xs text-gray-400 text-center">
                      Eenmalige aankoop van volledig Nederlands carbon footprint rapport
                    </span>
                  </motion.button>
                )}

                {/* Account Creation */}
                {!isAuthenticated && (
                  <motion.button
                    className="flex flex-col items-center p-6 bg-primary-500/10 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserPlusIcon className="w-8 h-8 text-primary-400 mb-3" />
                    <span className="font-medium text-white mb-2">Nederlandse Account</span>
                    <span className="text-xs text-gray-400 text-center">
                      Onbeperkte berekeningen + Nederlandse compliance tracking
                    </span>
                  </motion.button>
                )}

                {/* New Calculation */}
                <motion.button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentStep(1)
                    setResults(null)
                    setAiInsights(null)
                  }}
                  className="flex flex-col items-center p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CalculatorIcon className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="font-medium text-white mb-2">Nieuwe Berekening</span>
                  <span className="text-xs text-gray-400 text-center">
                    Start een nieuwe Nederlandse carbon footprint analyse
                  </span>
                </motion.button>
              </div>

              {/* Guest limitations notice */}
              {!isAuthenticated && guestCalculationUsed && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Gratis Nederlandse berekening gebruikt</p>
                      <p className="text-gray-300 text-sm mt-1">
                        U heeft uw gratis carbon footprint berekening gebruikt. Voor meer berekeningen, 
                        geavanceerde Nederlandse compliance features (CSRD, WPM, CO2-heffing) en 
                        professionele rapportages, maak een account aan of koop een eenmalig rapport.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }center mb-3">
                  <span className="text-2xl font-bold text-primary-400">€149</span>
                  <span className="text-gray-400 ml-1">eenmalig</span>
                </div>
                <button 
                  onClick={handleOneTimePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Koop Rapport
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Later beslissen
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Results view met Nederlandse focus
  if (showResults && results) {
    const breakdownData = Object.entries(results.emissions.breakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      color: {
        energy: '#22c55e',
        transport: '#3b82f6', 
        waste: '#f59e0b',
        water: '#06b6d4',
        materials: '#8b5cf6',
        scope3: '#ef4444'
      }[key] || '#6b7280'
    }))

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-effect rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
        >
          {/* Header met Nederlandse vlag accent */}
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-white to-blue-500 rounded-xl flex items-center justify-center relative">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nederlandse Carbon Footprint Resultaten</h2>
                  <p className="text-gray-400">{results.companyInfo.name} • {results.companyInfo.industry} • {results.companyInfo.location || 'Nederland'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Nederlandse Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">
                  {results.emissions.total}
                </div>
                <div className="text-gray-400 mb-2">ton CO2e per jaar</div>
                <div className="text-xs text-gray-500">
                  {(results.emissions.total / results.companyInfo.employees).toFixed(1)} ton per medewerker
                </div>
                <div className="text-xs text-blue-400 mt-2">
                  Nederlandse methodiek
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  €{Math.round(results.emissions.total * 30.48).toLocaleString()}
                </div>
                <div className="text-gray-400 mb-2">CO2-heffing 2024</div>
                <div className="text-xs text-orange-500">
                  €{Math.round(results.emissions.total * 216).toLocaleString()} in 2030
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {results.benchmark?.percentile || 0}%
                </div>
                <div className="text-gray-400 mb-2">Beter dan NL peers</div>
                <div className="text-xs text-gray-500">
                  {results.benchmark?.ranking || 'Gemiddeld'} in sector
                </div>
              </div>
              
              <div className="glass-effect-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  €{results.costSavings?.total?.toLocaleString() || 0}
                </div>
                <div className="text-gray-400 mb-2">Besparingspotentieel</div>
                <div className="text-'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  EyeIcon,
  UserPlusIcon,
  BoltIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  GlobeEuropeAfricaIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts'
import { useAuth } from '../../lib/AuthContext'
import toast from 'react-hot-toast'

const Calculator = ({ onClose }) => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [guestCalculationUsed, setGuestCalculationUsed] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showOneTimePayment, setShowOneTimePayment] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    industry: user?.industry || '',
    employees: user?.employees || '',
    revenue: '',
    location: 'Nederland',
    energy: {
      electricity: '',
      gas: '',
      heating: '',
      greenEnergyPercentage: '0'
    },
    transport: {
      carFleet: '',
      electricVehicles: '0',
      publicTransport: '',
      businessTravel: '',
      homeToWork: ''
    },
    waste: {
      general: '',
      recycling: '',
      organic: '',
      hazardous: ''
    },
    water: '',
    materials: {
      paper: '',
      plastic: '',
      metal: '',
      electronics: ''
    },
    scope3: {
      procurement: '',
      outsourcing: '',
      businessServices: ''
    }
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const totalSteps = 8 // Uitgebreid naar 8 stappen
  const progress = (currentStep / totalSteps) * 100

  const dutchIndustries = [
    'Technologie & Software', 'Productie & Manufacturing', 'Retail & E-commerce', 
    'Financiële Diensten', 'Gezondheidszorg', 'Onderwijs', 'Transport & Logistiek', 
    'Bouw & Vastgoed', 'Agri & Food', 'Energie & Utilities', 'Consultancy', 'Anders'
  ]

  const dutchCities = [
    'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Tilburg',
    'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Apeldoorn', 'Anders'
  ]

  const calculateFootprint = async () => {
    // Check gratis berekening voor guests
    if (!isAuthenticated) {
      const hasUsedFree = localStorage.getItem('carbon_comply_free_calculation_used')
      if (hasUsedFree) {
        setShowUpgradePrompt(true)
        return
      }
    }

    setIsCalculating(true)
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...formData,
          dutch: true,
          csrdCompliance: true
        })
      })

      if (!response.ok) {
        throw new Error('Calculation failed')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
      
      // Mark free calculation als gebruikt voor guests
      if (!isAuthenticated) {
        localStorage.setItem('carbon_comply_free_calculation_used', Date.now().toString())
        setGuestCalculationUsed(true)
      }
      
      toast.success('Nederlandse carbon footprint berekend!')
      
      // Auto-genereer AI insights voor authenticated users
      if (isAuthenticated) {
        await generateAIInsights(data)
      }
      
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Er ging iets mis bij de berekening')
    } finally {
      setIsCalculating(false)
    }
  }

  const generateAIInsights = async (calculationData) => {
    if (!isAuthenticated) {
      toast.error('Log in voor geavanceerde AI-insights met Nederlandse compliance analyse')
      return
    }

    setLoadingAI(true)
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          emissions: calculationData.emissions,
          companyInfo: calculationData.companyInfo,
          industry: calculationData.companyInfo.industry,
          goals: {
            targetReduction: 30,
            timeline: 24,
            csrdCompliance: true,
            dutchMarket: true
          }
        })
      })

      if (!response.ok) {
        throw new Error('AI insights generation failed')
      }

      const insights = await response.json()
      setAiInsights(insights.insights)
      toast.success('AI insights met Nederlandse compliance analyse gegenereerd!')
      
    } catch (error) {
      console.error('AI insights error:', error)
      toast.error('Er ging iets mis bij het genereren van AI insights')
    } finally {
      setLoadingAI(false)
    }
  }

  const generateProfessionalPDF = async () => {
    if (!results?.calculationId) {
      toast.error('Je moet eerst ingelogd zijn om een professioneel PDF rapport te downloaden')
      return
    }

    setIsGeneratingPDF(true)
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          calculationId: results.calculationId,
          reportType: 'dutch_professional',
          includeCSRD: true,
          includeAIInsights: !!aiInsights,
          dutchCompliance: true
        })
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `Nederlandse-Carbon-Footprint-Rapport-${results.companyInfo?.name || 'rapport'}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Professioneel Nederlands carbon footprint rapport gedownload!')
      
    } catch (error) {
      console.error('PDF error:', error)
      toast.error('Er ging iets mis bij het genereren van de PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleOneTimePayment = async () => {
    try {
      const response = await fetch('/api/create-onetime-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          calculationData: {
            companyInfo: results.companyInfo,
            results: results,
            calculationId: results.calculationId || 'guest',
            dutch: true,
            csrdCompliance: true
          },
          customerEmail: '',
          customerName: '',
          companyName: results.companyInfo.name,
          reportType: 'dutch_professional_csrd'
        })
      })

      const data = await response.json()
      
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        toast.error('Er ging iets mis bij het starten van de betaling')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Er ging iets mis bij het betalingsproces')
    }
  }

  const handleInputChange = (category, field, value) => {
    if (category) {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateFootprint()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Nederlandse Bedrijfsinformatie</h3>
              <p className="text-gray-400">Conform CSRD en Nederlandse rapportagestandaarden</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange(null, 'companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Voer uw Nederlandse bedrijfsnaam in"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Industrie *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange(null, 'industry', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    required
                  >
                    <option value="">Selecteer industrie</option>
                    {dutchIndustries.map(industry => (
                      <option key={industry} value={industry} className="bg-gray-800">
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Locatie</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange(null, 'location', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  >
                    {dutchCities.map(city => (
                      <option key={city} value={city} className="bg-gray-800">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aantal medewerkers *</label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => handleInputChange(null, 'employees', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 50"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {parseInt(formData.employees) >= 100 ? '⚠️ WPM rapportage verplicht' : 
                     parseInt(formData.employees) >= 250 ? '🔴 CSRD rapportage verplicht' : '✅ Geen directe rapportageplicht'}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Jaaromzet (optioneel)</label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange(null, 'revenue', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="€ miljoen"
                  />
                  <p className="text-xs text-gray-400 mt-1">Voor CSRD compliance check</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Energieverbruik (Scope 1 & 2)</h3>
              <p className="text-gray-400">Nederlandse emissiefactoren conform CO2-Prestatieladder</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Elektriciteit verbruik (kWh/jaar)</label>
                <input
                  type="number"
                  value={formData.energy.electricity}
                  onChange={(e) => handleInputChange('energy', 'electricity', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Bijv. 50000"
                />
                <p className="text-xs text-gray-400 mt-1">Nederlandse stroommix: 0.298 kg CO2/kWh</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aardgas verbruik (m³/jaar)</label>
                  <input
                    type="number"
                    value={formData.energy.gas}
                    onChange={(e) => handleInputChange('energy', 'gas', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 15000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Nederlandse aardgas: 1.884 kg CO2/m³</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Groene energie percentage (%)</label>
                  <input
                    type="number"
                    value={formData.energy.greenEnergyPercentage}
                    onChange={(e) => handleInputChange('energy', 'greenEnergyPercentage', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="0-100%"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Voor Scope 2 market-based berekening</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Overige verwarming (kWh/jaar)</label>
                <input
                  type="number"
                  value={formData.energy.heating}
                  onChange={(e) => handleInputChange('energy', 'heating', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Warmtepomp, elektrische verwarming"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Transport & Mobiliteit</h3>
              <p className="text-gray-400">Inclusief WPM (Werkgebonden Personenmobiliteit) rapportage</p>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Bedrijfswagens (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.carFleet}
                    onChange={(e) => handleInputChange('transport', 'carFleet', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 100000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lease auto's, busjes, vrachtwagens</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Elektrische voertuigen (%)</label>
                  <input
                    type="number"
                    value={formData.transport.electricVehicles}
                    onChange={(e) => handleInputChange('transport', 'electricVehicles', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="0-100%"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Voor SEEH subsidie berekening</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Woon-werk verkeer medewerkers (km/jaar)</label>
                <input
                  type="number"
                  value={formData.transport.homeToWork}
                  onChange={(e) => handleInputChange('transport', 'homeToWork', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Voor WPM rapportage (verplicht 100+ werknemers)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {parseInt(formData.employees) >= 100 ? '🔴 Verplicht voor WPM rapportage' : '✅ Optioneel voor WPM'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Openbaar vervoer (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.publicTransport}
                    onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="NS, GVB, RET etc."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Zakelijke vliegreizen (km/jaar)</label>
                  <input
                    type="number"
                    value={formData.transport.businessTravel}
                    onChange={(e) => handleInputChange('transport', 'businessTravel', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Internationale en binnenlandse vluchten"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Afval & Circulaire Economie</h3>
              <p className="text-gray-400">Nederlandse afvalverwerking en recycling</p>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Restafval (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.waste.general}
                    onChange={(e) => handleInputChange('waste', 'general', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Bijv. 5000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Niet-recyclebaar afval naar verbrandingsoven</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Recycling (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.waste.recycling}
                    onChange={(e) => handleInputChange('waste', 'recycling', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Papier, plastic, glas, metaal"
                  />
                  <p className="text-xs text-gray-400 mt-1">80% emissiereductie vs restafval</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Organisch afval (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.waste.organic}
                    onChange={(e) => handleInputChange('waste', 'organic', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="GFT, kantineafval"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Gevaarlijk afval (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.waste.hazardous}
                    onChange={(e) => handleInputChange('waste', 'hazardous', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Chemicaliën, batterijen, e-waste"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Waterverbruik (m³/jaar)</label>
                <input
                  type="number"
                  value={formData.water}
                  onChange={(e) => handleInputChange(null, 'water', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Drinkwater en proceswater"
                />
                <p className="text-xs text-gray-400 mt-1">Nederlandse waterproductie: 0.298 kg CO2/m³</p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Materialen & Inkoop</h3>
              <p className="text-gray-400">Upstream emissies van materiaalgebruik</p>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Papier verbruik (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.materials.paper}
                    onChange={(e) => handleInputChange('materials', 'paper', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Kantoorpapier, prints, documenten"
                  />
                  <p className="text-xs text-gray-400 mt-1">0.921 kg CO2 per kg papier</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Plastic verbruik (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.materials.plastic}
                    onChange={(e) => handleInputChange('materials', 'plastic', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Verpakkingen, kantoorartikelen"
                  />
                  <p className="text-xs text-gray-400 mt-1">1.967 kg CO2 per kg plastic</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Metaal verbruik (kg/jaar)</label>
                  <input
                    type="number"
                    value={formData.materials.metal}
                    onChange={(e) => handleInputChange('materials', 'metal', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Machines, gereedschap, onderdelen"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Elektronica (€/jaar)</label>
                  <input
                    type="number"
                    value={formData.materials.electronics}
                    onChange={(e) => handleInputChange('materials', 'electronics', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                    placeholder="Laptops, telefoons, servers"
                  />
                  <p className="text-xs text-gray-400 mt-1">Spend-based: 0.2 kg CO2 per €</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Scope 3: Upstream Activiteiten</h3>
              <p className="text-gray-400">Indirecte emissies uit de waardeketen</p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Inkoop goederen & diensten (€/jaar)</label>
                <input
                  type="number"
                  value={formData.scope3.procurement}
                  onChange={(e) => handleInputChange('scope3', 'procurement', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Totale inkoopwaarde exclusief energie"
                />
                <p className="text-xs text-gray-400 mt-1">Spend-based methode: gemiddeld 0.25 kg CO2 per €</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Uitbesteed werk (€/jaar)</label>
                <input
                  type="number"
                  value={formData.scope3.outsourcing}
                  onChange={(e) => handleInputChange('scope3', 'outsourcing', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Consultancy, schoonmaak, beveiliging"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Zakelijke diensten (€/jaar)</label>
                <input
                  type="number"
                  value={formData.scope3.businessServices}
                  onChange={(e) => handleInputChange('scope3', 'businessServices', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="Marketing, IT, legal, finance"
                />
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Nederlandse Compliance</h3>
              <p className="text-gray-400">CSRD, WPM en CO2-heffing voorbereiding</p>
            </div>
            <div className="space-y-4">
              {/* CSRD Status */}
              <div className="glass-effect-dark rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-400" />
                  CSRD Rapportage Status
                </h4>
                <div className="text-sm text-gray-300">
                  {(parseInt(formData.employees) > 250 || parseInt(formData.revenue) > 50) ? (
                    <div className="text-red-400">
                      🔴 CSRD rapportage verplicht - Deadline: maart 2025
                    </div>
                  ) : (
                    <div className="text-green-400">
                      ✅ Geen directe CSRD verplichting, maar voorbereiding aanbevolen
                    </div>
                  )}
                </div>
              </div>

              {/* WPM Status */}
              <div className="glass-effect-dark rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <GlobeEuropeAfricaIcon className="w-5 h-5 text-yellow-400" />
                  WPM Rapportage Status
                </h4>
                <div className="text-sm text-gray-300">
                  {parseInt(formData.employees) >= 100 ? (
                    <div className="text-yellow-400">
                      ⚠️ WPM rapportage verplicht - Deadline: 30 juni 2025
                    </div>
                  ) : (
                    <div className="text-green-400">
                      ✅ Geen WPM rapportageplicht (&lt;100 werknemers)
                    </div>
                  )}
                </div>
              </div>

              {/* CO2 Heffing */}
              <div className="glass-effect-dark rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                  CO2-Heffing Impact
                </h4>
                <div className="text-sm text-gray-300">
                  {['Productie & Manufacturing', 'Bouw & Vastgoed', 'Transport & Logistiek'].includes(formData.industry) ? (
                    <div className="text-orange-400">
                      ⚠️ Mogelijk onderhevig aan CO2-heffing industrie
                    </div>
                  ) : (
                    <div className="text-blue-400">
                      ℹ️ Indirecte impact via leveranciers en energieprijzen
                    </div>
                  )}
                </div>
              </div>

              {/* Data Quality Check */}
              <div className="glass-effect-dark rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Data Kwaliteit Check</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scope 1 & 2 data:</span>
                    <span className={`${(formData.energy.electricity || formData.energy.gas) ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(formData.energy.electricity || formData.energy.gas) ? 'Aanwezig' : 'Incompleet'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transport data:</span>
                    <span className={`${formData.transport.carFleet ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formData.transport.carFleet ? 'Aanwezig' : 'Ontbreekt'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scope 3 data:</span>
                    <span className={`${formData.scope3.procurement ? 'text-green-400' : 'text-orange-400'}`}>
                      {formData.scope3.procurement ? 'Basis aanwezig' : 'Minimaal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Bevestig Nederlandse Carbon Footprint</h3>
              <p className="text-gray-400">Controleer uw gegevens voor nauwkeurige CSRD-conforme berekening</p>
            </div>
            <div className="glass-effect-dark rounded-lg p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bedrijf:</span>
                    <span className="text-white">{formData.companyName || 'Niet ingevuld'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Industrie:</span>
                    <span className="text-white">{formData.industry || 'Niet ingevuld'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Medewerkers:</span>
                    <span className="text-white">{formData.employees || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Locatie:</span>
                    <span className="text-white">{formData.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elektriciteit:</span>
                    <span className="text-white">{formData.energy.electricity || '0'} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Aardgas:</span>
                    <span className="text-white">{formData.energy.gas || '0'} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Groene energie:</span>
                    <span className="text-white">{formData.energy.greenEnergyPercentage || '0'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transport:</span>
                    <span className="text-white">{formData.transport.carFleet || '0'} km</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-600">
                <h4 className="font-semibold text-white mb-3">Nederlandse Compliance Status:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">CSRD Rapportage:</span>
                    <span className={`font-medium ${
                      (parseInt(formData.employees) > 250 || parseInt(formData.revenue) > 50) 
                        ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {(parseInt(formData.employees) > 250 || parseInt(formData.revenue) > 50) ? 'Verplicht' : 'Optioneel'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">WPM Rapportage:</span>
                    <span className={`font-medium ${
                      parseInt(formData.employees) >= 100 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {parseInt(formData.employees) >= 100 ? 'Verplicht' : 'Niet van toepassing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">CO2-Heffing:</span>
                    <span className="text-blue-400 font-medium">
                      {['Productie & Manufacturing', 'Bouw & Vastgoed'].includes(formData.industry) ? 'Mogelijk van toepassing' : 'Indirecte impact'}
                    </span>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Gratis Nederlandse berekening</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Dit is uw gratis carbon footprint berekening volgens Nederlandse standaarden. 
                    Voor geavanceerde CSRD-conforme rapporten, AI-insights en onbeperkte berekeningen, 
                    maak een account aan.
                  </p>
                  <div className="flex gap-2">
                    <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                      Account aanmaken
                    </button>
                    <span className="text-gray-500">•</span>
                    <button className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                      Later inloggen
                    </button>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">CSRD-conforme berekening</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Uw berekening wordt opgeslagen en u krijgt automatisch AI-powered Dutch compliance insights 
                    en een professioneel Nederlands carbon footprint rapport.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }
