import React from "react"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface StatusAlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose: () => void
}

export function StatusAlert({ type, message, onClose }: StatusAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getStyles()} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIcon()}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
