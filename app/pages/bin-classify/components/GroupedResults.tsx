import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Copy, Download } from "lucide-react"
import { GroupedResult, CardInfo } from "@/app/shared/types"

interface GroupedResultsProps {
  groupedResults: any
  expandedGroups: Set<string>
  onToggleGroup: (groupKey: string) => void
  onRetry: () => void
}

export function GroupedResults({ 
  groupedResults, 
  expandedGroups, 
  onToggleGroup, 
  onRetry 
}: GroupedResultsProps) {
  const totalCards = Object.values(groupedResults).reduce((sum, cards) => sum + cards.length, 0)
  const groupCount = Object.keys(groupedResults).length

  if (totalCards === 0) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">分类结果</h2>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            {groupCount} 个分组
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* 收起所有分组 */}}
            className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            全部收起
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* 导出数据 */}}
            className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedResults).map(([groupName, cards]) => (
          <Card
            key={groupName}
            className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-60"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader
              className="relative hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 pb-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-base font-semibold group-hover:text-blue-600 transition-colors">
                    {groupName}
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    {cards.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      // 复制分组数据
                      navigator.clipboard.writeText(JSON.stringify(cards, null, 2))
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleGroup(groupName)
                    }}
                    className="cursor-pointer"
                  >
                    {expandedGroups.has(groupName) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {expandedGroups.has(groupName) && (
              <CardContent className="relative pt-0 max-h-60 overflow-y-auto p-6">
                <div className="space-y-2">
                  {cards.map((card, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]"
                    >
                      <div className="font-mono text-sm flex-1 min-w-0">
                        <div className="font-semibold truncate mb-1">{card.cardNumber}</div>
                        <div className="text-xs text-gray-500">
                          {card.brand} • {card.type} • {card.level} • {card.bank} • {card.currency}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(card.cardNumber)}
                        className="h-8 w-8 p-0 ml-3 flex-shrink-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </Card>
        ))}
      </div>
    </>
  )
}