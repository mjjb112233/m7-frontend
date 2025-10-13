import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟信息生成配置
const mockInfoGenerateConfig = {
  maxCards: 100,
  fields: ['name', 'address', 'phone', 'email'],
  formats: ['US', 'CA', 'UK', 'AU']
}

// 模拟信息生成结果
const mockInfoGenerateResult = {
  successData: [
    {
      cardNumber: '4000123456789012',
      generatedInfo: {
        name: 'John Smith',
        address: '123 Main St, New York, NY 10001',
        phone: '+1-555-0123',
        email: 'john.smith@email.com'
      }
    },
    {
      cardNumber: '5000123456789012',
      generatedInfo: {
        name: 'Jane Doe',
        address: '456 Oak Ave, Toronto, ON M5V 3A8',
        phone: '+1-416-555-0123',
        email: 'jane.doe@email.com'
      }
    }
  ],
  failedCardNumbers: [],
  totalGenerated: 2,
  processingTime: 2000
}

export const infoGenerateHandlers = [
  // 获取信息生成配置
  http.get('*/api/info-generate/config', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockInfoGenerateConfig)
  }),

  // 开始信息生成
  http.post('*/api/info-generate/start', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.cardNumbers && body.cardNumbers.length > 0) {
      return createApiResponse({
        taskId: 'info-generate-' + Date.now(),
        status: 'processing'
      })
    }
    
    return createErrorResponse('卡片号码列表不能为空', 400)
  }),

  // 获取信息生成结果
  http.get('*/api/info-generate/results', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockInfoGenerateResult)
  })
]
