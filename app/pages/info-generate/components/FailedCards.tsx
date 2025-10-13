import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, XCircle } from "lucide-react"
import { InfoGenerateState, InfoGenerateActions } from "../types"

interface FailedCardsProps {
  state: Pick<InfoGenerateState, 'failedCardNumbers'>
  actions: Pick<InfoGenerateActions, 'copyAllFailedCards' | 'setFailedCardNumbers'>
}

export function FailedCards({ state, actions }: FailedCardsProps) {
  const { failedCardNumbers } = state
  const { copyAllFailedCards, setFailedCardNumbers } = actions

  if (!failedCardNumbers || failedCardNumbers.length === 0) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
      <CardHeader className="relative bg-gradient-to-r from-red-600/10 to-pink-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <XCircle className="h-4 w-4 text-white" />
          </div>
          生成失败的卡号
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAllFailedCards}
              className="text-red-600 hover:text-red-800 hover:bg-red-100 flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              复制全部
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFailedCardNumbers([])}
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              ×
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-4">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {failedCardNumbers.map((cardNumber, index) => (
            <div key={index} className="bg-white rounded border border-red-200 p-2 shadow-sm">
              <code className="text-sm text-red-800 font-mono">{cardNumber}</code>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
    </Card>
  )
}
