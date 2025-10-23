// src/components/AIBowTieGenerator.jsx
import React, { useState } from 'react';
import { 
  Send, Sparkles, CheckCircle, AlertTriangle, Loader, Brain, 
  FileDown, Edit, Eye, Upload, X, Zap, Play, Shield, Target, Activity
} from 'lucide-react';

// Example scenarios for demo
const EXAMPLE_SCENARIOS = [
  {
    title: "Conveyor Unexpected Start",
    icon: "🏭",
    riskLevel: "high",
    description: `Yesterday we had a near-miss in Material Handling department. A conveyor belt unexpectedly started while maintenance crew was working on it during scheduled shutdown. The work permit was properly issued but the LOTO (Lock-Out Tag-Out) procedure was incomplete due to time pressure from production. Fortunately, the emergency pull chord worked perfectly and stopped the belt immediately - no injuries occurred but this could have been fatal.

The root cause investigation revealed that our digital work permit system wasn't properly linked to the PLC interlock system. This meant someone in the control room was able to issue a remote restart command without knowing maintenance was ongoing. The permit showed as "active" in SAP but the PLC didn't have this information.

We need better barriers between the permit system and the actual equipment isolation. The incident highlighted gaps in our Management of Change process and inadequate shift handover communication.`
  },
  {
    title: "Gas Leak in Confined Space",
    icon: "☣️",
    riskLevel: "critical",
    description: `Serious incident this morning at Blast Furnace Area. Carbon monoxide leak detected in the control room which is a confined space with limited ventilation. The gas detection alarm went off at 8:15 AM showing 85 ppm CO concentration - well above the 50 ppm TWA limit.

Investigation shows the leak originated from a corroded flange on the gas line running above the control room. The flange was installed 8 years ago and was due for replacement 6 months ago but maintenance was delayed due to budget constraints. The corrosion was visible during last inspection but rated as "monitor" not "immediate action".

Emergency response was good - area evacuated within 3 minutes, ventilation system activated, no injuries. However, if the leak had occurred during night shift with fewer personnel, the outcome could have been very different. We need better preventive maintenance scheduling, corrosion monitoring systems, and redundant gas detection with automatic ventilation activation.`
  },
  {
    title: "Molten Metal Spillage",
    icon: "🔥",
    riskLevel: "critical",
    description: `Critical incident in Steel Melting Shop during ladle transfer operation. Approximately 200 kg of molten steel spilled from the ladle onto the floor during crane movement. The incident occurred at 2:30 PM during the day shift.

Root causes identified: 
1) Ladle refractory lining had deteriorated beyond safe limits - last inspection was 45 days ago, should be every 30 days
2) Crane operator was new (only 2 weeks on the job) and moved too quickly during transfer
3) Spotter was not in position due to communication breakdown
4) Floor in the area had water puddles from earlier cleaning - created explosive steam contact with molten metal

Existing barriers that worked: Heat-resistant PPE prevented burns to nearby workers, emergency response team contained the spill quickly, no injuries occurred.

Failed barriers: Ladle inspection schedule not followed, inadequate training verification for new crane operators, housekeeping standards not maintained, two-person rule for critical lifts not enforced.

We need automated ladle condition monitoring, mandatory competency verification before solo operations, pre-operation safety checks with digital sign-off, and better supervision during critical operations.`
  }
];

export default function AIBowTieGenerator({ onImport, onClose }) {
  const [step, setStep] = useState('input');
  const [input, setInput] = useState('');
  const [agentProgress, setAgentProgress] = useState({});
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [analysisTime, setAnalysisTime] = useState(0);
  const [processingMode, setProcessingMode] = useState('standard');

  // Simulate intelligent agent progress
  const simulateAgentProgress = async () => {
    const agents = [
      { key: 'metadata', delay: 400 },
      { key: 'hazard', delay: 350 },
      { key: 'threats', delay: 500 },
      { key: 'consequences', delay: 450 },
      { key: 'barriers', delay: 400 },
      { key: 'signals', delay: 300 },
      { key: 'synthesizer', delay: 350 }
    ];

    for (const agent of agents) {
      setAgentProgress(prev => ({ ...prev, [agent.key]: 'running' }));
      await new Promise(resolve => setTimeout(resolve, agent.delay));
      setAgentProgress(prev => ({ ...prev, [agent.key]: 'complete' }));
    }
  };

  // Main AI analysis function
  const runAnalysis = async () => {
    if (!input.trim()) {
      alert('Please enter an incident description');
      return;
    }

    if (input.length < 100) {
      alert('Please provide more details for accurate analysis (minimum 100 characters)');
      return;
    }

    setStep('analyzing');
    setAgentProgress({});
    const startTime = Date.now();

    const progressPromise = simulateAgentProgress();
    const analysisPromise = analyzeWithAI(input);

    try {
      const [_, json] = await Promise.all([progressPromise, analysisPromise]);
      
      const endTime = Date.now();
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(1));
      
      setGeneratedJSON(json);
      setJsonText(JSON.stringify(json, null, 2));
      setStep('review');
    } catch (error) {
      console.error('AI Analysis error:', error);
      alert(`⚠️ AI Analysis failed: ${error.message}\n\nPlease try again or contact support if the issue persists.`);
      setStep('input');
      setAgentProgress({});
    }
  };

  // AI Analysis Engine (calls YOUR serverless function, not external API)
  const analyzeWithAI = async (description) => {
    try {
      console.log('⚡ Calling AI analysis engine...');
      
      // Call YOUR Vercel serverless function
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          mode: processingMode // 'standard', 'advanced', or 'premium'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI analysis failed');
      }

      const data = await response.json();
      console.log('✅ AI analysis complete');
      
      return data.analysis;
      
    } catch (error) {
      console.error('AI Analysis error:', error);
      
      // User-friendly error messages (no technical details)
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      
      throw error;
    }
  };

  const handleLoadExample = (example) => {
    setInput(example.description);
    setShowExamples(false);
  };

  const handleImport = () => {
    try {
      const json = isEditing ? JSON.parse(jsonText) : generatedJSON;
      onImport(json);
      setStep('complete');
    } catch (error) {
      alert('Invalid JSON. Please fix syntax errors before importing.');
    }
  };

  const handleDownload = () => {
    try {
      const json = isEditing ? JSON.parse(jsonText) : generatedJSON;
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bowtie-${json.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Cannot download - invalid JSON');
    }
  };

  const handleReset = () => {
    setStep('input');
    setInput('');
    setGeneratedJSON(null);
    setJsonText('');
    setAgentProgress({});
    setIsEditing(false);
    setAnalysisTime(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="w-12 h-12" />
              <div>
                <h2 className="text-3xl font-bold">AI BowTie Generator</h2>
                <p className="text-purple-100 text-sm">Intelligent Multi-Agent Analysis System</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* INPUT STEP */}
          {step === 'input' && (
            <div className="space-y-6">
              
              {/* Instructions */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-lg">How It Works</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/60 rounded-xl p-4 border border-blue-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">1</div>
                      <div>
                        <div className="font-bold text-blue-900 mb-1">Describe Incident</div>
                        <div className="text-blue-700 text-xs">Natural language description of what happened</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">2</div>
                      <div>
                        <div className="font-bold text-purple-900 mb-1">AI Analyzes</div>
                        <div className="text-purple-700 text-xs">Multi-agent intelligence processing</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-green-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">3</div>
                      <div>
                        <div className="font-bold text-green-900 mb-1">Import & Visualize</div>
                        <div className="text-green-700 text-xs">Complete BowTie diagram auto-generated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Mode Selection */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Analysis Mode
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Standard Mode */}
                  <button
                    onClick={() => setProcessingMode('standard')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      processingMode === 'standard' 
                        ? 'border-green-500 bg-green-100 shadow-lg scale-105' 
                        : 'border-slate-200 bg-white hover:border-green-400'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">⚡ Standard</div>
                    <div className="text-xs text-slate-600">Fast processing</div>
                    <div className="text-xs text-green-600 mt-1">1-2 seconds</div>
                  </button>
                  
                  {/* Advanced Mode */}
                  <button
                    onClick={() => setProcessingMode('advanced')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      processingMode === 'advanced' 
                        ? 'border-blue-500 bg-blue-100 shadow-lg scale-105' 
                        : 'border-slate-200 bg-white hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">⭐ Advanced</div>
                    <div className="text-xs text-slate-600">Deep analysis</div>
                    <div className="text-xs text-blue-600 mt-1">2-4 seconds</div>
                  </button>
                  
                  {/* Premium Mode */}
                  <button
                    onClick={() => setProcessingMode('premium')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      processingMode === 'premium' 
                        ? 'border-purple-500 bg-purple-100 shadow-lg scale-105' 
                        : 'border-slate-200 bg-white hover:border-purple-400'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">💎 Premium</div>
                    <div className="text-xs text-slate-600">Comprehensive</div>
                    <div className="text-xs text-purple-600 mt-1">2-3 seconds</div>
                  </button>
                </div>
              </div>

              {/* Example Scenarios */}
              <div className="text-center">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  {showExamples ? 'Hide' : 'Load'} Example Scenarios
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>

              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                  {EXAMPLE_SCENARIOS.map((ex, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLoadExample(ex)}
                      className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-2xl hover:border-blue-400 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                        {ex.icon}
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-800 text-lg">{ex.title}</h4>
                          <span className="text-2xl">{ex.icon}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                          {ex.description.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                            ex.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                            ex.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ex.riskLevel.toUpperCase()}
                          </span>
                          <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            Click to load
                            <Zap className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Describe the Safety Incident
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what happened, where, equipment involved, what went wrong, existing barriers, root causes, potential consequences...

Be as detailed as possible. Include:
- Location and equipment
- What went wrong and why
- Existing safety barriers (did they work?)
- Potential consequences
- Contributing factors"
                  className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none transition-all"
                  rows={12}
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${input.length > 200 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {input.length} characters · {input.split(/\s+/).filter(w => w.length > 0).length} words
                  </span>
                  <span className="text-slate-400">
                    {input.length < 100 ? `Need ${100 - input.length} more characters for good analysis` : '✓ Good length'}
                  </span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={runAnalysis}
                disabled={!input.trim() || input.length < 100}
                className="w-full py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transition-all hover:scale-105 disabled:hover:scale-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                  {input.length < 100 ? `Add ${100 - input.length} more characters` : 'Generate BowTie with AI'}
                  <Zap className="w-7 h-7" />
                </div>
              </button>
              {input.length < 100 && input.length > 0 && (
                <p className="text-xs text-center text-amber-600 font-medium">
                  ⚠️ Please provide more details for accurate analysis (minimum 100 characters)
                </p>
              )}
            </div>
          )}

          {/* ANALYZING STEP */}
          {step === 'analyzing' && (
            <div className="space-y-6">
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                  <Loader className="relative w-20 h-20 animate-spin text-purple-600" />
                  <Zap className="w-8 h-8 text-yellow-500 absolute top-0 right-0 animate-bounce" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3 animate-pulse">AI Processing...</h3>
                <p className="text-slate-600 text-lg">Multi-agent intelligence system analyzing incident</p>
              </div>

              {/* Agent Progress */}
              <div className="space-y-3">
                {[
                  { key: 'metadata', name: 'Project Intelligence Agent', icon: '📋', desc: 'Extracting project metadata and classification' },
                  { key: 'hazard', name: 'Hazard Recognition Agent', icon: '⚠️', desc: 'Identifying critical hazard event' },
                  { key: 'threats', name: 'Threat Analysis Agent', icon: '🔍', desc: 'Analyzing causal pathways and threats' },
                  { key: 'consequences', name: 'Impact Modeling Agent', icon: '💥', desc: 'Modeling potential consequences' },
                  { key: 'barriers', name: 'Control Systems Agent', icon: '🛡️', desc: 'Evaluating safety barriers' },
                  { key: 'signals', name: 'Monitoring Agent', icon: '📡', desc: 'Identifying digital monitoring signals' },
                  { key: 'synthesizer', name: 'Integration Agent', icon: '⚙️', desc: 'Synthesizing complete analysis' }
                ].map((agent, idx) => (
                  <div 
                    key={agent.key} 
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-500 ${
                      agentProgress[agent.key] === 'complete' 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-lg' 
                        : agentProgress[agent.key] === 'running'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-2xl scale-105'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`text-4xl transition-all duration-300 ${
                      agentProgress[agent.key] === 'running' ? 'animate-bounce' : ''
                    }`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg">{agent.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{agent.desc}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {agentProgress[agent.key] === 'running' && (
                        <div className="flex items-center gap-2">
                          <Loader className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600">Running...</span>
                        </div>
                      )}
                      {agentProgress[agent.key] === 'complete' && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-7 h-7 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">Complete</span>
                        </div>
                      )}
                      {!agentProgress[agent.key] && (
                        <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500"
                  style={{ 
                    width: `${(Object.values(agentProgress).filter(v => v === 'complete').length / 7) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === 'review' && generatedJSON && (
            <div className="space-y-6">
              
              {/* Success Banner */}
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">AI Analysis Complete! 🎉</h3>
                    <p className="text-green-700">Comprehensive BowTie generated in {analysisTime}s · 95% time saved</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-100 p-5 rounded-xl text-center border-2 border-red-300">
                  <div className="text-4xl font-bold text-red-700">{generatedJSON.threats?.length || 0}</div>
                  <div className="text-sm font-bold text-red-900 mt-1">Threats</div>
                  <div className="text-xs text-red-600">Root causes</div>
                </div>
                <div className="bg-orange-100 p-5 rounded-xl text-center border-2 border-orange-300">
                  <div className="text-4xl font-bold text-orange-700">{generatedJSON.consequences?.length || 0}</div>
                  <div className="text-sm font-bold text-orange-900 mt-1">Consequences</div>
                  <div className="text-xs text-orange-600">Potential outcomes</div>
                </div>
                <div className="bg-green-100 p-5 rounded-xl text-center border-2 border-green-300">
                  <div className="text-4xl font-bold text-green-700">
                    {(generatedJSON.threats?.reduce((sum, t) => sum + (t.barriers?.length || 0), 0) || 0) +
                     (generatedJSON.consequences?.reduce((sum, c) => sum + (c.barriers?.length || 0), 0) || 0)}
                  </div>
                  <div className="text-sm font-bold text-green-900 mt-1">Barriers</div>
                  <div className="text-xs text-green-600">Safety controls</div>
                </div>
                <div className="bg-blue-100 p-5 rounded-xl text-center border-2 border-blue-300">
                  <div className="text-4xl font-bold text-blue-700">{generatedJSON.digitalSignals?.length || 0}</div>
                  <div className="text-sm font-bold text-blue-900 mt-1">Signals</div>
                  <div className="text-xs text-blue-600">Monitor points</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Project Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <span className="text-slate-600 text-xs font-semibold">Project Name</span>
                    <div className="font-bold text-slate-900 mt-1">{generatedJSON.name}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <span className="text-slate-600 text-xs font-semibold">Department</span>
                    <div className="font-bold text-slate-900 mt-1">{generatedJSON.department}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <span className="text-slate-600 text-xs font-semibold">Risk Level</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        generatedJSON.riskLevel === 'high' ? 'bg-red-500 text-white' :
                        generatedJSON.riskLevel === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {generatedJSON.riskLevel?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <span className="text-slate-600 text-xs font-semibold">Created</span>
                    <div className="font-bold text-slate-900 mt-1">{new Date(generatedJSON.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="mt-3 bg-white p-3 rounded-lg">
                  <span className="text-slate-600 text-xs font-semibold">Hazard Event</span>
                  <div className="font-medium text-orange-900 mt-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    {generatedJSON.hazardEvent}
                  </div>
                </div>
              </div>

              {/* JSON Preview */}
              <div className="border-2 border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-slate-700" />
                    <span className="font-bold text-slate-800">Generated Analysis Data</span>
                    <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-bold">
                      {(JSON.stringify(generatedJSON).length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all"
                  >
                    {isEditing ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 max-h-80 overflow-y-auto">
                  {isEditing ? (
                    <textarea
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      className="w-full h-72 px-4 py-3 font-mono text-xs border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      spellCheck={false}
                    />
                  ) : (
                    <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(generatedJSON, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-semibold transition-all"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Start Over
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-bold shadow-lg transition-all hover:scale-105"
                >
                  <FileDown className="w-5 h-5 inline mr-2" />
                  Download JSON
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 font-bold shadow-2xl transition-all hover:scale-105"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Import to BowTie
                  <Sparkles className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* COMPLETE STEP */}
          {step === 'complete' && (
            <div className="text-center py-20">
              <CheckCircle className="w-32 h-32 text-green-600 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-slate-800 mb-4">BowTie Created Successfully! 🎉</h3>
              <p className="text-xl text-slate-600 mb-10">
                Your AI-powered safety analysis is ready to visualize
              </p>
              <div className="flex justify-center gap-4 mb-10">
                <div className="px-6 py-3 bg-green-50 rounded-xl border-2 border-green-300">
                  <div className="text-2xl font-bold text-green-700">⚡ {analysisTime}s</div>
                  <div className="text-xs text-green-600">Analysis Time</div>
                </div>
                <div className="px-6 py-3 bg-blue-50 rounded-xl border-2 border-blue-300">
                  <div className="text-2xl font-bold text-blue-700">95%</div>
                  <div className="text-xs text-blue-600">Time Saved</div>
                </div>
                <div className="px-6 py-3 bg-purple-50 rounded-xl border-2 border-purple-300">
                  <div className="text-2xl font-bold text-purple-700">
                    {(generatedJSON?.threats?.length || 0) + (generatedJSON?.consequences?.length || 0)}
                  </div>
                  <div className="text-xs text-purple-600">Items Analyzed</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 font-bold text-xl shadow-2xl transition-all hover:scale-110"
              >
                Close & View BowTie Diagram
              </button>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
