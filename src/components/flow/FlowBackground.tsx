'use client'

import { useSimulationStore } from '@/store/simulation-store'

export function FlowBackground() {
  const isResolving = useSimulationStore((s) => s.isResolving)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0,200,149,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,149,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Ambient glow when resolving */}
      {isResolving && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-red-500/[0.02] blur-3xl animate-pulse" />
      )}
    </div>
  )
}
