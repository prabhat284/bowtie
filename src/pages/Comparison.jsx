//cat > src/pages/Comparison.jsx <<'EOF'
import React, { useState } from 'react';
import { Check, X, ArrowRight, TrendingUp, DollarSign, Clock, Users, Shield, Zap, Package, Wrench } from 'lucide-react';

export default function Comparison() {
  const [pricingView, setPricingView] = useState('migration'); // 'migration' or 'gasline'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - same as before */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Platform Comparison
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Legacy System vs. Culturiq BowTie Platform
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        
        {/* Pricing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-xl shadow-lg p-2 gap-2">
            <button
              onClick={() => setPricingView('migration')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                pricingView === 'migration'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Full Migration
            </button>
            <button
              onClick={() => setPricingView('gasline')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                pricingView === 'gasline'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-5 h-5 inline mr-2" />
              Gas Pipeline Safety
            </button>
          </div>
        </div>

        {/* Migration Pricing View */}
        {pricingView === 'migration' && (
          <div className="space-y-12">
            
            {/* Cost Comparison Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-sm font-semibold mb-2 opacity-90">Legacy System</h3>
                <div className="text-4xl font-bold mb-2">₹91-136L</div>
                <div className="text-sm opacity-75">Annual Total Cost</div>
                <div className="text-xs mt-2 opacity-60">+ ₹60-100L implementation</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-sm font-semibold mb-2 opacity-90">Culturiq Professional</h3>
                <div className="text-4xl font-bold mb-2">₹48L</div>
                <div className="text-sm opacity-75">Annual Subscription</div>
                <div className="text-xs mt-2 opacity-60">+ ₹15-30L migration (one-time)</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <DollarSign className="w-12 h-12 mb-2 opacity-80" />
                <div className="text-4xl font-bold mb-2">65%</div>
                <div className="text-sm opacity-90">Total Savings</div>
                <div className="text-xs mt-2 opacity-75">₹43-88L annually</div>
              </div>
            </div>

            {/* Migration Tiers */}
            <div>
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
                Migration Plans - Choose Your Path
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Essential Tier */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-slate-50">
                    <h3 className="text-2xl font-bold text-slate-800">Essential</h3>
                    <p className="text-slate-600 text-sm mt-2">Single plant deployment</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-blue-600">₹28L</span>
                      <span className="text-slate-600">/year</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Complete BowTieXP feature parity</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">One-time data migration included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Up to 100 bow tie projects</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">30-day parallel run support</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Email support (48hr response)</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Professional Tier */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-500 relative transform scale-105">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h3 className="text-2xl font-bold text-slate-800">Professional</h3>
                    <p className="text-slate-600 text-sm mt-2">Multi-plant enterprise</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-blue-600">₹48L</span>
                      <span className="text-slate-600">/year</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 font-medium">Everything in Essential</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Unlimited projects & users</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Advanced KPI dashboard</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Auto-barrier effectiveness scoring</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Reusable barrier library</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">90-day dedicated migration support</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Priority support (24hr response)</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white rounded-lg font-semibold transition-all">
                      Get Started
                    </button>
                  </div>
                </div>

                {/* Enterprise Tier */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <h3 className="text-2xl font-bold text-slate-800">Enterprise</h3>
                    <p className="text-slate-600 text-sm mt-2">Full digital transformation</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-purple-600">₹85L</span>
                      <span className="text-slate-600">/year</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 font-medium">Everything in Professional</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">AI-powered recommendations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">SCADA/DCS integration (5 systems)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Real-time barrier monitoring</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Historical incident mining (10yrs)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">Dedicated account manager</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">24/7 support</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                      Contact Sales
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Migration Included */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">✓ Migration Services Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Legacy Data Import</p>
                    <p className="text-sm text-slate-600">Automated Excel/CSV import with validation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">User Account Migration</p>
                    <p className="text-sm text-slate-600">Transfer all users, roles & permissions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Parallel Run Support</p>
                    <p className="text-sm text-slate-600">30-90 days running both systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Training & Onboarding</p>
                    <p className="text-sm text-slate-600">Comprehensive team training sessions</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Gas Pipeline Safety View */}
        {pricingView === 'gasline' && (
          <div className="space-y-12">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Gas Pipeline Safety Solution
              </h2>
              <p className="text-lg text-slate-600">
                Specialized solution for LD/BF CO gas network protection without full system migration
              </p>
            </div>

            {/* Phased Approach */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Phase 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">PHASE 1</span>
                    <span className="text-sm text-slate-600">6-8 weeks</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mt-4">Assessment</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-orange-600">₹18L</span>
                    <span className="text-slate-600 text-sm ml-2">one-time</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Deliverables:</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Complete gas pipeline network bow tie</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Threat identification (backfire, puncture)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Barrier effectiveness evaluation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Risk prioritization matrix</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Gap analysis report</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Executive presentation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Platform access (assessment period)</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all">
                    Start Assessment
                  </button>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-500 relative transform scale-105">
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  RECOMMENDED
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">PHASE 2</span>
                    <span className="text-sm text-slate-600">Ongoing</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mt-4">Live Monitoring</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">₹35L</span>
                    <span className="text-slate-600">/year</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Features:</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Real-time sensor integration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Pressure, flow, gas detection monitoring</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Auto-alert system (SMS/Email)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Barrier health dashboard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Incident prediction analytics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Mobile app for field engineers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">12 months platform license</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white rounded-lg font-semibold transition-all">
                    Get Started
                  </button>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">PHASE 3</span>
                    <span className="text-sm text-slate-600">Optional</span>
                  </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mt-4">Plant-wide</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-purple-600">₹48L</span>
                    <span className="text-slate-600">/year</span>
                  </div>
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Expansion Features:</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Everything in Phase 2</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Unlimited bow tie projects (all hazards)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Multi-department access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">AI-powered recommendations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Cross-plant benchmarking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Professional tier features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Covers all safety scenarios</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>

            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Optional Add-ons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800">Additional Plant/Site</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₹12L/year</p>
                  <p className="text-sm text-slate-600 mt-2">Expand monitoring to additional locations</p>
                </div>
                <div className="border-2 border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800">Emergency Response Integration</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₹8L</p>
                  <p className="text-sm text-slate-600 mt-2">One-time integration with ERP system</p>
                </div>
                <div className="border-2 border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800">Historical Incident Analysis</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₹15L</p>
                  <p className="text-sm text-slate-600 mt-2">AI mining of 10+ years incident data</p>
                </div>
              </div>
            </div>

            {/* Why Gas Line Approach */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-orange-900 mb-4">Why Start with Gas Pipeline Safety?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Quick Win (6-8 weeks)
                  </h4>
                  <p className="text-sm text-slate-700">
                    Immediate value on critical high-risk scenario without full system replacement
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    Lower Entry Cost
                  </h4>
                  <p className="text-sm text-slate-700">
                    Start at ₹18L vs ₹28L+ for full migration. Prove ROI before scaling.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Focus on Critical Risk
                  </h4>
                  <p className="text-sm text-slate-700">
                    LD/BF CO gas = highest consequence scenario. Address most critical first.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Natural Expansion Path
                  </h4>
                  <p className="text-sm text-slate-700">
                    Phase 1 → Phase 2 → Phase 3 → Full migration. Pay as you scale.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Feature Comparison Table (same for both) */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">Detailed Feature Comparison</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Dimension</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Legacy System</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Culturiq Platform</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Business Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Copy comparison data from previous version */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-800">Core Philosophy</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Compliance documentation → audit traceability</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Connected intelligence → real-time verification</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-700 font-medium">Shift from reactive to proactive safety</span>
                    </div>
                  </td>
                </tr>
                {/* Add all other rows from the original comparison */}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Migration ROI */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Full Migration ROI
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Year 1 Investment:</span>
                <span className="font-bold text-slate-800">₹63L</span>
              </div>
              <div className="text-xs text-slate-500 pl-4">
                • Software: ₹48L<br/>
                • Migration: ₹15L
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Year 1 Savings:</span>
                  <span className="font-bold text-green-600">₹75L</span>
                </div>
                <div className="text-xs text-slate-500 pl-4">
                  • vs Legacy: ₹48L saved<br/>
                  • No infrastructure: ₹20L saved<br/>
                  • No training fees: ₹7L saved
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Net Benefit Year 1:</span>
                  <span className="font-bold text-2xl text-green-600">+₹12L</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800">
                  <strong>5-Year Total Savings:</strong> ₹2.4-3.8Cr<br/>
                  <span className="text-xs">Assuming one major incident prevented worth ₹10Cr</span>
                </p>
              </div>
            </div>
          </div>

          {/* Gas Line ROI */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-orange-600" />
              Gas Pipeline Safety ROI
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Phase 1 Investment:</span>
                <span className="font-bold text-slate-800">₹18L</span>
              </div>
              <div className="text-xs text-slate-500 pl-4">
                • Assessment only<br/>
                • 6-8 weeks
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Potential Value:</span>
                  <span className="font-bold text-green-600">₹50Cr+</span>
                </div>
                <div className="text-xs text-slate-500 pl-4">
                  • One prevented gas explosion<br/>
                  • Fatality avoidance: Priceless<br/>
                  • Plant downtime avoided: ₹2-5Cr
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Risk Reduction:</span>
                  <span className="font-bold text-2xl text-green-600">90%+</span>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-orange-800">
                  <strong>Low-Risk Entry:</strong> Prove value with critical scenario<br/>
                  <span className="text-xs">Expand to Phase 2/3 after demonstrating ROI</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Decision Matrix */}
        <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Which Path is Right for You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Choose Full Migration If:</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You're already paying ₹80L+ for legacy system</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You need bow ties for multiple hazard scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Legacy system limitations are blocking productivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You want enterprise-wide safety transformation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Budget approved for capital expenditure</span>
                </li>
              </ul>
              <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                Start Migration
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Choose Gas Pipeline If:</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>LD/BF CO gas is your #1 critical risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>You want to pilot before full commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Need quick win (6-8 weeks) for management buy-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Budget constraints but urgent safety need</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Want real-time monitoring for specific asset</span>
                </li>
              </ul>
              <button className="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all">
                Start Assessment
              </button>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Transform Safety Management?</h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Experience the platform with our live demo or schedule a consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all"
            >
              Try Live Demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="mailto:contact@culturiq.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all"
            >
              Schedule Consultation
            </a>
          </div>
          <div className="mt-6 text-sm text-slate-600">
            <div className="font-semibold">Demo Access Password:</div>
            <div className="font-mono bg-slate-100 px-4 py-2 rounded mt-1 inline-block">Safety2025</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-slate-400">
            © 2025 Culturiq BowTie Platform | Built for Tata Steel Safety Excellence
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Specialized in Gas Pipeline Safety • Legacy System Migration • Enterprise Safety Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

