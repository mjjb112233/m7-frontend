import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/auth-context"
import { RechargeState, RechargeActions } from "../types"
import { RechargePackage, RechargeOrder, RechargeHistory } from "@/app/shared/types"

export function useRecharge(): RechargeState & RechargeActions {
  const authContext = useContext(AuthContext)
  const token = authContext?.token
  const refreshUserInfo = authContext?.refreshUserInfo

  // 状态管理
  const [packages, setPackages] = useState<RechargePackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<RechargeOrder | null>(null)
  const [history, setHistory] = useState<RechargeHistory[]>([])
  const [exchangeCode, setExchangeCode] = useState("")
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)

  // 获取充值套餐
  const fetchPackages = async () => {
    // 移除token检查，允许无登录访问
    setIsLoading(true)
    try {
      // 直接设置模拟数据，避免异步导入问题
      setPackages([
        {
          id: '1',
          name: '基础套餐',
          amount: 10,
          coins: 100,
          bonus: 0,
          description: '适合新手用户',
          popular: false
        },
        {
          id: '2',
          name: '热门套餐',
          amount: 50,
          coins: 550,
          bonus: 50,
          description: '最受欢迎的选择',
          popular: true
        },
        {
          id: '3',
          name: '高级套餐',
          amount: 100,
          coins: 1200,
          bonus: 200,
          description: '超值优惠',
          popular: false
        }
      ])
    } catch (error) {
      console.error('获取充值套餐失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 创建充值订单
  const createOrder = async (packageId: string, amount: number) => {
    // 移除token检查，允许无登录访问
    setIsLoading(true)
    try {
      // 创建模拟订单
      const mockOrder = {
        orderId: `order_${Date.now()}`,
        amount,
        coins: amount * 10,
        status: 'pending',
        paymentUrl: 'https://example.com/payment',
        qrCode: 'data:image/png;base64,mock-qr-code',
        createdAt: new Date().toISOString()
      }
      setCurrentOrder(mockOrder)
      setShowPaymentDialog(true)
    } catch (error) {
      console.error('创建订单失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取充值历史
  const fetchHistory = async () => {
    // 移除token检查，允许无登录访问
    try {
      // 设置模拟历史数据
      setHistory([
        {
          id: '1',
          amount: 50,
          coins: 550,
          status: 'completed',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:35:00Z'
        },
        {
          id: '2',
          amount: 100,
          coins: 1200,
          status: 'pending',
          createdAt: '2024-01-20T14:20:00Z'
        }
      ])
    } catch (error) {
      console.error('获取充值历史失败:', error)
    }
  }

  // 兑换码兑换
  const handleExchangeCode = async () => {
    if (!exchangeCode.trim()) return

    setIsLoading(true)
    try {
      // 模拟兑换码验证
      if (exchangeCode.trim() === 'TEST123') {
        alert('兑换成功！获得100积分')
        setExchangeCode("")
        setShowExchangeDialog(false)
      } else {
        alert('兑换码无效，请检查后重试')
      }
    } catch (error) {
      console.error('兑换失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    // 移除token检查，允许无登录访问
    fetchPackages()
    fetchHistory()
  }, [])

  return {
    // 状态
    packages,
    selectedPackage,
    customAmount,
    isLoading,
    showPaymentDialog,
    currentOrder,
    history,
    exchangeCode,
    showExchangeDialog,
    
    // 操作
    setPackages,
    setSelectedPackage,
    setCustomAmount,
    setIsLoading,
    setShowPaymentDialog,
    setCurrentOrder,
    setHistory,
    setExchangeCode,
    setShowExchangeDialog,
    fetchPackages,
    createOrder,
    fetchHistory,
    handleExchangeCode,
  }
}
