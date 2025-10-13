import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟BIN分类配置
const mockBinClassifyConfig = {
  categories: ['country', 'bank', 'brand', 'type', 'level'],
  groupBy: 'country',
  sortOrder: 'asc'
}

// 模拟分类结果
const mockClassificationResult = {
  groupedResults: {
    'US': [
      {
        cardNumber: '4000123456789012',
        brand: 'Visa',
        type: 'Credit',
        level: 'Classic',
        bank: 'Chase Bank',
        country: 'US',
        currency: 'USD'
      },
      {
        cardNumber: '4000123456789013',
        brand: 'Visa',
        type: 'Credit',
        level: 'Gold',
        bank: 'Bank of America',
        country: 'US',
        currency: 'USD'
      }
    ],
    'CA': [
      {
        cardNumber: '5000123456789012',
        brand: 'Mastercard',
        type: 'Credit',
        level: 'Platinum',
        bank: 'RBC',
        country: 'CA',
        currency: 'CAD'
      }
    ]
  },
  totalCards: 3,
  categories: ['US', 'CA'],
  processingTime: 1500
}

export const binClassifyHandlers = [
  // 获取BIN分类配置
  http.get('*/api/bin-classify/config', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockBinClassifyConfig)
  }),

  // 开始BIN分类
  http.post('*/api/bin-classify/start', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.cardNumbers && body.cardNumbers.length > 0) {
      return createApiResponse({
        taskId: 'bin-classify-' + Date.now(),
        status: 'processing'
      })
    }
    
    return createErrorResponse('卡片号码列表不能为空', 400)
  }),

  // 获取BIN分类结果
  http.get('*/api/bin-classify/results', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockClassificationResult)
  })
]
