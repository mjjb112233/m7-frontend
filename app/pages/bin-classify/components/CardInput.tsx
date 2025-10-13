import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3 } from "lucide-react"
import { gradientStyles } from "@/app/shared/utils"

interface CardInputProps {
  cardInput: string
  setCardInput: (value: string) => void
  onStart: () => void
  onStop: () => void
  onReset: () => void
  isProcessing: boolean
  processingStatus: any
  error: string | null
  setError: (error: string | null) => void
}

export function CardInput({ cardInput, setCardInput, onStart, onStop, onReset, isProcessing, processingStatus, error, setError }: CardInputProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className={`absolute inset-0 ${gradientStyles.cardBlue} opacity-60`}></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          卡号数据输入
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <Textarea
          value={cardInput}
          onChange={(e) => setCardInput(e.target.value)}
          placeholder="请输入卡号信息，每行一个，格式：卡号|日期|CVV|邮编"
          className="min-h-[300px] font-mono text-sm resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          rows={12}
        />
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>已输入 {cardInput.split("\n").filter((line) => line.trim()).length} 条记录</span>
          <span>支持批量处理</span>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onStart}
              disabled={!cardInput.trim() || isProcessing}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  分析中...
                </div>
              ) : (
                "开始分析"
              )}
            </button>
            
            {isProcessing && (
              <button
                onClick={onStop}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                停止
              </button>
            )}
          </div>
          
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            重置
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}
