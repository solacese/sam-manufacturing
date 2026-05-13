'use client'

import { ResolutionKPIs } from '@/types'
import { CheckCircle, Clock, DollarSign, TrendingUp, Package, Timer, Zap } from 'lucide-react'

export function ResolutionSummary({ kpis }: { kpis: ResolutionKPIs }) {
  return (
    <div className="mt-3 rounded-xl border border-[#00c895]/30 bg-[#00c895]/5 p-3 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 w-6 rounded-full bg-[#00c895]/20 flex items-center justify-center">
          <CheckCircle className="h-3.5 w-3.5 text-[#00c895]" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#00c895] uppercase tracking-wider block">Resolution Complete</span>
          <span className="text-[8px] text-slate-400">Multi-agent coordination via Solace A2A protocol</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <KpiCard icon={<Timer className="h-3 w-3 text-cyan-400" />} label="Time to Detect" value={kpis.timeToDetect} highlight />
        <KpiCard icon={<Clock className="h-3 w-3 text-indigo-400" />} label="Time to Resolve" value={kpis.timeToResolve} />
        <KpiCard icon={<DollarSign className="h-3 w-3 text-amber-400" />} label="Cost Impact" value={kpis.costImpact} />
        <KpiCard icon={<TrendingUp className="h-3 w-3 text-[#00c895]" />} label="Recovery" value={kpis.productionRecovery} highlight />
        <KpiCard icon={<Package className="h-3 w-3 text-violet-400" />} label="Units Affected" value={String(kpis.unitsAffected)} />
      </div>

      {/* SAM vs Manual comparison */}
      <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Zap className="h-3 w-3 text-[#00c895]" />
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">SAM vs Manual Response</span>
        </div>
        <div className="space-y-1">
          <CompareBar label="Detection" sam="< 1s" manual="~15 min" samPct={95} />
          <CompareBar label="Coordination" sam="Instant" manual="~45 min" samPct={98} />
          <CompareBar label="Resolution" sam={kpis.timeToResolve} manual="4-8 hours" samPct={75} />
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/30 text-[8px] text-slate-400 text-center">
          Estimated savings: <span className="text-[#00c895] font-bold">3-6 hours</span> per incident · <span className="text-[#00c895] font-bold">{kpis.costImpact}</span> protected
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-800/50 px-2.5 py-1.5 animate-count-up">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[7px] uppercase tracking-wider text-slate-500 font-medium">{label}</span>
      </div>
      <div className={`text-[12px] font-bold font-mono ${highlight ? 'text-[#00c895]' : 'text-white'}`}>{value}</div>
    </div>
  )
}

function CompareBar({ label, sam, manual, samPct }: { label: string; sam: string; manual: string; samPct: number }) {
  return (
    <div className="flex items-center gap-2 text-[8px]">
      <span className="w-[60px] text-slate-500">{label}</span>
      <div className="flex-1 flex items-center gap-1">
        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-[#00c895] transition-all duration-1000" style={{ width: `${samPct}%` }} />
        </div>
        <span className="text-[#00c895] font-bold w-[45px]">{sam}</span>
      </div>
      <span className="text-slate-500 w-[50px] text-right">{manual}</span>
    </div>
  )
}
