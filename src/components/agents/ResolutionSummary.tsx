'use client'

import { ResolutionKPIs } from '@/types'
import { CheckCircle } from 'lucide-react'

export function ResolutionSummary({ kpis }: { kpis: ResolutionKPIs }) {
  return (
    <div className="mt-2 rounded-lg border border-[#00c895]/30 bg-[#00c895]/5 p-2 animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2">
        <CheckCircle className="h-3.5 w-3.5 text-[#00c895]" />
        <span className="text-[9px] font-bold text-[#00c895] uppercase tracking-wider">Resolved</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <Kpi label="Detect" value={kpis.timeToDetect} />
        <Kpi label="Resolve" value={kpis.timeToResolve} />
        <Kpi label="Recovery" value={kpis.productionRecovery} />
        <Kpi label="Cost" value={kpis.costImpact} />
        <Kpi label="Units" value={String(kpis.unitsAffected)} />
      </div>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-800/50 px-1.5 py-1">
      <div className="text-[7px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-[10px] font-bold text-white font-mono">{value}</div>
    </div>
  )
}
