"use client"

import { useEffect, useState } from 'react'
import { initMocks } from '@/mocks/init'
import { MSWDebugPanel } from './MSWDebugPanel'

interface MSWProviderProps {
  children: React.ReactNode
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  useEffect(() => {
    // 检查是否启用MSW
    const isMSWEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // 确保只在客户端运行
    if (typeof window !== 'undefined' && isDevelopment && isMSWEnabled) {
      initMocks().then(() => {
        setIsReady(true)
        console.log('✅ MSW 模拟服务已启动')
      }).catch((error) => {
        console.error('❌ MSW 启动失败:', error)
        setIsReady(true) // 即使MSW启动失败，也继续渲染应用
      })
    } else {
      setIsReady(true)
    }
  }, [])

  // 在生产环境中直接渲染子组件
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  // 在开发环境中等待MSW启动完成
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在启动模拟服务...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <MSWDebugPanel 
          isVisible={showDebugPanel} 
          onToggle={() => setShowDebugPanel(!showDebugPanel)} 
        />
      )}
    </>
  )
}
