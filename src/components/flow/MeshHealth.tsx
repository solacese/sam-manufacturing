'use client'

import { useEffect, useState } from 'react'
import { Activity, Server, Cpu } from 'lucide-react'
import { useSimulationStore } from '@/store/simulation-store'

export function MeshHealth() {
  const events = useSimulationStore((s) => s.events)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const [throughput, setThroughput] = useState(24800)

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput(Math.round(23000 + Math.random() * 4000))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-[8px] font-mono text-slate-500 mt-1 px-1">
      <span className="flex items-center gap-1">
        <Activity className="h-2.5 w-2.5 text-[#00c895]" />
        <span className="text-slate-400">Solace PubSub+ Mesh</span>
      </span>
      <span><Server className="h-2.5 w-2.5 inline mr-0.5" />{events.length > 200 ? '847' : '312'} topics</span>
      <span><Cpu className="h-2.5 w-2.5 inline mr-0.5" />{throughput.toLocaleString()} msg/s</span>
      {isResolving && <span className="text-amber-400">A2A protocol active</span>}
    </div>
  )
}
