/**
 * API客户端工具函数
 * 
 * 提供统一的API请求接口，支持环境变量配置和错误处理
 * 主要功能：
 * 1. 统一管理API基础URL
 * 2. 提供带认证和不带认证的请求方法
 * 3. 统一的错误处理和响应格式
 * 4. 支持WebSocket连接
 * 5. 调试模式支持
 */

/**
 * 获取API基础URL
 * 优先使用环境变量 NEXT_PUBLIC_API_BASE_URL
 * 如果环境变量未设置，则使用默认值 http://localhost:8080/api
 * @returns {string} API基础URL
 */
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
}

/**
 * 获取WebSocket基础URL
 * 优先使用环境变量 NEXT_PUBLIC_WS_BASE_URL
 * 如果环境变量未设置，则使用默认值 ws://localhost:8080
 * @returns {string} WebSocket基础URL
 */
const getWsBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8080"
}

/**
 * 检查是否启用调试模式
 * 通过环境变量 NEXT_PUBLIC_DEBUG_MODE 控制
 * 调试模式下会输出详细的请求日志
 * @returns {boolean} 是否启用调试模式
 */
const isDebugMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEBUG_MODE === "true"
}

import { ApiResponse } from '@/app/shared/types'



// 通用API请求函数
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    // 如果URL不是完整URL，则添加API基础URL
    const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`
    
    if (isDebugMode()) {
      console.log(`[API] 通用请求: ${fullUrl}`)
    }
    
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("API请求失败:", error)
    return {
      success: false,
      message: "网络请求失败，请检查网络连接",
    }
  }
}

// 带认证的API请求函数
export async function authenticatedRequest<T>(
  url: string, 
  token: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // 如果URL不是完整URL，则添加API基础URL
    const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`
    
    if (isDebugMode()) {
      console.log(`[API] 认证请求: ${fullUrl}`)
    }
    
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    })

    const result = await response.json()
    
    // 如果HTTP状态码不是200，但响应包含JSON数据，返回响应数据
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
      }
    }
    
    return result
  } catch (error) {
    console.error("认证API请求失败:", error)
    return {
      success: false,
      message: "网络请求失败，请检查网络连接",
    }
  }
}

// 获取WebSocket URL
export function getWebSocketUrl(token: string): string {
  const wsBaseUrl = getWsBaseUrl()
  return `${wsBaseUrl}/api/cvv-check/ws?token=${token}`
}

// 导出基础URL获取函数
export { getApiBaseUrl, getWsBaseUrl, isDebugMode }