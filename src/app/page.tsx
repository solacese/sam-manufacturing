'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { EventStreamPanel } from '@/components/event-stream/EventStreamPanel'
import { FlowSelector } from '@/components/flow/FlowSelector'
import { ScenarioGenerator } from '@/components/flow/ScenarioGenerator'
import { ManufacturingFlowViz } from '@/components/flow/ManufacturingFlowViz'
import { SupplyChainView } from '@/components/flow/SupplyChainView'
import { ViewToggle } from '@/components/flow/ViewToggle'
import { MeshHealth } from '@/components/flow/MeshHealth'
import { FlowBackground } from '@/components/flow/FlowBackground'
import { WelcomeOverlay } from '@/components/layout/WelcomeOverlay'
import { ToastContainer } from '@/components/ui/Toast'
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
  const isResolving = useSimulationStore((s) => s.isResolving)
  const [view, setView] = useState<'production' | 'supply-chain'>('production')

  useEffect(() => {
    document.title = isResolving
      ? '⚠ Resolving — Solace Agent+Event Mesh'
      : 'Solace Agent+Event Mesh for Manufacturing'
  }, [isResolving])

  useEffect(() => {
    if (!selectedFlow) {
      const flows = getAllFlows()
      if (flows.length > 0) selectFlow(flows[0])
    }
  }, [selectedFlow, selectFlow])

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0b1120]">
      <WelcomeOverlay />
      <ToastContainer />
      <Header />
      {/* Event mesh activity indicator */}
      <div className="h-[2px] bg-slate-900 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00c895]/40 to-transparent animate-flow-particle" />
      </div>

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
            <div className="flex-1 flex flex-col px-4 py-3 gap-2 min-w-0 relative">
              <FlowBackground />
              <div className="flex items-center gap-3">
                <ViewToggle view={view} onChange={setView} />
                {view === 'production' && <div className="flex-1"><FlowSelector /></div>}
              </div>
              {view === 'production' && <ScenarioGenerator />}
              {view === 'production' ? <ManufacturingFlowViz /> : <SupplyChainView />}
              <MeshHealth />
            </div>

            {/* RIGHT: Agent Resolution */}
            <aside className="w-[380px] flex-shrink-0 border-l border-slate-800">
              <AgentWorkspacePanel />
            </aside>
          </div>

          {/* BOTTOM: Disruption injection */}
          <div className="flex-shrink-0 border-t border-slate-800 bg-[#0f1729] px-4 py-2.5">
            <CustomDisruptionInput />
            <DisruptionInjector />
            <div className="flex justify-end mt-1">
              <span className="text-[7px] text-slate-700 font-mono">solace.com/agent-mesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
