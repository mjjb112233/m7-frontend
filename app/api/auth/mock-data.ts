/**
 * 认证API模拟数据
 */

// 模拟用户数据
export const mockUsers = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    level: 2,
    balance: 500.0,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    level: 3,
    balance: 1000.0,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// 模拟Token数据
export const mockTokens = new Map<string, { token: string; expiresAt: number; userId: string }>()

// 生成模拟Token
export function generateMockToken(userId: string): string {
  const token = `mock_token_${userId}_${Date.now()}`
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天后过期
  mockTokens.set(token, { token, expiresAt, userId })
  return token
}

// 验证模拟Token
export function validateMockToken(token: string): { valid: boolean; userId?: string } {
  const tokenData = mockTokens.get(token)
  if (!tokenData) {
    return { valid: false }
  }
  
  if (Date.now() > tokenData.expiresAt) {
    mockTokens.delete(token)
    return { valid: false }
  }
  
  return { valid: true, userId: tokenData.userId }
}

// 模拟登录响应
export function getMockLoginResponse(username: string, password: string) {
  const user = mockUsers.find(u => u.username === username && u.password === password)
  
  if (!user) {
    return {
      success: false,
      message: '用户名或密码错误'
    }
  }
  
  const token = generateMockToken(user.id)
  
  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level
      }
    },
    message: '登录成功'
  }
}

// 模拟注册响应
export function getMockRegisterResponse(username: string, email: string, password: string) {
  // 检查用户是否已存在
  const existingUser = mockUsers.find(u => u.username === username || u.email === email)
  
  if (existingUser) {
    return {
      success: false,
      message: '用户名或邮箱已存在'
    }
  }
  
  // 创建新用户
  const newUser = {
    id: String(mockUsers.length + 1),
    username,
    email,
    password,
    level: 1,
    balance: 100.0,
    createdAt: new Date().toISOString()
  }
  
  mockUsers.push(newUser)
  
  const token = generateMockToken(newUser.id)
  
  return {
    success: true,
    data: {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        level: newUser.level
      }
    },
    message: '注册成功'
  }
}

// 模拟用户信息响应
export function getMockUserInfoResponse(token: string) {
  const tokenValidation = validateMockToken(token)
  
  if (!tokenValidation.valid) {
    return {
      success: false,
      message: 'Token无效或已过期'
    }
  }
  
  const user = mockUsers.find(u => u.id === tokenValidation.userId)
  
  if (!user) {
    return {
      success: false,
      message: '用户不存在'
    }
  }
  
  return {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      level: user.level,
      balance: user.balance,
      createdAt: user.createdAt
    }
  }
}

// 模拟刷新Token响应
export function getMockRefreshTokenResponse(token: string) {
  const tokenValidation = validateMockToken(token)
  
  if (!tokenValidation.valid) {
    return {
      success: false,
      message: 'Token无效或已过期'
    }
  }
  
  const newToken = generateMockToken(tokenValidation.userId!)
  
  return {
    success: true,
    data: {
      token: newToken
    },
    message: 'Token刷新成功'
  }
}

// 模拟登出响应
export function getMockLogoutResponse(token: string) {
  mockTokens.delete(token)
  
  return {
    success: true,
    message: '登出成功'
  }
}
