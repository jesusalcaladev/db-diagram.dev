import { Panel } from '@xyflow/react'
import { Eye, EyeOff, Grid, Maximize2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { motion } from 'motion/react'

interface PanelBottomLeftProps {
  onChangeGrid: () => void
  onChangeMiniMap: () => void
  showGrid: boolean
  showMiniMap: boolean
}

export function PanelBottomLeft({
  onChangeGrid: handleChangeGrid,
  onChangeMiniMap: handleChangeMiniMap,
  showGrid,
  showMiniMap,
}: PanelBottomLeftProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

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
    <Panel position='bottom-left' className='m-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='rounded-xl p-5 shadow-2xl'
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(32, 32, 32, 0.6))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <h3 className='text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4'>
          View Options
        </h3>
        <div className='space-y-2.5'>
          <motion.button
            onClick={handleChangeGrid}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2.5 ${showGrid
              ? 'bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-300 shadow-lg shadow-green-500/20'
              : 'bg-black/20 text-gray-300 hover:bg-black/30'}`}
          >
            <Grid className={`w-4 h-4 ${showGrid ? 'text-green-300' : 'text-gray-400'}`} />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </motion.button>
          <motion.button
            onClick={handleChangeMiniMap}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2.5 ${showMiniMap
              ? 'bg-gradient-to-r from-blue-500/30 to-blue-400/20 text-blue-300 shadow-lg shadow-blue-500/20'
              : 'bg-black/20 text-gray-300 hover:bg-black/30'}`}
          >
            {showMiniMap ? (
              <EyeOff className='w-4 h-4 text-blue-300' />
            ) : (
              <Eye className='w-4 h-4 text-gray-400' />
            )}
            {showMiniMap ? 'Hide MiniMap' : 'Show MiniMap'}
          </motion.button>
          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-500/30 to-purple-400/20 text-purple-300 shadow-lg shadow-purple-500/20'
          >
            <Maximize2 className='w-4 h-4 text-purple-300' />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </motion.button>
        </div>
      </motion.div>
    </Panel>
  )
}
