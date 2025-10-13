"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOut, CheckCircle, XCircle, User, Shield, Mail, Coins } from "lucide-react"
import Header from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { UserProfileCard, UserStatsCard, PasswordChangeDialog } from "@/app/shared/components"
import { useUserProfile } from "@/app/shared/hooks"

export default function AccountPage() {
  return (
    <AuthGuard requiredLevel={1}>
      <AccountContent />
    </AuthGuard>
  )
}

function AccountContent() {
  const { user, logout } = useAuth()
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // 使用独立的hooks
  const { updateUserProfile, changePassword } = useUserProfile()

  // 显示消息
  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  // 处理个人信息保存
  const handleSaveProfile = async (data: { username: string; email: string }) => {
    try {
      await updateUserProfile(data)
      showMessage("个人信息更新成功", "success")
    } catch (error: any) {
      showMessage(error.message || "更新失败，请重试", "error")
    }
  }

  // 处理密码修改
  const handleChangePassword = async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    try {
      await changePassword(data.currentPassword, data.newPassword)
      showMessage("密码修改成功", "success")
    } catch (error: any) {
      showMessage(error.message || "密码修改失败，请重试", "error")
    }
  }

  // 登出
  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                账户管理
              </h1>
            </div>
            <p className="text-gray-600">
              管理您的个人信息、安全设置和账户偏好
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">个人信息</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="billing">账单信息</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <UserProfileCard
                onSave={handleSaveProfile}
                onError={(error) => showMessage(error, "error")}
                onSuccess={(message) => showMessage(message, "success")}
              />
              
              <UserStatsCard />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>安全设置</CardTitle>
                  <CardDescription>管理您的账户安全</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">密码</div>
                        <div className="text-sm text-gray-500">定期更新密码以保护账户安全</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      修改密码
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">邮箱验证</div>
                        <div className="text-sm text-gray-500">已验证邮箱地址</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      已验证
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>账单信息</CardTitle>
                  <CardDescription>查看您的消费记录和余额</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Coins className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">当前余额</div>
                          <div className="text-sm text-gray-500">M币余额</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{user?.mCoins || 0}</div>
                        <div className="text-sm text-blue-600">M币</div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <div className="text-gray-500">暂无消费记录</div>
                      <div className="text-sm text-gray-400 mt-1">您的消费记录将显示在这里</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        </div>
      </div>

      {/* 修改密码对话框 */}
      <PasswordChangeDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onChangePassword={handleChangePassword}
        onError={(error) => showMessage(error, "error")}
        onSuccess={(message) => showMessage(message, "success")}
      />

      {/* 登出确认对话框 */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认退出登录</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要退出登录吗？退出后需要重新登录才能使用服务。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              确认退出
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 消息提示 */}
      {message && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
            messageType === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {messageType === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
