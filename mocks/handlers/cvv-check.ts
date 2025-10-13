import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟检测配置
const mockDetectionConfig = {
  detectionModes: [
    {
      'mode-id': 1,
      name: '充值测试',
      'channels-data': {
        channels: [
          {
            id: 'channel-1',
            name: '快速通道',
            status: 'online',
            consumption: 10,
            speed: '快速',
            description: '高速检测通道，适合大批量检测'
          },
          {
            id: 'channel-2',
            name: '标准通道',
            status: 'online',
            consumption: 5,
            speed: '标准',
            description: '标准检测通道，性价比高'
          },
          {
            id: 'channel-3',
            name: '经济通道',
            status: 'busy',
            consumption: 2,
            speed: '慢速',
            description: '经济型检测通道，成本低'
          }
        ],
        description: '充值测试模式，用于验证卡片有效性'
      }
    },
    {
      'mode-id': 2,
      name: '无CVV检测',
      'channels-data': {
        channels: [
          {
            id: 'channel-4',
            name: '无CVV快速',
            status: 'online',
            consumption: 8,
            speed: '快速',
            description: '无CVV检测快速通道'
          }
        ],
        description: '无CVV检测模式'
      }
    },
    {
      'mode-id': 3,
      name: '带CVV检测',
      'channels-data': {
        channels: [
          {
            id: 'channel-5',
            name: 'CVV检测',
            status: 'online',
            consumption: 15,
            speed: '快速',
            description: '带CVV检测通道'
          }
        ],
        description: '带CVV检测模式'
      }
    }
  ]
}

// 模拟用户检测状态
const mockUserDetectionStatus = {
  status: 'idle',
  detectionId: null,
  progress: 0,
  message: '等待开始检测'
}

// 模拟检测进度
const mockDetectionProgress = {
  progress: 75,
  message: '正在检测中...',
  processedCount: 15,
  totalCount: 20,
  currentCard: '4000****1234'
}

// 模拟检测结果
const mockDetectionResults = {
  validCount: 12,
  invalidCount: 3,
  totalCount: 15,
  validCards: [
    '4000123456789012',
    '4000123456789013',
    '4000123456789014'
  ],
  invalidCards: [
    '4000123456789999',
    '4000123456788888'
  ],
  detectionTime: '2024-01-15T10:30:00Z',
  results: [
    {
      cardNumber: '4000123456789012',
      isValid: true,
      cvv: '123',
      brand: 'Visa',
      type: 'Credit',
      level: 'Classic'
    },
    {
      cardNumber: '4000123456789999',
      isValid: false,
      cvv: null,
      brand: 'Visa',
      type: 'Credit',
      level: 'Classic'
    }
  ]
}

export const cvvCheckHandlers = [
  // 获取用户检测状态
  http.get('*/api/cvv-check/user-status', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockUserDetectionStatus)
  }),

  // 获取检测配置
  http.get('*/api/cvv-check/config', ({ request }) => {
    // 在开发模式下，跳过认证检查
    if (process.env.NODE_ENV === 'development') {
      return createApiResponse(mockDetectionConfig)
    }
    
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockDetectionConfig)
  }),

  // 获取检测进度
  http.get('*/api/cvv-check/detection-progress', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockDetectionProgress)
  }),

  // 获取检测结果
  http.post('*/api/cvv-check/detection-results', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockDetectionResults)
  }),

  // 开始检测
  http.post('*/api/cvv-check/start-detection', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.detectionMode && body.channels && body.cvvList) {
      return createApiResponse({
        detectionId: 'detection-' + Date.now(),
        status: 'started'
      })
    }
    
    return createErrorResponse('检测参数不完整', 400)
  }),

  // 停止检测
  http.post('*/api/cvv-check/stop-detection', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse({ success: true })
  }),

  // 重置检测状态
  http.get('*/api/cvv-check/reset-detection-status', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse({ success: true })
  })
]
