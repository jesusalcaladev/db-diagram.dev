import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useState, useCallback } from 'react'
import {
  Table,
  Database,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Grid,
  Maximize2,
} from 'lucide-react'
import { TableNode } from './components/table-node'
import { RelationshipPanel } from './components/eelationship-panel'

const nodeTypes = {
  tableNode: TableNode,
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedDbType, setSelectedDbType] = useState<'mysql' | 'mongodb'>(
    'mysql'
  )
  const [nodeId, setNodeId] = useState(1)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      // Enhanced connection with relationship information
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          color: '#64748b',
        },
        label: getRelationshipLabel(params),
        labelStyle: { fill: '#e2e8f0', fontSize: 10 },
        labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 },
      }
      setEdges((eds: Edge[]) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  // Helper function to determine relationship label
  const getRelationshipLabel = (params: Connection) => {
    const sourceHandle = params.sourceHandle
    const targetHandle = params.targetHandle

    if (
      sourceHandle?.includes('-source') &&
      targetHandle?.includes('-target')
    ) {
      const sourceField = sourceHandle.replace('-source', '')
      const targetField = targetHandle.replace('-target', '')
      return `${sourceField} → ${targetField}`
    }

    return 'Relationship'
  }

  const addNewTable = useCallback(() => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'tableNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label:
          selectedDbType === 'mysql'
            ? `Table_${nodeId}`
            : `Collection_${nodeId}`,
        type: selectedDbType,
        fields:
          selectedDbType === 'mysql'
            ? [
                { name: 'id', type: 'INT', isPrimary: true },
                { name: 'name', type: 'VARCHAR(255)' },
                { name: 'created_at', type: 'TIMESTAMP' },
              ]
            : [
                { name: '_id', type: 'ObjectId', isPrimary: true },
                { name: 'name', type: 'String' },
                { name: 'createdAt', type: 'Date' },
              ],
      },
    }
    setNodes((nds) => nds.concat(newNode))
    setNodeId((id) => id + 1)
  }, [nodeId, selectedDbType, setNodes])

  const clearCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
    setNodeId(1)
    setSelectedEdge(null)
  }, [setNodes, setEdges])

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null)
  }, [])

  const deleteRelationship = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
      setSelectedEdge(null)
    },
    [setEdges]
  )

  const exportDiagram = useCallback(() => {
    const diagramData = {
      nodes,
      edges,
      dbType: selectedDbType,
      timestamp: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(diagramData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `db-diagram-${selectedDbType}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [nodes, edges, selectedDbType])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div className='h-screen text-white' style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <header
        className='border-b px-6 py-4'
        style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold text-blue-400'>DB Diagram</h1>
            <span className='text-slate-400'>Database Design Tool</span>
          </div>

          {/* Database Type Selector */}
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-slate-400'>Database Type:</span>
            <div
              className='flex rounded-lg p-1'
              style={{ backgroundColor: '#2a2a2a' }}
            >
              <button
                onClick={() => setSelectedDbType('mysql')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDbType === 'mysql'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={
                  selectedDbType !== 'mysql'
                    ? { backgroundColor: 'transparent' }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (selectedDbType !== 'mysql') {
                    e.currentTarget.style.backgroundColor = '#3a3a3a'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDbType !== 'mysql') {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                MySQL
              </button>
              <button
                onClick={() => setSelectedDbType('mongodb')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDbType === 'mongodb'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={
                  selectedDbType !== 'mongodb'
                    ? { backgroundColor: 'transparent' }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (selectedDbType !== 'mongodb') {
                    e.currentTarget.style.backgroundColor = '#3a3a3a'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDbType !== 'mongodb') {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                MongoDB
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className='h-[calc(100vh-80px)] relative'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          style={{ backgroundColor: '#121212' }}
          fitView
        >
          {showGrid && (
            <Background color='#2a2a2a' gap={20} size={1} variant='dots' />
          )}
          <Controls
            style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
            showInteractive={false}
          />
          {showMiniMap && (
            <MiniMap
              style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
              nodeColor='#3B82F6'
              maskColor='rgba(0, 0, 0, 0.3)'
            />
          )}

          {/* Enhanced Toolbar Panel */}
          <Panel position='top-left' className='m-4'>
            <div
              className='rounded-lg p-4 shadow-xl'
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#2a2a2a',
                border: '1px solid #2a2a2a',
              }}
            >
              <h3 className='text-sm font-semibold text-gray-200 mb-3'>
                Tools
              </h3>
              <div className='space-y-2'>
                <button
                  onClick={addNewTable}
                  className='w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2'
                >
                  {selectedDbType === 'mysql' ? (
                    <Table className='w-4 h-4' />
                  ) : (
                    <Database className='w-4 h-4' />
                  )}
                  {selectedDbType === 'mysql' ? 'Add Table' : 'Add Collection'}
                </button>
                <button
                  onClick={exportDiagram}
                  className='w-full px-4 py-2 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2'
                  style={{ backgroundColor: '#2a2a2a' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#3a3a3a')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#2a2a2a')
                  }
                >
                  <Download className='w-4 h-4 text-gray-300' />
                  Export JSON
                </button>
                <button
                  onClick={clearCanvas}
                  className='w-full px-4 py-2 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2'
                  style={{ backgroundColor: '#2a2a2a' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#3a3a3a')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#2a2a2a')
                  }
                >
                  <Trash2 className='w-4 h-4 text-gray-300' />
                  Clear Canvas
                </button>
              </div>
            </div>
          </Panel>

          {/* View Options Panel */}
          <Panel position='bottom-left' className='m-4'>
            <div
              className='rounded-lg p-4 shadow-xl'
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#2a2a2a',
                border: '1px solid #2a2a2a',
              }}
            >
              <h3 className='text-sm font-semibold text-gray-200 mb-3'>
                View Options
              </h3>
              <div className='space-y-2'>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    showGrid
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'text-white'
                  }`}
                  style={!showGrid ? { backgroundColor: '#2a2a2a' } : {}}
                  onMouseEnter={(e) => {
                    if (!showGrid)
                      e.currentTarget.style.backgroundColor = '#3a3a3a'
                  }}
                  onMouseLeave={(e) => {
                    if (!showGrid)
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                  }}
                >
                  <Grid className='w-4 h-4' />
                  {showGrid ? 'Hide Grid' : 'Show Grid'}
                </button>
                <button
                  onClick={() => setShowMiniMap(!showMiniMap)}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    showMiniMap
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'text-white'
                  }`}
                  style={!showMiniMap ? { backgroundColor: '#2a2a2a' } : {}}
                  onMouseEnter={(e) => {
                    if (!showMiniMap)
                      e.currentTarget.style.backgroundColor = '#3a3a3a'
                  }}
                  onMouseLeave={(e) => {
                    if (!showMiniMap)
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                  }}
                >
                  {showMiniMap ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                  {showMiniMap ? 'Hide MiniMap' : 'Show MiniMap'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className='w-full px-4 py-2 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2'
                  style={{ backgroundColor: '#2a2a2a' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#3a3a3a')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#2a2a2a')
                  }
                >
                  <Maximize2 className='w-4 h-4 text-gray-300' />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </div>
          </Panel>

          {/* Enhanced Info Panel */}
          <Panel position='top-right' className='m-4'>
            <div
              className='rounded-lg p-4 shadow-xl'
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#2a2a2a',
                border: '1px solid #2a2a2a',
              }}
            >
              <h3 className='text-sm font-semibold text-gray-200 mb-2'>
                Database Info
              </h3>
              <div className='text-xs text-gray-400 space-y-1'>
                <div className='flex justify-between'>
                  <span>Type:</span>
                  <span
                    className={
                      selectedDbType === 'mysql'
                        ? 'text-blue-400'
                        : 'text-green-400'
                    }
                  >
                    {selectedDbType.toUpperCase()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>
                    {selectedDbType === 'mysql' ? 'Tables:' : 'Collections:'}
                  </span>
                  <span className='text-white'>{nodes.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Relationships:</span>
                  <span className='text-white'>{edges.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Grid:</span>
                  <span
                    className={showGrid ? 'text-green-400' : 'text-red-400'}
                  >
                    {showGrid ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>MiniMap:</span>
                  <span
                    className={showMiniMap ? 'text-green-400' : 'text-red-400'}
                  >
                    {showMiniMap ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>

        {/* Relationship Panel */}
        <RelationshipPanel
          selectedEdge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onDeleteRelationship={deleteRelationship}
        />
      </div>
    </div>
  )
}

export default App
