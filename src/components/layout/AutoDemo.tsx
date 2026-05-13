'use client'

import { useState, useRef, useCallback } from 'react'
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

  const stopDemo = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setRunning(false)
    setStep('')
  }, [])

  function startDemo() {
    if (running) { stopDemo(); return }
    setRunning(true)
    reset()

    const flows = getAllFlows()
    const aerospace = flows.find(f => f.category === 'Wing Assembly')
    const automotive = flows.find(f => f.category === 'Final Assembly')

    const sequence: { delay: number; action: () => void; label: string }[] = [
      { delay: 500, label: 'Selecting Aerospace flow...', action: () => { if (aerospace) selectFlow(aerospace) } },
      { delay: 3000, label: 'Monitoring production...', action: () => {} },
      { delay: 5000, label: '⚠ CNC Spindle Failure detected!', action: () => { injectDisruption({ ...disruptions[0], id: `auto-${Date.now()}-1` }) } },
      { delay: 8000, label: '⚠ Adding supply shortage...', action: () => { injectDisruption({ ...disruptions[1], id: `auto-${Date.now()}-2` }) } },
      { delay: 12000, label: 'Agents coordinating via A2A...', action: () => {} },
      { delay: 25000, label: 'Resolution in progress...', action: () => {} },
      { delay: 38000, label: 'Switching to Automotive...', action: () => { if (automotive) selectFlow(automotive) } },
      { delay: 41000, label: '⚠ Environmental excursion!', action: () => { injectDisruption({ ...disruptions[3], id: `auto-${Date.now()}-3` }) } },
      { delay: 55000, label: 'Multi-agent resolution...', action: () => {} },
      { delay: 70000, label: '✓ Demo complete', action: () => { stopDemo() } },
    ]

    let cumDelay = 0
    sequence.forEach(({ delay, action, label }) => {
      cumDelay += delay
      const t = setTimeout(() => { setStep(label); action() }, cumDelay)
      timeoutsRef.current.push(t)
    })
  }

  return (
    <button
      onClick={startDemo}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-semibold transition-all whitespace-nowrap',
        running
          ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
          : 'bg-[#00c895]/10 border border-[#00c895]/30 text-[#00c895] hover:bg-[#00c895]/20'
      )}
      title={running ? 'Stop auto-demo' : 'Run automated 70s demo sequence'}
    >
      {running ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      {running ? (step || 'Running...') : 'Auto Demo'}
    </button>
  )
}
