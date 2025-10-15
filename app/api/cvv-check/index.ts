/**
 * CVV检测相关API接口
 */

import { authenticatedRequest } from '@/lib/api-client'
import { ApiResponse } from '@/app/shared/types'
import { 
  UserDetectionStatus, 
  DetectionStatus, 
  DetectionProgressData,
  DetectionResultData,
  Channel,
  DetectionMode,
  ErrorType
} from '@/app/shared/types'
import * as mockData from './mock-data'

// 用户检测状态响应
export interface UserDetectionStatusResponse {
  status: UserDetectionStatus
  detectionId?: string | null
}

// 检测配置响应
export interface DetectionConfigResponse {
  detectionModes: DetectionMode[]
}

// 检测进度响应
export interface DetectionProgressResponse extends DetectionProgressData {}

// 检测结果响应
export interface DetectionResultsResponse extends DetectionResultData {}

// 启动检测请求
export interface StartDetectionRequest {
  detectionMode: number
  channels: number[]
  autoStop: boolean
  validStopCount?: number
  cvvList: string[]
}

// 启动检测响应
export interface StartDetectionResponse {
  detectionId: string
  status: string
}

/**
 * 获取用户检测状态
 */
export async function fetchUserDetectionStatus(token: string): Promise<ApiResponse<UserDetectionStatusResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockUserDetectionStatus('user_1'))
      }, 300) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<UserDetectionStatusResponse>('/cvv-check/user-status', token)
}

/**
 * 获取检测配置
 */
export async function fetchDetectionConfig(token: string): Promise<ApiResponse<DetectionConfigResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockDetectionConfig())
      }, 200) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<DetectionConfigResponse>('/cvv-check/config', token)
}

/**
 * 获取检测进度
 */
export async function fetchDetectionProgress(
  token: string, 
  detectionId?: string
): Promise<ApiResponse<DetectionProgressResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockDetectionProgress(detectionId || 'det_123456789'))
      }, 300) // 模拟网络延迟
    })
  }
  
  const url = detectionId 
    ? `/cvv-check/detection-progress?detectionId=${detectionId}`
    : '/cvv-check/detection-progress'
  
  return authenticatedRequest<DetectionProgressResponse>(url, token, {
    method: 'GET'
  })
}

/**
 * 获取检测结果
 */
export async function fetchDetectionResults(
  token: string, 
  detectionId: string
): Promise<ApiResponse<DetectionResultsResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockDetectionResults(detectionId))
      }, 500) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<DetectionResultsResponse>('/cvv-check/detection-results', token, {
    method: 'POST',
    body: JSON.stringify({ detectionId })
  })
}

/**
 * 启动检测
 */
export async function startDetection(
  token: string, 
  requestData: StartDetectionRequest
): Promise<ApiResponse<StartDetectionResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockStartDetection('user_1', requestData))
      }, 800) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<StartDetectionResponse>('/cvv-check/start-detection', token, {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

/**
 * 停止检测
 */
export async function stopDetection(
  token: string, 
  detectionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockStopDetection('user_1', detectionId))
      }, 300) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<{ success: boolean }>('/cvv-check/stop-detection', token, {
    method: 'POST',
    body: JSON.stringify({ detectionId })
  })
}

/**
 * 重置检测状态
 */
export async function resetDetectionStatus(token: string): Promise<ApiResponse<{ success: boolean }>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockResetDetectionStatus('user_1'))
      }, 200) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<{ success: boolean }>('/cvv-check/reset-detection-status', token, {
    method: 'GET'
  })
}

/**
 * CVV检测API Hook
 */
export function useCVVCheckAPI() {
  // 获取token的函数
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || ''
    }
    return ''
  }

  return {
    fetchUserDetectionStatus: () => fetchUserDetectionStatus(getToken()),
    fetchDetectionConfig: () => fetchDetectionConfig(getToken()),
    fetchDetectionProgress: (detectionId: string) => fetchDetectionProgress(getToken(), detectionId),
    fetchDetectionResults: (detectionId: string) => fetchDetectionResults(getToken(), detectionId),
    startDetection: (config: StartDetectionRequest) => startDetection(getToken(), config),
    stopDetection: (detectionId: string) => stopDetection(detectionId, getToken()),
    resetDetectionStatus: () => resetDetectionStatus(getToken()),
  }
}
