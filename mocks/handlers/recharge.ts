import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟充值套餐
const mockRechargePackages = [
  {
    id: 'package-1',
    name: '基础套餐',
    amount: 100,
    price: 10,
    bonus: 0,
    description: '基础充值套餐，无额外奖励',
    isPopular: false
  },
  {
    id: 'package-2',
    name: '标准套餐',
    amount: 500,
    price: 45,
    bonus: 25,
    description: '标准充值套餐，额外赠送25M币',
    isPopular: true
  },
  {
    id: 'package-3',
    name: '高级套餐',
    amount: 1000,
    price: 80,
    bonus: 100,
    description: '高级充值套餐，额外赠送100M币',
    isPopular: false
  },
  {
    id: 'package-4',
    name: '豪华套餐',
    amount: 2000,
    price: 150,
    bonus: 300,
    description: '豪华充值套餐，额外赠送300M币',
    isPopular: false
  }
]

// 模拟充值订单
const mockRechargeOrder = {
  id: 'order-' + Date.now(),
  packageId: 'package-2',
  amount: 500,
  price: 45,
  bonus: 25,
  status: 'pending',
  paymentMethod: 'usdt',
  paymentAddress: 'TXYZ1234567890abcdef',
  paymentAmount: 45,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30分钟后过期
}

// 模拟充值历史
const mockRechargeHistory = [
  {
    id: 'order-1',
    packageId: 'package-1',
    amount: 100,
    price: 10,
    bonus: 0,
    status: 'completed',
    paymentMethod: 'usdt',
    createdAt: '2024-01-10T10:00:00Z',
    completedAt: '2024-01-10T10:05:00Z'
  },
  {
    id: 'order-2',
    packageId: 'package-2',
    amount: 500,
    price: 45,
    bonus: 25,
    status: 'completed',
    paymentMethod: 'usdt',
    createdAt: '2024-01-12T14:30:00Z',
    completedAt: '2024-01-12T14:35:00Z'
  }
]

export const rechargeHandlers = [
  // 获取充值配置
  http.get('*/api/recharge/config', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse({
      paymentMethods: ['usdt', 'btc', 'eth'],
      minAmount: 10,
      maxAmount: 10000,
      exchangeRate: 1.0
    })
  }),

  // 获取充值套餐
  http.get('*/api/recharge/packages', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse({
      packages: mockRechargePackages
    })
  }),

  // 获取单个套餐详情
  http.get('/api/recharge/packages/:id', ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const packageId = params.id as string
    const packageData = mockRechargePackages.find(pkg => pkg.id === packageId)
    
    if (!packageData) {
      return createErrorResponse('套餐不存在', 404)
    }
    
    return createApiResponse(packageData)
  }),

  // 创建充值订单
  http.post('/api/recharge/create-order', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.packageId && body.amount) {
      const packageData = mockRechargePackages.find(pkg => pkg.id === body.packageId)
      
      if (!packageData) {
        return createErrorResponse('套餐不存在', 404)
      }
      
      return createApiResponse({
        ...mockRechargeOrder,
        packageId: body.packageId,
        amount: body.amount,
        price: packageData.price,
        bonus: packageData.bonus
      })
    }
    
    return createErrorResponse('订单参数不完整', 400)
  }),

  // 获取充值历史
  http.get('*/api/recharge/history', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse({
      orders: mockRechargeHistory,
      total: mockRechargeHistory.length,
      page: 1,
      limit: 10
    })
  }),

  // 兑换码兑换
  http.post('/api/recharge/redeem-code', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.code) {
      // 模拟兑换码验证
      if (body.code === 'VALIDCODE123') {
        return createApiResponse({
          success: true,
          amount: 100,
          message: '兑换成功，已充值100M币'
        })
      } else {
        return createErrorResponse('兑换码无效或已使用', 400)
      }
    }
    
    return createErrorResponse('兑换码不能为空', 400)
  })
]
