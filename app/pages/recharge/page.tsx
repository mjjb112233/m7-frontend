"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRechargePackages } from '@/app/pages/shared/hooks/useRechargePackages'
import { RechargePackageCard } from '@/app/pages/shared/components/RechargePackageCard'
import Header from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  Gift,
  History,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Zap,
  Star,
  Crown
} from 'lucide-react'

export default function RechargePage() {
  const { user, token } = useAuth()
  const {
    packages,
    isLoading,
    error,
    fetchPackages,
    createOrder,
    exchangeCode
  } = useRechargePackages()

  const [exchangeCodeInput, setExchangeCodeInput] = useState('')
  const [isExchanging, setIsExchanging] = useState(false)
  const [exchangeResult, setExchangeResult] = useState<string | null>(null)

  // 模拟充值套餐数据
  const mockPackages = [
    {
      id: '1',
      name: '基础套餐',
      amount: 100,
      bonus: 0,
      price: 100,
      description: '适合新手用户',
      features: ['基础功能', '标准支持'],
      popular: false,
      icon: CreditCard
    },
    {
      id: '2',
      name: '标准套餐',
      amount: 500,
      bonus: 50,
      price: 500,
      description: '最受欢迎的选择',
      features: ['所有功能', '优先支持', '额外奖励'],
      popular: true,
      icon: Star
    },
    {
      id: '3',
      name: '高级套餐',
      amount: 1000,
      bonus: 200,
      price: 1000,
      description: '专业用户首选',
      features: ['所有功能', 'VIP支持', '专属服务', '高级功能'],
      popular: false,
      icon: Crown
    }
  ]

  // 初始化数据
  useEffect(() => {
    if (token) {
      fetchPackages()
    }
  }, [token, fetchPackages])

  // 处理套餐选择
  const handlePackageSelect = async (packageId: string) => {
    try {
      const order = await createOrder(packageId, 0)
      console.log('创建订单:', order)
      // 这里可以跳转到支付页面
      alert('订单创建成功，跳转到支付页面')
    } catch (error) {
      console.error('创建订单失败:', error)
    }
  }

  // 处理兑换码
  const handleExchangeCode = async () => {
    if (!exchangeCodeInput.trim()) {
      setExchangeResult('请输入兑换码')
      return
    }

    setIsExchanging(true)
    setExchangeResult(null)

    try {
      const result = await exchangeCode(exchangeCodeInput)
      setExchangeResult('兑换成功！')
      setExchangeCodeInput('')
    } catch (error: any) {
      setExchangeResult(error.message || '兑换失败')
    } finally {
      setIsExchanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">账户充值</h1>
          <p className="text-xl text-gray-600">选择适合您的充值套餐，享受更多服务</p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：充值套餐 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="packages" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="packages">充值套餐</TabsTrigger>
                <TabsTrigger value="exchange">兑换码</TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">选择充值套餐</h2>
                  <p className="text-gray-600">选择适合您的套餐，享受更多优惠</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockPackages.map((pkg) => {
                    const Icon = pkg.icon
                    return (
                      <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500 text-white px-3 py-1">
                              最受欢迎
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-gray-600 text-sm">{pkg.description}</p>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                          <div className="space-y-2">
                            <div className="text-3xl font-bold text-gray-900">
                              ¥{pkg.price}
                            </div>
                            <div className="text-sm text-gray-600">
                              获得 {pkg.amount} 积分
                              {pkg.bonus > 0 && (
                                <span className="text-green-600 ml-1">
                                  + {pkg.bonus} 奖励
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => handlePackageSelect(pkg.id)}
                            className="w-full"
                            variant={pkg.popular ? 'default' : 'outline'}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            立即充值
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="exchange" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">兑换码充值</h2>
                  <p className="text-gray-600">输入兑换码，快速充值到账户</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      兑换码充值
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="exchangeCode">兑换码</Label>
                      <Input
                        id="exchangeCode"
                        placeholder="请输入兑换码"
                        value={exchangeCodeInput}
                        onChange={(e) => setExchangeCodeInput(e.target.value)}
                        className="font-mono"
                      />
                    </div>

                    <Button
                      onClick={handleExchangeCode}
                      disabled={isExchanging || !exchangeCodeInput.trim()}
                      className="w-full"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      {isExchanging ? '兑换中...' : '立即兑换'}
                    </Button>

                    {exchangeResult && (
                      <Alert variant={exchangeResult.includes('成功') ? 'default' : 'destructive'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{exchangeResult}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：账户信息和历史 */}
          <div className="space-y-6">
            {/* 账户统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  账户统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">当前余额</span>
                  <span className="text-2xl font-bold text-green-600">¥1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">本月消费</span>
                  <span className="text-lg font-semibold">¥320</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">累计充值</span>
                  <span className="text-lg font-semibold">¥2,500</span>
                </div>
              </CardContent>
            </Card>

            {/* 充值历史 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  最近充值
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { date: '2024-01-15', amount: 500, status: '成功' },
                  { date: '2024-01-10', amount: 200, status: '成功' },
                  { date: '2024-01-05', amount: 100, status: '成功' }
                ].map((record, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{record.date}</div>
                      <div className="text-xs text-gray-500">{record.status}</div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      +¥{record.amount}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card>
              <CardHeader>
                <CardTitle>充值说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>1. 选择适合的充值套餐</p>
                <p>2. 确认充值金额和奖励</p>
                <p>3. 选择支付方式完成支付</p>
                <p>4. 充值成功后余额立即到账</p>
                <p className="text-blue-600 font-medium">
                  充值金额越高，享受的优惠越多
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}