/**
 * 认证相关API接口
 */

import { apiRequest, authenticatedRequest } from '@/lib/api-client'
import { ApiResponse } from '@/app/shared/types'

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
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * 获取用户信息
 */
export async function getUserInfo(token: string): Promise<ApiResponse<UserInfo>> {
  return authenticatedRequest<UserInfo>('/auth/user', token)
}

/**
 * 刷新Token
 */
export async function refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
  return authenticatedRequest<{ token: string }>('/auth/refresh', token, {
    method: 'POST'
  })
}

/**
 * 登出
 */
export async function logout(token: string): Promise<ApiResponse<void>> {
  return authenticatedRequest<void>('/auth/logout', token, {
    method: 'POST'
  })
}
