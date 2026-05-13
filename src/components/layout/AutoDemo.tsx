'use client'

import { useState, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { disruptions } from '@/data/disruption-scenarios'
import { getAllFlows } from '@/data/flow-generator'
import { Play, Square } from 'lucide-react'
import { cn } from '@/lib/cn'

export function AutoDemo() {
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState('')
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const selectFlow = useSimulationStore((s) => s.selectFlow)
  const injectDisruption = useSimulationStore((s) => s.injectDisruption)
  const reset = useSimulationStore((s) => s.reset)

  function startDemo() {
    if (running) {
      stopDemo()
      return
    }
    setRunning(true)
    reset()

    const flows = getAllFlows()
    const sequence: { delay: number; action: () => void; label: string }[] = [
      { delay: 1000, action: () => selectFlow(flows[0]), label: 'Selecting Aerospace flow...' },
      { delay: 4000, action: () => {
        const d = { ...disruptions[0], id: `auto-${Date.now()}` }
        injectDisruption(d)
      }, label: 'Injecting CNC failure...' },
      { delay: 20000, action: () => {
        const d = { ...disruptions[1], id: `auto-${Date.now()}` }
        injectDisruption(d)
      }, label: 'Adding supply shortage...' },
      { delay: 40000, action: () => setStep('Resolution in progress...'), label: 'Agents coordinating...' },
      { delay: 55000, action: () => { setRunning(false); setStep('') }, label: 'Demo complete' },
    ]

    let cumDelay = 0
    sequence.forEach(({ delay, action, label }) => {
      cumDelay += delay
      const t = setTimeout(() => { setStep(label); action() }, cumDelay)
      timeoutsRef.current.push(t)
    })
  }

  function stopDemo() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setRunning(false)
    setStep('')
  }

  return (
    <button
      onClick={startDemo}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-semibold transition-all',
        running
          ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
          : 'bg-[#00c895]/10 border border-[#00c895]/30 text-[#00c895] hover:bg-[#00c895]/20'
      )}
      title={running ? 'Stop auto-demo' : 'Run automated demo sequence'}
    >
      {running ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      {running ? step || 'Stop' : 'Auto Demo'}
    </button>
  )
}
