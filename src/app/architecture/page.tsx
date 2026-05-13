'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Network, Factory, Database, Globe, Cpu, Radio, Shield, BarChart3, Layers, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { AGENT_COLORS, AGENT_NAMES } from '@/lib/constants'
import { AgentRole } from '@/types'

const agentRoles: AgentRole[] = ['orchestrator', 'maintenance', 'scheduling', 'quality', 'supplier', 'safety', 'logistics', 'digital-twin', 'predictive']

const systems = [
  { id: 'mes', name: 'MES', fullName: 'Manufacturing Execution System', icon: Factory, color: '#a78bfa', description: 'Real-time production tracking, work orders, batch control, OEE monitoring, operator dispatch', topics: ['manufacturing/+/+/mes/production-order', 'manufacturing/+/+/mes/oee-update', 'manufacturing/+/+/mes/batch-complete'] },
  { id: 'erp', name: 'ERP', fullName: 'Enterprise Resource Planning', icon: Database, color: '#fbbf24', description: 'Sales orders, inventory management, BOM, procurement, financial planning, demand forecasting', topics: ['manufacturing/+/+/erp/sales-order', 'manufacturing/+/+/erp/inventory-level', 'manufacturing/+/+/erp/supplier-update'] },
  { id: 'scada', name: 'SCADA', fullName: 'Supervisory Control & Data Acquisition', icon: Cpu, color: '#22d3ee', description: 'PLC integration, process control, alarm management, historian data, real-time visualization', topics: ['manufacturing/+/+/scada/alarm', 'manufacturing/+/+/scada/setpoint', 'manufacturing/+/+/plc/cycle-count'] },
  { id: 'iot', name: 'IoT Gateway', fullName: 'Industrial IoT Platform', icon: Radio, color: '#00c895', description: 'Sensor telemetry (temperature, vibration, pressure, humidity), edge computing, device management', topics: ['manufacturing/+/+/sensor/temperature', 'manufacturing/+/+/sensor/vibration', 'manufacturing/+/+/sensor/pressure'] },
  { id: 'cmms', name: 'CMMS', fullName: 'Computerized Maintenance Management', icon: Shield, color: '#f97316', description: 'Work orders, preventive maintenance scheduling, spare parts, asset lifecycle, MTBF/MTTR tracking', topics: ['manufacturing/+/+/cmms/work-order', 'manufacturing/+/+/cmms/pm-schedule', 'manufacturing/+/+/cmms/spare-parts'] },
  { id: 'qms', name: 'QMS', fullName: 'Quality Management System', icon: BarChart3, color: '#ec4899', description: 'SPC charts, CAPA workflows, NCR management, audit trails, inspection protocols, calibration', topics: ['manufacturing/+/+/qms/spc-alert', 'manufacturing/+/+/qms/ncr', 'manufacturing/+/+/qms/capa'] },
  { id: 'wms', name: 'WMS', fullName: 'Warehouse Management System', icon: Layers, color: '#14b8a6', description: 'Inventory locations, pick/pack/ship, lot traceability, Kanban signals, AGV coordination', topics: ['manufacturing/+/+/wms/inventory', 'manufacturing/+/+/wms/kanban-signal', 'manufacturing/+/+/wms/agv-dispatch'] },
  { id: 'dt', name: 'Digital Twin', fullName: 'Digital Twin Platform', icon: Globe, color: '#8b5cf6', description: 'Virtual plant model, simulation, what-if analysis, process optimization, predictive scenarios', topics: ['manufacturing/+/+/digital-twin/simulation', 'manufacturing/+/+/digital-twin/prediction'] },
]

const plants = [
  { name: 'Munich Plant', country: 'Germany', lines: 8, type: 'Aerospace', status: 'online' },
  { name: 'Toulouse Plant', country: 'France', lines: 6, type: 'Aerospace', status: 'online' },
  { name: 'Detroit Plant', country: 'USA', lines: 12, type: 'Automotive', status: 'online' },
  { name: 'Shanghai Plant', country: 'China', lines: 10, type: 'Electronics', status: 'online' },
  { name: 'Nagoya Plant', country: 'Japan', lines: 8, type: 'Automotive', status: 'online' },
  { name: 'São Paulo Plant', country: 'Brazil', lines: 6, type: 'Consumer Goods', status: 'online' },
]

export default function ArchitecturePage() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [eventCount, setEventCount] = useState(142857)

  useEffect(() => {
    const interval = setInterval(() => {
      setEventCount(c => c + Math.floor(Math.random() * 5) + 1)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const selected = systems.find(s => s.id === selectedSystem)

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00c895 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Demo</span>
          </Link>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#00c895"/>
              <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="1.5" fill="white"/>
            </svg>
            <h1 className="text-lg font-bold">Solace <span className="text-[#00c895]">Agent+Event Mesh</span> Architecture</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-slate-400 font-mono bg-slate-800 rounded px-3 py-1.5 border border-slate-700">
            Protocol: SMF/MQTT/AMQP/REST | A2A
          </div>
          <div className="text-[10px] font-mono bg-[#00c895]/10 border border-[#00c895]/30 rounded px-3 py-1.5 text-[#00c895] tabular-nums">
            {eventCount.toLocaleString()} events processed
          </div>
        </div>
      </div>

      {/* Main Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Architecture */}
        <div className="space-y-6">
          {/* Solace Event Mesh - Central */}
          <div className="rounded-2xl border-2 border-[#00c895]/40 bg-[#00c895]/5 p-6 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute h-1 w-1 rounded-full bg-[#00c895]/40" style={{ left: `${10 + i * 20}%`, top: `${20 + i * 15}%`, animation: `flow-particle ${3 + i * 0.5}s linear infinite`, animationDelay: `${i * 0.6}s` }} />
              ))}
            </div>
            <div className="absolute -top-3 left-6 bg-[#0b1120] px-3">
              <span className="text-sm font-bold text-[#00c895]">Solace Agent+Event Mesh</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-[#00c895]" />
              <p className="text-xs text-slate-300">Topic-based pub/sub routing | Guaranteed delivery | Multi-protocol | Global mesh</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {['SMF', 'MQTT', 'AMQP', 'REST', 'WebSocket', 'JMS'].map(p => (
                <span key={p} className="text-[8px] font-bold text-[#00c895] bg-[#00c895]/10 border border-[#00c895]/20 rounded px-1.5 py-0.5">{p}</span>
              ))}
            </div>

            {/* Agent Mesh inside Solace */}
            <div className="rounded-xl border-2 border-[#00c895]/30 bg-[#00c895]/5 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Network className="h-4 w-4 text-[#00c895]" />
                <span className="text-xs font-bold text-[#00c895]">Agent Mesh — A2A Protocol</span>
                <span className="text-[8px] text-slate-500 ml-auto font-mono">{'solace/agent-mesh/v1/{agent}/{action}'}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {agentRoles.map(role => (
                  <div key={role}
                    onMouseEnter={() => setHoveredAgent(role)}
                    onMouseLeave={() => setHoveredAgent(null)}
                    className={cn('rounded-lg border p-2 text-center transition-all cursor-pointer', hoveredAgent === role ? 'border-white/50 scale-105 shadow-lg' : 'border-slate-700 hover:border-slate-500')}
                    style={{ backgroundColor: hoveredAgent === role ? AGENT_COLORS[role] + '20' : undefined }}>
                    <div className="h-4 w-4 rounded-full mx-auto mb-1" style={{ backgroundColor: AGENT_COLORS[role] }} />
                    <span className="text-[8px] font-medium text-slate-300 block truncate">{AGENT_NAMES[role].replace(' Agent', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Systems */}
            <div className="grid grid-cols-4 gap-2">
              {systems.map(sys => {
                const Icon = sys.icon
                const isSelected = selectedSystem === sys.id
                return (
                  <button key={sys.id} onClick={() => setSelectedSystem(isSelected ? null : sys.id)}
                    className={cn('rounded-lg border p-3 text-left transition-all', isSelected ? 'border-white/50 bg-white/5 scale-[1.02]' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500')}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" style={{ color: sys.color }} />
                      <span className="text-[10px] font-bold text-white">{sys.name}</span>
                    </div>
                    <p className="text-[8px] text-slate-400">{sys.fullName}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Topic Hierarchy */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-xs font-bold text-white mb-3">Event Topic Hierarchy</h3>
            <div className="font-mono text-[10px] space-y-1">
              <div className="text-[#00c895]">manufacturing/</div>
              <div className="pl-4 text-slate-300">{'<plant>/'}</div>
              <div className="pl-8 text-slate-300">{'<line>/'}</div>
              <div className="pl-12 text-slate-400">sensor/ <span className="text-cyan-400">temperature | vibration | pressure | humidity | power</span></div>
              <div className="pl-12 text-slate-400">plc/ <span className="text-cyan-400">cycle-count | fault-code | status</span></div>
              <div className="pl-12 text-slate-400">mes/ <span className="text-violet-400">production-order | oee-update | batch-complete | quality-check</span></div>
              <div className="pl-12 text-slate-400">erp/ <span className="text-amber-400">sales-order | inventory-level | supplier-update | forecast</span></div>
              <div className="pl-12 text-slate-400">scada/ <span className="text-cyan-400">alarm | setpoint | historian</span></div>
              <div className="pl-12 text-slate-400">agent/ <span className="text-[#00c895]">event-detected | delegation | resolution</span></div>
            </div>
          </div>

          {/* Plant Locations */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-xs font-bold text-white mb-3">Connected Manufacturing Locations</h3>
            <div className="grid grid-cols-3 gap-2">
              {plants.map(plant => (
                <div key={plant.name} className="rounded-lg border border-slate-700 bg-slate-800/50 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-white">{plant.name}</span>
                    <span className="h-2 w-2 rounded-full bg-[#00c895]" />
                  </div>
                  <div className="text-[9px] text-slate-400">
                    <div>{plant.country} · {plant.lines} lines · {plant.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-xs font-bold text-white mb-3">Enterprise Use Cases</h3>
            <div className="grid grid-cols-2 gap-2">
              <UseCase industry="Aerospace" company="Airbus / Boeing" example="Wing assembly disruption → multi-agent rerouting across 6 plants" />
              <UseCase industry="Automotive" company="BMW / Toyota" example="Supply chain delay → automatic alternate sourcing + schedule optimization" />
              <UseCase industry="Pharma" company="Pfizer / Roche" example="Cleanroom excursion → compliance agent + batch containment in under 1 min" />
              <UseCase industry="Semiconductors" company="TSMC / Intel" example="Yield drift detection → SPC agent + predictive maintenance coordination" />
            </div>
          </div>
        </div>

        {/* Right: System Detail Panel */}
        <div className="space-y-4">
          {/* Selected system detail */}
          {selected ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <selected.icon className="h-5 w-5" style={{ color: selected.color }} />
                <div>
                  <h3 className="text-sm font-bold text-white">{selected.name}</h3>
                  <p className="text-[9px] text-slate-400">{selected.fullName}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mb-4 leading-relaxed">{selected.description}</p>
              <div className="space-y-2">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Event Topics</h4>
                {selected.topics.map(t => (
                  <div key={t} className="font-mono text-[9px] text-[#00c895] bg-slate-800 rounded px-2 py-1 border border-slate-700">{t}</div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connected Agents</h4>
                <div className="flex flex-wrap gap-1">
                  {agentRoles.slice(0, 5).map(role => (
                    <span key={role} className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[8px] text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: AGENT_COLORS[role] }} />
                      {AGENT_NAMES[role].replace(' Agent', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-center">
              <p className="text-xs text-slate-400">Click a system to see details</p>
            </div>
          )}

          {/* Data Flow Summary */}
          <DataFlowSection />

          {/* Key Benefits */}
          <div className="rounded-xl border border-[#00c895]/20 bg-[#00c895]/5 p-4">
            <h3 className="text-xs font-bold text-[#00c895] mb-2">Why Solace Agent+Event Mesh?</h3>
            <div className="space-y-1.5 text-[9px] text-slate-300">
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">1.</span> AI agents discover and delegate tasks autonomously via A2A protocol</div>
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">2.</span> Orchestrator decomposes complex problems across specialist agents</div>
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">3.</span> Event-driven: agents react to real-time signals from any connected system</div>
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">4.</span> Solace Platform guarantees delivery — no event is ever lost</div>
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">5.</span> Scale from 9 agents to thousands without architecture changes</div>
              <div className="flex items-start gap-2"><span className="text-[#00c895] font-bold">6.</span> Hybrid deployment: agents run on-prem, cloud, or edge simultaneously</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-xs font-bold text-white mb-3">Platform Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Events/sec" value="25,000+" />
              <MetricCard label="Latency" value="<50ms" />
              <MetricCard label="Agents" value="9" />
              <MetricCard label="Topics" value="10,000+" />
              <MetricCard label="Plants" value="6" />
              <MetricCard label="Uptime" value="99.99%" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500">
        <span>Solace Agent+Event Mesh — Real-Time Intelligence for Manufacturing & Supply Chain</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00c895]" />
          solace.com
        </span>
      </div>
    </div>
  )
}



const dataFlowSteps = [
  { num: '1', text: 'IoT sensors publish telemetry to Solace topics', color: '#22d3ee' },
  { num: '2', text: 'MES/SCADA publish production events', color: '#a78bfa' },
  { num: '3', text: 'Orchestrator Agent subscribes to anomaly patterns', color: '#00c895' },
  { num: '4', text: 'Disruption detected → A2A delegation to specialists', color: '#f97316' },
  { num: '5', text: 'Agents coordinate resolution via event mesh', color: '#8b5cf6' },
  { num: '6', text: 'Resolution actions published back to MES/CMMS/ERP', color: '#fbbf24' },
]

function DataFlowSection() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % dataFlowSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <h3 className="text-xs font-bold text-white mb-3">Data Flow <span className="text-[8px] text-slate-500 font-normal ml-2">auto-cycling</span></h3>
      <div className="space-y-2 text-[10px]">
        {dataFlowSteps.map((step, i) => (
          <div key={step.num} className={cn('flex items-center gap-2 transition-all duration-500 rounded px-1.5 py-0.5', i === activeStep ? 'bg-slate-800 scale-[1.02]' : 'opacity-60')}>
            <span className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: step.color, boxShadow: i === activeStep ? `0 0 8px ${step.color}60` : undefined }}>{step.num}</span>
            <span className="text-slate-300">{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-800/50 px-2 py-1.5 text-center">
      <div className="text-[8px] text-slate-500 uppercase">{label}</div>
      <div className="text-[12px] font-bold text-[#00c895] font-mono">{value}</div>
    </div>
  )
}

function UseCase({ industry, company, example }: { industry: string; company: string; example: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
      <div className="text-[10px] font-bold text-white mb-0.5">{industry}</div>
      <div className="text-[8px] text-[#00c895] font-medium mb-1">{company}</div>
      <div className="text-[9px] text-slate-400 leading-relaxed">{example}</div>
    </div>
  )
}
