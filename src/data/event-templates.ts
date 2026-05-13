import { EventCategory } from '@/types'

export interface EventTemplate {
  category: EventCategory
  topicSuffix: string
  payloadGenerator: () => Record<string, unknown>
  severity: 'info' | 'warning' | 'critical'
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export const iotTemplates: EventTemplate[] = [
  { category: 'iot', topicSuffix: 'sensor/temperature', severity: 'info', payloadGenerator: () => ({ value: +rand(18, 95).toFixed(1), unit: '°C', sensorId: `TEMP-${Math.floor(rand(100, 999))}` }) },
  { category: 'iot', topicSuffix: 'sensor/vibration', severity: 'info', payloadGenerator: () => ({ value: +rand(0.1, 8.5).toFixed(2), unit: 'mm/s', axis: ['X', 'Y', 'Z'][Math.floor(rand(0, 3))], sensorId: `VIB-${Math.floor(rand(100, 999))}` }) },
  { category: 'iot', topicSuffix: 'sensor/pressure', severity: 'info', payloadGenerator: () => ({ value: +rand(0.5, 12).toFixed(2), unit: 'bar', sensorId: `PRES-${Math.floor(rand(100, 999))}` }) },
  { category: 'iot', topicSuffix: 'sensor/humidity', severity: 'info', payloadGenerator: () => ({ value: +rand(30, 75).toFixed(1), unit: '%RH', zone: `Zone-${Math.floor(rand(1, 8))}` }) },
  { category: 'iot', topicSuffix: 'plc/cycle-count', severity: 'info', payloadGenerator: () => ({ count: Math.floor(rand(1000, 99999)), machine: `MCH-${Math.floor(rand(1, 30))}`, cycleTime: +rand(4, 120).toFixed(1) }) },
  { category: 'iot', topicSuffix: 'sensor/power', severity: 'info', payloadGenerator: () => ({ kW: +rand(5, 450).toFixed(1), powerFactor: +rand(0.85, 0.99).toFixed(3), phase: 3 }) },
  { category: 'iot', topicSuffix: 'sensor/flow-rate', severity: 'info', payloadGenerator: () => ({ value: +rand(0.5, 25).toFixed(2), unit: 'L/min', medium: ['coolant', 'hydraulic', 'compressed-air'][Math.floor(rand(0, 3))] }) },
  { category: 'iot', topicSuffix: 'gateway/heartbeat', severity: 'info', payloadGenerator: () => ({ gatewayId: `GW-${Math.floor(rand(1, 12))}`, uptime: Math.floor(rand(3600, 864000)), connectedDevices: Math.floor(rand(8, 64)) }) },
]

export const mesTemplates: EventTemplate[] = [
  { category: 'mes', topicSuffix: 'mes/production-order', severity: 'info', payloadGenerator: () => ({ orderId: `PO-2024-${Math.floor(rand(8000, 9999))}`, status: ['started', 'in-progress', 'completed'][Math.floor(rand(0, 3))], quantity: Math.floor(rand(10, 500)), partNumber: `PN-${Math.floor(rand(10000, 99999))}` }) },
  { category: 'mes', topicSuffix: 'mes/oee-update', severity: 'info', payloadGenerator: () => ({ availability: +rand(85, 99).toFixed(1), performance: +rand(80, 98).toFixed(1), quality: +rand(95, 99.9).toFixed(1), oee: +rand(70, 95).toFixed(1), line: `Line-${Math.floor(rand(1, 8))}` }) },
  { category: 'mes', topicSuffix: 'mes/batch-complete', severity: 'info', payloadGenerator: () => ({ batchId: `B-2024-${Math.floor(rand(400, 999))}`, goodParts: Math.floor(rand(90, 500)), rejectParts: Math.floor(rand(0, 8)), cycleTime: +rand(30, 300).toFixed(1) }) },
  { category: 'mes', topicSuffix: 'mes/quality-check', severity: 'info', payloadGenerator: () => ({ checkId: `QC-${Math.floor(rand(10000, 99999))}`, result: Math.random() > 0.05 ? 'PASS' : 'FAIL', measurement: +rand(24.95, 25.05).toFixed(3), tolerance: '±0.05', inspector: `OP-${Math.floor(rand(100, 400))}` }) },
  { category: 'mes', topicSuffix: 'mes/work-order-status', severity: 'info', payloadGenerator: () => ({ woId: `WO-2024-${Math.floor(rand(7000, 9999))}`, operation: Math.floor(rand(10, 60)), status: ['queue', 'setup', 'running', 'complete'][Math.floor(rand(0, 4))], operator: `OP-${Math.floor(rand(100, 400))}` }) },
  { category: 'mes', topicSuffix: 'mes/downtime-event', severity: 'warning', payloadGenerator: () => ({ reason: ['tool-change', 'material-wait', 'setup', 'break', 'maintenance'][Math.floor(rand(0, 5))], duration: Math.floor(rand(2, 45)), machine: `MCH-${Math.floor(rand(1, 30))}`, planned: Math.random() > 0.3 }) },
]

export const erpTemplates: EventTemplate[] = [
  { category: 'erp', topicSuffix: 'erp/sales-order', severity: 'info', payloadGenerator: () => ({ orderId: `SO-${Math.floor(rand(100000, 999999))}`, customer: ['Airbus', 'Boeing', 'BMW', 'Mercedes', 'Toyota', 'Siemens', 'GE', 'Rolls-Royce'][Math.floor(rand(0, 8))], value: `€${Math.floor(rand(5000, 500000)).toLocaleString()}`, dueDate: '2024-' + String(Math.floor(rand(1, 12))).padStart(2, '0') + '-' + String(Math.floor(rand(1, 28))).padStart(2, '0') }) },
  { category: 'erp', topicSuffix: 'erp/inventory-level', severity: 'info', payloadGenerator: () => ({ material: `MAT-${Math.floor(rand(1000, 9999))}`, quantity: Math.floor(rand(5, 5000)), unit: ['kg', 'pcs', 'L', 'm'][Math.floor(rand(0, 4))], reorderPoint: Math.floor(rand(10, 100)), location: `WH-${Math.floor(rand(1, 6))}` }) },
  { category: 'erp', topicSuffix: 'erp/supplier-update', severity: 'info', payloadGenerator: () => ({ supplier: ['TIMET', 'Hexcel', 'Alcoa', 'ThyssenKrupp', 'BASF', 'Mitsubishi'][Math.floor(rand(0, 6))], type: ['shipment', 'invoice', 'quality-cert', 'forecast'][Math.floor(rand(0, 4))], poNumber: `PO-${Math.floor(rand(50000, 99999))}` }) },
  { category: 'erp', topicSuffix: 'erp/forecast-update', severity: 'info', payloadGenerator: () => ({ product: `FG-${Math.floor(rand(1000, 9999))}`, period: '2024-Q' + Math.floor(rand(1, 5)), demandUnits: Math.floor(rand(50, 2000)), confidenceLevel: +rand(70, 95).toFixed(0) + '%' }) },
]

export const logisticsTemplates: EventTemplate[] = [
  { category: 'logistics', topicSuffix: 'logistics/shipment-status', severity: 'info', payloadGenerator: () => ({ shipmentId: `SH-${Math.floor(rand(4000, 9999))}`, status: ['in-transit', 'arrived', 'customs', 'loading', 'dispatched'][Math.floor(rand(0, 5))], origin: ['Shanghai', 'Rotterdam', 'Detroit', 'Nagoya', 'Hamburg'][Math.floor(rand(0, 5))], eta: `${Math.floor(rand(1, 21))}d` }) },
  { category: 'logistics', topicSuffix: 'logistics/vessel-tracking', severity: 'info', payloadGenerator: () => ({ vessel: `MV-${['Atlantic', 'Pacific', 'Nordic', 'Aurora', 'Horizon'][Math.floor(rand(0, 5))]}`, lat: +rand(30, 60).toFixed(2), lon: +rand(-10, 140).toFixed(2), speed: `${Math.floor(rand(12, 22))}kt`, cargo: ['titanium', 'steel coils', 'electronics', 'composites'][Math.floor(rand(0, 4))] }) },
  { category: 'logistics', topicSuffix: 'logistics/warehouse-movement', severity: 'info', payloadGenerator: () => ({ warehouse: `WH-${['Munich', 'Toulouse', 'Detroit', 'Shanghai'][Math.floor(rand(0, 4))]}`, action: ['inbound', 'outbound', 'transfer', 'pick'][Math.floor(rand(0, 4))], sku: `SKU-${Math.floor(rand(10000, 99999))}`, quantity: Math.floor(rand(1, 500)) }) },
  { category: 'logistics', topicSuffix: 'logistics/fleet-alert', severity: 'warning', payloadGenerator: () => ({ vehicle: `TRK-${Math.floor(rand(100, 999))}`, alert: ['delay', 'route-change', 'temp-excursion', 'geofence'][Math.floor(rand(0, 4))], location: ['A7 Highway', 'Port of Hamburg', 'CDG Airport', 'Swiss Alps'][Math.floor(rand(0, 4))] }) },
]

export const supplierTemplates: EventTemplate[] = [
  { category: 'supplier', topicSuffix: 'supplier/order-confirmation', severity: 'info', payloadGenerator: () => ({ supplier: ['TIMET', 'Hexcel', 'Alcoa', 'ThyssenKrupp', 'BASF', 'Toray', 'Safran'][Math.floor(rand(0, 7))], po: `PO-${Math.floor(rand(50000, 99999))}`, material: ['Ti-6Al-4V', 'carbon fiber', 'aluminum 7075', 'Inconel 718', 'epoxy resin'][Math.floor(rand(0, 5))], leadTime: `${Math.floor(rand(3, 45))}d` }) },
  { category: 'supplier', topicSuffix: 'supplier/quality-cert', severity: 'info', payloadGenerator: () => ({ supplier: ['TIMET', 'Hexcel', 'Alcoa'][Math.floor(rand(0, 3))], certType: ['mill-cert', 'CoC', 'test-report', 'NADCAP'][Math.floor(rand(0, 4))], lot: `LOT-${Math.floor(rand(10000, 99999))}`, status: 'approved' }) },
  { category: 'supplier', topicSuffix: 'supplier/capacity-update', severity: 'info', payloadGenerator: () => ({ supplier: ['ThyssenKrupp', 'BASF', 'Mitsubishi', 'Safran'][Math.floor(rand(0, 4))], capacityPct: Math.floor(rand(60, 98)), nextAvailable: `${Math.floor(rand(1, 30))}d`, material: ['steel', 'composites', 'alloys', 'polymers'][Math.floor(rand(0, 4))] }) },
]
