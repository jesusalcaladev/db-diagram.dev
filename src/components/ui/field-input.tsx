import { motion } from 'motion/react'

interface FieldInputProps {
  value: string
  onChange: (text: string) => void
  onSave: () => void
}

export function FieldInput({
  value,
  onChange: handleChangeValue,
  onSave: handleSave,
}: FieldInputProps) {
  return (
    <motion.input
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className='bg-gray-700 text-gray-100 px-2 py-1 rounded outline-none focus:ring-2 ring-blue-500 text-sm font-semibold'
      value={value}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onChange={(e) => handleChangeValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
      autoFocus
    />
  )
}
