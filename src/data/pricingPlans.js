//cat > src/data/pricingPlans.js <<'EOF'
export const pricingPlans = {
  migration: {
    title: "Legacy System Migration",
    subtitle: "Complete replacement of existing BowTie software",
    tiers: [
      {
        name: "Essential",
        price: "₹28L/year",
        description: "Single plant deployment",
        features: [
          "Complete BowTieXP feature parity",
          "One-time data migration from legacy system",
          "Up to 100 bow tie projects",
          "Standard reporting & exports",
          "Email support (48hr response)",
          "Quarterly training sessions"
        ],
        migration: [
          "Excel/CSV import automation",
          "Legacy data cleanup & validation",
          "User account migration",
          "30-day parallel run support"
        ],
        included: true
      },
      {
        name: "Professional",
        price: "₹48L/year",
        description: "Multi-plant enterprise deployment",
        badge: "Most Popular",
        features: [
          "Everything in Essential",
          "Unlimited bow tie projects",
          "Advanced KPI dashboard",
          "Auto-barrier effectiveness scoring",
          "Reusable barrier library",
          "PDF report generation",
          "Priority support (24hr response)",
          "Monthly training & workshops"
        ],
        migration: [
          "All Essential migration features",
          "Cross-site data consolidation",
          "Custom workflow mapping",
          "90-day dedicated support"
        ],
        included: true
      },
      {
        name: "Enterprise",
        price: "₹85L/year",
        description: "Full digital transformation",
        features: [
          "Everything in Professional",
          "AI-powered recommendations",
          "Predictive escalation factors",
          "Basic SCADA/DCS integration (5 systems)",
          "Real-time barrier monitoring",
          "Custom API access",
          "Dedicated account manager",
          "24/7 support",
          "On-site quarterly reviews"
        ],
        migration: [
          "All Professional migration features",
          "Historical incident data mining (10 years)",
          "Legacy system decommissioning support",
          "6-month parallel operation",
          "Change management program"
        ],
        included: true
      }
    ],
    oneTime: {
      implementation: "₹15-30L",
      training: "₹3-8L",
      customization: "₹5-20L (if needed)"
    }
  },

  gaslineSafety: {
    title: "Gas Pipeline Safety Solution",
    subtitle: "Specialized for LD/BF CO gas network protection",
    pricing: {
      assessment: {
        name: "Phase 1: Assessment",
        price: "₹18L one-time",
        duration: "6-8 weeks",
        deliverables: [
          "Complete gas pipeline network bow tie analysis",
          "Threat identification (backfire, puncture, corrosion)",
          "Existing barrier effectiveness evaluation",
          "Risk scoring & prioritization matrix",
          "Gap analysis report",
          "Recommended corrective actions",
          "Executive presentation",
          "Platform access for assessment period"
        ]
      },
      monitoring: {
        name: "Phase 2: Live Monitoring (Optional)",
        price: "₹35L/year",
        duration: "Ongoing",
        features: [
          "Real-time sensor integration",
          "Pressure, flow, gas detection monitoring",
          "Auto-alert system (SMS/Email/Dashboard)",
          "Barrier health dashboard",
          "Weekly risk reports",
          "Incident prediction analytics",
          "Mobile app for field engineers",
          "12 months platform license included"
        ]
      },
      expansion: {
        name: "Phase 3: Plant-wide Expansion",
        price: "₹48L/year",
        description: "Expand beyond gas lines to all safety scenarios",
        features: [
          "Everything in Phase 2",
          "Unlimited bow tie projects (all hazards)",
          "Multi-department access",
          "AI recommendations",
          "Cross-plant benchmarking",
          "Professional tier platform features"
        ]
      }
    },
    addons: [
      {
        name: "Additional Plant/Site",
        price: "₹12L/year per site"
      },
      {
        name: "Emergency Response Integration",
        price: "₹8L one-time"
      },
      {
        name: "Historical Incident Analysis (AI)",
        price: "₹15L one-time"
      }
    ]
  }
};

export const legacyComparison = {
  annual: {
    license: "₹45-65L",
    infrastructure: "₹18-28L",
    maintenance: "₹12-18L",
    training: "₹6-10L",
    upgrades: "₹10-15L",
    total: "₹91-136L"
  },
  oneTime: {
    implementation: "₹25-40L",
    serverSetup: "₹15-25L",
    dataCenter: "₹20-35L",
    total: "₹60-100L"
  }
};
//EOF
