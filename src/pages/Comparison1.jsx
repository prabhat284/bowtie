//cat > src/pages/Comparison.jsx <<'EOF'
import React, { useState } from 'react';
import { Check, X, ArrowRight, TrendingUp, DollarSign, Clock, Users, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export default function Comparison() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const comparisonData = [
    {
      dimension: "Core Philosophy",
      Legacy: "Compliance documentation → audit traceability",
      culturiq: "Connected intelligence → real-time verification",
      impact: "Shift from reactive to proactive safety",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      dimension: "Architecture",
      Legacy: "Desktop + client-server (BowTieXP & Server)",
      culturiq: "Web-native React + D3 + API-ready microservices",
      impact: "90% reduction in IT infrastructure",
      icon: <Zap className="w-5 h-5" />
    },
    {
      dimension: "Deployment",
      Legacy: "On-premise / VPN; high IT overhead",
      culturiq: "Zero-install, browser-based; Vercel or intranet deploy",
      impact: "Deploy in hours, not months",
      icon: <Clock className="w-5 h-5" />
    },
    {
      dimension: "Accessibility",
      Legacy: "Limited concurrent users; license-bound",
      culturiq: "Unlimited internal users; role-based permissions",
      impact: "No per-seat licensing costs",
      icon: <Users className="w-5 h-5" />
    },
    {
      dimension: "Data Workflow",
      Legacy: "Manual Excel uploads → central server",
      culturiq: "Live JSON schema → instant barrier updates",
      impact: "80% time saving on data entry",
      icon: <Clock className="w-5 h-5" />
    },
    {
      dimension: "Collaboration",
      Legacy: "Sequential (review → approval → upload)",
      culturiq: "Real-time multi-user editing with autosave",
      impact: "5x faster assessment completion",
      icon: <Users className="w-5 h-5" />
    },
    {
      dimension: "Visualization",
      Legacy: "Static BowTie diagrams",
      culturiq: "Multi-layered: Structural, Functional, Diagnostic, Predictive, Contextual",
      impact: "Deeper risk insights",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      dimension: "Barrier Health Monitoring",
      Legacy: "Static 'exists / not exists'",
      culturiq: "Dynamic R/Y/G status + due-date + signal heartbeat",
      impact: "Proactive maintenance alerts",
      icon: <Shield className="w-5 h-5" />
    },
    {
      dimension: "Integration (PLC/SCADA/AI)",
      Legacy: "Minimal; manual log import",
      culturiq: "Live digital-signal feed + AI risk prediction",
      impact: "Real-time operational intelligence",
      icon: <Zap className="w-5 h-5" />
    },
    {
      dimension: "AI Capabilities",
      Legacy: "None (NLP/ML not integrated)",
      culturiq: "Causal AI, Predictive factors, Auto-recommendations, Pattern mining",
      impact: "10x faster risk identification",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      dimension: "Cost Structure",
      Legacy: "High license + server + upgrade fees",
      culturiq: "Subscription / deployment cost only; scalable by site",
      impact: "~70% cost reduction",
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      dimension: "Time-to-Deploy",
      Legacy: "3–6 months (consultant-dependent)",
      culturiq: "< 2 weeks for pilot; hours for updates",
      impact: "Immediate value realization",
      icon: <Clock className="w-5 h-5" />
    },
    {
      dimension: "Training Needs",
      Legacy: "Formal certification (1–2 days + recurring)",
      culturiq: "Intuitive UI + zero-training onboarding",
      impact: "No training bottleneck",
      icon: <Users className="w-5 h-5" />
    },
    {
      dimension: "Data Ownership",
      Legacy: "Legacy server (vendor-controlled)",
      culturiq: "100% on-prem or private cloud data control",
      impact: "Full data sovereignty",
      icon: <Shield className="w-5 h-5" />
    },
    {
      dimension: "Target Outcome",
      Legacy: "Regulatory compliance & reporting",
      culturiq: "Operational intelligence & risk prevention",
      impact: "From checkbox to culture change",
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const costComparison = [
    { component: "Software License", Legacy: "₹40-60L / year", culturiq: "₹8-12L / year", savings: "₹32-48L" },
    { component: "Server Infrastructure", Legacy: "₹15-25L / year", culturiq: "₹0 (cloud-hosted)", savings: "₹15-25L" },
    { component: "IT Support & Maintenance", Legacy: "₹10-15L / year", culturiq: "₹2-3L / year", savings: "₹8-12L" },
    { component: "Training & Certification", Legacy: "₹5-8L / year", culturiq: "₹0 (intuitive UI)", savings: "₹5-8L" },
    { component: "Upgrade Fees", Legacy: "₹8-12L / upgrade", culturiq: "₹0 (continuous)", savings: "₹8-12L" },
  ];

  const benefits = {
    immediate: [
      "Eliminate Excel bottlenecks in assessment workflow",
      "Enable cross-site collaboration without VPN dependency",
      "Instant deployment for LD/BF CO gas assessment pilot",
      "Mobile access for field engineers"
    ],
    medium: [
      "AI-powered barrier recommendations from historical data",
      "Integration with existing SCADA/DCS for live monitoring",
      "Predictive risk alerts before incidents occur",
      "Unified safety + ESG reporting for sustainability goals"
    ],
    long: [
      "Industry-leading safety analytics for all plants",
      "Reduced insurance premiums through demonstrated risk reduction",
      "Export best practices to other group companies",
      "Potential revenue stream by licensing to manufacturers"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Platform Comparison
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Legacy BowTieXP vs. Culturiq BowTie Platform
            </p>
            <p className="text-sm sm:text-base text-blue-200 mt-2">
              A comprehensive analysis for modern safety management
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        
        {/* Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <DollarSign className="w-12 h-12 mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-2">~85%</div>
            <div className="text-sm opacity-90">Cost Reduction</div>
            <div className="text-xs mt-2 opacity-75">₹70-108L annual savings</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <Clock className="w-12 h-12 mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-2">5x</div>
            <div className="text-sm opacity-90">Faster Deployment</div>
            <div className="text-xs mt-2 opacity-75">2 weeks vs 6 months</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <Users className="w-12 h-12 mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-2">∞</div>
            <div className="text-sm opacity-90">Unlimited Users</div>
            <div className="text-xs mt-2 opacity-75">No per-seat licensing</div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">Detailed Feature Comparison</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Dimension</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Legacy BowTieXP</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Culturiq Platform</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Business Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisonData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-blue-600">{item.icon}</div>
                        <span className="font-semibold text-slate-800">{item.dimension}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{item.Legacy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{item.culturiq}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-green-700 font-medium">{item.impact}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Cost-Benefit Analysis (Annual)
            </h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Cost Component</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Legacy BowTieXP</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Culturiq Platform</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-green-700">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {costComparison.map((item, index) => (
                    <tr key={index} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.component}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">{item.Legacy}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{item.culturiq}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                          <TrendingUp className="w-4 h-4" />
                          {item.savings}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-bold">
                    <td className="px-6 py-4 text-slate-900">Total Annual Cost</td>
                    <td className="px-6 py-4 text-red-700 text-lg">₹80-123L</td>
                    <td className="px-6 py-4 text-green-700 text-lg">₹10-15L</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-base font-bold">
                        <TrendingUp className="w-5 h-5" />
                        ₹70-108L (85%)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Estimates based on typical enterprise deployments. Actual costs may vary based on specific requirements and deployment scale.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Immediate Benefits */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Immediate (0-3 months)
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {benefits.immediate.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medium-term Benefits */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Medium-term (3-12 months)
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {benefits.medium.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Long-term Benefits */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-green-500 to-green-600">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Long-term (12+ months)
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {benefits.long.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why Culturiq Wins */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Culturiq Platform Wins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Speed", desc: "Safety incidents don't wait for annual software upgrades" },
              { title: "Accessibility", desc: "Every engineer should have safety tools, not just EHS staff" },
              { title: "Intelligence", desc: "Modern safety is about prevention, not just documentation" },
              { title: "Cost", desc: "85% savings can fund 5+ additional safety initiatives" },
              { title: "Agility", desc: "Rapidly evolving risks need rapidly evolving tools" },
              { title: "Ownership", desc: "Your data, your rules, your competitive advantage" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Transform Safety Management?</h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Experience the future of bow tie analysis with our live demo platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all"
            >
              Try Live Demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <div className="text-sm text-slate-600">
              <div className="font-semibold">Access Password:</div>
              <div className="font-mono bg-slate-100 px-4 py-2 rounded mt-1">Safety2025</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-slate-400">
            © 2025 Culturiq BowTie Platform | Built for Tata Steel Safety Excellence
          </p>
        </div>
      </footer>
    </div>
  );
}
//EOF
