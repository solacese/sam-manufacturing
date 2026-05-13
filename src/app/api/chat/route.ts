import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/llm'

export async function POST(request: Request) {
  try {
    const { message, flow, disruptions, recentMessages } = await request.json()

    const flowContext = flow
      ? `Current production flow: "${flow.category}" at ${flow.plant}/${flow.line}. Steps: ${flow.steps.map((s: { name: string }) => s.name).join(' → ')}. Cycle: ${flow.cycleTime}, Takt: ${flow.taktTime}, FPY: ${flow.firstPassYield}%`
      : 'No flow currently selected.'

    const disruptionContext = disruptions?.length > 0
      ? `Active disruptions: ${disruptions.map((d: { name: string; severity: string }) => `${d.name} (${d.severity})`).join(', ')}`
      : 'No active disruptions.'

    const messagesContext = recentMessages?.length > 0
      ? `Recent agent activity:\n${recentMessages.slice(-5).map((m: { fromAgent: string; content: string }) => `- ${m.fromAgent}: ${m.content.slice(0, 100)}`).join('\n')}`
      : ''

    const systemPrompt = `You are the Orchestrator Agent in a Solace Agent Mesh manufacturing intelligence platform. You coordinate 8 specialized agents: Maintenance, Scheduling, Quality Control, Supplier Management, Safety & Compliance, Logistics, Digital Twin, and Predictive Analytics.

You communicate via Solace Platform event mesh using A2A protocol topics.

${flowContext}
${disruptionContext}
${messagesContext}

Respond concisely (2-4 sentences) with deep manufacturing expertise. Use terminology like OEE, MTBF, MTTR, Cpk, takt time, cycle time, FPY, SPC, SCADA, PLC, FMEA, CAPA, Kanban, JIT, BOM, work order, lot traceability.

If asked about optimizations, reference specific agents you'd delegate to.
If asked about status, reference real metrics and current flow state.
If asked what-if scenarios, describe which agents you'd invoke via A2A protocol.`

    const result = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ], { temperature: 0.7, maxTokens: 500 })

    return NextResponse.json({ response: result })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
