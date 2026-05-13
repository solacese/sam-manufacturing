import { NextResponse } from 'next/server'
import { callLLM, extractJSON } from '@/lib/llm'

export async function POST(request: Request) {
  try {
    const { industry, companyDescription } = await request.json()

    const systemPrompt = `You are a manufacturing systems architect. Generate a complete manufacturing flow with disruption scenarios for a demo.

Output ONLY valid JSON (no markdown, no explanation) matching this schema:
{
  "flow": {
    "id": "flow-custom-1",
    "name": "descriptive name",
    "industry": "${industry || 'automotive'}",
    "category": "category name",
    "plant": "plant-custom",
    "line": "line-1",
    "steps": [
      { "id": "step-c-0", "name": "Step Name", "description": "brief description", "duration": "X min", "status": "running", "metrics": { "metric1": number, "metric2": number } }
    ],
    "cycleTime": "X min",
    "taktTime": "X min",
    "firstPassYield": 97.2
  },
  "disruptions": [
    {
      "id": "dis-custom-1",
      "name": "short title",
      "category": "machine-breakdown|supply-chain|quality-issue|personnel|environmental",
      "severity": "low|medium|high|critical",
      "description": "2-3 sentences with manufacturing terminology",
      "affectedSteps": [step indices],
      "resolutionScript": [],
      "kpis": { "timeToDetect": "< Xms", "timeToResolve": "X hours", "costImpact": "€X", "productionRecovery": "X%", "unitsAffected": number }
    }
  ]
}

Requirements:
- Generate 6-8 realistic manufacturing steps for the flow
- Generate 3-4 disruption scenarios specific to this industry
- Use authentic terminology (MES, IoT, SCADA, PLC, OEE, SPC, etc.)
- Step metrics should match step types (thermal → temperature/pressure, machining → RPM/feedRate, quality → passRate/defectPpm)
- Make disruptions realistic for the specific industry and process`

    const result = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: companyDescription || `A ${industry} manufacturing company` },
    ], { temperature: 0.8, maxTokens: 6000 })

    const json = extractJSON(result)
    const scenario = JSON.parse(json)

    return NextResponse.json(scenario)
  } catch (error) {
    console.error('Generate scenario error:', error)
    return NextResponse.json({ error: 'Failed to generate scenario' }, { status: 500 })
  }
}
