'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

export function MeshHealth() {
  const [stats, setStats] = useState({ topics: 847, subscribers: 23, throughput: 25400 })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(s => ({
        topics: s.topics + (Math.random() > 0.8 ? 1 : 0),
        subscribers: s.subscribers + (Math.random() > 0.95 ? 1 : Math.random() < 0.05 ? -1 : 0),
        throughput: Math.round(24000 + Math.random() * 3000),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-[8px] font-mono text-slate-500 mt-2">
      <span className="flex items-center gap-1">
        <Activity className="h-2.5 w-2.5 text-[#00c895]" />
        <span className="text-slate-400">Mesh:</span>
      </span>
      <span>{stats.topics} topics</span>
      <span>{stats.subscribers} subscribers</span>
      <span className="text-[#00c895]">{stats.throughput.toLocaleString()} msg/s</span>
    </div>
  )
}
