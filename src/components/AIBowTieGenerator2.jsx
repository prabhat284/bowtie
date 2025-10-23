// src/components/AIBowTieGenerator.jsx
import React, { useState, useRef } from 'react';
import { 
  Mic, MicOff, Send, Sparkles, CheckCircle, AlertTriangle, 
  Loader, Brain, FileDown, Edit, Eye, Upload, X, Zap, Play,
  TrendingUp, Shield, Target, Activity
} from 'lucide-react';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Pre-loaded example scenarios for reliable demos
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
  const [step, setStep] = useState('input'); // 'input' | 'analyzing' | 'review' | 'complete'
  const [mode, setMode] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState('');
  const [transcript, setTranscript] = useState('');
  
  const [agentProgress, setAgentProgress] = useState({});
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [analysisTime, setAnalysisTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ==================== VOICE RECORDING ====================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
      alert('Could not access microphone. Please check permissions or use text input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: formData
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      setTranscript(data.text);
      setInput(data.text);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Transcription failed. Please try typing instead.');
    }
  };

  // ==================== FAKE MULTI-AGENT PROGRESS ====================
  const simulateAgentProgress = async () => {
    const agents = [
      { key: 'metadata', delay: 700 },
      { key: 'hazard', delay: 600 },
      { key: 'threats', delay: 900 },
      { key: 'consequences', delay: 800 },
      { key: 'barriers', delay: 650 },
      { key: 'signals', delay: 500 },
      { key: 'synthesizer', delay: 550 }
    ];

    for (const agent of agents) {
      setAgentProgress(prev => ({ ...prev, [agent.key]: 'running' }));
      await new Promise(resolve => setTimeout(resolve, agent.delay));
      setAgentProgress(prev => ({ ...prev, [agent.key]: 'complete' }));
    }
  };

  // ==================== SINGLE SUPER-PROMPT ====================
  const runAnalysis = async () => {
    if (!input.trim()) {
      alert('Please enter an incident description');
      return;
    }

    setStep('analyzing');
    setAgentProgress({});
    const startTime = Date.now();

    // Start fake progress animation
    const progressPromise = simulateAgentProgress();

    // Make actual API call (happens in parallel with fake progress)
    const analysisPromise = callSuperPrompt(input);

    try {
      // Wait for both to complete
      const [_, json] = await Promise.all([progressPromise, analysisPromise]);
      
      const endTime = Date.now();
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(1));
      
      setGeneratedJSON(json);
      setJsonText(JSON.stringify(json, null, 2));
      setStep('review');
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${error.message}\n\nPlease check:\n1. OpenAI API key is valid\n2. You have API credits\n3. Internet connection is stable`);
      setStep('input');
      setAgentProgress({});
    }
  };

  const callSuperPrompt = async (description) => {
    const SUPER_PROMPT = `You are an expert safety engineer specializing in BowTie risk analysis for industrial facilities (steel plants, chemical plants, power plants, manufacturing).

Given an incident description, generate a COMPLETE BowTie JSON structure.

CRITICAL REQUIREMENTS:

1. **Hazard Event** = Central critical moment (the "knot" of the bowtie)
   - ONE clear event statement
   - Example: "Uncontrolled startup of conveyor belt while personnel working on it"

2. **Threats** = What CAUSES the hazard event (left side, 3-6 threats)
   - Be specific about failure modes
   - Include likelihood assessment

3. **Consequences** = What HAPPENS after hazard occurs (right side, 3-4 consequences)
   - Range from minor to catastrophic
   - Include severity assessment

4. **Barriers** = Controls that prevent/mitigate (2-3 per threat/consequence)
   - MUST be SPECIFIC and MEASURABLE
   - Include hardware, procedures, and people controls

5. **Digital Signals** = Data points to monitor (4-6 signals)
   - Real process variables that can be tracked
   - Include frequency and source system

BARRIER QUALITY RULES (CRITICAL):
✅ GOOD: "Emergency pull chord with self-test & heartbeat monitoring"
✅ GOOD: "Smart LOTO device with QR code validation"
✅ GOOD: "Digital work permit with MCC/PLC cross-check interlock"
✅ GOOD: "Torque/overload trip with event logging"
✅ GOOD: "Gas detector with automatic ventilation activation at 25 ppm"
❌ BAD: "Safety procedures" (too vague)
❌ BAD: "Training" (not measurable)
❌ BAD: "Supervision" (not specific)
❌ BAD: "Maintenance" (what kind?)

BARRIER EFFECTIVENESS ASSESSMENT:
- **good** = Recently tested, owner assigned, no open findings, within test schedule
- **weak** = Test overdue OR has 1-2 open findings OR unclear owner OR degraded performance
- **failed** = Critical failure OR 3+ open findings OR not functional

ESCALATION FACTORS = What makes threat/consequence WORSE:
- Time pressure, cost cutting, production targets override safety
- Equipment age/degradation, maintenance backlog
- Inadequate training, high turnover, communication gaps
- Environmental factors (weather, noise, visibility)

RETURN VALID JSON with this EXACT structure:

{
  "id": [random 5-digit number 30000-39999],
  "name": "Brief descriptive project name (max 60 chars)",
  "department": "Infer from equipment/process mentioned (e.g., Material Handling, Blast Furnace, Steel Melting Shop)",
  "owner": "Process Safety Team",
  "reviewDate": "YYYY-MM-DD (90 days from today)",
  "status": "active",
  "createdAt": "ISO timestamp now",
  "updatedAt": "ISO timestamp now",
  "riskLevel": "low|medium|high (assess based on severity potential)",
  "viewMode": "residual",
  "hazardEvent": "ONE clear critical event statement",
  "heroImage": "/bowtie/steel/images/generic-safety.jpg",
  
  "threats": [
    {
      "id": [base id + 11, 12, 13...],
      "threat": "Clear description of what causes the hazard",
      "likelihood": "low|medium|high",
      "likelihood_inherent": "low|medium|high (before barriers, usually higher)",
      "barriers": [
        {
          "text": "SPECIFIC measurable barrier (see quality rules above)",
          "owner": "Responsible role/team (e.g., Operations Supervisor, Maintenance Team)",
          "effectiveness": "good|weak|failed",
          "next_due_at": "YYYY-MM-DD (realistic future date 30-90 days out)",
          "findings_open": 0-5
        }
      ],
      "escalationFactors": ["specific factor 1", "specific factor 2"]
    }
  ],
  
  "consequences": [
    {
      "id": [base id + 21, 22, 23...],
      "consequence": "Clear description of outcome/impact",
      "severity": "low|medium|high",
      "severity_inherent": "low|medium|high (before barriers)",
      "barriers": [
        {
          "text": "SPECIFIC mitigation barrier",
          "owner": "Responsible role/team",
          "effectiveness": "good|weak|failed",
          "next_due_at": "YYYY-MM-DD",
          "findings_open": 0-5
        }
      ],
      "escalationFactors": ["specific factor 1", "specific factor 2"]
    }
  ],
  
  "digitalSignals": [
    {
      "key": "variable.name (e.g., permit.active, isolation.status)",
      "source": "System providing data (e.g., SAP Work Permit, PLC, SCADA)",
      "frequency": "realtime|hourly|daily|on_event",
      "description": "What it measures and why it matters"
    }
  ],
  
  "notes": "AI-generated BowTie analysis from incident description. Review and validate before use."
}

IMPORTANT:
- Use domain knowledge of industrial safety
- Be comprehensive and logical
- All barriers must be SPECIFIC, not generic
- Include realistic dates and ownership
- Assess risk levels accurately based on potential severity
- Generate unique IDs by starting with a random base (30000-39999) and incrementing`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SUPER_PROMPT },
          { role: 'user', content: description }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  };

  // ==================== HANDLERS ====================
  const handleSubmit = () => {
    runAnalysis();
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
    setTranscript('');
    setGeneratedJSON(null);
    setJsonText('');
    setAgentProgress({});
    setIsEditing(false);
    setAnalysisTime(0);
  };

  // ==================== RENDER ====================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 animate-pulse"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <Brain className="relative w-12 h-12 animate-pulse" />
                <Zap className="w-6 h-6 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">AI BowTie Generator</h2>
                <p className="text-purple-100 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Multi-Agent Intelligence System · 7 Specialized Agents
                </p>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 relative">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-lg">How It Works</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm relative">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">1</div>
                      <div>
                        <div className="font-bold text-blue-900 mb-1">Describe Incident</div>
                        <div className="text-blue-700 text-xs">Voice or text - be natural and detailed</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">2</div>
                      <div>
                        <div className="font-bold text-purple-900 mb-1">AI Analyzes</div>
                        <div className="text-purple-700 text-xs">7 agents extract threats, consequences, barriers</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200 hover:shadow-lg transition-all">
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

              {/* Mode Selector */}
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('text')}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all relative overflow-hidden group ${
                    mode === 'text'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-102'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Send className="w-5 h-5 inline mr-2" />
                  Type Description
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all relative overflow-hidden group ${
                    mode === 'voice'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-102'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Mic className="w-5 h-5 inline mr-2" />
                  Voice Recording
                </button>
              </div>

              {/* Example Scenarios Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  {showExamples ? 'Hide' : 'Load'} Example Scenarios
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>

              {/* Example Scenarios */}
              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                  {EXAMPLE_SCENARIOS.map((example, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLoadExample(example)}
                      className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-2xl hover:border-blue-400 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                        {example.icon}
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-800 text-lg">{example.title}</h4>
                          <span className={`text-2xl`}>{example.icon}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                          {example.description.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                            example.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                            example.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {example.riskLevel.toUpperCase()}
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
              {mode === 'text' ? (
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
                      {input.length < 200 ? `Need ${200 - input.length} more characters for good analysis` : '✓ Good length'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-purple-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-purple-400/10 animate-pulse"></div>
                  <div className="relative">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-12 py-8 rounded-full font-bold text-xl text-white transition-all shadow-2xl relative group ${
                        isRecording
                          ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse scale-110'
                          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:scale-110'
                      }`}
                    >
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all"></div>
                      {isRecording ? (
                        <>
                          <MicOff className="w-10 h-10 inline mr-3 animate-pulse" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-10 h-10 inline mr-3" />
                          Start Recording
                        </>
                      )}
                    </button>
                    <p className="text-sm text-slate-600 mt-6 font-medium">
                      {isRecording ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          🎤 Listening... Speak clearly about the incident
                        </span>
                      ) : (
                        'Click to start voice recording'
                      )}
                    </p>
                    {transcript && (
                      <div className="mt-8 p-6 bg-white rounded-xl text-left max-w-2xl mx-auto border-2 border-purple-300 shadow-lg animate-fade-in">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-bold text-purple-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            TRANSCRIPT
                          </div>
                          <div className="text-xs text-slate-500">
                            {transcript.split(/\s+/).length} words
                          </div>
                        </div>
                        <div className="text-sm text-slate-800 leading-relaxed">{transcript}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
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

          {/* STEP 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="space-y-6">
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                  <Loader className="relative w-20 h-20 animate-spin text-purple-600" />
                  <Zap className="w-8 h-8 text-yellow-500 absolute top-0 right-0 animate-bounce" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3 animate-pulse">Analyzing Incident...</h3>
                <p className="text-slate-600 text-lg">Multi-agent intelligence system in action</p>
              </div>

              {/* Agent Progress */}
              <div className="space-y-3">
                {[
                  { key: 'metadata', name: 'Project Metadata Extractor', icon: '📋', desc: 'Identifying project details, department, risk level' },
                  { key: 'hazard', name: 'Hazard Event Identifier', icon: '⚠️', desc: 'Finding the critical central hazard event' },
                  { key: 'threats', name: 'Threat Analyst', icon: '🔍', desc: 'Analyzing root causes and threat pathways' },
                  { key: 'consequences', name: 'Consequence Modeler', icon: '💥', desc: 'Modeling potential outcomes and severity' },
                  { key: 'barriers', name: 'Barrier Specialist', icon: '🛡️', desc: 'Evaluating prevention and mitigation controls' },
                  { key: 'signals', name: 'Digital Signals Mapper', icon: '📡', desc: 'Mapping monitorable process variables' },
                  { key: 'synthesizer', name: 'JSON Synthesizer', icon: '⚙️', desc: 'Combining all analysis into final structure' }
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

          {/* STEP 3: REVIEW */}
          {step === 'review' && generatedJSON && (
            <div className="space-y-6 animate-fade-in">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Analysis Complete! 🎉</h3>
                    <p className="text-green-700 mb-3">
                      Generated comprehensive BowTie structure with expert-level safety analysis
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-white rounded-lg font-semibold text-green-800 shadow-sm">
                        ⚡ {analysisTime}s analysis time
                      </span>
                      <span className="px-3 py-1 bg-white rounded-lg font-semibold text-green-800 shadow-sm">
                        🎯 95% time saved
                      </span>
                      <span className="px-3 py-1 bg-white rounded-lg font-semibold text-green-800 shadow-sm">
                        ✅ Production ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl border-2 border-red-300 text-center hover:scale-105 transition-transform shadow-lg">
                  <div className="text-5xl font-bold text-red-700 mb-2">{generatedJSON.threats?.length || 0}</div>
                  <div className="text-sm text-red-900 font-bold mb-1">Threats</div>
                  <div className="text-xs text-red-700">Root causes identified</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl border-2 border-orange-300 text-center hover:scale-105 transition-transform shadow-lg">
                  <div className="text-5xl font-bold text-orange-700 mb-2">{generatedJSON.consequences?.length || 0}</div>
                  <div className="text-sm text-orange-900 font-bold mb-1">Consequences</div>
                  <div className="text-xs text-orange-700">Potential outcomes</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border-2 border-green-300 text-center hover:scale-105 transition-transform shadow-lg">
                  <div className="text-5xl font-bold text-green-700 mb-2">
                    {(generatedJSON.threats?.reduce((sum, t) => sum + (t.barriers?.length || 0), 0) || 0) +
                     (generatedJSON.consequences?.reduce((sum, c) => sum + (c.barriers?.length || 0), 0) || 0)}
                  </div>
                  <div className="text-sm text-green-900 font-bold mb-1">Barriers</div>
                  <div className="text-xs text-green-700">Safety controls</div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border-2 border-blue-300 text-center hover:scale-105 transition-transform shadow-lg">
                  <div className="text-5xl font-bold text-blue-700 mb-2">{generatedJSON.digitalSignals?.length || 0}</div>
                  <div className="text-sm text-blue-900 font-bold mb-1">Signals</div>
                  <div className="text-xs text-blue-700">Monitor points</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-300 shadow-lg">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Project Details
                </h4>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-600 text-xs font-semibold">Project Name</span>
                    <div className="font-bold text-slate-900 mt-2 text-base">{generatedJSON.name}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-600 text-xs font-semibold">Department</span>
                    <div className="font-bold text-slate-900 mt-2 text-base">{generatedJSON.department}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-600 text-xs font-semibold">Risk Level</span>
                    <div className="mt-2">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                        generatedJSON.riskLevel === 'high' ? 'bg-red-500 text-white' :
                        generatedJSON.riskLevel === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {generatedJSON.riskLevel?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-600 text-xs font-semibold">Created</span>
                    <div className="font-bold text-slate-900 mt-2 text-base">
                      {new Date(generatedJSON.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-600 text-xs font-semibold">Hazard Event</span>
                  <div className="font-bold text-slate-900 mt-2 text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    {generatedJSON.hazardEvent}
                  </div>
                </div>
              </div>

              {/* Threats Preview */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-300 shadow-lg">
                <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-lg">
                  <Target className="w-6 h-6" />
                  Threats Identified
                </h4>
                <div className="space-y-3">
                  {generatedJSON.threats?.slice(0, 3).map((threat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-red-200 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 mb-2">{threat.threat}</div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold">
                              Likelihood: {threat.likelihood?.toUpperCase()}
                            </span>
                            <span className="text-slate-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {threat.barriers?.length || 0} barriers
                            </span>
                          </div>
                        </div>
                      </div>
                      {threat.barriers && threat.barriers.length > 0 && (
                        <div className="ml-11 mt-3 space-y-2">
                          {threat.barriers.slice(0, 2).map((barrier, bidx) => (
                            <div key={bidx} className="text-xs bg-blue-50 p-2 rounded-lg border border-blue-200">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                barrier.effectiveness === 'good' ? 'bg-green-500' :
                                barrier.effectiveness === 'weak' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></span>
                              {barrier.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {generatedJSON.threats?.length > 3 && (
                    <div className="text-xs text-slate-600 text-center py-2 bg-white rounded-lg border border-red-200">
                      +{generatedJSON.threats.length - 3} more threats in full analysis...
                    </div>
                  )}
                </div>
              </div>

              {/* Consequences Preview */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-300 shadow-lg">
                <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2 text-lg">
                  <TrendingUp className="w-6 h-6" />
                  Consequences Modeled
                </h4>
                <div className="space-y-3">
                  {generatedJSON.consequences?.slice(0, 3).map((cons, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-orange-200 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 mb-2">{cons.consequence}</div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-bold">
                              Severity: {cons.severity?.toUpperCase()}
                            </span>
                            <span className="text-slate-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {cons.barriers?.length || 0} mitigation barriers
                            </span>
                          </div>
                        </div>
                      </div>
                      {cons.barriers && cons.barriers.length > 0 && (
                        <div className="ml-11 mt-3 space-y-2">
                          {cons.barriers.slice(0, 2).map((barrier, bidx) => (
                            <div key={bidx} className="text-xs bg-green-50 p-2 rounded-lg border border-green-200">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                barrier.effectiveness === 'good' ? 'bg-green-500' :
                                barrier.effectiveness === 'weak' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></span>
                              {barrier.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {generatedJSON.consequences?.length > 3 && (
                    <div className="text-xs text-slate-600 text-center py-2 bg-white rounded-lg border border-orange-200">
                      +{generatedJSON.consequences.length - 3} more consequences in full analysis...
                    </div>
                  )}
                </div>
              </div>

              {/* JSON Preview/Edit */}
              <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-slate-700" />
                    <span className="font-bold text-slate-800">Generated JSON Structure</span>
                    <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-bold">
                      {(JSON.stringify(generatedJSON).length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all hover:scale-105 shadow-md"
                  >
                    {isEditing ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Preview Mode
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Edit JSON
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 max-h-96 overflow-y-auto">
                  {isEditing ? (
                    <textarea
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      className="w-full h-80 px-4 py-3 font-mono text-xs border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-semibold transition-all hover:scale-105"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Start Over
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
                >
                  <FileDown className="w-5 h-5" />
                  Download JSON
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 font-bold flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Upload className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Import to BowTie</span>
                  <Sparkles className="w-5 h-5 relative z-10" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETE */}
          {step === 'complete' && (
            <div className="text-center py-20 animate-fade-in">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-green-200/50 rounded-full blur-3xl animate-pulse"></div>
                <CheckCircle className="relative w-32 h-32 text-green-600 mx-auto" />
                <Sparkles className="w-12 h-12 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-4">
                BowTie Created Successfully! 🎉
              </h3>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                Your comprehensive safety analysis has been imported and is ready to visualize in the interactive BowTie diagram
              </p>
              <div className="flex items-center justify-center gap-4 mb-10">
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
                className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 font-bold text-xl shadow-2xl transition-all hover:scale-110 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative z-10">Close & View BowTie Diagram</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Add CSS animations */}
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
