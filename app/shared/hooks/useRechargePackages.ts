"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { RechargePackage, RechargeOrder } from "../types"

export function useRechargePackages() {
  const { token } = useAuth()
  const [packages, setPackages] = useState<RechargePackage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取充值套餐
  const fetchPackages = async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/recharge/packages', token)
      
      if (response.success && response.data) {
        setPackages((response.data as any).packages || [])
      }
    } catch (error: any) {
      setError(error.message || '获取充值套餐失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 创建充值订单
  const createOrder = async (packageId: string, amount: number): Promise<RechargeOrder> => {
    if (!token) throw new Error('未登录')

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/recharge/create-order', token, {
        method: 'POST',
        body: JSON.stringify({ packageId, amount })
      })

      if (response.success && response.data) {
        return response.data as RechargeOrder
      } else {
        throw new Error(response.message || '创建订单失败')
      }
    } catch (error: any) {
      setError(error.message || '创建订单失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 兑换码兑换
  const exchangeCode = async (code: string) => {
    if (!token) throw new Error('未登录')

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/recharge/exchange-code', token, {
        method: 'POST',
        body: JSON.stringify({ code })
      })

      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || '兑换失败')
      }
    } catch (error: any) {
      setError(error.message || '兑换失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    if (token) {
      fetchPackages()
    }
  }, [token])

  return {
    packages,
    isLoading,
    error,
    fetchPackages,
    createOrder,
    exchangeCode,
    refetch: fetchPackages
  }
}
