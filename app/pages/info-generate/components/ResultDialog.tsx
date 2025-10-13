import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"
import { InfoGenerateState } from "../types"

interface ResultDialogProps {
  state: Pick<InfoGenerateState, 'showResultDialog' | 'generateResult'>
  onClose: () => void
}

export function ResultDialog({ state, onClose }: ResultDialogProps) {
  const { showResultDialog, generateResult } = state

  if (!generateResult) return null

  return (
    <Dialog open={showResultDialog} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            生成完成
          </DialogTitle>
          <DialogDescription className="text-gray-600">信息生成结果统计</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 统计信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">成功生成</div>
                  <div className="text-2xl font-bold text-green-600">{generateResult.successCount}</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm font-medium text-red-900">生成失败</div>
                  <div className="text-2xl font-bold text-red-600">{generateResult.failedCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 消耗信息 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">实际消耗</div>
                <div className="text-lg font-bold text-blue-600">{generateResult.totalCost} M币</div>
              </div>
            </div>
          </div>

          {/* 失败卡号列表 */}
          {generateResult.failedCardNumbers && generateResult.failedCardNumbers.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <div className="text-sm font-medium text-red-900">生成失败的卡号</div>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {generateResult.failedCardNumbers.map((cardNumber, index) => (
                  <div key={index} className="bg-white rounded border border-red-200 p-2">
                    <code className="text-sm text-red-800 font-mono">{cardNumber}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
            >
              关闭
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
              onClick={onClose}
            >
              查看结果
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
