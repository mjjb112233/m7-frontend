"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Eye, EyeOff, RefreshCw } from 'lucide-react'

interface MSWDebugPanelProps {
  isVisible: boolean
  onToggle: () => void
}

export function MSWDebugPanel({ isVisible, onToggle }: MSWDebugPanelProps) {
  const [isMSWEnabled, setIsMSWEnabled] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    // 检查MSW状态
    const checkMSWStatus = () => {
      const enabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
      const isDevelopment = process.env.NODE_ENV === 'development'
      const isBrowser = typeof window !== 'undefined'
      
      // 检查MSW是否真正启动
      const isMSWActive = enabled && isDevelopment && isBrowser && 
        (window as any).msw && (window as any).msw.worker
      
      setIsMSWEnabled(isMSWActive)
    }

    checkMSWStatus()
    
    // 监听网络请求（简单实现）
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      setRequestCount(prev => prev + 1)
      return originalFetch(...args)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Settings className="w-4 h-4 mr-2" />
        MSW调试
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            MSW 调试面板
          </CardTitle>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">MSW状态:</span>
          <Badge variant={isMSWEnabled ? "default" : "secondary"}>
            {isMSWEnabled ? "已启用" : "已禁用"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">请求计数:</span>
          <span className="text-sm font-mono">{requestCount}</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">
            模拟的API端点:
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>认证:</span>
              <Badge variant="outline" className="text-xs">/api/auth/*</Badge>
            </div>
            <div className="flex justify-between">
              <span>CVV检测:</span>
              <Badge variant="outline" className="text-xs">/api/cvv-check/*</Badge>
            </div>
            <div className="flex justify-between">
              <span>BIN分类:</span>
              <Badge variant="outline" className="text-xs">/api/bin-classify/*</Badge>
            </div>
            <div className="flex justify-between">
              <span>信息生成:</span>
              <Badge variant="outline" className="text-xs">/api/info-generate/*</Badge>
            </div>
            <div className="flex justify-between">
              <span>充值:</span>
              <Badge variant="outline" className="text-xs">/api/recharge/*</Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          刷新页面
        </Button>
      </CardContent>
    </Card>
  )
}
