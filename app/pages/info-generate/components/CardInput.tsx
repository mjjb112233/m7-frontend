import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, AlertCircle, Sparkles } from "lucide-react"
import { InfoGenerateState, InfoGenerateActions } from "../types"

interface CardInputProps {
  state: Pick<InfoGenerateState, 'cardNumbers' | 'isGenerating' | 'pricePerCard'>
  actions: Pick<InfoGenerateActions, 'setCardNumbers' | 'handleGenerate' | 'getCardCount'>
}

export function CardInput({ state, actions }: CardInputProps) {
  const { cardNumbers, isGenerating, pricePerCard } = state
  const { setCardNumbers, handleGenerate, getCardCount } = actions

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative bg-gradient-to-r from-cyan-600/10 to-blue-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          卡号输入
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">输入卡号（每行一个）</label>
          <Textarea
            value={cardNumbers}
            onChange={(e) => setCardNumbers(e.target.value)}
            placeholder="请输入卡号，每行一个&#10;例如：&#10;4147202688856879&#10;4207670137072792"
            className="min-h-[200px] font-mono text-sm border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {cardNumbers.trim() && (
          <Card className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full -translate-y-8 translate-x-8"></div>
            <CardContent className="relative p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-orange-900">消耗预览</div>
                  <div className="text-sm text-orange-700">
                    检测到 {getCardCount()} 个卡号，需要消耗 {getCardCount() * pricePerCard} M币
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 shadow-sm"
                >
                  -{getCardCount() * pricePerCard} M币
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !cardNumbers.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                生成中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                开始生成
              </div>
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
          <p>• 每生成一条信息消耗 {pricePerCard} M币</p>
          <p>• 使用真实地理位置数据生成</p>
          <p>• 支持批量生成，每行一个卡号</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      </CardContent>
    </Card>
  )
}
