'use client'

import { useEffect, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'

export function Sparkline() {
  const [points, setPoints] = useState<number[]>(() => Array(30).fill(0).map(() => Math.random() * 20 + 5))
  const isResolving = useSimulationStore((s) => s.isResolving)

  useEffect(() => {
    const interval = setInterval(() => {
      const spike = isResolving ? Math.random() * 15 : 0
      setPoints(prev => [...prev.slice(1), Math.random() * 25 + 3 + spike])
    }, 400)
    return () => clearInterval(interval)
  }, [isResolving])

  const max = Math.max(...points, 1)
  const color = isResolving ? '#f59e0b' : '#00c895'
  const pathData = points.map((v, i) => {
    const x = (i / (points.length - 1)) * 100
    const y = 100 - (v / max) * 80
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-6 transition-colors duration-500">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${pathData} L100,100 L0,100 Z`} fill="url(#sparkGrad)" />
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
