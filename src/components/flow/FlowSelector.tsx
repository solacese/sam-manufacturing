'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { getFlowsByIndustry } from '@/data/flow-generator'
import { INDUSTRY_LABELS } from '@/lib/constants'
import { Industry } from '@/types'
import { Factory } from 'lucide-react'

const flowsByIndustry = getFlowsByIndustry()
const industries = Object.keys(flowsByIndustry) as Industry[]
const allFlows = Object.values(flowsByIndustry).flat()

export function FlowSelector() {
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const selectFlow = useSimulationStore((s) => s.selectFlow)

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
        <Factory className="h-3.5 w-3.5 text-[#00c895]" />
        Production Flow
      </div>
      <select value={selectedFlow?.id || ''} onChange={(e) => { const f = allFlows.find((f) => f.id === e.target.value); if (f) selectFlow(f) }}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-[12px] text-slate-200 outline-none focus:border-[#00c895] focus:ring-1 focus:ring-[#00c895]/30 transition-all cursor-pointer">
        <option value="" disabled>Select from {allFlows.length} flows...</option>
        {industries.map((ind) => (
          <optgroup key={ind} label={INDUSTRY_LABELS[ind]}>
            {flowsByIndustry[ind].map((f) => <option key={f.id} value={f.id}>{f.category} — {f.name.split(' — ')[1]} ({f.plant})</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
