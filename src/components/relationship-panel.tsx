import { type Edge } from '@xyflow/react'
import { Link, X, Database, ArrowRight, Trash2, Info } from 'lucide-react'
import { motion } from 'motion/react'

interface RelationshipPanelProps {
  selectedEdge: Edge | null
  onClose: () => void
  onDeleteRelationship: (edgeId: string) => void
}

/**
 * Panel component to display and manage relationship details
 * Shows information about selected connections between table fields
 */
export function RelationshipPanel({
  selectedEdge,
  onClose,
  onDeleteRelationship,
}: RelationshipPanelProps) {
  if (!selectedEdge) return null

  const getRelationshipType = () => {
    const sourceHandle = selectedEdge.sourceHandle
    const targetHandle = selectedEdge.targetHandle

    if (
      sourceHandle?.includes('-source') &&
      targetHandle?.includes('-target')
    ) {
      return 'Field Relationship'
    }
    return 'Table Relationship'
  }

  const getSourceInfo = () => {
    if (selectedEdge.sourceHandle?.includes('-source')) {
      return selectedEdge.sourceHandle.replace('-source', '')
    }
    return 'Table'
  }

  const getTargetInfo = () => {
    if (selectedEdge.targetHandle?.includes('-target')) {
      return selectedEdge.targetHandle.replace('-target', '')
    }
    return 'Table'
  }

  return (
    <div className='absolute top-4 right-4 min-w-[320px] z-10'>
      <div
        className='backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden'
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header */}
        <div
          className='px-6 py-4 border-b'
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-blue-500/20'>
                <Link className='w-5 h-5 text-blue-400' />
              </div>
              <div>
                <h3 className='text-lg font-bold text-white'>
                  Database Relationship
                </h3>
                <p className='text-xs text-gray-400 mt-0.5'>
                  Connection Details & Management
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Relationship Type Badge */}
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-emerald-500/20'>
              <Info className='w-4 h-4 text-emerald-400' />
            </div>
            <div>
              <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
                Relationship Type
              </p>
              <div className='flex items-center gap-2 mt-1'>
                <span className='px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'>
                  {getRelationshipType()}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Flow */}
          <div className='space-y-4'>
            {/* Source */}
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Database className='w-4 h-4 text-blue-400' />
                  <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
                    Source
                  </span>
                </div>
                <div className='p-3 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                  <p className='text-sm font-semibold text-blue-300'>
                    {selectedEdge.source}
                  </p>
                  {selectedEdge.sourceHandle?.includes('-source') && (
                    <p className='text-xs text-gray-400 mt-1'>
                      Field:{' '}
                      <span className='text-blue-300 font-mono'>
                        {getSourceInfo()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className='flex justify-center'>
              <div className='p-2 rounded-full bg-purple-500/20'>
                <ArrowRight className='w-4 h-4 text-purple-400' />
              </div>
            </div>

            {/* Target */}
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Database className='w-4 h-4 text-purple-400' />
                  <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
                    Target
                  </span>
                </div>
                <div className='p-3 rounded-lg bg-purple-500/10 border border-purple-500/20'>
                  <p className='text-sm font-semibold text-purple-300'>
                    {selectedEdge.target}
                  </p>
                  {selectedEdge.targetHandle?.includes('-target') && (
                    <p className='text-xs text-gray-400 mt-1'>
                      Field:{' '}
                      <span className='text-purple-300 font-mono'>
                        {getTargetInfo()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Connection ID */}
          <div className='p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mb-1'>
              Connection ID
            </p>
            <p className='text-xs text-gray-300 font-mono break-all'>
              {selectedEdge.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className='px-6 py-4 border-t'
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <motion.button
            onClick={() => onDeleteRelationship(selectedEdge.id)}
            className='flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200'
            whileHover={{
              scale: 1.02,
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className='w-4 h-4' />
            <span className='font-medium'>Delete Relationship</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
