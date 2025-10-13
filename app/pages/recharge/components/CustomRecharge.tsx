import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomRechargeProps } from "../types"
import { calculateCustomCoins } from "../utils"

export function CustomRecharge({ customAmount, isLoading, onAmountChange, onRecharge }: CustomRechargeProps) {
  const amount = parseFloat(customAmount) || 0
  const coins = calculateCustomCoins(amount)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">自定义充值金额</CardTitle>
        <CardDescription className="text-center">
          输入您想要充值的金额
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">充值金额 (¥)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="请输入充值金额"
            value={customAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            min="1"
            step="0.01"
          />
        </div>
        
        {customAmount && amount > 0 && (
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-gray-600">将获得</div>
            <div className="text-2xl font-bold text-yellow-600">
              {coins} M币
            </div>
          </div>
        )}
        
        <Button
          className="w-full"
          onClick={() => {
            if (amount > 0) {
              onRecharge(amount)
            }
          }}
          disabled={!customAmount || amount <= 0 || isLoading}
        >
          {isLoading ? '处理中...' : '立即充值'}
        </Button>
      </CardContent>
    </Card>
  )
}
