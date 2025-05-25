import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react'
import { Table, Database, Trash2, Edit3, Copy } from 'lucide-react'
import { useState } from 'react'
import { EditTableModal } from './edit-table-node'

interface TableNodeProps {
  id: string
  data: {
    label: string
    type: 'mysql' | 'mongodb'
    fields?: Array<{
      name: string
      type: string
      isPrimary?: boolean
    }>
  }
}

/**
 * Custom node component for database tables/collections
 * Renders a dark-themed table with fields and connection handles
 */
export function TableNode({ id, data }: TableNodeProps) {
  const { label, type, fields = [] } = data
  const { deleteElements, getNode, addNodes, setNodes } = useReactFlow()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] })
  }

  const handleDuplicate = () => {
    const node = getNode(id)
    if (node) {
      const newNode = {
        ...node,
        id: `${id}-copy-${Date.now()}`,
        position: {
          x: node.position.x + 250,
          y: node.position.y + 50,
        },
        data: {
          ...node.data,
          label: `${node.data.label}_copy`,
        },
      }
      // Agregate new node duplicated
      addNodes([newNode])

      // This would need to be handled by the parent component
      console.log('Duplicate node:', newNode)
    }
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedData: {
    label: string
    fields: Array<{ name: string; type: string; isPrimary?: boolean }>
  }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: updatedData.label,
              fields: updatedData.fields,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <>
      <NodeToolbar position={Position.Top} offset={10}>
        <div
          className='flex items-center gap-1 p-1 rounded-lg backdrop-blur-xl border'
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <button
            onClick={handleDuplicate}
            className='p-2 rounded-md text-gray-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200'
            title='Duplicate Table'
          >
            <Copy className='w-4 h-4' />
          </button>
          <button
            onClick={handleEdit}
            className='p-2 rounded-md text-gray-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all duration-200'
            title='Edit Table'
          >
            <Edit3 className='w-4 h-4' />
          </button>
          <div className='w-px h-6 bg-gray-600 mx-1'></div>
          <button
            onClick={handleDelete}
            className='p-2 rounded-md text-gray-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200'
            title='Delete Table'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </NodeToolbar>

      <div
        className='rounded-lg shadow-xl min-w-[200px] transition-all duration-200 hover:shadow-2xl'
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
      >
        {/* Table Header */}
        <div
          className='px-4 py-3 rounded-t-lg'
          style={{
            background:
              type === 'mysql'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
            borderBottom: '1px solid #3a3a3a',
          }}
        >
          <div className='flex items-center gap-2'>
            {type === 'mysql' ? (
              <div className='p-1.5 rounded-md bg-blue-500/20'>
                <Table className='w-4 h-4 text-blue-400' />
              </div>
            ) : (
              <div className='p-1.5 rounded-md bg-green-500/20'>
                <Database className='w-4 h-4 text-green-400' />
              </div>
            )}
            <h3 className='text-sm font-semibold text-gray-100'>{label}</h3>
          </div>
        </div>

        {/* Table Fields */}
        <div className='p-2'>
          {fields.length > 0 ? (
            <div className='space-y-1'>
              {fields.map((field, index) => (
                <div
                  key={index}
                  className='relative flex justify-between items-center px-2 py-1.5 text-xs rounded transition-all duration-200 group hover:bg-gray-800/50'
                >
                  {/* Left handle for each field */}
                  <Handle
                    type='target'
                    position={Position.Left}
                    id={`${field.name}-target`}
                    className='w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125'
                    style={{
                      backgroundColor: type === 'mysql' ? '#3B82F6' : '#22C55E',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      left: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />

                  <span
                    className={`font-medium ${
                      field.isPrimary ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  >
                    {field.name}
                  </span>
                  <span className='text-gray-400 text-[10px] font-mono'>
                    {field.type}
                  </span>

                  {/* Right handle for each field */}
                  <Handle
                    type='source'
                    position={Position.Right}
                    id={`${field.name}-source`}
                    className='w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125'
                    style={{
                      backgroundColor: type === 'mysql' ? '#3B82F6' : '#22C55E',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      right: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-xs text-gray-500 text-center py-3'>
              No fields defined
            </div>
          )}
        </div>

        {/* Main table connection handles */}
        <Handle
          type='target'
          position={Position.Left}
          id='table-target'
          className='w-3 h-3 transition-all duration-200 hover:scale-110'
          style={{
            backgroundColor: type === 'mysql' ? '#3B82F6' : '#22C55E',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            top: '20px',
          }}
        />
        <Handle
          type='source'
          position={Position.Right}
          id='table-source'
          className='w-3 h-3 transition-all duration-200 hover:scale-110'
          style={{
            backgroundColor: type === 'mysql' ? '#3B82F6' : '#22C55E',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            top: '20px',
          }}
        />
      </div>

      {/* Edit Modal */}
      <EditTableModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={{
          label,
          type,
          fields,
        }}
      />
    </>
  )
}
