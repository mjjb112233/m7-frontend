import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Upload, FileText, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface InputStepProps {
  inputText: string
  setInputText: (text: string) => void
  onNext: () => void
  onBack?: () => void
  isLoading: boolean
}

export function InputStep({ inputText, setInputText, onNext, onBack, isLoading }: InputStepProps) {
  const { t } = useLanguage()
  const [dragActive, setDragActive] = useState(false)

  // 处理文件拖拽
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setInputText(event.target?.result as string || '')
        }
        reader.readAsText(file)
      }
    }
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInputText(event.target?.result as string || '')
      }
      reader.readAsText(file)
    }
  }

  // 验证输入格式
  const validateInput = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const validLines = lines.filter(line => {
      // 基本格式验证：卡号|CVV|过期日期|持卡人姓名
      const parts = line.split('|')
      return parts.length >= 4 && parts[0].length >= 13 && parts[1].length >= 3
    })
    
    return {
      total: lines.length,
      valid: validLines.length,
      invalid: lines.length - validLines.length
    }
  }

  const validation = validateInput(inputText)

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          {t('cvvCheck.input.title')}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">{t('cvvCheck.input.description')}</p>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* 输入区域 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-semibold text-gray-900">
              {t('cvvCheck.input.cardData')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                上传文件
              </Button>
            </div>
          </div>

          {/* 拖拽区域 */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('cvvCheck.input.placeholder')}
              className="min-h-32 resize-none border-0 bg-transparent focus:ring-0"
            />
            
            {!inputText && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">拖拽文件到此处或直接输入</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 输入验证 */}
        {inputText && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">输入验证</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{validation.total}</div>
                <div className="text-gray-600">总行数</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{validation.valid}</div>
                <div className="text-gray-600">有效格式</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{validation.invalid}</div>
                <div className="text-gray-600">无效格式</div>
              </div>
            </div>
          </div>
        )}

        {/* 格式说明 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">数据格式说明</h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• 每行一张卡片，格式：卡号|CVV|过期日期|持卡人姓名</p>
            <p>• 示例：4000123456789012|123|12/25|John Doe</p>
            <p>• 支持批量导入，每行一张卡片</p>
            <p>• 支持.txt文件拖拽上传</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between pt-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              disabled={isLoading}
              className="px-6 py-2"
            >
              上一步
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!inputText.trim() || validation.valid === 0 || isLoading}
            size="lg"
            className="px-8 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                处理中...
              </>
            ) : (
              t('cvvCheck.input.nextStep')
            )}
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}