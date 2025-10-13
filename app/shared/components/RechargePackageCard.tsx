"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Star, Zap } from "lucide-react"
import { RechargePackage } from "../types"

interface RechargePackageCardProps {
  package: RechargePackage
  onSelect?: (pkg: RechargePackage) => void
  onPurchase?: (pkg: RechargePackage) => Promise<void>
  isLoading?: boolean
}

export function RechargePackageCard({ 
  package: pkg, 
  onSelect, 
  onPurchase, 
  isLoading = false 
}: RechargePackageCardProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected(!isSelected)
    onSelect?.(pkg)
  }

  const handlePurchase = async () => {
    if (!onPurchase) return
    
    try {
      await onPurchase(pkg)
    } catch (error) {
      console.error('购买失败:', error)
    }
  }

  const getCardColors = () => {
    if (pkg.popular) {
      return {
        bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
        accent: "from-yellow-500 to-orange-500",
        border: "border-yellow-200"
      }
    }
    return {
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      accent: "from-blue-500 to-cyan-500",
      border: "border-blue-200"
    }
  }

  const colors = getCardColors()

  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-yellow-500' : ''
      } ${colors.bg}`}
      onClick={handleSelect}
    >
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            热门
          </Badge>
        </div>
      )}
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative text-center pb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${colors.accent} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
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
          {pkg.originalPrice && pkg.discount && (
            <div className="text-sm text-gray-500">
              原价 ¥{pkg.originalPrice} 优惠 {pkg.discount}%
            </div>
          )}
        </div>
        
        <Button
          className={`w-full bg-gradient-to-r ${colors.accent} text-white hover:opacity-90 transition-all duration-300`}
          onClick={(e) => {
            e.stopPropagation()
            handlePurchase()
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              处理中...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              立即充值
            </div>
          )}
        </Button>
      </CardContent>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent}`}></div>
    </Card>
  )
}
