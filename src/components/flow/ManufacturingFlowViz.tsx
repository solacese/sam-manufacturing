'use client'

import { useState, useEffect } from 'react'
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

  const [oee, setOee] = useState({ oee: 87.2, avail: 94.1, perf: 96.3, qual: 96.2 })

  useEffect(() => {
    const interval = setInterval(() => {
      setOee(prev => ({
        oee: +(prev.oee + (Math.random() - 0.5) * 0.4).toFixed(1),
        avail: +(prev.avail + (Math.random() - 0.5) * 0.3).toFixed(1),
        perf: +(prev.perf + (Math.random() - 0.5) * 0.3).toFixed(1),
        qual: +(prev.qual + (Math.random() - 0.5) * 0.2).toFixed(1),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!selectedFlow) return <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select a flow</div>

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-2 rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-1.5">
        <h3 className="text-[11px] font-bold text-white">{selectedFlow.category}</h3>
        <span className="text-[9px] text-slate-500 font-mono">{selectedFlow.plant}/{selectedFlow.line}</span>
        <div className="ml-auto flex gap-3">
          <MetricPill label="OEE" value={`${oee.oee}%`} accent />
          <MetricPill label="Avail" value={`${oee.avail}%`} />
          <MetricPill label="Perf" value={`${oee.perf}%`} />
          <MetricPill label="Qual" value={`${oee.qual}%`} />
          <MetricPill label="Takt" value={selectedFlow.taktTime} />
          <MetricPill label="FPY" value={`${selectedFlow.firstPassYield.toFixed(1)}%`} accent />
        </div>
      </div>

      {/* Flow direction indicator */}
      <div className="flex items-center gap-1 mb-1 text-[8px] text-slate-600">
        <span>Raw Materials</span>
        <span className="flex-1 border-t border-dashed border-slate-700 mx-1" />
        <span>→ Processing → Assembly → Quality →</span>
        <span className="flex-1 border-t border-dashed border-slate-700 mx-1" />
        <span>Finished Goods</span>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 content-start">
        {selectedFlow.steps.map((step, idx) => {
          const status = flowStepStatuses[idx] || 'running'
          const metrics = step.metrics || {}
          const metricEntries = Object.entries(metrics).slice(0, 2)
          return (
            <div key={step.id} className={cn('relative rounded-lg border p-2.5 transition-all duration-300 group hover:scale-[1.02] hover:z-10 animate-fade-in', statusStyles[status])} style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={cn('h-2 w-2 rounded-full', dotColors[status])} />
                <span className="text-[10px] font-bold text-slate-200 truncate">{step.name}</span>
                <span className="ml-auto text-[8px] font-mono text-slate-500">{step.duration}</span>
              </div>
              <p className="text-[8px] text-slate-500 mb-1.5 line-clamp-1 group-hover:line-clamp-none">{step.description}</p>
              {metricEntries.map(([key, val]) => (
                <div key={key} className="mb-1">
                  <div className="flex justify-between text-[8px]"><span className="text-slate-500 capitalize">{key}</span><span className="text-slate-300 font-mono">{val as number}</span></div>
                  <MiniGauge value={val as number} max={key === 'temperature' ? 300 : key === 'efficiency' || key === 'passRate' ? 100 : 1000} color={status === 'error' ? '#ef4444' : '#00c895'} />
                </div>
              ))}
              {status === 'error' && (
                <div className="mt-1 text-[8px] font-bold text-red-400 uppercase tracking-wider">DISRUPTED</div>
              )}
              <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-slate-900 border flex items-center justify-center" style={{ borderColor: status === 'error' ? '#ef4444' : '#00c895' }}>
                <span className="text-[7px] font-bold" style={{ color: status === 'error' ? '#ef4444' : '#00c895' }}>{idx + 1}</span>
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
