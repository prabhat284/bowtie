// api/analyze.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Groq API key from environment (server-side only)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not configured');
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const { description, mode } = req.body;

  // Validate input
  if (!description || description.length < 100) {
    return res.status(400).json({ 
      error: 'Please provide a detailed incident description (minimum 100 characters)' 
    });
  }

  // Map user-facing mode to actual Groq model (hidden from frontend)
  const modelMap = {
    'standard': 'llama-3.1-8b-instant',
    'advanced': 'llama-3.3-70b-versatile',
    'premium': 'llama-3.2-3b-preview'
  };

  const selectedModel = modelMap[mode] || modelMap.standard;

  // AI Analysis Prompt
  const ANALYSIS_PROMPT = `You are an expert safety engineer specializing in BowTie risk analysis for industrial facilities.

Given an incident description, generate a COMPLETE BowTie JSON structure.

REQUIREMENTS:
1. Hazard Event = Central critical moment
2. Threats = What CAUSES the hazard (3-6 threats)
3. Consequences = What HAPPENS after (3-4 consequences)
4. Barriers = Specific controls (2-3 per threat/consequence)
5. Digital Signals = Monitoring points (4-6 signals)

BARRIER QUALITY (CRITICAL):
✅ GOOD: "Smart LOTO device with QR validation"
✅ GOOD: "Gas detector with auto ventilation at 25 ppm"
❌ BAD: "Safety procedures" (too vague)
❌ BAD: "Training" (not measurable)

RETURN VALID JSON:
{
  "id": [random 5-digit 30000-39999],
  "name": "Brief project name (max 60 chars)",
  "department": "Infer from description",
  "owner": "Process Safety Team",
  "reviewDate": "YYYY-MM-DD (90 days from today)",
  "status": "active",
  "createdAt": "ISO timestamp now",
  "updatedAt": "ISO timestamp now",
  "riskLevel": "low|medium|high",
  "viewMode": "residual",
  "hazardEvent": "Clear critical event statement",
  "heroImage": "/bowtie/steel/images/generic-safety.jpg",
  "threats": [
    {
      "id": [base id + 11, 12...],
      "threat": "Clear cause description",
      "likelihood": "low|medium|high",
      "likelihood_inherent": "low|medium|high",
      "barriers": [
        {
          "text": "SPECIFIC measurable barrier",
          "owner": "Responsible role",
          "effectiveness": "good|weak|failed",
          "next_due_at": "YYYY-MM-DD",
          "findings_open": 0-5
        }
      ],
      "escalationFactors": ["factor 1", "factor 2"]
    }
  ],
  "consequences": [
    {
      "id": [base id + 21, 22...],
      "consequence": "Clear outcome description",
      "severity": "low|medium|high",
      "severity_inherent": "low|medium|high",
      "barriers": [
        {
          "text": "SPECIFIC mitigation barrier",
          "owner": "Responsible role",
          "effectiveness": "good|weak|failed",
          "next_due_at": "YYYY-MM-DD",
          "findings_open": 0-5
        }
      ],
      "escalationFactors": ["factor 1", "factor 2"]
    }
  ],
  "digitalSignals": [
    {
      "key": "variable.name",
      "source": "System name",
      "frequency": "realtime|hourly|daily|on_event",
      "description": "What it measures"
    }
  ],
  "notes": "AI-generated BowTie analysis. Review and validate before use."
}`;

  try {
    console.log(`[API] Analyzing incident with model: ${selectedModel}`);
    
    // Call Groq API (hidden from frontend)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: ANALYSIS_PROMPT },
          { role: 'user', content: description }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errorData);
      
      // Send generic error to frontend (don't expose Groq details)
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'AI system is busy. Please try again in a moment.' 
        });
      } else if (response.status === 401) {
        return res.status(500).json({ 
          error: 'AI service authentication error. Please contact support.' 
        });
      } else {
        return res.status(500).json({ 
          error: 'AI analysis service temporarily unavailable. Please try again.' 
        });
      }
    }

    const data = await response.json();
    console.log('[API] Analysis complete');
    
    // Parse and return result (no Groq references)
    const analysis = JSON.parse(data.choices[0].message.content);
    
    res.status(200).json({ 
      success: true,
      analysis: analysis,
      processingTime: data.usage?.total_time || 0
    });

  } catch (error) {
    console.error('[API] Error:', error);
    
    // Generic error message (hide technical details)
    res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again or contact support.' 
    });
  }
}
