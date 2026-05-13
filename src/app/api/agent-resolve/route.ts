import { NextResponse } from 'next/server'
import { callLLM, extractJSON } from '@/lib/llm'

export async function POST(request: Request) {
  try {
    const { disruption, flow } = await request.json()

    const flowContext = flow
      ? `Production flow: "${flow.category}" at ${flow.plant}/${flow.line}. Steps: ${flow.steps.map((s: { name: string }, i: number) => `[${i}] ${s.name}`).join(', ')}. Cycle time: ${flow.cycleTime}, FPY: ${flow.firstPassYield}%`
      : ''

    const systemPrompt = `You are simulating a Solace Agent Mesh with 9 specialized AI agents resolving a manufacturing disruption via event-driven A2A protocol over Solace Platform.

Agents available:
- orchestrator: Decomposes tasks, routes to specialists, coordinates resolution
- maintenance: CMMS integration, spare parts, work orders, LOTO procedures
- scheduling: Production scheduling, capacity planning, route alternatives
- quality: SPC analysis, CAPA workflows, FMEA, NCR generation
- supplier: AVL queries, alternative sourcing, PO management
- safety: Safety protocols, compliance checks, incident reporting
- logistics: WMS, material flow, Kanban signals, AGV routing
- digital-twin: Simulation, impact prediction, what-if analysis
- predictive: Anomaly detection, RUL estimation, trend analysis

${flowContext}

Disruption: "${disruption.name}" — ${disruption.description}
Severity: ${disruption.severity}
Affected steps: ${disruption.affectedSteps?.join(', ') || 'multiple'}

Generate 8-12 agent messages showing the multi-agent coordination. Output ONLY a JSON array (no markdown):
[
  { "fromAgent": "orchestrator", "type": "event-detected", "content": "...", "status": "complete" },
  { "fromAgent": "orchestrator", "type": "task-decomposition", "content": "...", "status": "complete" },
  { "fromAgent": "orchestrator", "toAgent": "maintenance", "type": "delegation", "content": "...", "status": "complete" },
  ...
]

Valid types: event-detected, task-decomposition, delegation, analysis, action, resolution, a2a-request, a2a-response
Valid agents: orchestrator, maintenance, scheduling, quality, supplier, safety, logistics, digital-twin, predictive

Rules:
- Start with orchestrator detecting the event
- Then orchestrator decomposes into sub-tasks
- Then delegate to 3-5 different specialist agents
- Each specialist performs analysis or action
- End with orchestrator giving final resolution summary
- Use highly technical manufacturing language (MTBF, Cpk, OEE, SCADA, PLC fault codes, etc.)
- Include specific numbers, part numbers, timelines, and costs
- Make it feel like real autonomous agents coordinating`

    const result = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Resolve this disruption: ${disruption.name} — ${disruption.description}` },
    ], { temperature: 0.7, maxTokens: 6000 })

    let messages
    try {
      const json = extractJSON(result)
      messages = JSON.parse(json)
    } catch (parseErr) {
      console.error('JSON parse failed, raw result:', result.slice(0, 500))
      messages = [
        { fromAgent: 'orchestrator', type: 'event-detected', content: `CRITICAL: ${disruption.name} detected. Initiating Solace Agent Mesh multi-agent resolution.`, status: 'complete' },
        { fromAgent: 'orchestrator', type: 'resolution', content: result.slice(0, 300), status: 'complete' },
      ]
    }

    return NextResponse.json({ messages })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Agent resolve error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
