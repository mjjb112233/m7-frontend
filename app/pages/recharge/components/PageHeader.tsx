import { Coins } from "lucide-react"

export function PageHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          账户充值
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        选择充值套餐或自定义金额，快速为您的账户充值M币
      </p>
    </div>
  )
}
