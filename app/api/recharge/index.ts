/**
 * 充值相关API接口
 */

import { apiRequest, authenticatedRequest } from '@/lib/api-client'
import { ApiResponse, PackageData } from '@/app/shared/types'

// 充值配置响应
export interface RechargeConfigResponse {
  // 配置相关字段
  [key: string]: any
}

// 充值套餐响应
export interface RechargePackagesResponse {
  packages: Array<{
    id: string
    name: string
    amount: number
    coins: number
    bonus: number
    description: string
    popular: boolean
  }>
}

// 创建充值订单请求
export interface CreateRechargeOrderRequest {
  packageId: string
  amount: number
  paymentMethod: string
}

// 创建充值订单响应
export interface CreateRechargeOrderResponse {
  orderId: string
  amount: number
  coins: number
  paymentUrl: string
  qrCode: string
}

// 充值历史响应
export interface RechargeHistoryResponse {
  orders: Array<{
    id: string
    amount: number
    coins: number
    status: string
    createdAt: string
    completedAt?: string
  }>
  total: number
  page: number
  pageSize: number
}

/**
 * 获取充值配置
 */
export async function fetchRechargeConfig(token: string): Promise<ApiResponse<RechargeConfigResponse>> {
  return authenticatedRequest<RechargeConfigResponse>('/recharge/config', token)
}

/**
 * 获取充值套餐
 */
export async function fetchRechargePackages(token: string): Promise<ApiResponse<RechargePackagesResponse>> {
  return authenticatedRequest<RechargePackagesResponse>('/recharge/packages', token)
}

/**
 * 创建充值订单
 */
export async function createRechargeOrder(
  token: string, 
  requestData: CreateRechargeOrderRequest
): Promise<ApiResponse<CreateRechargeOrderResponse>> {
  return authenticatedRequest<CreateRechargeOrderResponse>('/recharge/create-order', token, {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

/**
 * 获取充值历史
 */
export async function fetchRechargeHistory(token: string): Promise<ApiResponse<RechargeHistoryResponse>> {
  return authenticatedRequest<RechargeHistoryResponse>('/recharge/history', token)
}


/**
 * 获取所有套餐数据（公开接口）
 */
export async function fetchPackages(): Promise<ApiResponse<PackageData[]>> {
  return apiRequest<PackageData[]>('/packages')
}

/**
 * 获取单个套餐数据
 */
export async function fetchPackageById(packageId: number): Promise<ApiResponse<PackageData>> {
  return apiRequest<PackageData>(`/packages/${packageId}`)
}
