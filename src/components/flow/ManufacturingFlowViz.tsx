'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { FlowStepStatus } from '@/types'
import { cn } from '@/lib/cn'

const statusStyles: Record<FlowStepStatus, string> = {
  idle: 'bg-slate-800/50 border-slate-700',
  running: 'bg-slate-800/80 border-[#00c895]/40',
  warning: 'bg-amber-950/30 border-amber-500/40',
  error: 'bg-red-950/40 border-red-500/60 animate-error-pulse',
  complete: 'bg-cyan-950/30 border-cyan-500/40',
}

const dotColors: Record<FlowStepStatus, string> = {
  idle: 'bg-slate-500',
  running: 'bg-[#00c895]',
  warning: 'bg-amber-400',
  error: 'bg-red-500',
  complete: 'bg-cyan-400',
}

function MiniGauge({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1 w-full rounded-full bg-slate-700 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

export function ManufacturingFlowViz() {
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const flowStepStatuses = useSimulationStore((s) => s.flowStepStatuses)

  if (!selectedFlow) return <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select a flow</div>

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-2 rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-1.5">
        <h3 className="text-[11px] font-bold text-white">{selectedFlow.category}</h3>
        <span className="text-[9px] text-slate-500 font-mono">{selectedFlow.plant}/{selectedFlow.line}</span>
        <div className="ml-auto flex gap-3">
          <MetricPill label="OEE" value="87.2%" accent />
          <MetricPill label="Avail" value="94.1%" />
          <MetricPill label="Perf" value="96.3%" />
          <MetricPill label="Qual" value="96.2%" />
          <MetricPill label="Takt" value={selectedFlow.taktTime} />
          <MetricPill label="FPY" value={`${selectedFlow.firstPassYield.toFixed(1)}%`} accent />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 content-start">
        {selectedFlow.steps.map((step, idx) => {
          const status = flowStepStatuses[idx] || 'running'
          const metrics = step.metrics || {}
          const metricEntries = Object.entries(metrics).slice(0, 2)
          return (
            <div key={step.id} className={cn('relative rounded-lg border p-2.5 transition-all duration-300', statusStyles[status])}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn('h-2 w-2 rounded-full', dotColors[status])} />
                <span className="text-[10px] font-bold text-slate-200 truncate">{step.name}</span>
                <span className="ml-auto text-[8px] font-mono text-slate-500">{step.duration}</span>
              </div>
              {metricEntries.map(([key, val]) => (
                <div key={key} className="mb-1">
                  <div className="flex justify-between text-[8px]"><span className="text-slate-500 capitalize">{key}</span><span className="text-slate-300 font-mono">{val as number}</span></div>
                  <MiniGauge value={val as number} max={key === 'temperature' ? 300 : key === 'efficiency' || key === 'passRate' ? 100 : 1000} color={status === 'error' ? '#ef4444' : '#00c895'} />
                </div>
              ))}
              <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-slate-900 border border-[#00c895] flex items-center justify-center">
                <span className="text-[7px] font-bold text-[#00c895]">{idx + 1}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MetricPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="text-[9px] font-mono">
      <span className="text-slate-500">{label} </span>
      <span className={accent ? 'text-[#00c895] font-bold' : 'text-slate-200'}>{value}</span>
    </span>
  )
}
