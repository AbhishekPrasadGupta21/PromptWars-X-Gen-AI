import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API Key is not configured' },
        { status: 500 }
      );
    }

    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content provided for scanning' },
        { status: 400 }
      );
    }

    const prompt = `You are a cybersecurity expert analyzing the following text or URL for phishing, scam, and social engineering risks.
Return ONLY a highly structured, valid JSON object evaluating the threat level for the VERIFYGUARD dashboard, with NO MARKDOWN, NO BACKTICKS, and NO ADDITIONAL TEXT. 
Look for urgency, suspicious links, unknown sender contexts, payment demands, and grammatical errors.
Cross-reference the company name, recruiter name, and domain with live search results.
Generate a highly strategic, professional counter-interrogation email (honey-trap). Instead of a generic response, this email should act as "bait," asking the scammer for specific corporate verification markers (e.g., official procurement portal link, employer Tax ID/EIN, official corporate landline) tailored to the specific red flags detected.

The JSON MUST exactly match this schema:
{
  "isEntityVerifiedBySearch": boolean,
  "searchGroundingSummary": "string",
  "honeyTrapEmail": "string",
  "scamThreatIndex": number,
  "threatVectors": {
    "financial": number,
    "domain": number,
    "interview": number
  },
  "domainInfo": {
    "domain": "string",
    "ageDays": number,
    "registeredDate": "string",
    "registrarType": "string"
  },
  "redFlags": [
    {
      "title": "string",
      "category": "string",
      "severity": "CRITICAL|HIGH|MEDIUM",
      "excerpt": "string",
      "explanation": "string"
    }
  ],
  "actionPlan": [
    {
      "step": "string",
      "description": "string"
    }
  ]
}

Content to analyze:
"${content}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) {
      throw new Error('No response text received from Gemini');
    }

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedOutput = JSON.parse(text);
    return NextResponse.json(parsedOutput);
  } catch (error: any) {
    console.error('Scan API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
