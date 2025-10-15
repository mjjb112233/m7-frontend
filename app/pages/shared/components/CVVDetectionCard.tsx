"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface CVVDetectionCardProps {
  onDetectionComplete?: (results: CVVDetectionResults) => void
  onError?: (error: string) => void
}

interface CVVDetectionResults {
  validCount: number
  invalidCount: number
  totalCount: number
  validCards: string[]
  invalidCards: string[]
}

interface DetectionStatus {
  status: 'idle' | 'detecting' | 'completed' | 'error'
  progress: number
  message: string
}

export function CVVDetectionCard({ onDetectionComplete, onError }: CVVDetectionCardProps) {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    status: 'idle',
    progress: 0,
    message: '准备开始检测'
  })
  const [results, setResults] = useState<CVVDetectionResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 开始检测
  const startDetection = async (cardNumbers: string[]) => {
    if (!cardNumbers.length) {
      onError?.("请输入卡号")
      return
    }

    setIsLoading(true)
    setDetectionStatus({
      status: 'detecting',
      progress: 0,
      message: '正在检测CVV...'
    })

    try {
      // 模拟检测过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDetectionStatus(prev => ({
          ...prev,
          progress: i,
          message: `检测进度: ${i}%`
        }))
      }

      // 模拟检测结果
      const mockResults: CVVDetectionResults = {
        validCount: Math.floor(cardNumbers.length * 0.7),
        invalidCount: Math.floor(cardNumbers.length * 0.3),
        totalCount: cardNumbers.length,
        validCards: cardNumbers.slice(0, Math.floor(cardNumbers.length * 0.7)),
        invalidCards: cardNumbers.slice(Math.floor(cardNumbers.length * 0.7))
      }

      setResults(mockResults)
      setDetectionStatus({
        status: 'completed',
        progress: 100,
        message: '检测完成'
      })
      
      onDetectionComplete?.(mockResults)
    } catch (error: any) {
      setDetectionStatus({
        status: 'error',
        progress: 0,
        message: '检测失败'
      })
      onError?.(error.message || "检测失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  // 停止检测
  const stopDetection = () => {
    setDetectionStatus({
      status: 'idle',
      progress: 0,
      message: '检测已停止'
    })
    setIsLoading(false)
  }

  // 重置检测
  const resetDetection = () => {
    setDetectionStatus({
      status: 'idle',
      progress: 0,
      message: '准备开始检测'
    })
    setResults(null)
    setIsLoading(false)
  }

  const getStatusIcon = () => {
    switch (detectionStatus.status) {
      case 'detecting':
        return <AlertCircle className="w-5 h-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (detectionStatus.status) {
      case 'detecting':
        return 'bg-blue-50 border-blue-200'
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className={`${getStatusColor()} transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          CVV检测状态
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{detectionStatus.message}</span>
            <span>{detectionStatus.progress}%</span>
          </div>
          <Progress value={detectionStatus.progress} className="w-full" />
        </div>

        {detectionStatus.status === 'detecting' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={stopDetection}
              className="flex-1"
            >
              停止检测
            </Button>
          </div>
        )}

        {detectionStatus.status === 'completed' && results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.validCount}</div>
                <div className="text-sm text-green-600">有效卡号</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.invalidCount}</div>
                <div className="text-sm text-red-600">无效卡号</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetDetection}
                className="flex-1"
              >
                重新检测
              </Button>
            </div>
          </div>
        )}

        {detectionStatus.status === 'error' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetDetection}
              className="flex-1"
            >
              重试
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
