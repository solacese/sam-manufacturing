import { Agent } from '@/types'

export const agents: Agent[] = [
  {
    id: 'orch-001',
    name: 'Orchestrator Agent',
    role: 'orchestrator',
    description: 'Decomposes complex manufacturing disruptions into sub-tasks and coordinates multi-agent resolution via A2A protocol',
    tools: ['task-decomposition', 'agent-routing', 'priority-scoring', 'escalation-management'],
  },
  {
    id: 'maint-001',
    name: 'Maintenance Agent',
    role: 'maintenance',
    description: 'Manages CMMS integration, predictive maintenance schedules, spare parts inventory, and work order generation',
    tools: ['cmms-query', 'spare-parts-lookup', 'work-order-create', 'maintenance-history', 'mtbf-analysis'],
  },
  {
    id: 'sched-001',
    name: 'Scheduling Agent',
    role: 'scheduling',
    description: 'Optimizes production scheduling, handles re-routing, manages capacity planning and takt time adjustments',
    tools: ['schedule-optimizer', 'capacity-planner', 'route-alternative', 'shift-management', 'bottleneck-analysis'],
  },
  {
    id: 'qual-001',
    name: 'Quality Control Agent',
    role: 'quality',
    description: 'Monitors SPC charts, triggers CAPA workflows, manages inspection protocols and first-pass yield analysis',
    tools: ['spc-analysis', 'capa-workflow', 'inspection-protocol', 'fmea-lookup', 'ncr-generation'],
  },
  {
    id: 'supp-001',
    name: 'Supplier Management Agent',
    role: 'supplier',
    description: 'Manages supplier communications, alternative sourcing, lead time optimization and BOM adjustments',
    tools: ['supplier-portal', 'alternative-source', 'lead-time-calc', 'bom-adjustment', 'purchase-order'],
  },
  {
    id: 'safe-001',
    name: 'Safety & Compliance Agent',
    role: 'safety',
    description: 'Monitors safety protocols, environmental compliance, lockout/tagout procedures and incident reporting',
    tools: ['safety-protocol', 'loto-verification', 'incident-report', 'compliance-check', 'risk-assessment'],
  },
  {
    id: 'logi-001',
    name: 'Logistics Agent',
    role: 'logistics',
    description: 'Coordinates material flow, WIP tracking, warehouse management and just-in-time delivery schedules',
    tools: ['wms-query', 'material-tracking', 'kanban-signal', 'jit-scheduler', 'agv-routing'],
  },
  {
    id: 'twin-001',
    name: 'Digital Twin Agent',
    role: 'digital-twin',
    description: 'Runs simulations on virtual plant model, predicts impact scenarios and validates resolution plans',
    tools: ['simulation-engine', 'impact-prediction', 'what-if-analysis', 'process-model', 'virtual-commissioning'],
  },
  {
    id: 'pred-001',
    name: 'Predictive Analytics Agent',
    role: 'predictive',
    description: 'Analyzes historical data, detects anomaly patterns, forecasts failures and estimates remaining useful life',
    tools: ['anomaly-detection', 'rul-estimation', 'trend-analysis', 'pattern-recognition', 'failure-forecast'],
  },
]
