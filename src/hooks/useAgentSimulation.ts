'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Disruption, AgentMessage } from '@/types'

export function useAgentSimulation() {
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const addAgentMessage = useSimulationStore((s) => s.addAgentMessage)
  const completeResolution = useSimulationStore((s) => s.completeResolution)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const processedRef = useRef<Set<string>>(new Set())
  const pendingRef = useRef(0)

  useEffect(() => {
    if (!isResolving || activeDisruptions.length === 0) return

    const newDisruptions = activeDisruptions.filter((d) => !processedRef.current.has(d.id))
    if (newDisruptions.length === 0) return

    newDisruptions.forEach((disruption) => {
      processedRef.current.add(disruption.id)
      pendingRef.current++

      if (disruption.resolutionScript && disruption.resolutionScript.length > 0) {
        playScriptedResolution(disruption)
      } else {
        fetchLLMResolution(disruption)
      }
    })

    function onDisruptionDone() {
      pendingRef.current--
      if (pendingRef.current <= 0) {
        pendingRef.current = 0
        setTimeout(() => {
          completeResolution()
          processedRef.current.clear()
        }, 1500)
      }
    }

    function playScriptedResolution(disruption: Disruption) {
      const script = disruption.resolutionScript
      let delay = 500 + Math.random() * 500

      script.forEach((msg, idx) => {
        const timeout = setTimeout(() => {
          addAgentMessage(msg)
          if (idx === script.length - 1) onDisruptionDone()
        }, delay)
        timeoutsRef.current.push(timeout)
        delay += 1500 + Math.random() * 1000
      })
    }

    async function fetchLLMResolution(disruption: Disruption) {
      try {
        const res = await fetch('/api/agent-resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disruption, flow: selectedFlow }),
        })
        if (!res.ok) throw new Error('API failed')
        const data = await res.json()
        const messages: Omit<AgentMessage, 'id' | 'timestamp'>[] = data.messages || []

        let delay = 300
        messages.forEach((msg, idx) => {
          const timeout = setTimeout(() => {
            addAgentMessage(msg)
            if (idx === messages.length - 1) onDisruptionDone()
          }, delay)
          timeoutsRef.current.push(timeout)
          delay += 1200 + Math.random() * 800
        })
      } catch {
        addAgentMessage({
          fromAgent: 'orchestrator',
          type: 'event-detected',
          content: `CRITICAL: ${disruption.name} detected. Initiating multi-agent resolution via Solace Agent Mesh.`,
          status: 'complete',
        })
        setTimeout(() => {
          addAgentMessage({ fromAgent: 'orchestrator', type: 'resolution', content: `Resolution protocol active. Agents deployed across mesh topics.`, status: 'complete' })
          onDisruptionDone()
        }, 2000)
      }
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [activeDisruptions, isResolving, selectedFlow, addAgentMessage, completeResolution])
}
