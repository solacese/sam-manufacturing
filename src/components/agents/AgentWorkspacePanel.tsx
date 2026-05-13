'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { AgentTimeline } from './AgentTimeline'
import { ResolutionSummary } from './ResolutionSummary'
import { OrchestratorChat } from './OrchestratorChat'
import { MeshTopology } from './MeshTopology'
import { Network, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AGENT_NAMES, AGENT_COLORS } from '@/lib/constants'
import { AgentRole, DisruptionCategory } from '@/types'
import { cn } from '@/lib/cn'

const agentRoles: AgentRole[] = ['orchestrator', 'maintenance', 'scheduling', 'quality', 'supplier', 'safety', 'logistics', 'digital-twin', 'predictive']
const catColors: Record<DisruptionCategory, string> = {
  'machine-breakdown': 'bg-red-500/15 border-red-500/40 text-red-300',
  'supply-chain': 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  'quality-issue': 'bg-violet-500/15 border-violet-500/40 text-violet-300',
  'personnel': 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  'environmental': 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
}

export function AgentWorkspacePanel() {
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const agentMessages = useSimulationStore((s) => s.agentMessages)
  const resolutionComplete = useSimulationStore((s) => s.resolutionComplete)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const lastDisruption = activeDisruptions[activeDisruptions.length - 1]
  const hasDisruptions = activeDisruptions.length > 0

  return (
    <div className="flex h-full flex-col bg-[#080d1a]">
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b border-slate-800 bg-[#0f1729]">
        <div className="h-5 w-5 rounded bg-[#00c895] flex items-center justify-center"><Network className="h-3 w-3 text-white" /></div>
        <span className="text-[10px] font-bold text-white">Agent Mesh Coordination</span>
        {hasDisruptions && <span className={cn('ml-auto text-[9px] font-bold rounded-full px-2 py-0.5 border', isResolving ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-[#00c895] bg-[#00c895]/10 border-[#00c895]/30')}>{isResolving ? `${activeDisruptions.length} active` : 'resolved'}</span>}
      </div>

      {hasDisruptions && (
        <div className="flex-shrink-0 border-b border-slate-800 px-3 py-2 bg-slate-900/50">
          <div className="flex items-center gap-1.5 mb-1">
            {isResolving ? <AlertCircle className="h-3 w-3 text-amber-400 animate-pulse" /> : <CheckCircle2 className="h-3 w-3 text-[#00c895]" />}
            <span className={cn('text-[9px] font-bold', isResolving ? 'text-amber-300' : 'text-[#00c895]')}>
              {isResolving ? `Coordinating ${activeDisruptions.length} parallel resolutions` : `${activeDisruptions.length} resolved`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {activeDisruptions.map((d) => (
              <span key={d.id} className={cn('inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-semibold', catColors[d.category])}>
                {isResolving && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                {d.name}
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: isResolving ? `${Math.min(90, agentMessages.length * 8)}%` : '100%',
                  backgroundColor: isResolving ? '#f59e0b' : '#00c895',
                }}
              />
            </div>
            <span className="text-[8px] text-slate-500 font-mono">{agentMessages.length} msgs</span>
          </div>
        </div>
      )}

      {/* Mesh topology visualization */}
      {(hasDisruptions || agentMessages.length === 0) && (
        <div className="flex-shrink-0 border-b border-slate-800 px-3 py-1">
          <MeshTopology active={isResolving} activeAgents={[...new Set(agentMessages.map(m => m.fromAgent))]} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        {!hasDisruptions && agentMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-[11px] font-medium text-slate-400 mb-1">Agents Standing By</p>
            <p className="text-[9px] text-slate-500">Inject disruptions to activate the mesh</p>
          </div>
        )}
        {agentMessages.length > 0 && <AgentTimeline messages={agentMessages} />}
        {resolutionComplete && lastDisruption && <ResolutionSummary kpis={lastDisruption.kpis} />}
      </div>

      <div className="flex-shrink-0 border-t border-slate-800 px-3 py-2">
        <OrchestratorChat />
      </div>
    </div>
  )
}
