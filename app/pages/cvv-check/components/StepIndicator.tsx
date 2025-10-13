import React from "react"
import { LucideIcon } from "lucide-react"

interface Step {
  id: string
  label: string
  icon: LucideIcon
}

interface StepIndicatorProps {
  currentStep: string
  steps: Step[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = index < currentIndex
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-110' 
                  : isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                isActive 
                  ? 'text-blue-600' 
                  : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`ml-4 w-8 h-0.5 transition-colors duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
