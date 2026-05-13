'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { Activity, Wifi } from 'lucide-react'

export function Header() {
  const events = useSimulationStore((s) => s.events)
  const isResolving = useSimulationStore((s) => s.isResolving)

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
          <h1 className="text-sm font-bold text-white">Solace <span className="text-[#00c895]">Agent Mesh</span></h1>
          <p className="text-[9px] text-slate-400">Manufacturing Intelligence Platform</p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-[#00c895]" /><span className="font-mono">{events.length > 0 ? '3' : '0'} ev/s</span></span>
        <span className="flex items-center gap-1.5"><Wifi className="h-3 w-3 text-[#00c895]" /><span className="font-mono">PubSub+ Connected</span><span className="h-2 w-2 rounded-full bg-[#00c895]" /></span>
        {isResolving && <span className="flex items-center gap-1.5 text-amber-400 font-semibold"><span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />Agents Active</span>}
      </div>
    </header>
  )
}
