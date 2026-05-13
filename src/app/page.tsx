'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { EventStreamPanel } from '@/components/event-stream/EventStreamPanel'
import { FlowSelector } from '@/components/flow/FlowSelector'
import { ScenarioGenerator } from '@/components/flow/ScenarioGenerator'
import { ManufacturingFlowViz } from '@/components/flow/ManufacturingFlowViz'
import { MeshHealth } from '@/components/flow/MeshHealth'
import { FlowBackground } from '@/components/flow/FlowBackground'
import { WelcomeOverlay } from '@/components/layout/WelcomeOverlay'
import { DisruptionInjector } from '@/components/disruption/DisruptionInjector'
import { CustomDisruptionInput } from '@/components/disruption/CustomDisruptionInput'
import { AgentWorkspacePanel } from '@/components/agents/AgentWorkspacePanel'
import { useEventStream } from '@/hooks/useEventStream'
import { useAgentSimulation } from '@/hooks/useAgentSimulation'
import { useSimulationStore } from '@/store/simulation-store'
import { getAllFlows } from '@/data/flow-generator'

export default function Home() {
  useEventStream()
  useAgentSimulation()

  const selectFlow = useSimulationStore((s) => s.selectFlow)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)

  useEffect(() => {
    if (!selectedFlow) {
      const flows = getAllFlows()
      if (flows.length > 0) selectFlow(flows[0])
    }
  }, [selectedFlow, selectFlow])

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0b1120]">
      <WelcomeOverlay />
      <Header />

      <div className="flex-1 flex min-h-0">
        {/* LEFT: Event Stream */}
        <aside className="w-[280px] flex-shrink-0 border-r border-slate-800">
          <EventStreamPanel />
        </aside>

        {/* CENTER + RIGHT layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP ROW: Flow center + Agent panel right */}
          <div className="flex-1 flex min-h-0">
            {/* CENTER: Flow */}
            <div className="flex-1 flex flex-col p-4 gap-3 min-w-0 relative">
              <FlowBackground />
              <div className="flex gap-2 items-center">
                <div className="flex-1"><FlowSelector /></div>
              </div>
              <ScenarioGenerator />
              <ManufacturingFlowViz />
              <MeshHealth />
            </div>

            {/* RIGHT: Agent Resolution */}
            <aside className="w-[380px] flex-shrink-0 border-l border-slate-800">
              <AgentWorkspacePanel />
            </aside>
          </div>

          {/* BOTTOM: Disruption injection */}
          <div className="flex-shrink-0 border-t border-slate-800 bg-[#0f1729] px-4 py-3">
            <CustomDisruptionInput />
            <DisruptionInjector />
          </div>
        </div>
      </div>
    </div>
  )
}
