"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import Header from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Play,
  Square,
  RotateCcw,
  Copy,
  Download,
  BarChart3,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

interface BinClassifyResult {
  bin: string
  bank: string
  country: string
  cardType: string
  level: string
}

interface GroupedResult {
  [key: string]: BinClassifyResult[]
}

export default function BinClassifyPage() {
  const { user, token } = useAuth()

  // 状态管理
  const [cardInput, setCardInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [results, setResults] = useState<GroupedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState('bank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // 模拟BIN分类结果
  const mockBinClassifyResults: BinClassifyResult[] = [
    { bin: '453212', bank: '中国银行', country: '中国', cardType: 'Visa', level: 'Gold' },
    { bin: '453213', bank: '中国银行', country: '中国', cardType: 'Visa', level: 'Platinum' },
    { bin: '453214', bank: '工商银行', country: '中国', cardType: 'Visa', level: 'Standard' },
    { bin: '453215', bank: '工商银行', country: '中国', cardType: 'Visa', level: 'Gold' },
    { bin: '453216', bank: '建设银行', country: '中国', cardType: 'Visa', level: 'Platinum' },
    { bin: '453217', bank: '农业银行', country: '中国', cardType: 'Visa', level: 'Standard' },
    { bin: '453218', bank: '招商银行', country: '中国', cardType: 'Visa', level: 'Gold' },
    { bin: '453219', bank: '招商银行', country: '中国', cardType: 'Visa', level: 'Platinum' },
    { bin: '453220', bank: '交通银行', country: '中国', cardType: 'Visa', level: 'Standard' },
  ]

  // 处理卡号输入
  const handleCardInput = (value: string) => {
    setCardInput(value)
  }

  // 开始BIN分类
  const handleStartClassification = async () => {
    if (!cardInput.trim()) {
      setError('请输入至少一张卡号')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)
    setResults(null)

    try {
      // 模拟处理过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProcessingProgress(i)
      }

      // 模拟分类结果
      const cardNumbers = cardInput.split('\n').filter(card => card.trim())
      const mockResults: GroupedResult = {}

      cardNumbers.forEach((card, index) => {
        const result = mockBinClassifyResults[index % mockBinClassifyResults.length]
        const groupKey = result[groupBy as keyof BinClassifyResult]

        if (!mockResults[groupKey]) {
          mockResults[groupKey] = []
        }
        mockResults[groupKey].push({
          ...result,
          bin: card.substring(0, 6) // 使用实际卡号的前6位作为BIN
        })
      })

      setResults(mockResults)
    } catch (error) {
      setError('分类失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  // 停止分类
  const handleStopClassification = () => {
    setIsProcessing(false)
    setProcessingProgress(0)
  }

  // 重置分类
  const handleResetClassification = () => {
    setCardInput('')
    setResults(null)
    setError(null)
    setProcessingProgress(0)
    setExpandedGroups(new Set())
  }

  // 切换分组展开状态
  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  // 复制结果
  const copyResults = () => {
    if (results) {
      let resultText = 'BIN分类结果：\n\n'
      Object.entries(results).forEach(([group, cards]) => {
        resultText += `${group} (${cards.length}张卡):\n`
        cards.forEach(card => {
          resultText += `  BIN: ${card.bin}, 银行: ${card.bank}, 国家: ${card.country}, 类型: ${card.cardType}, 等级: ${card.level}\n`
        })
        resultText += '\n'
      })

      navigator.clipboard.writeText(resultText)
      alert('结果已复制到剪贴板')
    }
  }

  // 下载结果
  const downloadResults = () => {
    if (results) {
      let resultText = `BIN分类结果
===============

分类时间: ${new Date().toLocaleString()}
分组方式: ${groupBy}
排序方式: ${sortOrder}

`
      Object.entries(results).forEach(([group, cards]) => {
        resultText += `${group} (${cards.length}张卡):\n`
        cards.forEach(card => {
          resultText += `  BIN: ${card.bin}, 银行: ${card.bank}, 国家: ${card.country}, 类型: ${card.cardType}, 等级: ${card.level}\n`
        })
        resultText += '\n'
      })

      const blob = new Blob([resultText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bin-classify-results-${Date.now()}.txt`
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BIN分类</h1>
          <p className="text-xl text-gray-600">智能分析信用卡BIN码，按银行、国家、类型等维度分类</p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入和配置区域 */}
          <div className="space-y-6">
            {/* 卡号输入 */}
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
                    value={cardInput}
                    onChange={(e) => handleCardInput(e.target.value)}
                    rows={8}
                    className="font-mono"
                  />
                  <p className="text-sm text-gray-600">
                    已输入 {cardInput.split('\n').filter(card => card.trim()).length} 张卡号
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 分类配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  分类配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>分组方式</Label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">按银行分组</SelectItem>
                      <SelectItem value="country">按国家分组</SelectItem>
                      <SelectItem value="cardType">按卡类型分组</SelectItem>
                      <SelectItem value="level">按等级分组</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>排序方式</Label>
                  <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4" />
                          升序
                        </div>
                      </SelectItem>
                      <SelectItem value="desc">
                        <div className="flex items-center gap-2">
                          <SortDesc className="w-4 h-4" />
                          降序
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  {!isProcessing ? (
                    <Button
                      onClick={handleStartClassification}
                      disabled={!cardInput.trim()}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      开始分类
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleStopClassification}
                      className="flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      停止分类
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleResetClassification}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果和状态显示 */}
          <div className="space-y-6">
            {/* 处理状态 */}
            {isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    正在分类
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>分析BIN码中...</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 分类结果 */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    分类结果
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" onClick={copyResults}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制结果
                    </Button>
                    <Button variant="outline" onClick={downloadResults}>
                      <Download className="w-4 h-4 mr-2" />
                      下载结果
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(results).map(([groupKey, cards]) => (
                      <div key={groupKey} className="border rounded-lg">
                        <button
                          onClick={() => toggleGroup(groupKey)}
                          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{groupKey}</Badge>
                            <span className="text-sm text-gray-600">({cards.length}张卡)</span>
                          </div>
                          <div className="text-gray-400">
                            {expandedGroups.has(groupKey) ? '−' : '+'}
                          </div>
                        </button>

                        {expandedGroups.has(groupKey) && (
                          <div className="p-4 border-t bg-gray-50">
                            <div className="space-y-2">
                              {cards.map((card, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded text-sm">
                                  <div className="font-mono">{card.bin}</div>
                                  <div className="flex gap-4 text-gray-600">
                                    <span>{card.bank}</span>
                                    <span>{card.country}</span>
                                    <span>{card.cardType}</span>
                                    <span>{card.level}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                <p>2. 选择分组方式（银行、国家、卡类型、等级）</p>
                <p>3. 选择排序方式（升序或降序）</p>
                <p>4. 点击开始分类，系统会分析BIN码</p>
                <p>5. 查看分类结果并可以导出</p>
                <p className="text-blue-600 font-medium">
                  BIN码是银行卡号的前6位数字，用于识别发卡银行和卡类型
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}