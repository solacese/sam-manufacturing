'use client'

import { useSimulationStore } from '@/store/simulation-store'
import { cn } from '@/lib/cn'
import { Factory, Truck, Ship, Package, Users, CheckCircle } from 'lucide-react'

const nodes = [
  { id: 'suppliers', label: 'Suppliers', sublabel: 'SAP / Oracle', icon: Package, color: '#06b6d4', protocol: 'AMQP' },
  { id: 'logistics-in', label: 'Inbound Logistics', sublabel: 'TMS / Fleet', icon: Ship, color: '#f97316', protocol: 'MQTT' },
  { id: 'plant', label: 'Plant Floor', sublabel: 'MES / SCADA / IoT', icon: Factory, color: '#00c895', protocol: 'MQTT' },
  { id: 'quality', label: 'Quality', sublabel: 'QMS / SPC', icon: CheckCircle, color: '#8b5cf6', protocol: 'REST' },
  { id: 'logistics-out', label: 'Distribution', sublabel: 'WMS / 3PL', icon: Truck, color: '#f97316', protocol: 'JMS' },
  { id: 'customers', label: 'Customers', sublabel: 'CRM / Portal', icon: Users, color: '#3b82f6', protocol: 'REST' },
]

export function SupplyChainView() {
  const isResolving = useSimulationStore((s) => s.isResolving)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-2 rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-1.5">
        <h3 className="text-[11px] font-bold text-white">End-to-End Supply Chain</h3>
        <span className="text-[9px] text-slate-500 font-mono">Connected via Solace PubSub+ Event Mesh</span>
        <span className="ml-auto text-[8px] text-[#00c895] font-bold">{nodes.length} systems · 4 protocols</span>
      </div>

      {/* Supply chain flow */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-1 w-full max-w-[700px]">
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
                <div className={cn(
                  'flex-1 rounded-lg border p-3 text-center transition-all duration-300',
                  hasDisruption
                    ? 'bg-red-950/30 border-red-500/50 animate-error-pulse'
                    : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-500'
                )}>
                  <Icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: hasDisruption ? '#ef4444' : node.color }} />
                  <div className="text-[10px] font-bold text-slate-200">{node.label}</div>
                  <div className="text-[8px] text-slate-500">{node.sublabel}</div>
                  <div className="mt-1 text-[7px] font-mono rounded bg-slate-700/50 px-1 py-0.5 inline-block" style={{ color: node.color }}>
                    {node.protocol}
                  </div>
                </div>
                {idx < nodes.length - 1 && (
                  <div className="flex-shrink-0 w-4 h-px mx-0.5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-600" />
                    <div className="absolute top-0 h-full w-3 bg-[#00c895] animate-flow-particle" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Mesh underline */}
      <div className="mt-3 rounded-lg border border-[#00c895]/20 bg-[#00c895]/5 px-4 py-2 text-center">
        <div className="text-[10px] font-bold text-[#00c895]">Solace PubSub+ Event Mesh</div>
        <div className="text-[8px] text-slate-400 mt-0.5">
          Events published once, consumed by many · Sub-ms delivery · Guaranteed messaging · Global mesh federation
        </div>
      </div>
    </div>
  )
}
