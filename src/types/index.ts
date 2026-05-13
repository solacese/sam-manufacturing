export type EventCategory = 'iot' | 'mes' | 'erp' | 'agent' | 'disruption'

export interface SolaceEvent {
  id: string
  timestamp: number
  topic: string
  category: EventCategory
  payload: Record<string, unknown>
  severity: 'info' | 'warning' | 'critical'
}

export type FlowStepStatus = 'idle' | 'running' | 'warning' | 'error' | 'complete'

export interface FlowStep {
  id: string
  name: string
  description: string
  duration: string
  status: FlowStepStatus
  metrics?: Record<string, number>
}

export type Industry =
  | 'aerospace'
  | 'automotive'
  | 'electronics'
  | 'heavy-machinery'
  | 'consumer-goods'
  | 'pharma'
  | 'energy'
  | 'defense'

export interface ManufacturingFlow {
  id: string
  name: string
  industry: Industry
  category: string
  plant: string
  line: string
  steps: FlowStep[]
  cycleTime: string
  taktTime: string
  firstPassYield: number
}

export type AgentRole =
  | 'orchestrator'
  | 'maintenance'
  | 'scheduling'
  | 'quality'
  | 'supplier'
  | 'safety'
  | 'logistics'
  | 'digital-twin'
  | 'predictive'

export interface Agent {
  id: string
  name: string
  role: AgentRole
  description: string
  tools: string[]
}

export type AgentMessageType =
  | 'event-detected'
  | 'task-decomposition'
  | 'delegation'
  | 'analysis'
  | 'action'
  | 'resolution'
  | 'a2a-request'
  | 'a2a-response'

export interface AgentMessage {
  id: string
  timestamp: number
  fromAgent: AgentRole
  toAgent?: AgentRole
  type: AgentMessageType
  content: string
  metadata?: Record<string, unknown>
  status: 'pending' | 'in-progress' | 'complete'
}

export type DisruptionCategory =
  | 'machine-breakdown'
  | 'supply-chain'
  | 'quality-issue'
  | 'personnel'
  | 'environmental'

export interface Disruption {
  id: string
  name: string
  category: DisruptionCategory
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedSteps: number[]
  resolutionScript: Omit<AgentMessage, 'id' | 'timestamp'>[]
  kpis: ResolutionKPIs
}

export interface ResolutionKPIs {
  timeToDetect: string
  timeToResolve: string
  costImpact: string
  productionRecovery: string
  unitsAffected: number
}
