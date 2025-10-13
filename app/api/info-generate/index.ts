/**
 * 信息生成相关API接口
 */

import { authenticatedRequest } from '@/lib/api-client'
import { ApiResponse } from '@/app/shared/types'

// 信息生成配置响应
export interface InfoGenerateConfigResponse {
  // 配置相关字段
  [key: string]: any
}

// 开始信息生成请求
export interface StartInfoGenerateRequest {
  cardNumbers: string[]
  // 其他配置参数
  [key: string]: any
}

// 开始信息生成响应
export interface StartInfoGenerateResponse {
  taskId: string
  status: string
}

// 信息生成结果响应
export interface InfoGenerateResultsResponse {
  taskId: string
  status: string
  results: Array<{
    cardNumber: string
    name: string
    country: string
    province: string
    city: string
    street: string
    zipCode: string
    phone: string
  }>
  totalCount: number
  processedCount: number
  successCount: number
  errorCount: number
}

/**
 * 获取信息生成配置
 */
export async function fetchInfoGenerateConfig(token: string): Promise<ApiResponse<InfoGenerateConfigResponse>> {
  return authenticatedRequest<InfoGenerateConfigResponse>('/info-generate/config', token)
}

/**
 * 开始信息生成
 */
export async function startInfoGenerate(
  token: string, 
  requestData: StartInfoGenerateRequest
): Promise<ApiResponse<StartInfoGenerateResponse>> {
  return authenticatedRequest<StartInfoGenerateResponse>('/info-generate/start', token, {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

/**
 * 获取信息生成结果
 */
export async function fetchInfoGenerateResults(
  token: string, 
  taskId: string
): Promise<ApiResponse<InfoGenerateResultsResponse>> {
  return authenticatedRequest<InfoGenerateResultsResponse>(`/info-generate/results?taskId=${taskId}`, token)
}
