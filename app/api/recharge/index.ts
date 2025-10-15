/**
 * 充值相关API接口
 */

import { apiRequest, authenticatedRequest } from '@/lib/api-client'
import { ApiResponse, PackageData } from '@/app/shared/types'
import * as mockData from './mock-data'

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

/**
 * 处理充值支付
 */
export async function processRechargePayment(orderId: string, paymentData: any): Promise<ApiResponse<any>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockRechargePayment(orderId, paymentData))
      }, 1000) // 模拟网络延迟
    })
  }
  
  return apiRequest<any>('/recharge/payment', {
    method: 'POST',
    body: JSON.stringify({ orderId, paymentData })
  })
}

/**
 * 处理充值回调
 */
export async function handleRechargeCallback(orderId: string, callbackData: any): Promise<ApiResponse<any>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockRechargeCallback(orderId, callbackData))
      }, 500) // 模拟网络延迟
    })
  }
  
  return apiRequest<any>('/recharge/callback', {
    method: 'POST',
    body: JSON.stringify({ orderId, callbackData })
  })
}

/**
 * 兑换充值码
 */
export async function exchangeRechargeCode(token: string, code: string): Promise<ApiResponse<any>> {
  // 检查是否使用模拟数据
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.getMockRechargeExchangeCode('user_1', code))
      }, 800) // 模拟网络延迟
    })
  }
  
  return authenticatedRequest<any>('/recharge/exchange-code', token, {
    method: 'POST',
    body: JSON.stringify({ code })
  })
}
