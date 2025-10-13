import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  StopCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  Zap
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DetectingStepProps {
  localDetectionUuid: string
  selectedChannel: any
  detectionStatus: any
  detectionProgress: any
  onStop: () => void
  onComplete: () => void
  isLoading: boolean
  stopButtonCountdown: number
}

export function DetectingStep({
  localDetectionUuid,
  selectedChannel,
  detectionStatus,
  detectionProgress,
  onStop,
  onComplete,
  isLoading,
  stopButtonCountdown
}: DetectingStepProps) {
  const { t } = useLanguage()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentCard, setCurrentCard] = useState('')

  // 模拟检测进度
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLoading && detectionProgress) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
        
        // 模拟当前检测的卡片
        const mockCards = [
          '4000****1234',
          '5000****5678',
          '3000****9012',
          '4000****3456',
          '5000****7890'
        ]
        setCurrentCard(mockCards[Math.floor(Math.random() * mockCards.length)])
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading, detectionProgress])

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 获取状态图标
  const getStatusIcon = () => {
    if (detectionStatus?.status === 'completed') {
      return <CheckCircle className="w-6 h-6 text-green-500" />
    } else if (detectionStatus?.status === 'error') {
      return <AlertTriangle className="w-6 h-6 text-red-500" />
    } else {
      return <Search className="w-6 h-6 text-blue-500 animate-pulse" />
    }
  }

  // 获取状态颜色
  const getStatusColor = () => {
    if (detectionStatus?.status === 'completed') {
      return 'from-green-500 to-emerald-500'
    } else if (detectionStatus?.status === 'error') {
      return 'from-red-500 to-pink-500'
    } else {
      return 'from-blue-500 to-indigo-500'
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <div className={`w-6 h-6 bg-gradient-to-br ${getStatusColor()} rounded-lg flex items-center justify-center shadow-lg`}>
            {getStatusIcon()}
          </div>
          {t('cvvCheck.detecting.title')}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">{t('cvvCheck.detecting.description')}</p>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* 检测状态 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              {detectionStatus?.status === 'completed' ? '检测完成' : 
               detectionStatus?.status === 'error' ? '检测失败' : '正在检测中...'}
            </span>
          </div>
        </div>

        {/* 进度信息 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {detectionProgress?.progress || 0}%
              </div>
              <div className="text-sm text-gray-600">完成进度</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-sm text-gray-600">已用时间</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {detectionProgress?.processedCount || 0}
              </div>
              <div className="text-sm text-gray-600">已处理</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>检测进度</span>
              <span>{detectionProgress?.processedCount || 0} / {detectionProgress?.totalCount || 0}</span>
            </div>
            <Progress 
              value={detectionProgress?.progress || 0} 
              className="h-3"
            />
          </div>
        </div>

        {/* 当前检测卡片 */}
        {currentCard && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">当前检测</span>
            </div>
            <div className="text-lg font-mono text-gray-700">{currentCard}</div>
          </div>
        )}

        {/* 检测通道信息 */}
        {selectedChannel && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-900">检测通道</span>
              <Badge variant="outline" className="text-xs">
                {selectedChannel.status === 'online' ? '在线' : '离线'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <span className="font-medium">通道名称：</span>
                <span>{selectedChannel.name}</span>
              </div>
              <div>
                <span className="font-medium">检测速度：</span>
                <span>{selectedChannel.speed}</span>
              </div>
              <div>
                <span className="font-medium">消耗费用：</span>
                <span>{selectedChannel.consumption || selectedChannel.rate} M币</span>
              </div>
              <div>
                <span className="font-medium">通道状态：</span>
                <span className="capitalize">{selectedChannel.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* 检测统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <div className="text-lg font-bold text-green-600">
              {detectionProgress?.validCount || 0}
            </div>
            <div className="text-xs text-gray-600">有效卡片</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <div className="text-lg font-bold text-red-600">
              {detectionProgress?.invalidCount || 0}
            </div>
            <div className="text-xs text-gray-600">无效卡片</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <div className="text-lg font-bold text-yellow-600">
              {detectionProgress?.unknownCount || 0}
            </div>
            <div className="text-xs text-gray-600">未知状态</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <div className="text-lg font-bold text-blue-600">
              {detectionProgress?.totalCount || 0}
            </div>
            <div className="text-xs text-gray-600">总数量</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center pt-4">
          {detectionStatus?.status === 'completed' ? (
            <Button
              onClick={onComplete}
              size="lg"
              className="px-8 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              查看结果
            </Button>
          ) : detectionStatus?.status === 'error' ? (
            <Button
              onClick={onComplete}
              variant="outline"
              size="lg"
              className="px-8 py-2"
            >
              返回重试
            </Button>
          ) : (
            <Button
              onClick={onStop}
              disabled={isLoading || stopButtonCountdown > 0}
              size="lg"
              className="px-8 py-2 text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              {stopButtonCountdown > 0 ? `停止 (${stopButtonCountdown}s)` : '停止检测'}
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}