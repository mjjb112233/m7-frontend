import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Copy, 
  RefreshCw,
  Clock,
  TrendingUp,
  Shield
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ResultsStepProps {
  detectionId: string | null
  onRetest: () => void
  copySuccess: boolean
  setCopySuccess: (success: boolean) => void
  isLoading: boolean
}

export function ResultsStep({
  detectionId,
  onRetest,
  copySuccess,
  setCopySuccess,
  isLoading
}: ResultsStepProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'valid' | 'invalid' | 'summary'>('summary')

  // 模拟检测结果数据
  const mockResults = {
    validCount: 8,
    invalidCount: 4,
    totalCount: 12,
    validCards: [
      { cardNumber: '4000123456789012', cvv: '123', brand: 'Visa', type: 'Credit', level: 'Classic' },
      { cardNumber: '5000123456789012', cvv: '456', brand: 'Mastercard', type: 'Credit', level: 'Gold' },
      { cardNumber: '3000123456789012', cvv: '789', brand: 'American Express', type: 'Credit', level: 'Platinum' },
      { cardNumber: '4000123456789013', cvv: '321', brand: 'Visa', type: 'Credit', level: 'Classic' },
      { cardNumber: '5000123456789013', cvv: '654', brand: 'Mastercard', type: 'Credit', level: 'Gold' },
      { cardNumber: '4000123456789014', cvv: '987', brand: 'Visa', type: 'Credit', level: 'Classic' },
      { cardNumber: '5000123456789014', cvv: '147', brand: 'Mastercard', type: 'Credit', level: 'Gold' },
      { cardNumber: '3000123456789013', cvv: '258', brand: 'American Express', type: 'Credit', level: 'Platinum' }
    ],
    invalidCards: [
      { cardNumber: '4000123456789999', cvv: '000', brand: 'Visa', type: 'Credit', level: 'Classic', reason: 'CVV错误' },
      { cardNumber: '5000123456789999', cvv: '111', brand: 'Mastercard', type: 'Credit', level: 'Gold', reason: '卡片已过期' },
      { cardNumber: '3000123456789999', cvv: '222', brand: 'American Express', type: 'Credit', level: 'Platinum', reason: '持卡人信息不匹配' },
      { cardNumber: '4000123456788888', cvv: '333', brand: 'Visa', type: 'Credit', level: 'Classic', reason: '银行拒绝' }
    ],
    detectionTime: '2024-01-15T10:30:00Z',
    processingTime: 45
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 导出结果
  const exportResults = () => {
    const data = {
      summary: {
        totalCards: mockResults.totalCount,
        validCards: mockResults.validCount,
        invalidCards: mockResults.invalidCount,
        successRate: Math.round((mockResults.validCount / mockResults.totalCount) * 100)
      },
      validCards: mockResults.validCards,
      invalidCards: mockResults.invalidCards,
      detectionTime: mockResults.detectionTime,
      processingTime: mockResults.processingTime
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cvv-detection-results-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 获取成功率颜色
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-6xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4 bg-gradient-to-r from-green-600/10 to-blue-600/10">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          {t('cvvCheck.results.title')}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">{t('cvvCheck.results.description')}</p>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* 总体统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{mockResults.totalCount}</div>
            <div className="text-sm text-gray-600">总检测数</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">{mockResults.validCount}</div>
            <div className="text-sm text-gray-600">有效卡片</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-red-600">{mockResults.invalidCount}</div>
            <div className="text-sm text-gray-600">无效卡片</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className={`text-2xl font-bold ${getSuccessRateColor(Math.round((mockResults.validCount / mockResults.totalCount) * 100))}`}>
              {Math.round((mockResults.validCount / mockResults.totalCount) * 100)}%
            </div>
            <div className="text-sm text-gray-600">成功率</div>
          </div>
        </div>

        {/* 检测信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">检测时间</div>
            <div className="text-xs text-gray-600">{new Date(mockResults.detectionTime).toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">处理时间</div>
            <div className="text-xs text-gray-600">{mockResults.processingTime} 秒</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
            <Shield className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">检测ID</div>
            <div className="text-xs text-gray-600 font-mono">{detectionId || 'N/A'}</div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'summary'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            检测摘要
          </button>
          <button
            onClick={() => setActiveTab('valid')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'valid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            有效卡片 ({mockResults.validCount})
          </button>
          <button
            onClick={() => setActiveTab('invalid')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'invalid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            无效卡片 ({mockResults.invalidCount})
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="min-h-96">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">有效卡片</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{mockResults.validCount}</div>
                  <div className="text-sm text-green-700">
                    成功率: {Math.round((mockResults.validCount / mockResults.totalCount) * 100)}%
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">无效卡片</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">{mockResults.invalidCount}</div>
                  <div className="text-sm text-red-700">
                    失败率: {Math.round((mockResults.invalidCount / mockResults.totalCount) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'valid' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">有效卡片列表</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(mockResults.validCards.map(card => card.cardNumber).join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制卡号
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>卡号</TableHead>
                      <TableHead>CVV</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>等级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResults.validCards.map((card, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{card.cardNumber}</TableCell>
                        <TableCell className="font-mono">{card.cvv}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{card.brand}</Badge>
                        </TableCell>
                        <TableCell>{card.type}</TableCell>
                        <TableCell>{card.level}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'invalid' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">无效卡片列表</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(mockResults.invalidCards.map(card => card.cardNumber).join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制卡号
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>卡号</TableHead>
                      <TableHead>CVV</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>失败原因</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResults.invalidCards.map((card, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{card.cardNumber}</TableCell>
                        <TableCell className="font-mono">{card.cvv}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{card.brand}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">{card.reason}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={onRetest}
            disabled={isLoading}
            variant="outline"
            className="px-6 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新检测
          </Button>
          <Button
            onClick={exportResults}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
          >
            <Download className="w-4 h-4 mr-2" />
            导出结果
          </Button>
        </div>

        {/* 复制成功提示 */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            已复制到剪贴板
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </CardContent>
    </Card>
  )
}