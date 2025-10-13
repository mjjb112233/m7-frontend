import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { gradientStyles } from "@/app/shared/utils"

interface StatisticsCardProps {
  result: any
  onExport: () => void
}

export function StatisticsCard({ result, onExport }: StatisticsCardProps) {
  if (!result || !result.groupedResults) {
    return null
  }

  const totalResults = result.totalCards || 0
  const groupCount = Object.keys(result.groupedResults).length

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className={`absolute inset-0 ${gradientStyles.cardPurple} opacity-60`}></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="relative bg-gradient-to-r from-purple-600/10 to-pink-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          分析统计
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">总记录数</span>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              {totalResults}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">分类数量</span>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              {groupCount}
            </Badge>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      </CardContent>
    </Card>
  )
}
