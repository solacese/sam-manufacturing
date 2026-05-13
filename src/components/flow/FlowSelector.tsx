'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { getFlowsByIndustry } from '@/data/flow-generator'
import { INDUSTRY_LABELS } from '@/lib/constants'
import { Industry } from '@/types'

const flowsByIndustry = getFlowsByIndustry()
const industries = Object.keys(flowsByIndustry) as Industry[]

export function FlowSelector() {
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const selectFlow = useSimulationStore((s) => s.selectFlow)
  const allFlows = Object.values(flowsByIndustry).flat()

  return (
    <select value={selectedFlow?.id || ''} onChange={(e) => { const f = allFlows.find((f) => f.id === e.target.value); if (f) selectFlow(f) }}
      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-[#00c895] focus:ring-1 focus:ring-[#00c895]/30 transition-all">
      <option value="" disabled>Select from {allFlows.length} manufacturing flows...</option>
      {industries.map((ind) => (
        <optgroup key={ind} label={INDUSTRY_LABELS[ind]}>
          {flowsByIndustry[ind].map((f) => <option key={f.id} value={f.id}>{f.category} — {f.name.split(' — ')[1]} ({f.plant})</option>)}
        </optgroup>
      ))}
    </select>
  )
}
