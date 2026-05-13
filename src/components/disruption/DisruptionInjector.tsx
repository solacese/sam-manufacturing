'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { disruptions } from '@/data/disruption-scenarios'
import { Disruption, DisruptionCategory } from '@/types'
import { cn } from '@/lib/cn'
import { AlertTriangle, Truck, Gauge, Users, Thermometer, Wrench, Bot, CheckCircle2 } from 'lucide-react'

const icons: Record<DisruptionCategory, React.ReactNode> = { 'machine-breakdown': <Wrench className="h-3.5 w-3.5" />, 'supply-chain': <Truck className="h-3.5 w-3.5" />, 'quality-issue': <Gauge className="h-3.5 w-3.5" />, 'personnel': <Users className="h-3.5 w-3.5" />, 'environmental': <Thermometer className="h-3.5 w-3.5" /> }
const colors: Record<DisruptionCategory, string> = { 'machine-breakdown': 'hover:bg-red-500/15 hover:border-red-500/50 text-red-400', 'supply-chain': 'hover:bg-amber-500/15 hover:border-amber-500/50 text-amber-400', 'quality-issue': 'hover:bg-violet-500/15 hover:border-violet-500/50 text-violet-400', 'personnel': 'hover:bg-blue-500/15 hover:border-blue-500/50 text-blue-400', 'environmental': 'hover:bg-emerald-500/15 hover:border-emerald-500/50 text-emerald-400' }

export function DisruptionInjector() {
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const injectDisruption = useSimulationStore((s) => s.injectDisruption)
  const reset = useSimulationStore((s) => s.reset)
  const resolutionComplete = useSimulationStore((s) => s.resolutionComplete)
  const [flash, setFlash] = useState(false)

  function handleInject(d: Disruption) {
    if (!selectedFlow) return
    if (resolutionComplete) reset()
    const instance = { ...d, id: `${d.id}-${Date.now()}` }
    injectDisruption(instance)
    setFlash(true)
    setTimeout(() => setFlash(false), 300)
  }

  return (
    <div className={cn('transition-all duration-300', flash && 'ring-1 ring-red-500/50 rounded-lg')}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
        <span className="text-[10px] font-bold text-slate-300">Inject Disruption</span>
        <span className="text-[9px] text-slate-600">(spam away)</span>
        {isResolving && (
          <span className="ml-auto flex items-center gap-1.5 text-[9px] text-amber-300 font-semibold bg-amber-500/10 rounded-full px-2 py-0.5 border border-amber-500/30">
            <Bot className="h-3 w-3 animate-pulse" />{activeDisruptions.length} resolving
          </span>
        )}
        {resolutionComplete && !isResolving && (
          <span className="ml-auto flex items-center gap-1.5 text-[9px] text-[#00c895] font-semibold bg-[#00c895]/10 rounded-full px-2 py-0.5 border border-[#00c895]/30">
            <CheckCircle2 className="h-3 w-3" />All resolved
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {disruptions.map((d) => (
          <button key={d.id} onClick={() => handleInject(d)} disabled={!selectedFlow}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all border-slate-700/60 bg-slate-800/40',
              'cursor-pointer active:scale-90 hover:shadow-lg disabled:opacity-25 disabled:cursor-not-allowed',
              colors[d.category]
            )}>
            {icons[d.category]}
            <span className="text-[10px] font-medium leading-tight line-clamp-1">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
