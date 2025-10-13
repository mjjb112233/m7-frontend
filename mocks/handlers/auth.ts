import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟用户数据
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  level: 2,
  mCoins: 1000,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-01-15T10:30:00Z'
}

// 模拟用户统计
const mockUserStats = {
  balance: 1000,
  todayUsage: 50,
  totalSpent: 200,
  lastLogin: '2024-01-15T10:30:00Z'
}

export const authHandlers = [
  // 用户登录
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    
    if (body.username === 'testuser' && body.password === 'password') {
      return createApiResponse({
        token: 'mock-jwt-token-12345',
        user: mockUser
      })
    }
    
    return createErrorResponse('用户名或密码错误', 401)
  }),

  // 用户注册
  http.post('*/api/auth/register', async ({ request }) => {
    const body = await request.json() as any
    
    if (body.username && body.email && body.password) {
      return createApiResponse({
        token: 'mock-jwt-token-12345',
        user: {
          ...mockUser,
          username: body.username,
          email: body.email
        }
      })
    }
    
    return createErrorResponse('注册信息不完整', 400)
  }),

  // 获取用户信息
  http.get('*/api/auth/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockUser)
  }),

  // 获取用户统计
  http.get('*/api/auth/stats', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    return createApiResponse(mockUserStats)
  }),

  // 修改密码
  http.post('*/api/auth/change-password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.currentPassword && body.newPassword) {
      return createApiResponse({ success: true })
    }
    
    return createErrorResponse('密码信息不完整', 400)
  })
]
