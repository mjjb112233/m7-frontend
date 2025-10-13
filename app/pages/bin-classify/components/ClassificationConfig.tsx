import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface ClassificationConfigProps {
  config: any
  setConfig: (config: any) => void
  disabled: boolean
}

export function ClassificationConfig({ 
  config, 
  setConfig, 
  disabled 
}: ClassificationConfigProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-blue-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          分类设置
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium mb-3">选择分类维度</label>
          <Select value={config.selectedCategory} onValueChange={(value) => setConfig({...config, selectedCategory: value})}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brand">卡片品牌</SelectItem>
              <SelectItem value="type">卡片种类</SelectItem>
              <SelectItem value="level">卡片等级</SelectItem>
              <SelectItem value="bank">发卡行</SelectItem>
              <SelectItem value="country">发卡国家</SelectItem>
              <SelectItem value="currency">国家货币</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-600">
          <p>• 按选择的维度对卡片进行分组</p>
          <p>• 支持多种分类方式</p>
          <p>• 结果将按分组展示</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </CardContent>
    </Card>
  )
}
