import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useState, useCallback, useRef } from 'react'
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
import { Button } from './components/ui/button'
import { TableNode } from './components/table-node'
import { RelationshipPanel } from './components/relationship-panel'
import { type ModelBaseDB } from './types'
import { exportToJson, exportToPng } from './utils/export-diagram'
import { PanelRight } from './components/panel-right'
import { PanelBottomLeft } from './components/panel-bottom-left'
const nodeTypes = {
  tableNode: TableNode,
}

function App() {
  const { fitView } = useReactFlow()
  const flowRef = useRef(null)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedDbType, setSelectedDbType] = useState<ModelBaseDB>('mysql')
  const [nodeId, setNodeId] = useState(1)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showMiniMap, setShowMiniMap] = useState(true)

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

  return (
    <>
      <header
        className='border-b border-white/10 px-8 py-5 justify-between flex flex-row sticky top-0 z-50'
        style={{
          background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
          backdropFilter: 'blur(12px)',
          boxShadow:
            '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className='flex items-center justify-between gap-8'>
          <div className='flex items-center gap-6'>
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
              DB Diagram
            </h1>
            <div className='h-6 w-[1px] bg-white/10 mx-2' />
            <span className='text-slate-300 font-medium'>
              Database Design Tool
            </span>
          </div>
        </div>

        {/* Database Type Selector */}
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-slate-300 font-medium'>
            Database Type
          </span>
          <div
            className='flex items-center gap-2 px-2 py-1.5 rounded-xl'
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))',
              backdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setSelectedDbType('mysql')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedDbType === 'mysql'
                  ? 'bg-gradient-to-r from-blue-500/30 to-blue-400/20 text-blue-300 shadow-lg shadow-blue-500/20 scale-105'
                  : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 hover:scale-105'
              }`}
            >
              MySQL
            </button>
            <button
              onClick={() => setSelectedDbType('mongodb')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedDbType === 'mongodb'
                  ? 'bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-300 shadow-lg shadow-green-500/20 scale-105'
                  : 'text-slate-400 hover:text-green-300 hover:bg-green-500/10 hover:scale-105'
              }`}
            >
              MongoDB
            </button>
          </div>
        </div>
      </header>
      {/* Main Canvas Area */}
      <div className='h-[calc(100vh-80px)] relative'>
        <ReactFlow
          ref={flowRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          snapGrid={[15, 15]}
          snapToGrid
          style={{ backgroundColor: '#121212' }}
          fitView
        >
          {showGrid && (
            <Background color='#2a2a2a' gap={20} size={2} variant='dots' />
          )}
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
                <Button
                  onClick={addNewTable}
                  variant='primary'
                  fullWidth
                  icon={
                    selectedDbType === 'mysql' ? (
                      <Table className='w-4 h-4' />
                    ) : (
                      <Database className='w-4 h-4' />
                    )
                  }
                >
                  {selectedDbType === 'mysql' ? 'Add Table' : 'Add Collection'}
                </Button>
                <Button
                  onClick={() => {
                    exportToJson(nodes, edges, selectedDbType)
                  }}
                  variant='secondary'
                  fullWidth
                  icon={<Download className='w-4 h-4' />}
                >
                  Export JSON
                </Button>
                <Button
                  onClick={clearCanvas}
                  variant='danger'
                  fullWidth
                  icon={<Trash2 className='w-4 h-4' />}
                >
                  Clear Canvas
                </Button>
              </div>
            </div>
          </Panel>

          <PanelBottomLeft
            showGrid={showGrid}
            showMiniMap={showMiniMap}
            onChangeGrid={() => {
              setShowGrid(!showGrid)
            }}
            onChangeMiniMap={() => {
              setShowMiniMap(!showMiniMap)
            }}
          />

          <PanelRight
            dbType={selectedDbType}
            edges={edges}
            nodes={nodes}
            onExport={() => {
              exportToPng(flowRef, fitView)
            }}
          />
        </ReactFlow>

        {/* Relationship Panel */}
        <RelationshipPanel
          selectedEdge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onDeleteRelationship={deleteRelationship}
        />
      </div>
    </>
  )
}

function WrappedApp() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  )
}

export default WrappedApp
