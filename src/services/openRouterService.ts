const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const BASE_URL = 'https://openrouter.ai/api/v1';

const headers = {
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  'X-Title': 'Actionify Meeting Analysis',
};

export interface AnalysisResult {
  summary: {
    executive: string;
    keyPoints: string[];
    topics: string[];
  };
  actionItems: Array<{
    id: string;
    task: string;
    assignee: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    context: string;
    confidence: number;
  }>;
  decisions: Array<{
    id: string;
    decision: string;
    category: string;
    confidence: string;
    context: string;
    participants: string[];
  }>;
}

export const analyzeMeetingContent = async (transcript: string): Promise<AnalysisResult> => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('Missing VITE_OPENROUTER_API_KEY. Please set it in your environment.');
    }
    const prompt = `
    Analyze this meeting transcript and extract the following information:

    TRANSCRIPT:
    ${transcript}

    Please provide a JSON response with the following structure:
    {
      "summary": {
        "executive": "One sentence executive summary",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
        "topics": ["Topic 1", "Topic 2", "Topic 3"]
      },
      "actionItems": [
        {
          "id": "action-1",
          "task": "Specific task description",
          "assignee": "Person responsible",
          "deadline": "When it's due",
          "priority": "high|medium|low",
          "context": "Additional context",
          "confidence": 0.95
        }
      ],
      "decisions": [
        {
          "id": "decision-1",
          "decision": "What was decided",
          "category": "strategic|operational|technical",
          "confidence": "high|medium|low",
          "context": "Context of the decision",
          "participants": ["Person1", "Person2"]
        }
      ]
    }

    Focus on:
    1. Clear, actionable tasks with specific assignees
    2. Important decisions made during the meeting
    3. Key topics discussed
    4. Executive summary that captures the essence
    `;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    // Try robust JSON extraction to handle code fences or extra text
    const parsed = safelyParseJsonFromText(content);
    if (parsed) return parsed as AnalysisResult;

    // Fallback to a basic structure
    return {
      summary: {
        executive: 'Meeting analysis completed',
        keyPoints: ['Analysis in progress'],
        topics: ['General discussion']
      },
      actionItems: [],
      decisions: []
    };
  } catch (error) {
    console.error('Error analyzing content with OpenRouter:', error);
    throw error;
  }
};

export const generateSentimentAnalysis = async (transcript: string): Promise<any> => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('Missing VITE_OPENROUTER_API_KEY. Please set it in your environment.');
    }
    const prompt = `
    Analyze the sentiment and engagement in this meeting transcript:

    ${transcript}

    Provide a JSON response with:
    {
      "overall": {
        "sentiment": "positive|neutral|negative",
        "score": 0.75,
        "confidence": 0.9
      },
      "speakers": {
        "Speaker1": {
          "averageSentiment": 0.8,
          "engagement": 0.85,
          "dominance": 30
        }
      }
    }
    `;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    const parsed = safelyParseJsonFromText(content);
    if (parsed) return parsed;

    return {
      overall: {
        sentiment: 'neutral',
        score: 0.5,
        confidence: 0.7
      },
      speakers: {}
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

function safelyParseJsonFromText(text: string): unknown | null {
  if (!text) return null;
  // Quick attempt
  try {
    return JSON.parse(text);
  } catch {}

  // Strip common markdown fences
  const fenceMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch {}
  }

  // Attempt to extract first JSON object or array
  const start = Math.min(
    ...[...['{', '[']]
      .map(c => text.indexOf(c))
      .filter(i => i >= 0)
  );
  const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (start >= 0 && end > start) {
    const candidate = text.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}