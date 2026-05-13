'use client'

import { create } from 'zustand'
import { SolaceEvent, ManufacturingFlow, FlowStepStatus, Disruption, AgentMessage } from '@/types'
import { MAX_EVENTS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

interface SimulationState {
  events: SolaceEvent[]
  selectedFlow: ManufacturingFlow | null
  flowStepStatuses: FlowStepStatus[]
  activeDisruptions: Disruption[]
  isResolving: boolean
  agentMessages: AgentMessage[]
  resolutionComplete: boolean

  addEvent: (event: SolaceEvent) => void
  selectFlow: (flow: ManufacturingFlow) => void
  injectDisruption: (disruption: Disruption) => void
  addAgentMessage: (msg: Omit<AgentMessage, 'id' | 'timestamp'>) => void
  setFlowStepStatus: (stepIdx: number, status: FlowStepStatus) => void
  completeResolution: () => void
  reset: () => void
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  events: [],
  selectedFlow: null,
  flowStepStatuses: [],
  activeDisruptions: [],
  isResolving: false,
  agentMessages: [],
  resolutionComplete: false,

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events.slice(-(MAX_EVENTS - 1)), event],
    })),

  selectFlow: (flow) =>
    set({
      selectedFlow: flow,
      flowStepStatuses: flow.steps.map(() => 'running'),
      activeDisruptions: [],
      isResolving: false,
      agentMessages: [],
      resolutionComplete: false,
    }),

  injectDisruption: (disruption) => {
    const { selectedFlow, flowStepStatuses, activeDisruptions, addEvent } = get()
    if (!selectedFlow) return

    const newStatuses = [...flowStepStatuses]
    disruption.affectedSteps.forEach((i) => {
      if (i < newStatuses.length) newStatuses[i] = 'error'
    })

    addEvent({
      id: `evt-dis-${Date.now()}`,
      timestamp: Date.now(),
      topic: `manufacturing/${selectedFlow.plant}/${selectedFlow.line}/agent/disruption-detected`,
      category: 'disruption',
      payload: { name: disruption.name, severity: disruption.severity, category: disruption.category },
      severity: 'critical',
    })

    set({
      activeDisruptions: [...activeDisruptions, disruption],
      isResolving: true,
      flowStepStatuses: newStatuses,
      resolutionComplete: false,
    })
  },

  addAgentMessage: (msg) =>
    set((state) => ({
      agentMessages: [
        ...state.agentMessages,
        { ...msg, id: generateId(), timestamp: Date.now() },
      ],
    })),

  setFlowStepStatus: (stepIdx, status) =>
    set((state) => {
      const newStatuses = [...state.flowStepStatuses]
      newStatuses[stepIdx] = status
      return { flowStepStatuses: newStatuses }
    }),

  completeResolution: () => {
    set((state) => ({
      isResolving: false,
      resolutionComplete: true,
      flowStepStatuses: state.flowStepStatuses.map((s) => s === 'error' ? 'complete' : s),
    }))
    setTimeout(() => {
      set((state) => ({
        flowStepStatuses: state.flowStepStatuses.map((s) => s === 'complete' ? 'running' : s),
      }))
    }, 2000)
    setTimeout(() => {
      set({ activeDisruptions: [], agentMessages: [], resolutionComplete: false })
    }, 5000)
  },

  reset: () =>
    set((state) => ({
      activeDisruptions: [],
      isResolving: false,
      agentMessages: [],
      resolutionComplete: false,
      flowStepStatuses: state.flowStepStatuses.map(() => 'running'),
    })),
}))
