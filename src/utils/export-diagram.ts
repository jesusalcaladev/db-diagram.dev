import type { Edge, Node } from '@xyflow/react'
import { type ModelBaseDB } from '../types'
import { toPng } from 'html-to-image'

export function exportToJson(
  nodes: Node[],
  edges: Edge[],
  dbType: ModelBaseDB
) {
  const diagramData = {
    nodes,
    edges,
    dbType,
    timestamp: new Date().toISOString(),
  }
  const dataStr = JSON.stringify(diagramData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `db-diagram-${dbType}-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPng(
  flowRef: React.RefObject<null>,
  fitView: () => void
) {
  if (!flowRef.current) return
  fitView()
  toPng(flowRef.current, {
    filter: (node) => {
      // Exclude UI elements like minimap, controls, and panels
      const excludeClasses = [
        'react-flow__minimap',
        'react-flow__controls',
        'react-flow__panel',
        'lucide-icon',
        'react-flow__node-toolbar',
        'toolbar',
        'button-add-field',
      ]
      return !excludeClasses.some((className) =>
        node?.classList?.contains(className)
      )
    },
    backgroundColor: '#1a1a1a',
    quality: 1,
    pixelRatio: 2,
  }).then((dataUrl) => {
    const link = document.createElement('a')
    link.download = 'diagram.png'
    link.href = dataUrl
    link.click()
  })
}
