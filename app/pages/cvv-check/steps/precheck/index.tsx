import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface PrecheckStepProps {
  precheckResults: any
  selectedChannel: any
  onNext: () => void
  onBack: () => void
  isLoading: boolean
}

export function PrecheckStep({ precheckResults, selectedChannel, onNext, onBack, isLoading }: PrecheckStepProps) {
  const { t } = useLanguage()
  const [precheckProgress, setPrecheckProgress] = useState(0)
  const [currentCheck, setCurrentCheck] = useState('')

  // 模拟预检查进度
  useEffect(() => {
    if (isLoading) {
      const checks = [
        '验证卡片格式',
        '检查卡片有效性',
        '验证CVV格式',
        '检查过期日期',
        '验证持卡人信息',
        '检查重复卡片',
        '生成检测队列'
      ]
      
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < checks.length) {
          setCurrentCheck(checks[currentIndex])
          setPrecheckProgress((currentIndex + 1) / checks.length * 100)
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  // 模拟预检查结果
  const mockPrecheckResults = {
    totalCards: 15,
    validCards: 12,
    invalidCards: 3,
    duplicateCards: 1,
    expiredCards: 2,
    checks: [
      { name: '格式验证', status: 'passed', count: 12 },
      { name: 'CVV验证', status: 'passed', count: 12 },
      { name: '过期检查', status: 'warning', count: 2 },
      { name: '重复检查', status: 'warning', count: 1 },
      { name: '有效性验证', status: 'passed', count: 12 }
    ]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-800 border-red-200'
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4 bg-gradient-to-r from-green-600/10 to-blue-600/10">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {t('cvvCheck.precheck.title')}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">{t('cvvCheck.precheck.description')}</p>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {isLoading ? (
          // 加载状态
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">正在预检查...</h3>
              <p className="text-gray-600">{currentCheck}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>检查进度</span>
                <span>{Math.round(precheckProgress)}%</span>
              </div>
              <Progress value={precheckProgress} className="h-2" />
            </div>
          </div>
        ) : (
          // 预检查结果
          <div className="space-y-6">
            {/* 总体统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{mockPrecheckResults.totalCards}</div>
                <div className="text-sm text-gray-600">总卡片数</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-green-600">{mockPrecheckResults.validCards}</div>
                <div className="text-sm text-gray-600">有效卡片</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-red-600">{mockPrecheckResults.invalidCards}</div>
                <div className="text-sm text-gray-600">无效卡片</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{mockPrecheckResults.duplicateCards + mockPrecheckResults.expiredCards}</div>
                <div className="text-sm text-gray-600">警告项</div>
              </div>
            </div>

            {/* 详细检查结果 */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">检查详情</h4>
              {mockPrecheckResults.checks.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(check.status)}`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <span className="font-medium">{check.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {check.count} 项
                  </Badge>
                </div>
              ))}
            </div>

            {/* 警告信息 */}
            {(mockPrecheckResults.duplicateCards > 0 || mockPrecheckResults.expiredCards > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">发现警告项</span>
                </div>
                <div className="text-sm text-yellow-700 space-y-1">
                  {mockPrecheckResults.duplicateCards > 0 && (
                    <p>• 发现 {mockPrecheckResults.duplicateCards} 张重复卡片</p>
                  )}
                  {mockPrecheckResults.expiredCards > 0 && (
                    <p>• 发现 {mockPrecheckResults.expiredCards} 张过期卡片</p>
                  )}
                  <p>这些卡片将被跳过，不会参与检测</p>
                </div>
              </div>
            )}

            {/* 检测通道信息 */}
            {selectedChannel && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">检测通道</span>
                </div>
                <div className="text-sm text-blue-700">
                  <p>通道：{selectedChannel.name}</p>
                  <p>消耗：{selectedChannel.consumption || selectedChannel.rate} M币</p>
                  <p>速度：{selectedChannel.speed}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            disabled={isLoading}
            className="px-6 py-2"
          >
            上一步
          </Button>
          <Button
            onClick={onNext}
            disabled={isLoading || mockPrecheckResults.validCards === 0}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
          >
            {isLoading ? '检查中...' : '继续配置'}
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </CardContent>
    </Card>
  )
}