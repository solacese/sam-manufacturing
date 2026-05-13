import { NextResponse } from 'next/server'
import { callLLM, extractJSON } from '@/lib/llm'

export async function POST(request: Request) {
  try {
    const { prompt, flow } = await request.json()

    const flowContext = flow
      ? `Manufacturing flow: "${flow.category}" at ${flow.plant}/${flow.line}. Steps: ${flow.steps.map((s: { name: string }, i: number) => `[${i}] ${s.name}`).join(', ')}.`
      : ''

    const systemPrompt = `You are a manufacturing process engineer creating disruption scenarios for a Solace Agent Mesh demo.

Given a user's description of a manufacturing problem, generate a realistic disruption scenario.

${flowContext}

Output ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "name": "short title (3-5 words)",
  "category": "machine-breakdown" | "supply-chain" | "quality-issue" | "personnel" | "environmental",
  "severity": "low" | "medium" | "high" | "critical",
  "description": "2-3 sentence technical description using manufacturing terminology (MES, OEE, SCADA, PLC, SPC, FMEA, CAPA, CMMS, IoT, etc.)",
  "affectedSteps": [array of step indices affected, 0-based],
  "kpis": {
    "timeToDetect": "e.g. < 200ms",
    "timeToResolve": "e.g. 2.5 hours",
    "costImpact": "e.g. €12,400",
    "productionRecovery": "e.g. 92%",
    "unitsAffected": number
  }
}

Make it realistic, technical, and specific. Use industry-standard terminology.`

    const result = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ], { temperature: 0.8 })

    const json = extractJSON(result)
    const disruption = JSON.parse(json)
    disruption.id = `dis-llm-${Date.now()}`
    disruption.resolutionScript = []

    return NextResponse.json(disruption)
  } catch (error) {
    console.error('Generate disruption error:', error)
    return NextResponse.json({ error: 'Failed to generate disruption' }, { status: 500 })
  }
}
