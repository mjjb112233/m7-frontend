/**
 * 认证相关API接口
 */

import { apiRequest, authenticatedRequest } from '@/lib/api-client'
import { ApiResponse } from '@/app/shared/types'
import * as mockData from './mock-data'

// 登录接口
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    level: number
  }
}

// 注册接口
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    level: number
  }
}

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  email: string
  level: number
  balance: number
  createdAt: string
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockLoginResponse(data.username, data.password))
      }, 500) // 模拟网络延迟
    })
  }
  
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockRegisterResponse(data.username, data.email, data.password))
      }, 800) // 模拟网络延迟
    })
  }
  
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * 获取用户信息
 */
export async function getUserInfo(token: string): Promise<ApiResponse<UserInfo>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockUserInfoResponse(token))
      }, 300) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<UserInfo>('/auth/user', token)
}

/**
 * 刷新Token
 */
export async function refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockRefreshTokenResponse(token))
      }, 200) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<{ token: string }>('/auth/refresh', token, {
    method: 'POST'
  })
}

/**
 * 登出
 */
export async function logout(token: string): Promise<ApiResponse<void>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockLogoutResponse(token))
      }, 200) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<void>('/auth/logout', token, {
    method: 'POST'
  })
}
