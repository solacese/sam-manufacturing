'use client'

import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

export function ElapsedTimer({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) { setSeconds(0); return }
    const start = Date.now()
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  if (!running && seconds === 0) return null

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <span className="flex items-center gap-1 text-[8px] font-mono text-slate-400">
      <Timer className="h-2.5 w-2.5" />
      {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`}
    </span>
  )
}
