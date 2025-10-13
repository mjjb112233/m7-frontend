"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { UserStats } from "../types"

interface UserStatsCardProps {
  onStatsUpdate?: (stats: UserStats) => void
}

export function UserStatsCard({ onStatsUpdate }: UserStatsCardProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    balance: user?.mCoins || 0,
    todayUsage: 0,
    totalSpent: 0,
    lastLogin: user?.createdAt || new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(true)

  // 获取用户统计数据
  const fetchUserStats = async () => {
    setIsLoading(true)
    try {
      // 这里应该调用API获取统计数据
      // const response = await fetchUserStatistics()
      // const statsData = response.data
      
      // 模拟数据
      const statsData = {
        balance: user?.mCoins || 0,
        todayUsage: 0,
        totalSpent: 0,
      }
      
      setStats({
        ...statsData,
        lastLogin: user?.createdAt || new Date().toISOString(),
      })
      onStatsUpdate?.({
        ...statsData,
        lastLogin: user?.createdAt || new Date().toISOString(),
      })
    } catch (error) {
      console.error('获取用户统计失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserStats()
  }, [user?.mCoins])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-2xl font-bold text-blue-600">{stats.balance}</div>
        <div className="text-sm text-blue-600">M币余额</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-600">{stats.todayUsage}</div>
        <div className="text-sm text-green-600">今日使用</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-2xl font-bold text-purple-600">{stats.totalSpent}</div>
        <div className="text-sm text-purple-600">总消费</div>
      </div>
    </div>
  )
}
