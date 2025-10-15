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
  FileText,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface GeneratedInfo {
  cardNumber: string
  cardHolder: string
  address: string
  phone: string
  email: string
  price: number
  status: 'success' | 'failed'
}

export default function InfoGeneratePage() {
  const { user, token } = useAuth()

  // 状态管理
  const [cardInput, setCardInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [results, setResults] = useState<GeneratedInfo[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState('100-500')
  const [generationCount, setGenerationCount] = useState(1)

  // 模拟价格查询
  const mockPriceRanges = {
    '100-500': { min: 100, max: 500, price: 2.5 },
    '500-1000': { min: 500, max: 1000, price: 5.0 },
    '1000-2000': { min: 1000, max: 2000, price: 8.0 },
    '2000+': { min: 2000, max: 5000, price: 12.0 }
  }

  // 处理卡号输入
  const handleCardInput = (value: string) => {
    setCardInput(value)
  }

  // 开始信息生成
  const handleStartGeneration = async () => {
    if (!cardInput.trim()) {
      setError('请输入至少一张卡号')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setError(null)
    setResults(null)

    try {
      // 模拟生成过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setGenerationProgress(i)
      }

      // 模拟生成结果
      const cardNumbers = cardInput.split('\n').filter(card => card.trim())
      const mockResults: GeneratedInfo[] = []

      cardNumbers.forEach((card, index) => {
        const priceInfo = mockPriceRanges[priceRange as keyof typeof mockPriceRanges]
        const isSuccess = Math.random() > 0.2 // 80% 成功率

        mockResults.push({
          cardNumber: card,
          cardHolder: `用户${index + 1}`,
          address: `地址${index + 1}`,
          phone: `138****${String(index + 1).padStart(4, '0')}`,
          email: `user${index + 1}@example.com`,
          price: priceInfo.price,
          status: isSuccess ? 'success' : 'failed'
        })
      })

      setResults(mockResults)
    } catch (error) {
      setError('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  // 停止生成
  const handleStopGeneration = () => {
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  // 重置生成
  const handleResetGeneration = () => {
    setCardInput('')
    setResults(null)
    setError(null)
    setGenerationProgress(0)
  }

  // 复制结果
  const copyResults = () => {
    if (results) {
      let resultText = '信息生成结果：\n\n'
      results.forEach((result, index) => {
        resultText += `卡号${index + 1}: ${result.cardNumber}\n`
        resultText += `持卡人: ${result.cardHolder}\n`
        resultText += `地址: ${result.address}\n`
        resultText += `电话: ${result.phone}\n`
        resultText += `邮箱: ${result.email}\n`
        resultText += `价格: ¥${result.price}\n`
        resultText += `状态: ${result.status === 'success' ? '成功' : '失败'}\n\n`
      })

      navigator.clipboard.writeText(resultText)
      alert('结果已复制到剪贴板')
    }
  }

  // 下载结果
  const downloadResults = () => {
    if (results) {
      let resultText = `信息生成结果
===============

生成时间: ${new Date().toLocaleString()}
价格范围: ${priceRange}
生成数量: ${results.length}

`
      results.forEach((result, index) => {
        resultText += `卡号${index + 1}: ${result.cardNumber}\n`
        resultText += `持卡人: ${result.cardHolder}\n`
        resultText += `地址: ${result.address}\n`
        resultText += `电话: ${result.phone}\n`
        resultText += `邮箱: ${result.email}\n`
        resultText += `价格: ¥${result.price}\n`
        resultText += `状态: ${result.status === 'success' ? '成功' : '失败'}\n\n`
      })

      const blob = new Blob([resultText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `info-generate-results-${Date.now()}.txt`
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">信息生成</h1>
          <p className="text-xl text-gray-600">智能生成信用卡相关信息，包括持卡人、地址、联系方式等</p>
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

            {/* 生成配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  生成配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>价格范围</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100-500">¥100-500 (¥2.5/条)</SelectItem>
                      <SelectItem value="500-1000">¥500-1000 (¥5.0/条)</SelectItem>
                      <SelectItem value="1000-2000">¥1000-2000 (¥8.0/条)</SelectItem>
                      <SelectItem value="2000+">¥2000+ (¥12.0/条)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>生成数量</Label>
                  <Input
                    type="number"
                    value={generationCount}
                    onChange={(e) => setGenerationCount(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  {!isGenerating ? (
                    <Button
                      onClick={handleStartGeneration}
                      disabled={!cardInput.trim()}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      开始生成
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleStopGeneration}
                      className="flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      停止生成
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleResetGeneration}
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
            {/* 生成状态 */}
            {isGenerating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    正在生成
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>生成信息中...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 生成结果 */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    生成结果
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
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                              {result.status === 'success' ? '成功' : '失败'}
                            </Badge>
                            <span className="text-sm text-gray-600">卡号{index + 1}</span>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            ¥{result.price}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{result.cardNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{result.cardHolder}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{result.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{result.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{result.email}</span>
                          </div>
                        </div>
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
                <p>2. 选择价格范围和生成数量</p>
                <p>3. 点击开始生成，系统会生成相关信息</p>
                <p>4. 查看生成结果并可以导出</p>
                <p className="text-blue-600 font-medium">
                  生成的信息包括持卡人姓名、地址、电话、邮箱等
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}