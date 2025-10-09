//cat > src/App.jsx <<'EOF'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, ChevronRight, X, Calendar, FileUp } from 'lucide-react';
import LoginPage from './Login';
import RiskMatrix from './components/RiskMatrix';
import BarrierPanel from './components/BarrierPanel';
import BowTieVisual from './components/BowTieVisual';
import Toolbar from './components/Toolbar';
import { createProject, createThreat, createConsequence, createBarrier, getEffectivenessColor, getInitials, migrateProject } from './utils';

const STORAGE_KEY = 'bowtie_projects';

// Threat Editor Component
function ThreatEditor({ project, onUpdate }) {
  const [selectedBarrier, setSelectedBarrier] = useState(null);

  const addThreat = () => {
    onUpdate({ ...project, threats: [...project.threats, createThreat()] });
  };

  const updateThreat = (id, updates) => {
    onUpdate({ ...project, threats: project.threats.map(t => t.id === id ? { ...t, ...updates } : t) });
  };

  const deleteThreat = (id) => {
    onUpdate({ ...project, threats: project.threats.filter(t => t.id !== id) });
  };

  const addBarrierToThreat = (threatId) => {
    const threat = project.threats.find(t => t.id === threatId);
    updateThreat(threatId, { barriers: [...threat.barriers, createBarrier()] });
  };

  const updateBarrierInThreat = (threatId, barrierId, updates) => {
    const threat = project.threats.find(t => t.id === threatId);
    updateThreat(threatId, {
      barriers: threat.barriers.map(b => b.id === barrierId ? { ...b, ...updates } : b)
    });
  };

  const deleteBarrierFromThreat = (threatId, barrierId) => {
    const threat = project.threats.find(t => t.id === threatId);
    updateThreat(threatId, { barriers: threat.barriers.filter(b => b.id !== barrierId) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Threats & Preventive Barriers</h3>
        <button onClick={addThreat} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" />
          Add Threat
        </button>
      </div>

      {project.threats.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No threats yet. Click "Add Threat" to start.</p>
        </div>
      )}

      {project.threats.map((threat, idx) => (
        <div key={threat.id} className="border-2 border-red-200 rounded-xl p-5 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
              {idx + 1}
            </div>
            <div className="flex-1">
              <textarea
                value={threat.threat}
                onChange={(e) => updateThreat(threat.id, { threat: e.target.value })}
                placeholder="Describe the threat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                rows={2}
              />
            </div>
            <select
              value={threat.likelihood}
              onChange={(e) => updateThreat(threat.id, { likelihood: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button onClick={() => deleteThreat(threat.id)} className="p-2 hover:bg-red-200 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>

          <div className="ml-14 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-blue-900">Preventive Barriers</p>
              <button onClick={() => addBarrierToThreat(threat.id)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                + Add Barrier
              </button>
            </div>

            {threat.barriers.map((barrier) => (
              <div
                key={barrier.id}
                className="bg-white border-2 border-blue-200 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedBarrier({ ...barrier, threatId: threat.id, type: 'threat' })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getEffectivenessColor(barrier.effectiveness)}`} title={barrier.effectiveness} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{barrier.description || 'Click to configure barrier'}</p>
                    {barrier.attachments && barrier.attachments.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {barrier.attachments.map((att, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {att.type.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {barrier.owner && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold" title={barrier.owner}>
                      {getInitials(barrier.owner)}
                    </div>
                  )}
                  {barrier.nextDue && (
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(barrier.nextDue).toLocaleDateString()}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBarrierFromThreat(threat.id, barrier.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedBarrier && selectedBarrier.type === 'threat' && (
        <BarrierPanel
          barrier={selectedBarrier}
          onUpdate={(updated) => {
            updateBarrierInThreat(selectedBarrier.threatId, updated.id, updated);
            setSelectedBarrier(null);
          }}
          onClose={() => setSelectedBarrier(null)}
        />
      )}
    </div>
  );
}

// Consequence Editor Component
function ConsequenceEditor({ project, onUpdate }) {
  const [selectedBarrier, setSelectedBarrier] = useState(null);

  const addConsequence = () => {
    onUpdate({ ...project, consequences: [...project.consequences, createConsequence()] });
  };

  const updateConsequence = (id, updates) => {
    onUpdate({ ...project, consequences: project.consequences.map(c => c.id === id ? { ...c, ...updates } : c) });
  };

  const deleteConsequence = (id) => {
    onUpdate({ ...project, consequences: project.consequences.filter(c => c.id !== id) });
  };

  const addBarrierToConsequence = (consId) => {
    const cons = project.consequences.find(c => c.id === consId);
    updateConsequence(consId, { barriers: [...cons.barriers, createBarrier()] });
  };

  const updateBarrierInConsequence = (consId, barrierId, updates) => {
    const cons = project.consequences.find(c => c.id === consId);
    updateConsequence(consId, {
      barriers: cons.barriers.map(b => b.id === barrierId ? { ...b, ...updates } : b)
    });
  };

  const deleteBarrierFromConsequence = (consId, barrierId) => {
    const cons = project.consequences.find(c => c.id === consId);
    updateConsequence(consId, { barriers: cons.barriers.filter(b => b.id !== barrierId) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Consequences & Mitigation Barriers</h3>
        <button onClick={addConsequence} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus className="w-4 h-4" />
          Add Consequence
        </button>
      </div>

      {project.consequences.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No consequences yet. Click "Add Consequence" to start.</p>
        </div>
      )}

      {project.consequences.map((cons, idx) => (
        <div key={cons.id} className="border-2 border-orange-200 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
              {idx + 1}
            </div>
            <div className="flex-1">
              <textarea
                value={cons.consequence}
                onChange={(e) => updateConsequence(cons.id, { consequence: e.target.value })}
                placeholder="Describe the consequence"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                rows={2}
              />
            </div>
            <select
              value={cons.severity}
              onChange={(e) => updateConsequence(cons.id, { severity: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button onClick={() => deleteConsequence(cons.id)} className="p-2 hover:bg-red-200 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>

          <div className="ml-14 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-green-900">Mitigation Barriers</p>
              <button onClick={() => addBarrierToConsequence(cons.id)} className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                + Add Barrier
              </button>
            </div>

            {cons.barriers.map((barrier) => (
              <div
                key={barrier.id}
                className="bg-white border-2 border-green-200 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedBarrier({ ...barrier, consId: cons.id, type: 'consequence' })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getEffectivenessColor(barrier.effectiveness)}`} title={barrier.effectiveness} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{barrier.description || 'Click to configure barrier'}</p>
                    {barrier.attachments && barrier.attachments.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {barrier.attachments.map((att, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {att.type.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {barrier.owner && (
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold" title={barrier.owner}>
                      {getInitials(barrier.owner)}
                    </div>
                  )}
                  {barrier.nextDue && (
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(barrier.nextDue).toLocaleDateString()}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBarrierFromConsequence(cons.id, barrier.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedBarrier && selectedBarrier.type === 'consequence' && (
        <BarrierPanel
          barrier={selectedBarrier}
          onUpdate={(updated) => {
            updateBarrierInConsequence(selectedBarrier.consId, updated.id, updated);
            setSelectedBarrier(null);
          }}
          onClose={() => setSelectedBarrier(null)}
        />
      )}
    </div>
  );
}

// Project Editor
function ProjectEditor({ project, onUpdate, onBack, onImportToProject }) {
  const [activeTab, setActiveTab] = useState('setup');

  // Ensure project has all required fields
  const safeProject = {
    ...project,
    inherentRisk: project.inherentRisk || { likelihood: 3, severity: 3 },
    residualRisk: project.residualRisk || { likelihood: 2, severity: 2 },
    threats: project.threats || [],
    consequences: project.consequences || []
  };

  const handleImport = (imported) => {
    if (confirm('This will replace the current project data. Continue?')) {
      const migratedData = migrateProject(imported);
      onImportToProject(migratedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{safeProject.name}</h1>
              <p className="text-slate-600 text-sm mt-2">Last updated: {new Date(safeProject.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <Toolbar 
            project={safeProject}
            onImport={handleImport}
          />
        </div>
      </div>

      <div className="flex gap-2 no-print">
        {['setup', 'threats', 'consequences', 'risk', 'visual'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'setup' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Project Setup</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
              <input
                type="text"
                value={safeProject.name}
                onChange={(e) => onUpdate({ ...safeProject, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <input
                type="text"
                value={safeProject.department}
                onChange={(e) => onUpdate({ ...safeProject, department: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Safety Officer</label>
              <input
                type="text"
                value={safeProject.owner}
                onChange={(e) => onUpdate({ ...safeProject, owner: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Review Date</label>
              <input
                type="date"
                value={safeProject.reviewDate}
                onChange={(e) => onUpdate({ ...safeProject, reviewDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Critical Hazard Event</label>
            <textarea
              value={safeProject.hazardEvent}
              onChange={(e) => onUpdate({ ...safeProject, hazardEvent: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      )}

      {activeTab === 'threats' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ThreatEditor project={safeProject} onUpdate={onUpdate} />
        </div>
      )}

      {activeTab === 'consequences' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ConsequenceEditor project={safeProject} onUpdate={onUpdate} />
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Risk Assessment Matrix</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Inherent Risk (No Barriers)</h3>
              <RiskMatrix project={safeProject} mode="inherent" />
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Likelihood</label>
                  <select
                    value={safeProject.inherentRisk.likelihood}
                    onChange={(e) => onUpdate({
                      ...safeProject,
                      inherentRisk: { ...safeProject.inherentRisk, likelihood: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Rare</option>
                    <option value="2">2 - Unlikely</option>
                    <option value="3">3 - Possible</option>
                    <option value="4">4 - Likely</option>
                    <option value="5">5 - Almost Certain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Severity</label>
                  <select
                    value={safeProject.inherentRisk.severity}
                    onChange={(e) => onUpdate({
                      ...safeProject,
                      inherentRisk: { ...safeProject.inherentRisk, severity: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Negligible</option>
                    <option value="2">2 - Minor</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Major</option>
                    <option value="5">5 - Catastrophic</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Residual Risk (With Barriers)</h3>
              <RiskMatrix project={safeProject} mode="residual" />
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Likelihood</label>
                  <select
                    value={safeProject.residualRisk.likelihood}
                    onChange={(e) => onUpdate({
                      ...safeProject,
                      residualRisk: { ...safeProject.residualRisk, likelihood: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Rare</option>
                    <option value="2">2 - Unlikely</option>
                    <option value="3">3 - Possible</option>
                    <option value="4">4 - Likely</option>
                    <option value="5">5 - Almost Certain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Severity</label>
                  <select
                    value={safeProject.residualRisk.severity}
                    onChange={(e) => onUpdate({
                      ...safeProject,
                      residualRisk: { ...safeProject.residualRisk, severity: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Negligible</option>
                    <option value="2">2 - Minor</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Major</option>
                    <option value="5">5 - Catastrophic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">Risk Reduction Summary</h4>
            <p className="text-sm text-blue-800">
              Your barriers reduce risk from <strong>{safeProject.inherentRisk.likelihood * safeProject.inherentRisk.severity}</strong> (Inherent) 
              to <strong>{safeProject.residualRisk.likelihood * safeProject.residualRisk.severity}</strong> (Residual).
              Reduction: <strong>{Math.max(0, ((1 - (safeProject.residualRisk.likelihood * safeProject.residualRisk.severity) / (safeProject.inherentRisk.likelihood * safeProject.inherentRisk.severity)) * 100)).toFixed(0)}%</strong>
            </p>
          </div>
        </div>
      )}

      {activeTab === 'visual' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 no-print">Bow Tie Visualization</h2>
          <BowTieVisual project={safeProject} />
        </div>
      )}
    </div>
  );
}

// Dashboard
function Dashboard({ projects, onSelectProject, onNewProject, onLogout, onImportProject, onDeleteProject }) {
  const fileInputRef = React.useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        onImportProject(imported);
        alert('Project imported successfully!');
      } catch (error) {
        alert('Failed to import file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Bow Tie Safety Platform</h1>
            <p className="text-blue-100 text-lg">Professional Edition - Enhanced Features</p>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button onClick={handleImportClick} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Import
            </button>
            <button onClick={onLogout} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={onNewProject}
          className="h-48 border-4 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-blue-600"
        >
          <Plus className="w-12 h-12" />
          <span className="text-lg font-semibold">New Project</span>
        </button>

        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer relative group"
            onClick={() => onSelectProject(project.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this project? This cannot be undone.')) {
                  onDeleteProject(project.id);
                }
              }}
              className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">{project.department}</p>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed.map(migrateProject));
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const handleLogin = (username, password) => {
    if (username && password) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedProjectId(null);
  };

  const handleNewProject = () => {
    const newProject = createProject();
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const handleUpdateProject = (updated) => {
    setProjects(projects.map(p => p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p));
  };

  const handleImportProject = (imported) => {
    const migratedProject = migrateProject(imported);
    const newProject = {
      ...migratedProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const handleImportToCurrentProject = (imported) => {
    const migratedData = migrateProject(imported);
    const updated = {
      ...migratedData,
      id: selectedProjectId,
      createdAt: projects.find(p => p.id === selectedProjectId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleUpdateProject(updated);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {selectedProject ? (
          <ProjectEditor
            project={selectedProject}
            onUpdate={handleUpdateProject}
            onBack={() => setSelectedProjectId(null)}
            onImportToProject={handleImportToCurrentProject}
          />
        ) : (
          <Dashboard
            projects={projects}
            onSelectProject={setSelectedProjectId}
            onNewProject={handleNewProject}
            onLogout={handleLogout}
            onImportProject={handleImportProject}
            onDeleteProject={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
}
