import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Star } from "lucide-react"
import { PackageCardProps } from "../types"
import { getPackageGradient, getPackageBackground } from "../utils"

export function PackageCard({ pkg, isSelected, isLoading, onSelect, onRecharge }: PackageCardProps) {
  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-yellow-500' : ''
      }`}
      onClick={() => onSelect(pkg)}
    >
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            热门
          </Badge>
        </div>
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-br ${getPackageBackground(0)} opacity-60`}></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${getPackageGradient(0)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Coins className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">{pkg.name}</CardTitle>
        <CardDescription className="text-gray-600">{pkg.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="relative text-center space-y-4">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            ¥{pkg.amount}
          </div>
          <div className="text-lg text-gray-600">
            {pkg.coins} M币
          </div>
          {pkg.bonus > 0 && (
            <div className="text-sm text-green-600 font-medium">
              赠送 {pkg.bonus} M币
            </div>
          )}
        </div>
        
        <Button
          className={`w-full bg-gradient-to-r ${getPackageGradient(0)} text-white hover:from-yellow-600 hover:to-orange-600`}
          onClick={(e) => {
            e.stopPropagation()
            onRecharge(pkg)
          }}
          disabled={isLoading}
        >
          {isLoading ? '处理中...' : '立即充值'}
        </Button>
      </CardContent>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getPackageGradient(0)}`}></div>
    </Card>
  )
}
