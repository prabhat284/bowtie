//cat > src/App.jsx <<'EOF'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, ChevronRight, X, Calendar, FileUp, BookOpen, Brain, Zap } from 'lucide-react';
import LoginPage from './Login';
import RiskMatrix from './components/RiskMatrix';
import BarrierPanel from './components/BarrierPanel';
import BowTieVisual from './components/BowTieVisual';
import Toolbar from './components/Toolbar';
import KPIDashboard from './components/KPIDashboard';
import BarrierLibrary from './components/BarrierLibrary';
import EscalationFactors from './components/EscalationFactors';
import AIBowTieGenerator from './components/AIBowTieGenerator';
import { createProject, createThreat, createConsequence, createBarrier, getEffectivenessColor, getInitials, migrateProject } from './utils';

const STORAGE_KEY = 'bowtie_projects';

// Threat Editor Component
function ThreatEditor({ project, onUpdate }) {
  const [selectedBarrier, setSelectedBarrier] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [currentThreatId, setCurrentThreatId] = useState(null);
  
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

  const handleLibrarySelect = (libraryBarrier) => {
    if (currentThreatId) {
      const newBarrier = {
        ...createBarrier(),
        description: libraryBarrier.description,
        category: libraryBarrier.category,
        notes: libraryBarrier.notes || ''
      };
      const threat = project.threats.find(t => t.id === currentThreatId);
      updateThreat(currentThreatId, { barriers: [...threat.barriers, newBarrier] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800">Threats (Left Side)</h3>
        <button
          onClick={addThreat}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Threat
        </button>
      </div>

      {project.threats.length === 0 && (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No threats defined. Add threats that could lead to the hazard event.</p>
        </div>
      )}

      {project.threats.map((threat, index) => (
        <div key={threat.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-red-800 mb-2">
                Threat {index + 1}
              </label>
              <textarea
                value={threat.threat}
                onChange={(e) => updateThreat(threat.id, { threat: e.target.value })}
                placeholder="Describe what could cause the hazard event..."
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows={2}
              />
            </div>
            <button
              onClick={() => deleteThreat(threat.id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-200 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold text-red-800 mb-2">
              Likelihood
            </label>
            <select
              value={threat.likelihood}
              onChange={(e) => updateThreat(threat.id, { likelihood: e.target.value })}
              className="px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <EscalationFactors
            factors={threat.escalationFactors || []}
            onChange={(factors) => updateThreat(threat.id, { escalationFactors: factors })}
            type="threat"
          />

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-blue-900">Preventive Barriers</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentThreatId(threat.id);
                    setShowLibrary(true);
                  }}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
                >
                  <BookOpen className="w-3 h-3" />
                  Library
                </button>
                <button
                  onClick={() => addBarrierToThreat(threat.id)}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Add Barrier
                </button>
              </div>
            </div>

            {threat.barriers.length === 0 ? (
              <p className="text-xs text-blue-700 text-center py-2">No barriers defined</p>
            ) : (
              <div className="space-y-2">
                {threat.barriers.map((barrier) => (
                  <div key={barrier.id} className="flex items-center gap-2 bg-white p-2 rounded border border-blue-200">
                    <div className={`w-3 h-3 rounded-full ${getEffectivenessColor(barrier.effectiveness)}`}></div>
                    <span className="flex-1 text-sm">{barrier.description || 'Unnamed barrier'}</span>
                    {barrier.owner && (
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                        {getInitials(barrier.owner)}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedBarrier({ ...barrier, threatId: threat.id, type: 'threat' })}
                      className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBarrierFromThreat(threat.id, barrier.id)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

      <BarrierLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelectBarrier={handleLibrarySelect}
      />
    </div>
  );
}

// Consequence Editor Component
function ConsequenceEditor({ project, onUpdate }) {
  const [selectedBarrier, setSelectedBarrier] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [currentConsequenceId, setCurrentConsequenceId] = useState(null);

  const addConsequence = () => {
    onUpdate({ ...project, consequences: [...project.consequences, createConsequence()] });
  };

  const updateConsequence = (id, updates) => {
    onUpdate({ ...project, consequences: project.consequences.map(c => c.id === id ? { ...c, ...updates } : c) });
  };

  const deleteConsequence = (id) => {
    onUpdate({ ...project, consequences: project.consequences.filter(c => c.id !== id) });
  };

  const addBarrierToConsequence = (consequenceId) => {
    const consequence = project.consequences.find(c => c.id === consequenceId);
    updateConsequence(consequenceId, { barriers: [...consequence.barriers, createBarrier()] });
  };

  const updateBarrierInConsequence = (consequenceId, barrierId, updates) => {
    const consequence = project.consequences.find(c => c.id === consequenceId);
    updateConsequence(consequenceId, {
      barriers: consequence.barriers.map(b => b.id === barrierId ? { ...b, ...updates } : b)
    });
  };

  const deleteBarrierFromConsequence = (consequenceId, barrierId) => {
    const consequence = project.consequences.find(c => c.id === consequenceId);
    updateConsequence(consequenceId, { barriers: consequence.barriers.filter(b => b.id !== barrierId) });
  };

  const handleLibrarySelect = (libraryBarrier) => {
    if (currentConsequenceId) {
      const newBarrier = {
        ...createBarrier(),
        description: libraryBarrier.description,
        category: libraryBarrier.category,
        notes: libraryBarrier.notes || ''
      };
      const consequence = project.consequences.find(c => c.id === currentConsequenceId);
      updateConsequence(currentConsequenceId, { barriers: [...consequence.barriers, newBarrier] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800">Consequences (Right Side)</h3>
        <button
          onClick={addConsequence}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Consequence
        </button>
      </div>

      {project.consequences.length === 0 && (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No consequences defined. Add outcomes that could occur after the hazard event.</p>
        </div>
      )}

      {project.consequences.map((consequence, index) => (
        <div key={consequence.id} className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-orange-800 mb-2">
                Consequence {index + 1}
              </label>
              <textarea
                value={consequence.consequence}
                onChange={(e) => updateConsequence(consequence.id, { consequence: e.target.value })}
                placeholder="Describe what could happen after the hazard event..."
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={2}
              />
            </div>
            <button
              onClick={() => deleteConsequence(consequence.id)}
              className="ml-2 p-2 text-orange-600 hover:bg-orange-200 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold text-orange-800 mb-2">
              Severity
            </label>
            <select
              value={consequence.severity}
              onChange={(e) => updateConsequence(consequence.id, { severity: e.target.value })}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <EscalationFactors
            factors={consequence.escalationFactors || []}
            onChange={(factors) => updateConsequence(consequence.id, { escalationFactors: factors })}
            type="consequence"
          />

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-green-900">Mitigation Barriers</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentConsequenceId(consequence.id);
                    setShowLibrary(true);
                  }}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
                >
                  <BookOpen className="w-3 h-3" />
                  Library
                </button>
                <button
                  onClick={() => addBarrierToConsequence(consequence.id)}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Add Barrier
                </button>
              </div>
            </div>

            {consequence.barriers.length === 0 ? (
              <p className="text-xs text-green-700 text-center py-2">No barriers defined</p>
            ) : (
              <div className="space-y-2">
                {consequence.barriers.map((barrier) => (
                  <div key={barrier.id} className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                    <div className={`w-3 h-3 rounded-full ${getEffectivenessColor(barrier.effectiveness)}`}></div>
                    <span className="flex-1 text-sm">{barrier.description || 'Unnamed barrier'}</span>
                    {barrier.owner && (
                      <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                        {getInitials(barrier.owner)}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedBarrier({ ...barrier, consequenceId: consequence.id, type: 'consequence' })}
                      className="text-green-600 hover:bg-green-100 p-1 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBarrierFromConsequence(consequence.id, barrier.id)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {selectedBarrier && selectedBarrier.type === 'consequence' && (
        <BarrierPanel
          barrier={selectedBarrier}
          onUpdate={(updated) => {
            updateBarrierInConsequence(selectedBarrier.consequenceId, updated.id, updated);
            setSelectedBarrier(null);
          }}
          onClose={() => setSelectedBarrier(null)}
        />
      )}

      <BarrierLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelectBarrier={handleLibrarySelect}
      />
    </div>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState('setup');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
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
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentProject(null);
  };

  const createNewProject = () => {
    const newProject = createProject();
    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setActiveTab('setup');
  };

  const updateProject = (updated) => {
    const updatedProjects = projects.map(p => p.id === updated.id ? updated : p);
    setProjects(updatedProjects);
    setCurrentProject(updated);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const handleImport = (data) => {
    try {
      const migrated = migrateProject(data);
      setProjects([...projects, migrated]);
      setCurrentProject(migrated);
      setActiveTab('setup');
    } catch (error) {
      alert('Failed to import project. Please check the file format.');
    }
  };

  const handleAIImport = (aiGeneratedJson) => {
    console.log('🤖 AI generated project:', aiGeneratedJson);
    
    try {
      const migratedProject = migrateProject(aiGeneratedJson);
      const updatedProjects = [...projects, migratedProject];
      setProjects(updatedProjects);
      setCurrentProject(migratedProject);
      setActiveTab('setup');
      
      console.log('✅ AI project imported successfully:', migratedProject.name);
    } catch (error) {
      console.error('Failed to import AI project:', error);
      alert('Failed to import AI-generated project. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Bow Tie Safety Platform</h1>
              <p className="text-sm text-blue-100 mt-1">Professional Edition - Enhanced Features</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => document.getElementById('import-file').click()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all text-sm"
              >
                <FileUp className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target.result);
                        handleImport(data);
                      } catch (error) {
                        alert('Invalid JSON file');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <button
                onClick={() => window.location.href = '/comparison'}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                Platform Comparison
              </button>
              
              <button
                onClick={() => setShowAIGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold shadow-lg transition-all hover:scale-105"
              >
                <Brain className="w-5 h-5" />
                <span className="hidden sm:inline">AI Generate</span>
                <Zap className="w-4 h-4 animate-pulse" />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Show Dashboard ONLY when no project is selected */}
        {!currentProject && (
          <>
            {/* KPI Dashboard */}
            <KPIDashboard projects={projects} />

            {/* Project Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              
              {/* New Project Card */}
              <button
                onClick={() => setShowAIGenerator(true)}
                className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50 rounded-xl p-8 transition-all group cursor-pointer"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Brain className="w-12 h-12 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div className="text-lg font-semibold text-slate-600 group-hover:text-purple-700 mb-2">
                    New Project
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-purple-600 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI-powered generation in 2 minutes
                  </div>
                </div>
              </button>

              {/* Existing Projects */}
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setCurrentProject(project);
                    setActiveTab('setup');
                  }}
                  className="bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl rounded-xl p-4 cursor-pointer transition-all relative group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this project?')) {
                        deleteProject(project.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>

                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{project.name}</h3>
                      <p className="text-sm text-slate-600">{project.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Threats:</span>
                      <span className="font-bold text-red-600">{project.threats.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consequences:</span>
                      <span className="font-bold text-orange-600">{project.consequences.length}</span>
                    </div>
                    <div className="text-xs text-slate-400 pt-2 border-t">
                      Updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Show Project View ONLY when a project is selected */}
        {currentProject && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
            {/* Project Header */}
            <div className="bg-gradient-to-r from-slate-100 to-blue-50 p-4 sm:p-6 border-b-2 border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => setCurrentProject(null)}
                      className="p-2 hover:bg-white rounded-lg transition-all"
                      title="Back to Dashboard"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">{currentProject.name}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 ml-14">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Last updated: {new Date(currentProject.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Toolbar project={currentProject} onImport={handleImport} />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-slate-200 bg-white">
              <div className="flex overflow-x-auto">
                {['setup', 'threats', 'consequences', 'risk', 'visual'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold capitalize whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'setup' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Project Setup</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold text-slate-700 mb-2">
Project Name
</label>
<input
type="text"
value={currentProject.name}
onChange={(e) => updateProject({ ...currentProject, name: e.target.value })}
className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={currentProject.department}
                    onChange={(e) => updateProject({ ...currentProject, department: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Safety Officer
                  </label>
                  <input
                    type="text"
                    value={currentProject.owner}
                    onChange={(e) => updateProject({ ...currentProject, owner: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={currentProject.reviewDate}
                    onChange={(e) => updateProject({ ...currentProject, reviewDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Critical Hazard Event
                </label>
                <textarea
                  value={currentProject.hazardEvent}
                  onChange={(e) => updateProject({ ...currentProject, hazardEvent: e.target.value })}
                  placeholder="Describe the critical event at the center of the bow tie..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          )}

          {activeTab === 'threats' && (
            <ThreatEditor project={currentProject} onUpdate={updateProject} />
          )}

          {activeTab === 'consequences' && (
            <ConsequenceEditor project={currentProject} onUpdate={updateProject} />
          )}

          {activeTab === 'risk' && (
            <RiskMatrix project={currentProject} onUpdate={updateProject} />
          )}

          {activeTab === 'visual' && (
            <BowTieVisual project={currentProject} />
          )}
        </div>
      </div>
    )}
  </main>

  {/* AI Generator Modal */}
  {showAIGenerator && (
    <AIBowTieGenerator
      onImport={handleAIImport}
      onClose={() => setShowAIGenerator(false)}
    />
  )}
</div>
);
}
