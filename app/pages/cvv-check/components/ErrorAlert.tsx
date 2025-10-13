import React from "react"
import { XCircle, AlertTriangle } from "lucide-react"

interface ErrorAlertProps {
  message: string
  onClose: () => void
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
