"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { User, UserStats } from "../types"

export function useUserProfile() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取用户详细信息
  const fetchUserProfile = async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/auth/user', token)
      
      if (response.success && response.data) {
        setProfile(response.data as User)
      }
    } catch (error: any) {
      setError(error.message || '获取用户信息失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取用户统计数据
  const fetchUserStats = async () => {
    if (!token) return

    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/auth/stats', token)
      
      if (response.success && response.data) {
        setStats(response.data as UserStats)
      }
    } catch (error: any) {
      console.error('获取用户统计失败:', error)
    }
  }

  // 更新用户信息
  const updateUserProfile = async (data: { username: string; email: string }) => {
    if (!token) throw new Error('未登录')

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/auth/update-profile', token, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (response.success) {
        await fetchUserProfile()
        return response.data
      } else {
        throw new Error(response.message || '更新失败')
      }
    } catch (error: any) {
      setError(error.message || '更新失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 修改密码
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error('未登录')

    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/auth/change-password', token, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || '密码修改失败')
      }
    } catch (error: any) {
      setError(error.message || '密码修改失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    if (token) {
      fetchUserProfile()
      fetchUserStats()
    }
  }, [token])

  return {
    profile,
    stats,
    isLoading,
    error,
    fetchUserProfile,
    fetchUserStats,
    updateUserProfile,
    changePassword,
    refetch: () => {
      fetchUserProfile()
      fetchUserStats()
    }
  }
}
