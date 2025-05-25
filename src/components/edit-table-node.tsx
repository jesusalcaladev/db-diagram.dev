import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Database, Table } from 'lucide-react'
import { motion } from 'motion/react'

interface Field {
  name: string
  type: string
  isPrimary?: boolean
}

interface EditTableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { label: string; fields: Field[] }) => void
  initialData: {
    label: string
    type: 'mysql' | 'mongodb'
    fields: Field[]
  }
}

/**
 * Modal component for editing table/collection properties
 * Allows editing name and fields with their types
 */
export function EditTableModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditTableModalProps) {
  const [label, setLabel] = useState(initialData.label)
  const [fields, setFields] = useState<Field[]>(initialData.fields)
  const { type } = initialData

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setLabel(initialData.label)
      setFields(initialData.fields)
    }
  }, [isOpen, initialData])

  const handleAddField = () => {
    const newField: Field = {
      name: '',
      type: type === 'mysql' ? 'VARCHAR(255)' : 'String',
      isPrimary: false,
    }
    setFields([...fields, newField])
  }

  const handleRemoveField = (index: number) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }

  const handleFieldChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFields(newFields)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ label, fields })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop with blur effect */}
      <motion.div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal container */}
      <motion.div
        className='relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl shadow-2xl'
        style={{
          backgroundColor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        }}
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div
          className='sticky top-0 z-10 flex items-center justify-between p-4 border-b'
          style={{
            backgroundColor: '#121212',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background:
              type === 'mysql'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.05))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.05))',
          }}
        >
          <div className='flex items-center gap-3'>
            {type === 'mysql' ? (
              <div className='p-2 rounded-md bg-blue-500/20'>
                <Table className='w-5 h-5 text-blue-400' />
              </div>
            ) : (
              <div className='p-2 rounded-md bg-green-500/20'>
                <Database className='w-5 h-5 text-green-400' />
              </div>
            )}
            <h2 className='text-lg font-semibold text-white'>
              Edit {type === 'mysql' ? 'Table' : 'Collection'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-white/10 transition-colors'
          >
            <X className='w-5 h-5 text-gray-400' />
          </button>
        </div>

        {/* Form */}
        <div
          className='overflow-y-auto custom-scrollbar'
          style={{ maxHeight: 'calc(90vh - 60px)' }}
        >
          <form onSubmit={handleSubmit} className='p-4'>
            <div className='space-y-5'>
              {/* Name field */}
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {type === 'mysql' ? 'Table' : 'Collection'} Name
                </label>
                <input
                  type='text'
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className='w-full px-4 py-2 rounded-lg text-white bg-gray-800/50 border border-gray-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all'
                  placeholder={
                    type === 'mysql' ? 'Table name' : 'Collection name'
                  }
                  required
                />
              </div>

              {/* Fields section */}
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Fields
                  </label>
                  <motion.button
                    type='button'
                    onClick={handleAddField}
                    className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className='w-3.5 h-3.5' /> Add Field
                  </motion.button>
                </div>

                {/* Fields list */}
                <div className='space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar'>
                  {fields.map((field, index) => (
                    <motion.div
                      key={index}
                      className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/80 transition-all'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className='flex-1 grid grid-cols-12 gap-3'>
                        {/* Field name */}
                        <div className='col-span-5'>
                          <input
                            type='text'
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(index, 'name', e.target.value)
                            }
                            className='w-full px-3 py-2 text-sm rounded-lg text-white bg-gray-900/50 border border-gray-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all'
                            placeholder='Field name'
                            required
                          />
                        </div>

                        {/* Field type */}
                        <div className='col-span-5'>
                          {type === 'mysql' ? (
                            <select
                              value={field.type}
                              onChange={(e) =>
                                handleFieldChange(index, 'type', e.target.value)
                              }
                              className='w-full px-3 py-2 text-sm rounded-lg text-white bg-gray-900/50 border border-gray-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none'
                              style={{
                                backgroundImage:
                                  'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem',
                              }}
                            >
                              <option value='INT'>INT</option>
                              <option value='VARCHAR(255)'>VARCHAR(255)</option>
                              <option value='TEXT'>TEXT</option>
                              <option value='BOOLEAN'>BOOLEAN</option>
                              <option value='DATE'>DATE</option>
                              <option value='TIMESTAMP'>TIMESTAMP</option>
                              <option value='DECIMAL(10,2)'>
                                DECIMAL(10,2)
                              </option>
                              <option value='FLOAT'>FLOAT</option>
                              <option value='DOUBLE'>DOUBLE</option>
                              <option value='JSON'>JSON</option>
                            </select>
                          ) : (
                            <select
                              value={field.type}
                              onChange={(e) =>
                                handleFieldChange(index, 'type', e.target.value)
                              }
                              className='w-full px-3 py-2 text-sm rounded-lg text-white bg-gray-900/50 border border-gray-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none'
                              style={{
                                backgroundImage:
                                  'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem',
                              }}
                            >
                              <option value='String'>String</option>
                              <option value='Number'>Number</option>
                              <option value='Boolean'>Boolean</option>
                              <option value='Date'>Date</option>
                              <option value='ObjectId'>ObjectId</option>
                              <option value='Array'>Array</option>
                              <option value='Object'>Object</option>
                              <option value='Mixed'>Mixed</option>
                              <option value='Buffer'>Buffer</option>
                              <option value='Map'>Map</option>
                            </select>
                          )}
                        </div>

                        {/* Primary key checkbox */}
                        <div className='col-span-2'>
                          <label className='flex items-center space-x-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={field.isPrimary || false}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  'isPrimary',
                                  e.target.checked
                                )
                              }
                              className='w-4 h-4 rounded text-blue-500 bg-gray-900/50 border-gray-700 focus:ring-blue-500 focus:ring-offset-gray-900'
                            />
                            <span className='text-xs text-gray-300'>
                              Primary
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Delete field button */}
                      <motion.button
                        type='button'
                        onClick={() => handleRemoveField(index)}
                        className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                        title='Remove field'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className='w-4 h-4' />
                      </motion.button>
                    </motion.div>
                  ))}

                  {fields.length === 0 && (
                    <motion.div
                      className='flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-800/10 rounded-lg border border-dashed border-gray-700/50'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className='p-3 rounded-full bg-gray-800/50 mb-3'>
                        <Plus className='w-5 h-5 text-blue-400' />
                      </div>
                      <p className='text-sm'>No fields added yet</p>
                      <p className='text-xs mt-1'>
                        Click "Add Field" to create one
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex justify-end gap-3 pt-4 border-t border-gray-800'>
                <motion.button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/70 hover:bg-gray-700 rounded-lg transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
