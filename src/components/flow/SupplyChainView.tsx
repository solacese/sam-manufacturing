'use client'

import { useEffect, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { cn } from '@/lib/cn'
import { Factory, Truck, Ship, Package, Users, CheckCircle } from 'lucide-react'

const nodes = [
  { id: 'suppliers', label: 'Suppliers', sublabel: 'SAP / Oracle', icon: Package, color: '#06b6d4', protocol: 'AMQP', agents: 'Supplier Agent, Scheduling' },
  { id: 'logistics-in', label: 'Inbound Logistics', sublabel: 'TMS / Fleet', icon: Ship, color: '#f97316', protocol: 'MQTT', agents: 'Logistics Agent, Predictive' },
  { id: 'plant', label: 'Plant Floor', sublabel: 'MES / SCADA / IoT', icon: Factory, color: '#00c895', protocol: 'MQTT', agents: 'Maintenance, Digital Twin' },
  { id: 'quality', label: 'Quality', sublabel: 'QMS / SPC', icon: CheckCircle, color: '#8b5cf6', protocol: 'REST', agents: 'Quality Agent, Safety' },
  { id: 'logistics-out', label: 'Distribution', sublabel: 'WMS / 3PL', icon: Truck, color: '#f97316', protocol: 'JMS', agents: 'Logistics Agent, Scheduling' },
  { id: 'customers', label: 'Customers', sublabel: 'CRM / Portal', icon: Users, color: '#3b82f6', protocol: 'REST', agents: 'Orchestrator, Scheduling' },
]

export function SupplyChainView() {
  const isResolving = useSimulationStore((s) => s.isResolving)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const [counters, setCounters] = useState<number[]>(nodes.map(() => 0))

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => prev.map(c => c + Math.floor(Math.random() * 3) + 1))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-3 rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-1.5">
        <h3 className="text-[11px] font-bold text-white">End-to-End Supply Chain</h3>
        <span className="text-[9px] text-slate-500 font-mono">Connected via Solace Platform — Agent Mesh</span>
        <span className="ml-auto text-[8px] text-[#00c895] font-bold">{nodes.length} systems · 4 protocols · 9 agents</span>
      </div>

      {/* Supply chain flow */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-1.5 w-full">
          {nodes.map((node, idx) => {
            const Icon = node.icon
            const hasDisruption = isResolving && activeDisruptions.some(d =>
              (node.id === 'suppliers' && d.category === 'supply-chain') ||
              (node.id === 'plant' && d.category === 'machine-breakdown') ||
              (node.id === 'quality' && d.category === 'quality-issue') ||
              (node.id === 'logistics-in' && d.category === 'environmental')
            )

            return (
              <div key={node.id} className="flex items-center flex-1">
                <div title={`Agents: ${node.agents}`} className={cn(
                  'flex-1 rounded-xl border p-3 text-center transition-all duration-300 relative cursor-default',
                  hasDisruption
                    ? 'bg-red-950/30 border-red-500/50 animate-error-pulse'
                    : 'bg-slate-800/60 border-slate-700/50 hover:border-[#00c895]/40 hover:bg-slate-800'
                )}>
                  <Icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: hasDisruption ? '#ef4444' : node.color }} />
                  <div className="text-[10px] font-bold text-slate-200">{node.label}</div>
                  <div className="text-[8px] text-slate-500">{node.sublabel}</div>
                  <div className="mt-1.5 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7px] font-mono rounded bg-slate-700/50 px-1 py-0.5" style={{ color: node.color }}>
                        {node.protocol}
                      </span>
                      <span className="text-[7px] font-mono text-slate-500 tabular-nums">
                        {counters[idx]} ev
                      </span>
                    </div>
                    <span className="text-[6px] text-[#00c895]/60">{node.agents.split(',')[0]}</span>
                  </div>
                  {hasDisruption && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                {idx < nodes.length - 1 && (
                  <div className="flex-shrink-0 w-6 h-[2px] mx-0.5 relative overflow-hidden rounded-full bg-slate-700">
                    <div className="absolute top-0 h-full w-4 bg-[#00c895] rounded-full animate-flow-particle" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event+Agent Mesh underline */}
      <div className="mt-3 rounded-xl border border-[#00c895]/20 bg-[#00c895]/5 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#00c895]">Solace Agent+Event Mesh</div>
            <div className="text-[8px] text-slate-400 mt-0.5">
              Events stream in real-time → Agents detect anomalies → A2A coordination → Autonomous resolution
            </div>
          </div>
          <div className="text-right text-[8px]">
            <div className="text-[#00c895] font-bold">Event Mesh</div>
            <div className="text-slate-500">routes events to agents</div>
            <div className="text-[#00c895] font-bold mt-0.5">Agent Mesh</div>
            <div className="text-slate-500">resolves autonomously</div>
          </div>
        </div>
      </div>
    </div>
  )
}
