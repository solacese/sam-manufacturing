'use client'

import { useEffect, useState, useMemo } from 'react'
import { Activity, Server, Cpu, GitBranch } from 'lucide-react'
import { useSimulationStore } from '@/store/simulation-store'

export function MeshHealth() {
  const events = useSimulationStore((s) => s.events)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const [throughput, setThroughput] = useState(24800)

  const uniqueTopics = useMemo(() => {
    const topics = new Set(events.slice(-200).map(e => e.topic))
    return topics.size
  }, [events])

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput(Math.round(23000 + Math.random() * 4000))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 text-[8px] font-mono text-slate-500 mt-1 px-1 py-0.5 rounded bg-slate-800/30 border border-slate-800/50">
      <span className="flex items-center gap-1">
        <Activity className="h-2.5 w-2.5 text-[#00c895]" />
        <span className="text-slate-400 font-bold">PubSub+</span>
      </span>
      <span className="flex items-center gap-0.5"><Server className="h-2.5 w-2.5" />{uniqueTopics} active topics</span>
      <span className="flex items-center gap-0.5"><Cpu className="h-2.5 w-2.5" /><span className="tabular-nums">{throughput.toLocaleString()}</span> msg/s</span>
      <span className="flex items-center gap-0.5"><GitBranch className="h-2.5 w-2.5" />6 brokers</span>
      {isResolving && <span className="text-amber-400 font-bold ml-auto">A2A ACTIVE</span>}
    </div>
  )
}
