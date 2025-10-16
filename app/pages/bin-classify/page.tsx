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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            BIN 智能分类
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于先进算法的信用卡BIN码分析系统，支持多维度智能分类与可视化展示
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入和配置区域 */}
          <div className="space-y-6">
            {/* 卡号输入 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  信用卡号输入
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cardNumbers" className="text-lg font-semibold text-gray-700">
                      卡号列表
                    </Label>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      {cardInput.split('\n').filter(card => card.trim()).length} 张卡
                    </div>
                  </div>
                  <Textarea
                    id="cardNumbers"
                    placeholder="请输入信用卡号，每行一个&#10;例如：&#10;4532123456789012&#10;4532123456789013&#10;4532123456789014"
                    value={cardInput}
                    onChange={(e) => handleCardInput(e.target.value)}
                    rows={8}
                    className="font-mono text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl resize-none"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">支持批量输入，自动识别BIN码</span>
                    <span className="text-blue-600 font-medium">
                      {cardInput.split('\n').filter(card => card.trim()).length > 0 ? '准备就绪' : '等待输入'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 分类配置 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Filter className="w-6 h-6" />
                  </div>
                  智能分类配置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-700">分组维度</Label>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank" className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">按银行分组</div>
                              <div className="text-sm text-gray-500">识别发卡银行</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="country" className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">按国家分组</div>
                              <div className="text-sm text-gray-500">按发卡国家分类</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="cardType" className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">按卡类型分组</div>
                              <div className="text-sm text-gray-500">Visa、MasterCard等</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="level" className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium">按等级分组</div>
                              <div className="text-sm text-gray-500">Standard、Gold、Platinum</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-700">排序方式</Label>
                    <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc" className="py-3">
                          <div className="flex items-center gap-3">
                            <SortAsc className="w-5 h-5 text-green-600" />
                            <span className="font-medium">升序排列</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="desc" className="py-3">
                          <div className="flex items-center gap-3">
                            <SortDesc className="w-5 h-5 text-green-600" />
                            <span className="font-medium">降序排列</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {!isProcessing ? (
                    <Button
                      onClick={handleStartClassification}
                      disabled={!cardInput.trim()}
                      className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-5 h-5 mr-3" />
                      开始智能分类
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleStopClassification}
                      className="flex-1 h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Square className="w-5 h-5 mr-3" />
                      停止分类
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleResetClassification}
                    className="h-14 px-6 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5 mr-3" />
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
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    智能分类结果
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex gap-3 mb-6">
                    <Button 
                      variant="outline" 
                      onClick={copyResults}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制结果
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={downloadResults}
                      className="flex-1 h-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载结果
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(results).map(([groupKey, cards]) => (
                      <div key={groupKey} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-all duration-300">
                        <button
                          onClick={() => toggleGroup(groupKey)}
                          className="w-full p-6 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 flex items-center justify-between transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {groupKey.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-semibold">
                                  {groupKey}
                                </Badge>
                                <span className="text-sm text-gray-600 font-medium">
                                  {cards.length} 张卡
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl text-gray-400 hover:text-blue-500 transition-colors duration-300">
                            {expandedGroups.has(groupKey) ? '−' : '+'}
                          </div>
                        </button>

                        {expandedGroups.has(groupKey) && (
                          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                            <div className="space-y-3">
                              {cards.map((card, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                  <div className="flex items-center gap-4">
                                    <div className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                      {card.bin}
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="font-medium text-gray-700">{card.bank}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-600">{card.country}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-gray-600">{card.cardType}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span className="text-gray-600">{card.level}</span>
                                      </div>
                                    </div>
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