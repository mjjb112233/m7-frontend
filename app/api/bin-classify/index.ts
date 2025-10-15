/**
 * BIN分类相关API接口
 */

import { authenticatedRequest } from '@/lib/api-client'
import { ApiResponse } from '@/app/shared/types'
import * as mockData from './mock-data'

// BIN分类配置响应
export interface BinClassifyConfigResponse {
  // 配置相关字段
  [key: string]: any
}

// 开始BIN分类请求
export interface StartBinClassifyRequest {
  cardNumbers: string[]
  // 其他配置参数
  [key: string]: any
}

// 开始BIN分类响应
export interface StartBinClassifyResponse {
  taskId: string
  status: string
}

// BIN分类结果响应
export interface BinClassifyResultsResponse {
  taskId: string
  status: string
  results: Array<{
    cardNumber: string
    bin: string
    bank: string
    country: string
    brand: string
    type: string
    level: string
  }>
  totalCount: number
  processedCount: number
  successCount: number
  errorCount: number
}

/**
 * 获取BIN分类配置
 */
export async function fetchBinClassifyConfig(token: string): Promise<ApiResponse<BinClassifyConfigResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockBinClassifyConfig())
      }, 200) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<BinClassifyConfigResponse>('/bin-classify/config', token)
}

/**
 * 开始BIN分类
 */
export async function startBinClassify(
  token: string, 
  requestData: StartBinClassifyRequest
): Promise<ApiResponse<StartBinClassifyResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockStartBinClassify(requestData.cardNumbers, requestData))
      }, 800) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<StartBinClassifyResponse>('/bin-classify/start', token, {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

/**
 * 获取BIN分类结果
 */
export async function fetchBinClassifyResults(
  token: string, 
  taskId: string
): Promise<ApiResponse<BinClassifyResultsResponse>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockBinClassifyResults(taskId))
      }, 300) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<BinClassifyResultsResponse>(`/bin-classify/results?taskId=${taskId}`, token)
}

/**
 * BIN分类API hooks
 */
export function useBinClassifyAPI() {
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || ''
    }
    return ''
  }

  return {
    fetchBinClassifyConfig: () => fetchBinClassifyConfig(getToken()),
    startBinClassify: (requestData: StartBinClassifyRequest) => startBinClassify(getToken(), requestData),
    fetchBinClassifyResults: (taskId: string) => fetchBinClassifyResults(getToken(), taskId),
  }
}
