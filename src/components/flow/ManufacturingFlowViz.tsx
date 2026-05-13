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
  const [prevOee, setPrevOee] = useState({ oee: 87.2, avail: 94.1, perf: 96.3, qual: 96.2 })
  const errorCount = flowStepStatuses.filter(s => s === 'error').length

  useEffect(() => {
    const interval = setInterval(() => {
      const impact = errorCount * 3
      setOee(prev => {
        setPrevOee(prev)
        return {
          oee: +(Math.max(40, 87.2 - impact + (Math.random() - 0.5) * 0.4)).toFixed(1),
          avail: +(Math.max(50, 94.1 - impact * 1.2 + (Math.random() - 0.5) * 0.3)).toFixed(1),
          perf: +(Math.max(60, 96.3 - impact * 0.8 + (Math.random() - 0.5) * 0.3)).toFixed(1),
          qual: +(Math.max(70, 96.2 - impact * 0.5 + (Math.random() - 0.5) * 0.2)).toFixed(1),
        }
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [errorCount])

  if (!selectedFlow) return <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select a flow</div>

  const isCascade = errorCount >= 4

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stats bar */}
      <div className={cn('flex items-center gap-2 mb-2 rounded-lg border px-3 py-1.5 transition-all duration-500', isCascade ? 'bg-red-950/30 border-red-500/40' : 'bg-slate-800/60 border-slate-700/50')}>
        <h3 className="text-[11px] font-bold text-white">{selectedFlow.category}</h3>
        {isCascade && <span className="text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded px-1.5 py-0.5 animate-pulse">CASCADE FAILURE</span>}
        <span className="text-[9px] text-slate-500 font-mono">{selectedFlow.plant}/{selectedFlow.line}</span>
        <div className="ml-auto flex gap-3">
          <MetricPill label="OEE" value={`${oee.oee}%`} accent={oee.oee > 80} warn={oee.oee <= 80} trend={oee.oee > prevOee.oee ? 'up' : oee.oee < prevOee.oee ? 'down' : 'stable'} />
          <MetricPill label="Avail" value={`${oee.avail}%`} accent={oee.avail > 85} warn={oee.avail <= 85} trend={oee.avail > prevOee.avail ? 'up' : oee.avail < prevOee.avail ? 'down' : 'stable'} />
          <MetricPill label="Perf" value={`${oee.perf}%`} accent={oee.perf > 90} warn={oee.perf <= 90} trend={oee.perf > prevOee.perf ? 'up' : oee.perf < prevOee.perf ? 'down' : 'stable'} />
          <MetricPill label="Qual" value={`${oee.qual}%`} accent={oee.qual > 90} warn={oee.qual <= 90} trend={oee.qual > prevOee.qual ? 'up' : oee.qual < prevOee.qual ? 'down' : 'stable'} />
          <MetricPill label="Takt" value={selectedFlow.taktTime} />
          <MetricPill label="FPY" value={`${selectedFlow.firstPassYield.toFixed(1)}%`} accent />
        </div>
      </div>

      {/* Flow direction indicator */}
      <div className="flex items-center gap-1 mb-1 text-[8px] text-slate-600 relative">
        <span className="text-slate-500 font-medium">Raw Materials</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-[#00c895]/30 to-slate-700 mx-2 relative overflow-hidden">
          <div className="absolute top-0 h-px w-8 bg-[#00c895] animate-flow-particle" />
        </div>
        <span className="text-slate-500">Processing → Assembly → QC</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-[#00c895]/30 to-slate-700 mx-2 relative overflow-hidden">
          <div className="absolute top-0 h-px w-8 bg-[#00c895] animate-flow-particle" style={{ animationDelay: '1.5s' }} />
        </div>
        <span className="text-slate-500 font-medium">Finished Goods</span>
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
              {status === 'complete' && (
                <div className="mt-1 text-[8px] font-bold text-cyan-400 uppercase tracking-wider animate-fade-in">RECOVERED</div>
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

function MetricPill({ label, value, accent, warn, trend }: { label: string; value: string; accent?: boolean; warn?: boolean; trend?: 'up' | 'down' | 'stable' }) {
  return (
    <span className="text-[9px] font-mono tabular-nums transition-colors duration-500">
      <span className="text-slate-500">{label} </span>
      <span className={cn(warn ? 'text-red-400 font-bold' : accent ? 'text-[#00c895] font-bold' : 'text-slate-200')}>{value}</span>
      {trend === 'up' && <span className="text-[#00c895] ml-0.5">↑</span>}
      {trend === 'down' && <span className="text-red-400 ml-0.5">↓</span>}
    </span>
  )
}
