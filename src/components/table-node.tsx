import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react'
import { Table, Database, Trash2, Copy, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TypesValues } from '../constants/types-values'

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
  const [editingField, setEditingField] = useState<{
    index: number
    type: 'name' | 'type' | 'tableName'
  } | null>(null)
  const [editValue, setEditValue] = useState('')

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
      addNodes([newNode])
    }
  }

  const handleFieldEdit = (
    index: number,
    type: 'name' | 'type',
    currentValue: string
  ) => {
    setEditingField({ index, type })
    setEditValue(currentValue)
  }

  const handleFieldSave = () => {
    if (!editingField) return

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          if (editingField.type === 'tableName') {
            return {
              ...node,
              data: {
                ...node.data,
                label: editValue,
              },
            }
          } else {
            const updatedFields = [...fields]
            if (editingField.type === 'name') {
              updatedFields[editingField.index].name = editValue
            } else {
              updatedFields[editingField.index].type = editValue
            }
            return {
              ...node,
              data: {
                ...node.data,
                fields: updatedFields,
              },
            }
          }
        }
        return node
      })
    )
    setEditingField(null)
  }

  const handleAddField = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              fields: [...fields, { name: 'new_field', type: 'string' }],
            },
          }
        }
        return node
      })
    )
  }

  return (
    <AnimatePresence>
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
            {editingField?.type === 'tableName' ? (
              <motion.input
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className='bg-gray-700 text-gray-100 px-2 py-1 rounded outline-none focus:ring-2 ring-blue-500 text-sm font-semibold'
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleFieldSave}
                onKeyDown={(e) => e.key === 'Enter' && handleFieldSave()}
                autoFocus
              />
            ) : (
              <h3
                className='text-sm font-semibold text-gray-100 cursor-pointer hover:text-blue-400 transition-colors'
                onDoubleClick={() => {
                  setEditingField({ index: -1, type: 'tableName' })
                  setEditValue(label)
                }}
              >
                {label}
              </h3>
            )}
          </div>
        </div>

        {/* Table Fields */}
        <div className='p-2'>
          {fields.length > 0 ? (
            <div className='space-y-1'>
              {fields.map((field, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className='relative flex justify-between items-center px-2 py-1.5 text-xs rounded transition-all duration-200 group hover:bg-gray-800/50'
                >
                  <button
                    onClick={() => {
                      setNodes((nodes) =>
                        nodes.map((node) => {
                          if (node.id === id) {
                            const updatedFields = [...fields]
                            updatedFields.splice(index, 1)
                            return {
                              ...node,
                              data: {
                                ...node.data,
                                fields: updatedFields,
                              },
                            }
                          }
                          return node
                        })
                      )
                    }}
                    className='absolute left-0 -ml-6 p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200'
                    title='Delete Field'
                  >
                    <Trash2 className='w-3 h-3' />
                  </button>
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

                  {editingField?.index === index &&
                  editingField?.type === 'name' ? (
                    <motion.input
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      className='bg-gray-700/50 backdrop-blur-sm text-gray-100 px-3 py-1.5 rounded-md outline-none border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner shadow-black/10 placeholder-gray-400 w-full transition-all duration-200'
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleFieldSave}
                      onKeyDown={(e) => e.key === 'Enter' && handleFieldSave()}
                      placeholder='Field name...'
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() =>
                        handleFieldEdit(index, 'name', field.name)
                      }
                      className={`font-medium cursor-pointer ${
                        field.isPrimary ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    >
                      {field.name}
                    </span>
                  )}
                  {editingField?.index === index &&
                  editingField?.type === 'type' ? (
                    <motion.select
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      className='bg-gray-700/50 backdrop-blur-sm text-gray-200 px-3 py-1.5 rounded-md outline-none border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner shadow-black/10 w-full transition-all duration-200 cursor-pointer appearance-none bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat'
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleFieldSave}
                      autoFocus
                    >
                      {Object.entries(TypesValues[type]).map(
                        ([category, types]) => (
                          <optgroup
                            key={category}
                            label={category.toUpperCase()}
                          >
                            {types.map((dataType) => (
                              <option key={dataType} value={dataType}>
                                {dataType}
                              </option>
                            ))}
                          </optgroup>
                        )
                      )}
                    </motion.select>
                  ) : (
                    <span
                      onDoubleClick={() =>
                        handleFieldEdit(index, 'type', field.type)
                      }
                      className='text-gray-400 text-[10px] font-mono cursor-pointer'
                    >
                      {field.type}
                    </span>
                  )}

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
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-xs text-gray-500 text-center py-3'>
              No fields defined
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddField}
            className='w-full mt-2 p-2 rounded-md text-gray-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2'
          >
            <Plus className='w-4 h-4' />
            <span className='text-xs'>Add Field</span>
          </motion.button>
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
    </AnimatePresence>
  )
}
