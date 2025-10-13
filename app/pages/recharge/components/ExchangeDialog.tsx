import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"
import { ExchangeDialogProps } from "../types"

export function ExchangeDialog({ isOpen, exchangeCode, isLoading, onCodeChange, onExchange, onClose }: ExchangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            兑换码
          </DialogTitle>
          <DialogDescription>
            输入兑换码获取M币
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exchangeCode">兑换码</Label>
            <Input
              id="exchangeCode"
              placeholder="请输入兑换码"
              value={exchangeCode}
              onChange={(e) => onCodeChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={onExchange}
              disabled={!exchangeCode.trim() || isLoading}
            >
              {isLoading ? '兑换中...' : '兑换'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
