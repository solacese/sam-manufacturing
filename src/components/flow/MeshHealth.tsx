'use client'

import { useEffect, useState } from 'react'
import { Activity, Server, Cpu, GitBranch, Shield } from 'lucide-react'
import { useSimulationStore } from '@/store/simulation-store'

export function MeshHealth() {
  const events = useSimulationStore((s) => s.events)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const [throughput, setThroughput] = useState(24800)
  const [sessionTotal, setSessionTotal] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput(Math.round(23000 + Math.random() * 4000))
      setSessionTotal(prev => prev + Math.floor(Math.random() * 50) + 20)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 text-[8px] font-mono text-slate-500 mt-1 px-1 py-1 rounded bg-slate-800/30 border border-slate-800/50">
      <span className="flex items-center gap-1">
        <Activity className="h-2.5 w-2.5 text-[#00c895]" />
        <span className="text-slate-400 font-bold">Event Mesh</span>
      </span>
      <span className="flex items-center gap-0.5"><Server className="h-2.5 w-2.5" />{events.length > 200 ? '847' : String(Math.min(events.length * 3, 500))} topics</span>
      <span className="flex items-center gap-0.5"><Cpu className="h-2.5 w-2.5" /><span className="tabular-nums">{throughput.toLocaleString()}</span> msg/s</span>
      <span className="flex items-center gap-0.5"><GitBranch className="h-2.5 w-2.5" />6 brokers</span>
      <span className="flex items-center gap-0.5"><Shield className="h-2.5 w-2.5" /><span className="tabular-nums text-slate-400">{sessionTotal.toLocaleString()}</span> processed</span>
      {isResolving && <span className="text-amber-400 font-bold ml-auto">A2A ACTIVE</span>}
    </div>
  )
}
