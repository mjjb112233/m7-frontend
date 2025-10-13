import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Copy } from "lucide-react"
import { PaymentDialogProps } from "../types"
import { copyToClipboard } from "../utils"

export function PaymentDialog({ isOpen, order, onClose }: PaymentDialogProps) {
  const handleCopyAddress = async () => {
    if (order?.paymentUrl) {
      const success = await copyToClipboard(order.paymentUrl)
      if (success) {
        alert('地址已复制到剪贴板')
      } else {
        alert('复制失败，请手动复制')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            支付信息
          </DialogTitle>
          <DialogDescription>
            请使用以下信息完成支付
          </DialogDescription>
        </DialogHeader>
        
        {order && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                ¥{order.amount}
              </div>
              <div className="text-sm text-gray-600">
                将获得 {order.coins} M币
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">支付地址</div>
              <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
                {order.paymentUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleCopyAddress}
              >
                <Copy className="w-4 h-4 mr-2" />
                复制地址
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                className="w-full"
                onClick={onClose}
              >
                关闭
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
