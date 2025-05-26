import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-[0_8px_25px_-8px] hover:shadow-blue-500/50 border border-white/10',
  secondary:
    'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white hover:shadow-[0_8px_25px_-8px] hover:shadow-gray-500/30 border border-white/10',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white hover:shadow-[0_8px_25px_-8px] hover:shadow-red-500/50 border border-white/10',
  success:
    'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:shadow-[0_8px_25px_-8px] hover:shadow-green-500/50 border border-white/10',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-semibold',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg
        transition-all duration-300
        shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)]
        backdrop-blur-sm
        hover:scale-[1.02] active:scale-[0.98]
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-opacity-50
        ${
          variant === 'primary'
            ? 'focus:ring-blue-500'
            : variant === 'danger'
            ? 'focus:ring-red-500'
            : variant === 'success'
            ? 'focus:ring-green-500'
            : 'focus:ring-gray-500'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {icon && <span className='flex-shrink-0'>{icon}</span>}
      {children}
    </button>
  )
}
