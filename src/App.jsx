import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FileDown, FileUp, AlertTriangle, Shield, Target, TrendingUp, Edit2, Check, X, Printer, Search, Factory, Flame, Zap, Droplet, Wind, ChevronRight, BarChart3, Award } from 'lucide-react';
import * as d3 from 'd3';

const STORAGE_KEY = 'bowtie_projects';
const AUTH_KEY = 'bowtie_auth';
const CORRECT_PASSWORD = 'Safety2025';

// Login Component
const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mt-32"></div>
      </div>

      <div className={`relative z-10 w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Bow Tie Safety Platform</h1>
            <p className="text-slate-600">Tata Steel - Risk Assessment System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <AlertTriangle className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <X className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Access Platform
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This is a secure internal platform for Tata Steel safety team. 
                Unauthorized access is prohibited. For access credentials, contact your safety administrator.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-80">
            © 2025 Tata Steel Safety Team. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced demo data combining original + new JSON files
const DEMO_PROJECTS = [
  {
    id: 1001,
    name: 'Blast Furnace Gas Explosion',
    hazardEvent: 'Uncontrolled release and ignition of blast furnace gas',
    riskLevel: 'medium',
    department: 'Ironmaking',
    owner: 'Safety Officer - BF Unit',
    reviewDate: '2025-12-31',
    status: 'active',
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2025-10-01T14:30:00Z',
    threats: [
      {
        id: 10011,
        threat: 'Corrosion-induced leak in gas pipeline',
        likelihood: 'medium',
        barriers: ['Online leak detection and pressure monitoring', 'Ultrasonic thickness testing during maintenance'],
        escalationFactors: ['Deferred maintenance', 'Sensor calibration overdue']
      },
      {
        id: 10012,
        threat: 'Improper purging during maintenance',
        likelihood: 'high',
        barriers: ['Permit-to-work with pre-purge checklist', 'Isolation valve lockout-tagout'],
        escalationFactors: ['Time pressure on maintenance team', 'Incomplete SOP communication']
      }
    ],
    consequences: [
      {
        id: 10021,
        consequence: 'Explosion causing injury and damage',
        severity: 'high',
        barriers: ['Automatic isolation and venting system', 'Gas detector alarms with ESD linkage'],
        escalationFactors: ['Blocked vent lines', 'Alarm ignored by operator']
      }
    ]
  },
  {
    id: 1002,
    name: 'Molten Metal Spill During Ladle Transport',
    hazardEvent: 'Spillage of molten steel during crane movement',
    riskLevel: 'high',
    department: 'Steelmaking',
    owner: 'SMS Safety Incharge',
    reviewDate: '2025-12-31',
    status: 'active',
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2025-09-28T11:15:00Z',
    threats: [
      {
        id: 10031,
        threat: 'Crane brake failure or overspeed',
        likelihood: 'medium',
        barriers: ['Dual braking system with mechanical backup', 'Pre-lift inspection and interlock test'],
        escalationFactors: ['Oil contamination on brake pads', 'Skipped preventive checks']
      },
      {
        id: 10032,
        threat: 'Overfilled ladle or improper balance',
        likelihood: 'high',
        barriers: ['Level sensor interlock', 'Operator checklist with supervisor sign-off'],
        escalationFactors: ['Sensor malfunction', 'Inexperienced operator']
      }
    ],
    consequences: [
      {
        id: 10041,
        consequence: 'Severe burns or fatalities',
        severity: 'high',
        barriers: ['Personnel exclusion zone', 'Heat-resistant PPE and face shields'],
        escalationFactors: ['Poor visibility or lighting', 'Inadequate PPE training']
      },
      {
        id: 10042,
        consequence: 'Equipment damage and fire',
        severity: 'medium',
        barriers: ['Fireproof flooring and trench design', 'Automatic fire suppression nozzles'],
        escalationFactors: ['Delayed firefighting response', 'Blocked emergency exit']
      }
    ]
  },
  {
    id: 1003,
    name: 'Hydrogen Explosion in Coke Oven Gas Holder',
    hazardEvent: 'Ignition of hydrogen-rich gas mixture in gas holder',
    riskLevel: 'high',
    department: 'By-Product Plant',
    owner: 'Gas Holder Area Safety Lead',
    reviewDate: '2025-11-30',
    status: 'active',
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2025-09-15T16:45:00Z',
    threats: [
      {
        id: 10051,
        threat: 'Vent valve failure leading to overpressure',
        likelihood: 'medium',
        barriers: ['Dual vent valves and relief systems', 'Nitrogen blanketing to maintain inert condition'],
        escalationFactors: ['Dust fouling vent mechanism', 'Valve actuator air leak']
      },
      {
        id: 10052,
        threat: 'Air ingress during maintenance',
        likelihood: 'high',
        barriers: ['Positive pressure monitoring system', 'Strict gas-freeing permit process'],
        escalationFactors: ['Improper isolation procedure', 'Untrained contractor staff']
      }
    ],
    consequences: [
      {
        id: 10061,
        consequence: 'Explosion or fire inside gas holder',
        severity: 'high',
        barriers: ['Flame arrestor and water seal trap', 'Remote emergency shutdown'],
        escalationFactors: ['Delayed ESD activation', 'Flame arrestor not tested']
      }
    ]
  },
  {
    id: 1004,
    name: 'BOF Lance Water Leak',
    hazardEvent: 'Water leakage from oxygen lance into molten metal bath',
    riskLevel: 'high',
    department: 'Converter Shop',
    owner: 'Process Safety Engineer',
    reviewDate: '2025-12-31',
    status: 'active',
    createdAt: '2024-06-15T07:30:00Z',
    updatedAt: '2025-10-05T13:20:00Z',
    threats: [
      {
        id: 10071,
        threat: 'Cooling jacket rupture',
        likelihood: 'medium',
        barriers: ['Pressure differential alarm', 'Flow switch interlock to lift lance'],
        escalationFactors: ['Poor water quality causing scaling', 'Inadequate flow monitoring']
      }
    ],
    consequences: [
      {
        id: 10081,
        consequence: 'Steam explosion inside converter',
        severity: 'high',
        barriers: ['Automatic lance lift mechanism', 'Blast-proof operator control cabin'],
        escalationFactors: ['Alarm ignored', 'Maintenance delay']
      }
    ]
  },
  {
    id: 1005,
    name: 'Electric Arc Furnace Electrode Breakage',
    hazardEvent: 'Arc flash or electrode collapse during melting',
    riskLevel: 'medium',
    department: 'EAF Unit',
    owner: 'Electrical Safety Engineer',
    reviewDate: '2025-10-31',
    status: 'active',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2025-09-30T09:45:00Z',
    threats: [
      {
        id: 10091,
        threat: 'Overcurrent causing electrode fracture',
        likelihood: 'medium',
        barriers: ['Current limiting system with feedback loop', 'Arc length automatic control'],
        escalationFactors: ['Improper scrap charging', 'Faulty control relay']
      }
    ],
    consequences: [
      {
        id: 10101,
        consequence: 'Arc flash leading to burns',
        severity: 'medium',
        barriers: ['Remote operation console', 'Arc shield curtains'],
        escalationFactors: ['Poor cabin sealing', 'Improper PPE compliance']
      }
    ]
  }
];

const loadProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.length > 0 ? parsed : DEMO_PROJECTS;
    }
    return DEMO_PROJECTS;
  } catch (e) {
    return DEMO_PROJECTS;
  }
};

const saveProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {}
};

const createProject = (name) => ({
  id: Date.now(),
  name,
  hazardEvent: '',
  riskLevel: 'medium',
  department: '',
  owner: '',
  reviewDate: '',
  status: 'draft',
  threats: [],
  consequences: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const createThreat = () => ({ id: Date.now(), threat: '', likelihood: 'medium', barriers: [], escalationFactors: [] });
const createConsequence = () => ({ id: Date.now(), consequence: '', severity: 'medium', barriers: [], escalationFactors: [] });

const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800'
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 2 }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all ${className}`}>{children}</div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    danger: 'bg-red-100 text-red-700 border border-red-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
    info: 'bg-blue-100 text-blue-700 border border-blue-300'
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>{children}</span>;
};

// D3 Bow Tie Canvas Component
const BowTieCanvas = ({ project }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!project.hazardEvent) return;
    
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    
    const width = 1200;
    const height = 600;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    const cx = width / 2;
    const cy = height / 2;
    const leftX = 200;
    const rightX = width - 200;
    
    const threats = project.threats ?? [];
    const cons = project.consequences ?? [];
    
    const yScaleL = d3.scalePoint().domain(d3.range(threats.length)).range([100, height - 100]);
    const yScaleR = d3.scalePoint().domain(d3.range(cons.length)).range([100, height - 100]);
    
    // Add gradient definitions
    const defs = svg.append("defs");
    
    // Threat gradient
    const threatGrad = defs.append("linearGradient").attr("id", "threatGrad").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    threatGrad.append("stop").attr("offset", "0%").attr("style", "stop-color:#ef4444;stop-opacity:1");
    threatGrad.append("stop").attr("offset", "100%").attr("style", "stop-color:#f97316;stop-opacity:1");
    
    // Consequence gradient
    const consGrad = defs.append("linearGradient").attr("id", "consGrad").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    consGrad.append("stop").attr("offset", "0%").attr("style", "stop-color:#f97316;stop-opacity:1");
    consGrad.append("stop").attr("offset", "100%").attr("style", "stop-color:#eab308;stop-opacity:1");
    
    // Center gradient
    const centerGrad = defs.append("radialGradient").attr("id", "centerGrad");
    centerGrad.append("stop").attr("offset", "0%").attr("style", "stop-color:#f97316;stop-opacity:1");
    centerGrad.append("stop").attr("offset", "100%").attr("style", "stop-color:#dc2626;stop-opacity:1");
    
    // Draw threat connections and nodes
    threats.forEach((t, i) => {
      const y = yScaleL(i);
      
      // Bezier curve
      const path = d3.path();
      path.moveTo(leftX, y);
      path.bezierCurveTo(leftX + 180, y, cx - 180, cy, cx - 80, cy);
      
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 3)
        .attr("opacity", 0.6);
      
      // Threat node
      const nodeGroup = svg.append("g").attr("class", "threat-node");
      
      nodeGroup.append("rect")
        .attr("x", leftX - 150)
        .attr("y", y - 30)
        .attr("rx", 12)
        .attr("width", 300)
        .attr("height", 60)
        .attr("fill", "url(#threatGrad)")
        .attr("stroke", "#dc2626")
        .attr("stroke-width", 2)
        .attr("opacity", 0.9);
      
      nodeGroup.append("text")
        .attr("x", leftX)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .each(function() {
          const text = t.threat || "Threat";
          const words = text.split(' ');
          let line = '';
          let lineNumber = 0;
          const maxWidth = 280;
          
          for (let word of words) {
            const testLine = line + word + ' ';
            const testWidth = testLine.length * 7;
            if (testWidth > maxWidth && line !== '') {
              d3.select(this).append("tspan")
                .attr("x", leftX)
                .attr("dy", lineNumber === 0 ? "-0.3em" : "1.1em")
                .text(line.trim());
              line = word + ' ';
              lineNumber++;
            } else {
              line = testLine;
            }
          }
          d3.select(this).append("tspan")
            .attr("x", leftX)
            .attr("dy", lineNumber === 0 ? "0.3em" : "1.1em")
            .text(line.trim());
        });
      
      // Likelihood badge
      const likelihoodColor = t.likelihood === 'high' ? '#dc2626' : t.likelihood === 'medium' ? '#f59e0b' : '#10b981';
      nodeGroup.append("rect")
        .attr("x", leftX - 35)
        .attr("y", y + 35)
        .attr("rx", 8)
        .attr("width", 70)
        .attr("height", 18)
        .attr("fill", likelihoodColor);
      
      nodeGroup.append("text")
        .attr("x", leftX)
        .attr("y", y + 47)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text((t.likelihood || "med").toUpperCase());
    });
    
    // Draw consequence connections and nodes
    cons.forEach((c, i) => {
      const y = yScaleR(i);
      
      // Bezier curve
      const path = d3.path();
      path.moveTo(cx + 80, cy);
      path.bezierCurveTo(cx + 180, cy, rightX - 180, y, rightX, y);
      
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 3)
        .attr("opacity", 0.6);
      
      // Consequence node
      const nodeGroup = svg.append("g").attr("class", "consequence-node");
      
      nodeGroup.append("rect")
        .attr("x", rightX - 150)
        .attr("y", y - 30)
        .attr("rx", 12)
        .attr("width", 300)
        .attr("height", 60)
        .attr("fill", "url(#consGrad)")
        .attr("stroke", "#ea580c")
        .attr("stroke-width", 2)
        .attr("opacity", 0.9);
      
      nodeGroup.append("text")
        .attr("x", rightX)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .each(function() {
          const text = c.consequence || "Consequence";
          const words = text.split(' ');
          let line = '';
          let lineNumber = 0;
          const maxWidth = 280;
          
          for (let word of words) {
            const testLine = line + word + ' ';
            const testWidth = testLine.length * 7;
            if (testWidth > maxWidth && line !== '') {
              d3.select(this).append("tspan")
                .attr("x", rightX)
                .attr("dy", lineNumber === 0 ? "-0.3em" : "1.1em")
                .text(line.trim());
              line = word + ' ';
              lineNumber++;
            } else {
              line = testLine;
            }
          }
          d3.select(this).append("tspan")
            .attr("x", rightX)
            .attr("dy", lineNumber === 0 ? "0.3em" : "1.1em")
            .text(line.trim());
        });
      
      // Severity badge
      const severityColor = c.severity === 'high' ? '#dc2626' : c.severity === 'medium' ? '#f59e0b' : '#10b981';
      nodeGroup.append("rect")
        .attr("x", rightX - 35)
        .attr("y", y + 35)
        .attr("rx", 8)
        .attr("width", 70)
        .attr("height", 18)
        .attr("fill", severityColor);
      
      nodeGroup.append("text")
        .attr("x", rightX)
        .attr("y", y + 47)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text((c.severity || "med").toUpperCase());
    });
    
    // Central hazard event circle with glow
    const centerGroup = svg.append("g");
    
    // Outer glow
    centerGroup.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 90)
      .attr("fill", "url(#centerGrad)")
      .attr("opacity", 0.3)
      .attr("filter", "blur(8px)");
    
    // Main circle
    centerGroup.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 75)
      .attr("fill", "url(#centerGrad)")
      .attr("stroke", "white")
      .attr("stroke-width", 4);
    
    // Warning icon (triangle)
    const iconSize = 35;
    centerGroup.append("path")
      .attr("d", `M${cx},${cy - iconSize} L${cx - iconSize * 0.866},${cy + iconSize * 0.5} L${cx + iconSize * 0.866},${cy + iconSize * 0.5} Z`)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);
    
    centerGroup.append("circle")
      .attr("cx", cx)
      .attr("cy", cy + 8)
      .attr("r", 2)
      .attr("fill", "white");
    
    centerGroup.append("rect")
      .attr("x", cx - 1.5)
      .attr("y", cy - 15)
      .attr("width", 3)
      .attr("height", 15)
      .attr("fill", "white");
    
    // Hazard event text
    centerGroup.append("text")
      .attr("x", cx)
      .attr("y", cy + 95)
      .attr("text-anchor", "middle")
      .attr("fill", "#1e293b")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .each(function() {
        const text = project.hazardEvent;
        const words = text.split(' ');
        let line = '';
        let lineNumber = 0;
        const maxWidth = 140;
        
        for (let word of words) {
          const testLine = line + word + ' ';
          const testWidth = testLine.length * 8;
          if (testWidth > maxWidth && line !== '') {
            d3.select(this).append("tspan")
              .attr("x", cx)
              .attr("dy", lineNumber === 0 ? "0em" : "1.2em")
              .text(line.trim());
            line = word + ' ';
            lineNumber++;
          } else {
            line = testLine;
          }
        }
        d3.select(this).append("tspan")
          .attr("x", cx)
          .attr("dy", lineNumber === 0 ? "0em" : "1.2em")
          .text(line.trim());
      });
    
    // Risk level badge at bottom
    const riskColor = project.riskLevel === 'high' ? '#dc2626' : project.riskLevel === 'medium' ? '#f59e0b' : '#10b981';
    svg.append("rect")
      .attr("x", cx - 60)
      .attr("y", cy + 140)
      .attr("rx", 12)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", riskColor);
    
    svg.append("text")
      .attr("x", cx)
      .attr("y", cy + 161)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`${(project.riskLevel || 'medium').toUpperCase()} RISK`);
    
  }, [project]);
  
  return <svg ref={ref} className="w-full h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl" />;
};

const Dashboard = ({ projects, onSelectProject, onNewProject, onImport, onDeleteProject, onLoadDemo }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hazardEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: projects.length,
    draft: projects.filter(p => p.status === 'draft').length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    highRisk: projects.filter(p => p.riskLevel === 'high').length
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        onImport(imported);
      } catch (error) {
        alert('Failed to import file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const departmentIcons = {
    'Ironmaking': Factory,
    'Steelmaking': Flame,
    'By-Product Plant': Wind,
    'Converter Shop': Droplet,
    'EAF Unit': Zap,
    default: AlertTriangle
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Ironmaking': 'from-orange-500 to-red-600',
      'Steelmaking': 'from-red-500 to-orange-600',
      'By-Product Plant': 'from-purple-500 to-indigo-600',
      'Converter Shop': 'from-blue-500 to-cyan-600',
      'EAF Unit': 'from-yellow-500 to-orange-600'
    };
    return colors[dept] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Bow Tie Safety Platform</h1>
            <p className="text-blue-100 text-lg">Tata Steel - Advanced Risk Assessment System</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onLoadDemo} variant="secondary">
              <Award className="w-4 h-4" />
              Demo Data
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all backdrop-blur-sm">
                <FileUp className="w-4 h-4" />
                Import
              </div>
            </label>
            <Button onClick={onNewProject} icon={Plus}>
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: Target, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-600' },
          { label: 'Draft', value: stats.draft, icon: Edit2, color: 'from-yellow-500 to-yellow-600', iconColor: 'text-yellow-600' },
          { label: 'Active', value: stats.active, icon: TrendingUp, color: 'from-green-500 to-green-600', iconColor: 'text-green-600' },
          { label: 'Completed', value: stats.completed, icon: Check, color: 'from-purple-500 to-purple-600', iconColor: 'text-purple-600' },
          { label: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'from-red-500 to-red-600', iconColor: 'text-red-600' }
        ].map(({ label, value, icon: Icon, color, iconColor }) => (
          <Card key={label} className="transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">{label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Risk Assessments
          </h2>
          <div className="relative w-80">
            <Search className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search projects, hazards, departments..."
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{searchTerm ? 'No projects found' : 'No projects yet. Create your first bow tie analysis.'}</p>
            </div>
          ) : (
            filteredProjects.map(project => {
              const DeptIcon = departmentIcons[project.department] || departmentIcons.default;
              const deptColor = getDepartmentColor(project.department);
              return (
                <div
                  key={project.id}
                  className="group flex items-center gap-4 p-5 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => onSelectProject(project)}
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${deptColor} shadow-lg group-hover:scale-110 transition-transform`}>
                    <DeptIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">{project.hazardEvent || 'No hazard event defined'}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Factory className="w-3 h-3" />
                        <span className="font-medium">{project.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Target className="w-3 h-3" />
                        <span>{project.owner}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                      <Badge variant={project.status === 'completed' ? 'success' : project.status === 'active' ? 'info' : 'warning'}>
                        {project.status.toUpperCase()}
                      </Badge>
                      <Badge variant={project.riskLevel === 'high' ? 'danger' : project.riskLevel === 'medium' ? 'warning' : 'success'}>
                        {project.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

const ProjectEditor = ({ project, onUpdate, onBack, onExport, onPrint }) => {
  const [activeTab, setActiveTab] = useState('setup');

  const updateProject = updates => {
    onUpdate({ ...project, ...updates, updatedAt: new Date().toISOString() });
  };

  const addThreat = () => updateProject({ threats: [...project.threats, createThreat()] });
  const addConsequence = () => updateProject({ consequences: [...project.consequences, createConsequence()] });

  const updateThreat = (id, updates) => {
    updateProject({ threats: project.threats.map(t => (t.id === id ? { ...t, ...updates } : t)) });
  };

  const updateConsequence = (id, updates) => {
    updateProject({ consequences: project.consequences.map(c => (c.id === id ? { ...c, ...updates } : c)) });
  };

  const deleteThreat = id => updateProject({ threats: project.threats.filter(t => t.id !== id) });
  const deleteConsequence = id => updateProject({ consequences: project.consequences.filter(c => c.id !== id) });

  const addBarrier = (type, id) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === id);
      updateThreat(id, { barriers: [...threat.barriers, ''] });
    } else {
      const consequence = project.consequences.find(c => c.id === id);
      updateConsequence(id, { barriers: [...consequence.barriers, ''] });
    }
  };

  const updateBarrier = (type, itemId, index, value) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === itemId);
      const barriers = [...threat.barriers];
      barriers[index] = value;
      updateThreat(itemId, { barriers });
    } else {
      const consequence = project.consequences.find(c => c.id === itemId);
      const barriers = [...consequence.barriers];
      barriers[index] = value;
      updateConsequence(itemId, { barriers });
    }
  };

  const deleteBarrier = (type, itemId, index) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === itemId);
      updateThreat(itemId, { barriers: threat.barriers.filter((_, i) => i !== index) });
    } else {
      const consequence = project.consequences.find(c => c.id === itemId);
      updateConsequence(itemId, { barriers: consequence.barriers.filter((_, i) => i !== index) });
    }
  };

  const addEscalationFactor = (type, id) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === id);
      updateThreat(id, { escalationFactors: [...threat.escalationFactors, ''] });
    } else {
      const consequence = project.consequences.find(c => c.id === id);
      updateConsequence(id, { escalationFactors: [...consequence.escalationFactors, ''] });
    }
  };

  const updateEscalationFactor = (type, itemId, index, value) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === itemId);
      const factors = [...threat.escalationFactors];
      factors[index] = value;
      updateThreat(itemId, { escalationFactors: factors });
    } else {
      const consequence = project.consequences.find(c => c.id === itemId);
      const factors = [...consequence.escalationFactors];
      factors[index] = value;
      updateConsequence(itemId, { escalationFactors: factors });
    }
  };

  const deleteEscalationFactor = (type, itemId, index) => {
    if (type === 'threat') {
      const threat = project.threats.find(t => t.id === itemId);
      updateThreat(itemId, { escalationFactors: threat.escalationFactors.filter((_, i) => i !== index) });
    } else {
      const consequence = project.consequences.find(c => c.id === itemId);
      updateConsequence(itemId, { escalationFactors: consequence.escalationFactors.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
              <p className="text-slate-600 text-sm mt-2">Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onPrint} icon={Printer} variant="secondary">
              Print
            </Button>
            <Button onClick={onExport} icon={FileDown} variant="success">
              Export
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        {['setup', 'threats', 'consequences', 'visual'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all transform ${
              activeTab === tab 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105' 
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:scale-105'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'setup' && (
        <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Project Setup</h2>
          <div className="grid grid-cols-2 gap-6">
            <Input label="Project Name" value={project.name} onChange={v => updateProject({ name: v })} placeholder="e.g., Blast Furnace Safety Analysis" />
            <Input label="Department" value={project.department} onChange={v => updateProject({ department: v })} placeholder="e.g., Steel Making" />
            <Input label="Safety Officer" value={project.owner} onChange={v => updateProject({ owner: v })} placeholder="Name of responsible person" />
            <Input label="Review Date" type="date" value={project.reviewDate} onChange={v => updateProject({ reviewDate: v })} />
            <Select
              label="Risk Level"
              value={project.riskLevel}
              onChange={v => updateProject({ riskLevel: v })}
              options={[
                { value: 'low', label: 'Low Risk' },
                { value: 'medium', label: 'Medium Risk' },
                { value: 'high', label: 'High Risk' }
              ]}
            />
            <Select
              label="Status"
              value={project.status}
              onChange={v => updateProject({ status: v })}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' }
              ]}
            />
          </div>
          <TextArea label="Critical Hazard Event" value={project.hazardEvent} onChange={v => updateProject({ hazardEvent: v })} placeholder="e.g., Molten Metal Spill from Ladle during Transport" rows={3} />
        </Card>
      )}

      {activeTab === 'threats' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Shield className="w-7 h-7 text-red-600" />
              Threats & Preventive Barriers
            </h2>
            <Button onClick={addThreat} icon={Plus} variant="danger">Add Threat</Button>
          </div>
          <div className="space-y-4">
            {project.threats.map((threat, idx) => (
              <div key={threat.id} className="border-2 border-red-200 rounded-xl p-5 bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-lg transition-all">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <TextArea label="Threat Description" value={threat.threat} onChange={v => updateThreat(threat.id, { threat: v })} placeholder="Describe the threat" rows={2} />
                  </div>
                  <div className="w-48">
                    <Select
                      label="Likelihood"
                      value={threat.likelihood}
                      onChange={v => updateThreat(threat.id, { likelihood: v })}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]}
                    />
                  </div>
                  <button onClick={() => deleteThreat(threat.id)} className="mt-7 p-2 hover:bg-red-200 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Preventive Barriers
                      </p>
                      <button onClick={() => addBarrier('threat', threat.id)} className="text-sm text-blue-700 hover:text-blue-900 font-semibold px-3 py-1 bg-blue-200 rounded-lg hover:bg-blue-300 transition-all">
                        + Add Barrier
                      </button>
                    </div>
                    {threat.barriers.map((barrier, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-2">
                          {i + 1}
                        </div>
                        <input value={barrier} onChange={e => updateBarrier('threat', threat.id, i, e.target.value)} placeholder="Barrier description" className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => deleteBarrier('threat', threat.id, i)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-yellow-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Escalation Factors
                      </p>
                      <button onClick={() => addEscalationFactor('threat', threat.id)} className="text-sm text-yellow-700 hover:text-yellow-900 font-semibold px-3 py-1 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition-all">
                        + Add Factor
                      </button>
                    </div>
                    {threat.escalationFactors.map((factor, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={factor} onChange={e => updateEscalationFactor('threat', threat.id, i, e.target.value)} placeholder="Factor that weakens barriers" className="flex-1 px-3 py-2 border-2 border-yellow-200 rounded-lg text-sm bg-yellow-50 focus:ring-2 focus:ring-yellow-500" />
                        <button onClick={() => deleteEscalationFactor('threat', threat.id, i)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'consequences' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Target className="w-7 h-7 text-orange-600" />
              Consequences & Mitigation Barriers
            </h2>
            <Button onClick={addConsequence} icon={Plus} variant="success">Add Consequence</Button>
          </div>
          <div className="space-y-4">
            {project.consequences.map((consequence, idx) => (
              <div key={consequence.id} className="border-2 border-orange-200 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-lg transition-all">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <TextArea label="Consequence Description" value={consequence.consequence} onChange={v => updateConsequence(consequence.id, { consequence: v })} placeholder="Describe the impact" rows={2} />
                  </div>
                  <div className="w-48">
                    <Select
                      label="Severity"
                      value={consequence.severity}
                      onChange={v => updateConsequence(consequence.id, { severity: v })}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]}
                    />
                  </div>
                  <button onClick={() => deleteConsequence(consequence.id)} className="mt-7 p-2 hover:bg-red-200 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-green-900 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Mitigation Barriers
                      </p>
                      <button onClick={() => addBarrier('consequence', consequence.id)} className="text-sm text-green-700 hover:text-green-900 font-semibold px-3 py-1 bg-green-200 rounded-lg hover:bg-green-300 transition-all">
                        + Add Barrier
                      </button>
                    </div>
                    {consequence.barriers.map((barrier, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold mt-2">
                          {i + 1}
                        </div>
                        <input value={barrier} onChange={e => updateBarrier('consequence', consequence.id, i, e.target.value)} placeholder="Barrier description" className="flex-1 px-3 py-2 border-2 border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                        <button onClick={() => deleteBarrier('consequence', consequence.id, i)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-yellow-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Escalation Factors
                      </p>
                      <button onClick={() => addEscalationFactor('consequence', consequence.id)} className="text-sm text-yellow-700 hover:text-yellow-900 font-semibold px-3 py-1 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition-all">
                        + Add Factor
                      </button>
                    </div>
                    {consequence.escalationFactors.map((factor, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={factor} onChange={e => updateEscalationFactor('consequence', consequence.id, i, e.target.value)} placeholder="Factor that weakens barriers" className="flex-1 px-3 py-2 border-2 border-yellow-200 rounded-lg text-sm bg-yellow-50 focus:ring-2 focus:ring-yellow-500" />
                        <button onClick={() => deleteEscalationFactor('consequence', consequence.id, i)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'visual' && (
        <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Interactive Bow Tie Diagram
          </h2>
          {!project.hazardEvent ? (
            <div className="text-center py-16 text-slate-500">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Define the hazard event in Setup to view the bow tie.</p>
            </div>
          ) : (
            <div id="printable-bowtie">
              <BowTieCanvas project={project} />
              
              {/* Legend */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 p-4 rounded-xl text-white">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Threats ({project.threats.length})
                  </h4>
                  <p className="text-sm opacity-90">Potential causes that could trigger the hazard event</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl text-white">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Central Event
                  </h4>
                  <p className="text-sm opacity-90">The critical hazard we aim to prevent</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-yellow-600 p-4 rounded-xl text-white">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Consequences ({project.consequences.length})
                  </h4>
                  <p className="text-sm opacity-90">Potential impacts if the hazard event occurs</p>
                </div>
              </div>
              
              {/* Detailed barriers view */}
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Preventive Controls
                  </h3>
                  {project.threats.map((threat, idx) => (
                    <div key={threat.id} className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                      <p className="font-semibold text-sm text-slate-800 mb-2">Threat {idx + 1}</p>
                      {threat.barriers.length > 0 ? (
                        <ul className="space-y-1">
                          {threat.barriers.map((b, i) => (
                            <li key={i} className="text-xs text-blue-900 flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No barriers defined</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Mitigation Controls
                  </h3>
                  {project.consequences.map((consequence, idx) => (
                    <div key={consequence.id} className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                      <p className="font-semibold text-sm text-slate-800 mb-2">Consequence {idx + 1}</p>
                      {consequence.barriers.length > 0 ? (
                        <ul className="space-y-1">
                          {consequence.barriers.map((b, i) => (
                            <li key={i} className="text-xs text-green-900 flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No barriers defined</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default function BowTiePlatform() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const handleNewProject = () => {
    const project = createProject('New Analysis');
    setProjects([project, ...projects]);
    setCurrentProject(project);
    setView('editor');
  };

  const handleUpdateProject = updated => {
    setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
    setCurrentProject(updated);
  };

  const handleDeleteProject = id => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleImport = imported => {
    const newProject = {
      ...imported,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects([newProject, ...projects]);
    alert('Project imported successfully!');
  };

  const handleLoadDemo = () => {
    if (confirm('This will load demo data. Your existing projects will be preserved. Continue?')) {
      const existingIds = new Set(projects.map(p => p.id));
      const newDemoProjects = DEMO_PROJECTS.filter(demo => !existingIds.has(demo.id));
      setProjects([...newDemoProjects, ...projects]);
      alert(`${newDemoProjects.length} demo projects loaded successfully!`);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bowtie-${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media print {
          body * { visibility: hidden; }
          #printable-bowtie, #printable-bowtie * { visibility: visible; }
          #printable-bowtie { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {view === 'dashboard' ? (
          <Dashboard
            projects={projects}
            onSelectProject={p => {
              setCurrentProject(p);
              setView('editor');
            }}
            onNewProject={handleNewProject}
            onImport={handleImport}
            onDeleteProject={handleDeleteProject}
            onLoadDemo={handleLoadDemo}
          />
        ) : (
          <ProjectEditor project={currentProject} onUpdate={handleUpdateProject} onBack={() => setView('dashboard')} onExport={handleExport} onPrint={handlePrint} />
        )}
      </div>
    </div>
  );
}
