"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useCVVDetection } from '@/app/pages/shared/hooks/useCVVDetection'
import { CVVDetectionCard } from '@/app/pages/shared/components/CVVDetectionCard'
import Header from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Play,
  Square,
  RotateCcw,
  Copy,
  Download
} from 'lucide-react'

export default function CVVCheckPage() {
  const { user, token } = useAuth()
  const {
    config,
    status,
    results,
    isLoading,
    error,
    currentStep,
    inputText,
    setInputText,
    fetchConfig,
    startDetection,
    stopDetection,
    resetDetection,
    handleConfigNext,
    handleInputNext,
    handleInputBack,
    handlePrecheckNext,
    handlePrecheckBack
  } = useCVVDetection(token)

  const [cardNumbers, setCardNumbers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  // 初始化配置
  useEffect(() => {
    if (token) {
      fetchConfig()
    }
  }, [token, fetchConfig])

  // 处理卡号输入
  const handleCardInput = (value: string) => {
    setInputText(value)
    const cards = value.split('\n').filter(card => card.trim())
    setCardNumbers(cards)
  }

  // 开始检测
  const handleStartDetection = async () => {
    if (cardNumbers.length === 0) {
      alert('请输入至少一张卡号')
      return
    }

    try {
      await startDetection({
        mode: 'charge_test',
        channels: [1],
        cvvList: cardNumbers
      })
      setShowResults(true)
    } catch (error) {
      console.error('检测失败:', error)
    }
  }

  // 复制结果
  const copyResults = () => {
    if (results) {
      const resultText = `检测结果：
有效卡号: ${results.validCount}
无效卡号: ${results.invalidCount}
总计: ${results.totalCount}

有效卡号列表:
${results.validCards.join('\n')}

无效卡号列表:
${results.invalidCards.join('\n')}`

      navigator.clipboard.writeText(resultText)
      alert('结果已复制到剪贴板')
    }
  }

  // 下载结果
  const downloadResults = () => {
    if (results) {
      const resultText = `CVV检测结果
===============

检测时间: ${new Date().toLocaleString()}
有效卡号: ${results.validCount}
无效卡号: ${results.invalidCount}
总计: ${results.totalCount}

有效卡号列表:
${results.validCards.join('\n')}

无效卡号列表:
${results.invalidCards.join('\n')}`

      const blob = new Blob([resultText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cvv-detection-results-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CVV检测</h1>
          <p className="text-xl text-gray-600">快速检测信用卡CVV码的有效性</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { key: 'config', label: '配置', icon: Shield },
              { key: 'input', label: '输入', icon: CreditCard },
              { key: 'precheck', label: '预检查', icon: CheckCircle },
              { key: 'detecting', label: '检测', icon: Play },
              { key: 'results', label: '结果', icon: CheckCircle }
            ].map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.key
              const isCompleted = ['config', 'input', 'precheck', 'detecting', 'results'].indexOf(currentStep) > index

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            {/* 配置步骤 */}
            {currentStep === 'config' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    检测配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>检测模式</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">充值测试</Badge>
                      <span className="text-sm text-gray-600">使用充值测试模式进行CVV检测</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>检测通道</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">通道 1</Badge>
                      <span className="text-sm text-gray-600">使用通道1进行检测</span>
                    </div>
                  </div>
                  <Button onClick={handleConfigNext} className="w-full">
                    下一步：输入卡号
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 输入步骤 */}
            {currentStep === 'input' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    输入卡号
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumbers">信用卡号列表</Label>
                    <Textarea
                      id="cardNumbers"
                      placeholder="请输入信用卡号，每行一个&#10;例如：&#10;4532123456789012&#10;4532123456789013&#10;4532123456789014"
                      value={inputText}
                      onChange={(e) => handleCardInput(e.target.value)}
                      rows={8}
                      className="font-mono"
                    />
                    <p className="text-sm text-gray-600">
                      已输入 {cardNumbers.length} 张卡号
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleInputBack}>
                      上一步
                    </Button>
                    <Button
                      onClick={handleInputNext}
                      disabled={cardNumbers.length === 0}
                      className="flex-1"
                    >
                      下一步：预检查
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 预检查步骤 */}
            {currentStep === 'precheck' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    预检查
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>卡号格式验证通过</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>检测通道可用</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>准备开始检测</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrecheckBack}>
                      上一步
                    </Button>
                    <Button onClick={handlePrecheckNext} className="flex-1">
                      开始检测
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 检测步骤 */}
            {currentStep === 'detecting' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    正在检测
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{status.message}</span>
                      <span>{status.progress}%</span>
                    </div>
                    <Progress value={status.progress} className="w-full" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => stopDetection('mock-detection-id')}
                    className="w-full"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    停止检测
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 结果步骤 */}
            {currentStep === 'results' && results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    检测结果
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.validCount}</div>
                      <div className="text-sm text-green-600">有效卡号</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{results.invalidCount}</div>
                      <div className="text-sm text-red-600">无效卡号</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>有效卡号列表</Label>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-sm font-mono">
                      {results.validCards.map((card: string, index: number) => (
                        <div key={index} className="text-green-600">{card}</div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>无效卡号列表</Label>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-sm font-mono">
                      {results.invalidCards.map((card: string, index: number) => (
                        <div key={index} className="text-red-600">{card}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyResults}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制结果
                    </Button>
                    <Button variant="outline" onClick={downloadResults}>
                      <Download className="w-4 h-4 mr-2" />
                      下载结果
                    </Button>
                    <Button onClick={resetDetection} className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重新检测
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：状态显示 */}
          <div className="space-y-6">
            {/* 检测状态卡片 */}
            <CVVDetectionCard
              onDetectionComplete={(results) => {
                console.log('检测完成:', results)
              }}
              onError={(error) => {
                console.error('检测错误:', error)
              }}
            />

            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 使用说明 */}
            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>1. 在左侧输入框中输入信用卡号，每行一个</p>
                <p>2. 系统会自动验证卡号格式</p>
                <p>3. 点击开始检测，系统会进行CVV检测</p>
                <p>4. 检测完成后可以查看结果并导出</p>
                <p className="text-red-600 font-medium">
                  注意：请确保您有权限检测这些卡号
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}