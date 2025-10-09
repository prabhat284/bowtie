//cat > src/utils.js <<'EOF'
// Utility functions for Bow Tie Safety Platform

export function createProject() {
  return {
    id: Date.now().toString(),
    name: 'New Safety Project',
    department: '',
    owner: '',
    reviewDate: new Date().toISOString().split('T')[0],
    hazardEvent: '',
    inherentRisk: { likelihood: 3, severity: 3 },
    residualRisk: { likelihood: 2, severity: 2 },
    threats: [],
    consequences: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function createThreat() {
  return {
    id: Date.now().toString() + Math.random(),
    threat: '',
    likelihood: 'medium',
    barriers: [],
    escalationFactors: []
  };
}

export function createConsequence() {
  return {
    id: Date.now().toString() + Math.random(),
    consequence: '',
    severity: 'medium',
    barriers: [],
    escalationFactors: []
  };
}

export function createBarrier() {
  return {
    id: Date.now().toString() + Math.random(),
    description: '',
    owner: '',
    effectiveness: 'good',
    category: 'hardware', // hardware, procedure, people
    inherentRisk: 'medium',
    residualRisk: 'low',
    evidence: [],
    lastTestDate: '',
    nextDue: '',
    findingsOpen: 0,
    attachments: [],
    testFrequency: 'quarterly',
    notes: ''
  };
}

// Auto-calculate barrier effectiveness based on multiple factors
export function calculateBarrierEffectiveness(barrier) {
  let score = 100;
  
  // Deduct points for open findings
  score -= (barrier.findingsOpen || 0) * 10;
  
  // Deduct points for overdue testing
  if (barrier.nextDue) {
    const dueDate = new Date(barrier.nextDue);
    const today = new Date();
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 0) {
      score -= Math.min(daysOverdue * 2, 40); // Max 40 points deduction
    }
  }
  
  // Deduct points for no recent testing
  if (barrier.lastTestDate) {
    const lastTest = new Date(barrier.lastTestDate);
    const today = new Date();
    const daysSinceTest = Math.floor((today - lastTest) / (1000 * 60 * 60 * 24));
    
    if (daysSinceTest > 365) {
      score -= 20;
    } else if (daysSinceTest > 180) {
      score -= 10;
    }
  } else {
    score -= 15; // Never tested
  }
  
  // Deduct points if no owner assigned
  if (!barrier.owner || barrier.owner.trim() === '') {
    score -= 10;
  }
  
  // Return effectiveness rating
  if (score >= 70) return 'good';
  if (score >= 40) return 'weak';
  return 'failed';
}

export function getEffectivenessColor(effectiveness) {
  const colors = {
    good: 'bg-green-500',
    weak: 'bg-yellow-500',
    failed: 'bg-red-500'
  };
  return colors[effectiveness] || 'bg-gray-400';
}

export function getBarrierCategoryIcon(category) {
  const icons = {
    hardware: '🔧',
    procedure: '📋',
    people: '👤'
  };
  return icons[category] || '🛡️';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRiskColor(level) {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[level] || colors.medium;
}

// Migration function to handle old format imports
export function migrateProject(data) {
  const migrated = {
    ...data,
    id: data.id || Date.now().toString(),
    inherentRisk: data.inherentRisk || { likelihood: 3, severity: 3 },
    residualRisk: data.residualRisk || { likelihood: 2, severity: 2 },
    threats: data.threats || [],
    consequences: data.consequences || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };

  // Migrate threats
  migrated.threats = migrated.threats.map(threat => {
    const migratedThreat = {
      ...threat,
      id: threat.id?.toString() || Date.now().toString() + Math.random(),
      barriers: [],
      escalationFactors: threat.escalationFactors || []
    };

    if (threat.barriers && Array.isArray(threat.barriers)) {
      migratedThreat.barriers = threat.barriers.map(b => {
        if (typeof b === 'string') {
          return {
            id: Date.now().toString() + Math.random(),
            description: b,
            owner: '',
            effectiveness: 'good',
            category: 'hardware',
            inherentRisk: 'medium',
            residualRisk: 'low',
            evidence: [],
            lastTestDate: '',
            nextDue: '',
            findingsOpen: 0,
            attachments: [],
            testFrequency: 'quarterly',
            notes: ''
          };
        } else if (typeof b === 'object') {
          const barrier = {
            id: b.id || Date.now().toString() + Math.random(),
            description: b.text || b.description || '',
            owner: b.owner || '',
            effectiveness: b.effectiveness || 'good',
            category: b.category || 'hardware',
            inherentRisk: b.inherent_risk || b.inherentRisk || 'medium',
            residualRisk: b.residual_risk || b.residualRisk || 'low',
            evidence: b.evidence || [],
            lastTestDate: b.last_test_at || b.lastTestDate || '',
            nextDue: b.next_due_at || b.nextDue || '',
            findingsOpen: b.findings_open || b.findingsOpen || 0,
            attachments: b.attachments || [],
            testFrequency: b.testFrequency || 'quarterly',
            notes: b.notes || ''
          };
          // Auto-calculate effectiveness
          barrier.effectiveness = calculateBarrierEffectiveness(barrier);
          return barrier;
        }
        return b;
      });
    }

    return migratedThreat;
  });

  // Migrate consequences
  migrated.consequences = migrated.consequences.map(cons => {
    const migratedCons = {
      ...cons,
      id: cons.id?.toString() || Date.now().toString() + Math.random(),
      barriers: [],
      escalationFactors: cons.escalationFactors || []
    };

    if (cons.barriers && Array.isArray(cons.barriers)) {
      migratedCons.barriers = cons.barriers.map(b => {
        if (typeof b === 'string') {
          return {
            id: Date.now().toString() + Math.random(),
            description: b,
            owner: '',
            effectiveness: 'good',
            category: 'hardware',
            inherentRisk: 'medium',
            residualRisk: 'low',
            evidence: [],
            lastTestDate: '',
            nextDue: '',
            findingsOpen: 0,
            attachments: [],
            testFrequency: 'quarterly',
            notes: ''
          };
        } else if (typeof b === 'object') {
          const barrier = {
            id: b.id || Date.now().toString() + Math.random(),
            description: b.text || b.description || '',
            owner: b.owner || '',
            effectiveness: b.effectiveness || 'good',
            category: b.category || 'hardware',
            inherentRisk: b.inherent_risk || b.inherentRisk || 'medium',
            residualRisk: b.residual_risk || b.residualRisk || 'low',
            evidence: b.evidence || [],
            lastTestDate: b.last_test_at || b.lastTestDate || '',
            nextDue: b.next_due_at || b.nextDue || '',
            findingsOpen: b.findings_open || b.findingsOpen || 0,
            attachments: b.attachments || [],
            testFrequency: b.testFrequency || 'quarterly',
            notes: b.notes || ''
          };
          // Auto-calculate effectiveness
          barrier.effectiveness = calculateBarrierEffectiveness(barrier);
          return barrier;
        }
        return b;
      });
    }

    return migratedCons;
  });

  return migrated;
}

// Calculate dashboard KPIs
export function calculateKPIs(projects) {
  let totalBarriers = 0;
  let overdueBarriers = 0;
  let failedBarriers = 0;
  let weakBarriers = 0;
  let goodBarriers = 0;
  let totalRiskReduction = 0;
  let projectsWithRisk = 0;

  const today = new Date();

  projects.forEach(project => {
    // Calculate risk reduction
    const inherentRisk = (project.inherentRisk?.likelihood || 3) * (project.inherentRisk?.severity || 3);
    const residualRisk = (project.residualRisk?.likelihood || 2) * (project.residualRisk?.severity || 2);
    
    if (inherentRisk > 0) {
      totalRiskReduction += ((inherentRisk - residualRisk) / inherentRisk) * 100;
      projectsWithRisk++;
    }

    // Count barriers
    [...(project.threats || []), ...(project.consequences || [])].forEach(item => {
      (item.barriers || []).forEach(barrier => {
        totalBarriers++;
        
        // Check effectiveness
        const effectiveness = calculateBarrierEffectiveness(barrier);
        if (effectiveness === 'good') goodBarriers++;
        else if (effectiveness === 'weak') weakBarriers++;
        else failedBarriers++;

        // Check if overdue
        if (barrier.nextDue && new Date(barrier.nextDue) < today) {
          overdueBarriers++;
        }
      });
    });
  });

  const avgRiskReduction = projectsWithRisk > 0 ? totalRiskReduction / projectsWithRisk : 0;

  return {
    totalBarriers,
    overdueBarriers,
    failedBarriers,
    weakBarriers,
    goodBarriers,
    avgRiskReduction: Math.round(avgRiskReduction),
    barrierHealth: totalBarriers > 0 ? Math.round((goodBarriers / totalBarriers) * 100) : 0
  };
}
//EOF
