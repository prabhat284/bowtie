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

export function getEffectivenessColor(effectiveness) {
  const colors = {
    good: 'bg-green-500',
    weak: 'bg-yellow-500',
    failed: 'bg-red-500'
  };
  return colors[effectiveness] || 'bg-gray-400';
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
  // Ensure basic structure
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

    // Convert old barrier format (string array) to new format (object array)
    if (threat.barriers && Array.isArray(threat.barriers)) {
      migratedThreat.barriers = threat.barriers.map(b => {
        if (typeof b === 'string') {
          // Old format: convert string to object
          return {
            id: Date.now().toString() + Math.random(),
            description: b,
            owner: '',
            effectiveness: 'good',
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
          // New format or partial: ensure all fields exist
          return {
            id: b.id || Date.now().toString() + Math.random(),
            description: b.text || b.description || '',
            owner: b.owner || '',
            effectiveness: b.effectiveness || 'good',
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

    // Convert old barrier format to new format
    if (cons.barriers && Array.isArray(cons.barriers)) {
      migratedCons.barriers = cons.barriers.map(b => {
        if (typeof b === 'string') {
          return {
            id: Date.now().toString() + Math.random(),
            description: b,
            owner: '',
            effectiveness: 'good',
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
          return {
            id: b.id || Date.now().toString() + Math.random(),
            description: b.text || b.description || '',
            owner: b.owner || '',
            effectiveness: b.effectiveness || 'good',
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
        }
        return b;
      });
    }

    return migratedCons;
  });

  return migrated;
}
//EOF
