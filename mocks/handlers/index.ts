import { http, HttpResponse } from 'msw'
import { authHandlers } from './auth'
import { cvvCheckHandlers } from './cvv-check'
import { binClassifyHandlers } from './bin-classify'
import { infoGenerateHandlers } from './info-generate'
import { rechargeHandlers } from './recharge'
import { announcementHandlers } from './announcement'

// 基础URL配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

// 合并所有处理器
export const handlers = [
  ...authHandlers,
  ...cvvCheckHandlers,
  ...binClassifyHandlers,
  ...infoGenerateHandlers,
  ...rechargeHandlers,
  ...announcementHandlers,
]

// 通用响应格式
export const createApiResponse = <T>(data: T, success = true, message = '') => {
  return HttpResponse.json({
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  })
}

// 错误响应格式
export const createErrorResponse = (message: string, code = 400) => {
  return HttpResponse.json({
    success: false,
    data: null,
    message,
    code,
    timestamp: new Date().toISOString()
  }, { status: code })
}
