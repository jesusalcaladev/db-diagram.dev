import { Panel, type Edge, type Node } from '@xyflow/react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import type { ModelBaseDB } from '../types'

interface PanelRightProps {
  nodes: Node[]
  edges: Edge[]
  dbType: ModelBaseDB
  onExport: () => void
}

export function PanelRight({
  nodes,
  edges,
  dbType,
  onExport: handleExport,
}: PanelRightProps) {
  return (
    <Panel position='top-right' className='m-4'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          onClick={handleExport}
          variant='primary'
          className='mb-4 w-full shadow-lg shadow-blue-500/20'
          icon={<Download className='w-4 h-4' />}
        >
          Export PNG
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='rounded-xl p-5 shadow-2xl'
        style={{
          background:
            'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(32, 32, 32, 0.6))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        <h3 className='text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-3'>
          Database Info
        </h3>
        <div className='text-xs text-gray-400 space-y-2.5'>
          <div className='flex justify-between items-center px-3 py-2 rounded-lg bg-black/20'>
            <span className='text-gray-300'>Type</span>
            <span
              className={`px-2 py-1 rounded-md font-medium ${
                dbType === 'mysql'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {dbType.toUpperCase()}
            </span>
          </div>
          <div className='flex justify-between items-center px-3 py-2 rounded-lg bg-black/20'>
            <span className='text-gray-300'>
              {dbType === 'mysql' ? 'Tables' : 'Collections'}
            </span>
            <span className='px-2 py-1 rounded-md font-medium bg-purple-500/20 text-purple-300'>
              {nodes.length}
            </span>
          </div>
          <div className='flex justify-between items-center px-3 py-2 rounded-lg bg-black/20'>
            <span className='text-gray-300'>Relationships</span>
            <span className='px-2 py-1 rounded-md font-medium bg-indigo-500/20 text-indigo-300'>
              {edges.length}
            </span>
          </div>
        </div>
      </motion.div>
    </Panel>
  )
}
