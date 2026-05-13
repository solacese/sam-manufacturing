'use client'

import { useState, useEffect } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Activity, Wifi, Network, Zap, RotateCcw, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import { AutoDemo } from './AutoDemo'

export function Header() {
  const events = useSimulationStore((s) => s.events)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const agentMessages = useSimulationStore((s) => s.agentMessages)
  const resolutionComplete = useSimulationStore((s) => s.resolutionComplete)
  const reset = useSimulationStore((s) => s.reset)
  const [totalResolved, setTotalResolved] = useState(0)

  useEffect(() => {
    if (resolutionComplete && activeDisruptions.length > 0) {
      setTotalResolved(prev => prev + activeDisruptions.length)
    }
  }, [resolutionComplete])

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between border-b border-slate-800 bg-[#0f1729] px-5">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#00c895"/>
          <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="1.5" fill="white"/>
        </svg>
        <div>
          <h1 className="text-sm font-bold text-white">Solace <span className="text-[#00c895]">Agent+Event Mesh</span></h1>
          <p className="text-[9px] text-slate-500">for Manufacturing</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-400">
        <AutoDemo />

        <Link href="/architecture" className="flex items-center gap-1.5 text-[#00c895] hover:text-white transition-colors font-semibold text-[10px]">
          <Network className="h-3 w-3" />Architecture
        </Link>

        <div className="h-4 w-px bg-slate-700" />

        <span className="flex items-center gap-1.5 font-mono">
          <Activity className="h-3 w-3 text-[#00c895]" />
          <span className="tabular-nums">{events.length.toLocaleString()}</span>
          {totalResolved > 0 && <span className="text-[#00c895] font-bold">· {totalResolved} resolved</span>}
        </span>

        <span className="flex items-center gap-1.5 font-mono">
          <Wifi className="h-3 w-3 text-[#00c895]" />
          Solace Platform
          <span className="h-2 w-2 rounded-full bg-[#00c895] animate-pulse" />
          <span className="text-slate-600">|</span>
          <span className="tabular-nums text-slate-400">{isResolving ? '12' : '8'}ms</span>
        </span>

        {isResolving && (
          <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-0.5 text-amber-300 font-semibold">
            <Zap className="h-3 w-3" />
            {activeDisruptions.length} event{activeDisruptions.length > 1 ? 's' : ''} · {agentMessages.length} A2A
          </span>
        )}

        <button onClick={reset} className="text-slate-500 hover:text-white transition-colors" title="Reset">
          <RotateCcw className="h-3 w-3" />
        </button>
        <button onClick={() => document.documentElement.requestFullscreen?.()} className="text-slate-500 hover:text-white transition-colors" title="Fullscreen">
          <Maximize2 className="h-3 w-3" />
        </button>
      </div>
    </header>
  )
}
