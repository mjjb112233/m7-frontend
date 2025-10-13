"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, CreditCard, Edit, Save, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserProfileCardProps {
  onSave?: (data: { username: string; email: string }) => Promise<void>
  onError?: (error: string) => void
  onSuccess?: (message: string) => void
}

export function UserProfileCard({ onSave, onError, onSuccess }: UserProfileCardProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  // 获取用户等级显示
  const getUserLevelDisplay = (level: number) => {
    const levels = {
      1: { label: "普通用户", color: "bg-gray-500", icon: User },
      2: { label: "高级用户", color: "bg-blue-500", icon: Shield },
      3: { label: "VIP用户", color: "bg-purple-500", icon: CreditCard },
    }
    return levels[level as keyof typeof levels] || levels[1]
  }

  const levelInfo = getUserLevelDisplay(user?.level || 1)
  const LevelIcon = levelInfo.icon

  // 保存个人信息
  const handleSave = async () => {
    if (!onSave) return

    setIsLoading(true)
    try {
      await onSave(formData)
      setIsEditing(false)
      onSuccess?.("个人信息更新成功")
    } catch (error: any) {
      onError?.(error.message || "更新失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  // 取消编辑
  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>管理您的基本信息</CardDescription>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              编辑
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                取消
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "保存中..." : "保存"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{user?.username}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${levelInfo.color} text-white`}>
                <LevelIcon className="w-3 h-3 mr-1" />
                {levelInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
