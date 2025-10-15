/**
 * 充值API模拟数据
 */

// 模拟充值套餐数据
export const mockRechargePackages = [
  {
    id: '1',
    name: '基础套餐',
    description: '适合轻度使用',
    amount: 10,
    bonus: 0,
    price: 10.00,
    currency: 'USD',
    popular: false,
    features: ['10 M币', '基础功能', '邮件支持']
  },
  {
    id: '2',
    name: '标准套餐',
    description: '适合日常使用',
    amount: 50,
    bonus: 5,
    price: 50.00,
    currency: 'USD',
    popular: true,
    features: ['55 M币', '所有功能', '优先支持', '5 M币奖励']
  },
  {
    id: '3',
    name: '高级套餐',
    description: '适合重度使用',
    amount: 100,
    bonus: 20,
    price: 100.00,
    currency: 'USD',
    popular: false,
    features: ['120 M币', '所有功能', 'VIP支持', '20 M币奖励', '专属客服']
  },
  {
    id: '4',
    name: '企业套餐',
    description: '适合企业用户',
    amount: 500,
    bonus: 100,
    price: 500.00,
    currency: 'USD',
    popular: false,
    features: ['600 M币', '企业功能', '专属客服', '100 M币奖励', '定制服务']
  }
]

// 模拟充值订单数据
export const mockRechargeOrders = new Map<string, {
  orderId: string
  userId: string
  packageId: string
  amount: number
  bonus: number
  price: number
  currency: string
  status: 'pending' | 'paid' | 'completed' | 'failed' | 'cancelled'
  paymentMethod: string
  createdAt: string
  paidAt?: string
  completedAt?: string
}>()

// 模拟充值历史数据
export const mockRechargeHistory = new Map<string, any[]>()

// 模拟支付方式
export const mockPaymentMethods = [
  {
    id: 'paypal',
    name: 'PayPal',
    description: '使用PayPal账户支付',
    icon: 'paypal',
    enabled: true
  },
  {
    id: 'stripe',
    name: '信用卡',
    description: '使用信用卡支付',
    icon: 'credit-card',
    enabled: true
  },
  {
    id: 'crypto',
    name: '加密货币',
    description: '使用比特币等加密货币支付',
    icon: 'bitcoin',
    enabled: true
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '使用支付宝支付',
    icon: 'alipay',
    enabled: true
  }
]

// 模拟获取充值配置
export function getMockRechargeConfig() {
  return {
    success: true,
    data: {
      packages: mockRechargePackages,
      paymentMethods: mockPaymentMethods,
      minAmount: 1,
      maxAmount: 10000,
      supportedCurrencies: ['USD', 'EUR', 'CNY', 'JPY']
    }
  }
}

// 模拟获取充值套餐
export function getMockRechargePackages() {
  return {
    success: true,
    data: mockRechargePackages
  }
}

// 模拟创建充值订单
export function getMockCreateRechargeOrder(userId: string, packageId: string, paymentMethod: string) {
  const packageData = mockRechargePackages.find(p => p.id === packageId)
  
  if (!packageData) {
    return {
      success: false,
      message: '套餐不存在'
    }
  }
  
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // 创建订单
  mockRechargeOrders.set(orderId, {
    orderId,
    userId,
    packageId,
    amount: packageData.amount,
    bonus: packageData.bonus,
    price: packageData.price,
    currency: packageData.currency,
    status: 'pending',
    paymentMethod,
    createdAt: new Date().toISOString()
  })
  
  return {
    success: true,
    data: {
      orderId,
      amount: packageData.amount,
      bonus: packageData.bonus,
      price: packageData.price,
      currency: packageData.currency,
      paymentUrl: `https://payment.example.com/pay/${orderId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30分钟后过期
    },
    message: '订单创建成功'
  }
}

// 模拟获取充值历史
export function getMockRechargeHistory(userId: string, page: number = 1, limit: number = 10) {
  const userHistory = mockRechargeHistory.get(userId) || []
  
  // 生成一些模拟历史数据
  if (userHistory.length === 0) {
    for (let i = 0; i < 20; i++) {
      const packageData = mockRechargePackages[Math.floor(Math.random() * mockRechargePackages.length)]
      userHistory.push({
        orderId: `order_${Date.now() - i * 86400000}_${Math.random().toString(36).substr(2, 9)}`,
        packageName: packageData.name,
        amount: packageData.amount,
        bonus: packageData.bonus,
        price: packageData.price,
        currency: packageData.currency,
        status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - i * 86400000).toISOString()
      })
    }
    mockRechargeHistory.set(userId, userHistory)
  }
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedHistory = userHistory.slice(startIndex, endIndex)
  
  return {
    success: true,
    data: {
      history: paginatedHistory,
      pagination: {
        page,
        limit,
        total: userHistory.length,
        totalPages: Math.ceil(userHistory.length / limit)
      }
    }
  }
}

// 模拟支付处理
export function getMockRechargePayment(orderId: string, paymentData: any) {
  const order = mockRechargeOrders.get(orderId)
  
  if (!order) {
    return {
      success: false,
      message: '订单不存在'
    }
  }
  
  if (order.status !== 'pending') {
    return {
      success: false,
      message: '订单状态不正确'
    }
  }
  
  // 模拟支付处理
  const paymentSuccess = Math.random() > 0.1 // 90%成功率
  
  if (paymentSuccess) {
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    
    // 模拟异步完成处理
    setTimeout(() => {
      order.status = 'completed'
      order.completedAt = new Date().toISOString()
    }, 2000)
    
    return {
      success: true,
      data: {
        orderId,
        status: 'paid',
        message: '支付成功'
      }
    }
  } else {
    order.status = 'failed'
    
    return {
      success: false,
      message: '支付失败，请重试'
    }
  }
}

// 模拟支付回调
export function getMockRechargeCallback(orderId: string, callbackData: any) {
  const order = mockRechargeOrders.get(orderId)
  
  if (!order) {
    return {
      success: false,
      message: '订单不存在'
    }
  }
  
  // 模拟回调处理
  order.status = 'completed'
  order.completedAt = new Date().toISOString()
  
  return {
    success: true,
    data: {
      orderId,
      status: 'completed',
      message: '充值完成'
    }
  }
}

// 模拟兑换码
export function getMockRechargeExchangeCode(userId: string, code: string) {
  // 模拟兑换码验证
  const validCodes = ['WELCOME10', 'NEWUSER20', 'SPECIAL50']
  
  if (!validCodes.includes(code.toUpperCase())) {
    return {
      success: false,
      message: '兑换码无效或已过期'
    }
  }
  
  // 模拟兑换成功
  const bonusAmount = code === 'WELCOME10' ? 10 : code === 'NEWUSER20' ? 20 : 50
  
  return {
    success: true,
    data: {
      code,
      amount: bonusAmount,
      message: `成功兑换 ${bonusAmount} M币`
    }
  }
}
