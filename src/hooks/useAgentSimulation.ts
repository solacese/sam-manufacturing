'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Disruption, AgentMessage } from '@/types'
import { generateId } from '@/lib/utils'

export function useAgentSimulation() {
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const isResolving = useSimulationStore((s) => s.isResolving)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const addAgentMessage = useSimulationStore((s) => s.addAgentMessage)
  const completeResolution = useSimulationStore((s) => s.completeResolution)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const processedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!isResolving || activeDisruptions.length === 0) return

    const newDisruptions = activeDisruptions.filter((d) => !processedRef.current.has(d.id))
    if (newDisruptions.length === 0) return

    newDisruptions.forEach((disruption) => {
      processedRef.current.add(disruption.id)

      if (disruption.resolutionScript && disruption.resolutionScript.length > 0) {
        playScriptedResolution(disruption)
      } else {
        fetchLLMResolution(disruption)
      }
    })

    function playScriptedResolution(disruption: Disruption) {
      const script = disruption.resolutionScript
      let delay = 800

      script.forEach((msg, idx) => {
        const timeout = setTimeout(() => {
          addAgentMessage(msg)
          if (idx === script.length - 1) checkAllComplete()
        }, delay)
        timeoutsRef.current.push(timeout)
        delay += 1800 + Math.random() * 1200
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

        let delay = 500
        messages.forEach((msg, idx) => {
          const timeout = setTimeout(() => {
            addAgentMessage(msg)
            if (idx === messages.length - 1) checkAllComplete()
          }, delay)
          timeoutsRef.current.push(timeout)
          delay += 1500 + Math.random() * 1000
        })
      } catch (err) {
        console.error('LLM resolution failed, using fallback:', err)
        addAgentMessage({
          fromAgent: 'orchestrator',
          type: 'event-detected',
          content: `CRITICAL: ${disruption.name} detected. Initiating multi-agent resolution protocol via Solace Agent Mesh A2A.`,
          status: 'complete',
        })
        const fallback = setTimeout(() => {
          addAgentMessage({
            fromAgent: 'orchestrator',
            type: 'resolution',
            content: `Resolution in progress. Agents deployed across event mesh topics. Monitoring via SCADA integration. ETA for full recovery: pending analysis.`,
            status: 'complete',
          })
          checkAllComplete()
        }, 3000)
        timeoutsRef.current.push(fallback)
      }
    }

    function checkAllComplete() {
      setTimeout(() => {
        const store = useSimulationStore.getState()
        const allProcessed = store.activeDisruptions.every((d) => processedRef.current.has(d.id))
        if (allProcessed) {
          completeResolution()
          processedRef.current.clear()
        }
      }, 1500)
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [activeDisruptions, isResolving, selectedFlow, addAgentMessage, completeResolution])
}
