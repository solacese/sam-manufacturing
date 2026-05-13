'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { BarChart3, X, CheckCircle } from 'lucide-react'

export function SessionSummary() {
  const [open, setOpen] = useState(false)
  const events = useSimulationStore((s) => s.events)

  const iotCount = events.filter(e => e.category === 'iot').length
  const mesCount = events.filter(e => e.category === 'mes').length
  const erpCount = events.filter(e => e.category === 'erp').length
  const logCount = events.filter(e => e.category === 'logistics').length
  const supCount = events.filter(e => e.category === 'supplier').length
  const disCount = events.filter(e => e.category === 'disruption').length

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-slate-500 hover:text-white transition-colors" title="Session summary">
        <BarChart3 className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 w-[500px] rounded-xl border border-slate-700 bg-[#0f1729] shadow-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[#00c895]" />
          Session Summary
        </h3>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <SumCard label="Total Events" value={events.length.toLocaleString()} color="#00c895" />
        <SumCard label="Disruptions Detected" value={String(disCount)} color="#ef4444" />
        <SumCard label="Protocols Used" value="5" color="#06b6d4" />
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        <MiniStat label="IoT" value={iotCount} color="#22d3ee" />
        <MiniStat label="MES" value={mesCount} color="#a78bfa" />
        <MiniStat label="ERP" value={erpCount} color="#fbbf24" />
        <MiniStat label="Logistics" value={logCount} color="#f97316" />
        <MiniStat label="Supplier" value={supCount} color="#06b6d4" />
      </div>

      <div className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-3">
        All events routed through the <span className="text-[#00c895] font-bold">Solace Agent+Event Mesh</span> with sub-millisecond latency
      </div>
    </div>
  )
}

function SumCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-center">
      <div className="text-[18px] font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className="text-[12px] font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-[7px] text-slate-500">{label}</div>
    </div>
  )
}
