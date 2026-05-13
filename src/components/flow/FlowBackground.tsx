'use client'

import { useSimulationStore } from '@/store/simulation-store'

export function FlowBackground() {
  const isResolving = useSimulationStore((s) => s.isResolving)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(0,200,149,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,149,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00c895]/[0.03] to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00c895]/[0.02] to-transparent rounded-tr-full" />

      {/* Ambient glow when resolving */}
      {isResolving && (
        <>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-red-500/[0.015] blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </>
      )}
    </div>
  )
}
