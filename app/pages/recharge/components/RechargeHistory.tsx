import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Gift } from "lucide-react"
import { RechargeHistoryProps } from "../types"

export function RechargeHistory({ history, isLoading, onExchangeCode }: RechargeHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">充值历史</h3>
        <Button
          variant="outline"
          onClick={onExchangeCode}
          className="flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          兑换码
        </Button>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">暂无充值记录</div>
            </CardContent>
          </Card>
        ) : (
          history.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">充值 {item.coins} M币</div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">¥{item.amount}</div>
                  <Badge
                    variant={item.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {item.status === 'completed' ? '已完成' : '处理中'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
