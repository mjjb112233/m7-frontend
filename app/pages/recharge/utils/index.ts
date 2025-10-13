import { RechargePackage } from "@/app/shared/types"

export const getPackageGradient = (index: number) => {
  const gradients = [
    "from-yellow-500 to-orange-500",
    "from-blue-500 to-cyan-500", 
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-red-500 to-rose-500"
  ]
  return gradients[index % gradients.length]
}

export const getPackageBackground = (index: number) => {
  const backgrounds = [
    "from-yellow-50 to-orange-50",
    "from-blue-50 to-cyan-50",
    "from-purple-50 to-pink-50", 
    "from-green-50 to-emerald-50",
    "from-red-50 to-rose-50"
  ]
  return backgrounds[index % backgrounds.length]
}

export const calculateCustomCoins = (amount: number): number => {
  return Math.floor(amount * 10)
}

export const formatCurrency = (amount: number): string => {
  return `¥${amount}`
}

export const formatCoins = (coins: number): string => {
  return `${coins} M币`
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}
