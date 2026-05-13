'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { iotTemplates, mesTemplates, erpTemplates, logisticsTemplates, supplierTemplates } from '@/data/event-templates'
import { generateId, pick } from '@/lib/utils'
import { PLANTS, EVENT_INTERVAL_IOT, EVENT_INTERVAL_MES, EVENT_INTERVAL_ERP } from '@/lib/constants'
import { SolaceEvent } from '@/types'

export function useEventStream() {
  const addEvent = useSimulationStore((s) => s.addEvent)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const plant = selectedFlow?.plant || pick(PLANTS).id
    const line = selectedFlow?.line || 'line-1'

    function createEvent(templates: typeof iotTemplates): SolaceEvent {
      const template = pick(templates)
      return {
        id: generateId(),
        timestamp: Date.now(),
        topic: `solace/${plant}/${line}/${template.topicSuffix}`,
        category: template.category,
        payload: template.payloadGenerator(),
        severity: template.severity,
      }
    }

    const iotInterval = setInterval(() => {
      addEvent(createEvent(iotTemplates))
    }, EVENT_INTERVAL_IOT + Math.random() * 200)

    const mesInterval = setInterval(() => {
      addEvent(createEvent(mesTemplates))
    }, EVENT_INTERVAL_MES + Math.random() * 1000)

    const erpInterval = setInterval(() => {
      addEvent(createEvent(erpTemplates))
    }, EVENT_INTERVAL_ERP + Math.random() * 2000)

    const logisticsInterval = setInterval(() => {
      addEvent(createEvent(logisticsTemplates))
    }, 800 + Math.random() * 1200)

    const supplierInterval = setInterval(() => {
      addEvent(createEvent(supplierTemplates))
    }, 1500 + Math.random() * 2000)

    intervalsRef.current = [iotInterval, mesInterval, erpInterval, logisticsInterval, supplierInterval]

    return () => {
      intervalsRef.current.forEach(clearInterval)
    }
  }, [addEvent, selectedFlow?.plant, selectedFlow?.line])
}
