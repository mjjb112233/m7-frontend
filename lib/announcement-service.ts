/**
 * 公告服务模块
 * 
 * 功能说明：
 * 1. 支持会话级别的公告缓存，避免重复请求
 * 2. 支持公告的关闭和缓存清除功能
 * 3. 使用统一的API客户端进行请求
 * 4. 支持多种公告类型和位置过滤
 * 5. 提供分页和排序功能
 * 
 * 主要特性：
 * - 会话缓存：同一会话内只请求一次公告数据
 * - 用户交互：支持用户关闭公告
 * - 错误处理：API失败时使用缓存数据作为后备
 * - 类型安全：完整的TypeScript类型定义
 */

import { getApiBaseUrl, isDebugMode, apiRequest } from './api-client'

export interface AnnouncementItem {
  id: string
  type: 'maintenance' | 'promotion' | 'update'
  title: string
  message: string
  priority: number
  dismissible: boolean
  uiType: 'info' | 'warning' | 'success' | 'error'
  position: 'top' | 'hero' | 'floating'
  enabled: boolean
  carouselDuration: number
}

// 类型别名，用于向后兼容
export type Announcement = AnnouncementItem

export interface GetAnnouncementsRequest {
  position?: string
  type?: string
  limit?: number
  offset?: number
}

export interface AnnouncementResponse {
  success: boolean
  data: AnnouncementItem[]
  total: number
  message: string
}

// 会话存储键名
const SESSION_REQUESTED_KEY = 'announcements_requested_in_session'
const CACHE_KEY = 'announcements_cache'

// 检查是否在当前会话中已经请求过公告
function hasRequestedInSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_REQUESTED_KEY) === 'true'
  } catch (error) {
    console.warn("[v0] 无法访问会话存储:", error)
    return false
  }
}

// 标记当前会话已请求过公告
function markAsRequestedInSession(): void {
  try {
    sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true')
  } catch (error) {
    console.warn("[v0] 无法设置会话存储:", error)
  }
}

// 缓存公告数据到会话存储
function cacheAnnouncements(announcements: AnnouncementItem[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(announcements))
  } catch (error) {
    console.warn("[v0] 无法缓存公告数据:", error)
  }
}

// 从会话存储获取缓存的公告数据
function getCachedAnnouncements(params: GetAnnouncementsRequest = {}): AnnouncementResponse {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const announcements: AnnouncementItem[] = JSON.parse(cached)
      
      // 应用过滤条件
      let filteredAnnouncements = announcements
      
      if (params.position) {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.position === params.position)
      }
      
      if (params.type) {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === params.type)
      }
      
      // 应用分页
      const limit = params.limit || 10
      const offset = params.offset || 0
      const paginatedAnnouncements = filteredAnnouncements.slice(offset, offset + limit)
      
      return {
        success: true,
        data: paginatedAnnouncements,
        total: filteredAnnouncements.length,
        message: "获取公告成功（缓存）"
      }
    }
  } catch (error) {
    console.warn("[v0] 无法读取缓存数据:", error)
  }
  
  return {
    success: true,
    data: [],
    total: 0,
    message: "没有可显示的公告"
  }
}

// 获取公告列表 - 支持真实API调用
export async function getAnnouncements(params: GetAnnouncementsRequest = {}): Promise<AnnouncementResponse> {
  try {
    console.log("[v0] 开始获取公告列表")

    // 检查是否在当前会话中已经请求过
    if (hasRequestedInSession()) {
      console.log("[v0] 当前会话已请求过公告，使用缓存数据")
      return getCachedAnnouncements(params)
    }

    // 使用API客户端获取公告（不携带参数）
    if (isDebugMode()) {
      console.log(`[API] 请求公告数据: ${getApiBaseUrl()}/announcements`)
    }
    
    const result = await apiRequest<AnnouncementItem[]>('/announcements')
    
    if (result.success && result.data) {
      // 缓存公告数据到会话存储
      cacheAnnouncements(result.data)
      markAsRequestedInSession()
      
      // 获取已关闭的公告列表
      const dismissedAnnouncements = getDismissedAnnouncements()
      
      // 应用过滤条件（不携带参数，使用默认过滤）
      let filteredAnnouncements = result.data.filter(announcement => {
        // 过滤掉已关闭的公告
        return !dismissedAnnouncements.has(announcement.id)
      })
      
      // 默认只显示top位置的公告
      filteredAnnouncements = filteredAnnouncements.filter(a => a.position === "top")
      
      if (params.type) {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === params.type)
      }
      
      // 应用默认分页（最多显示3个公告）
      const limit = params.limit || 3
      const offset = params.offset || 0
      const paginatedAnnouncements = filteredAnnouncements.slice(offset, offset + limit)
      
      const response: AnnouncementResponse = {
        success: true,
        data: paginatedAnnouncements,
        total: filteredAnnouncements.length,
        message: "获取公告成功"
      }
      
      console.log("[v0] API响应数据:", response.message)
      console.log("[v0] 获取到公告数量:", result.data.length)
      
      return response
    } else {
      throw new Error(result.message || "获取公告失败")
    }
  } catch (error) {
    console.error("[v0] 获取公告失败:", error)
    
    // 如果API请求失败，尝试使用缓存数据
    const cachedResponse = getCachedAnnouncements(params)
    if (cachedResponse.data.length > 0) {
      console.log("[v0] 使用缓存数据作为后备")
      return cachedResponse
    }
    
    return {
      success: false,
      data: [],
      total: 0,
      message: "获取公告失败，请检查网络连接"
    }
  }
}

// 清除公告缓存
export function clearAnnouncementCache(): void {
  try {
    sessionStorage.removeItem(CACHE_KEY)
    sessionStorage.removeItem(SESSION_REQUESTED_KEY)
    console.log("[v0] 公告缓存已清除")
  } catch (error) {
    console.warn("[v0] 无法清除公告缓存:", error)
  }
}

// 关闭公告
export function dismissAnnouncement(announcementId: string): void {
  try {
    const dismissedKey = `announcement_dismissed_${announcementId}`
    sessionStorage.setItem(dismissedKey, 'true')
    console.log(`[v0] 公告 ${announcementId} 已关闭`)
  } catch (error) {
    console.warn("[v0] 无法关闭公告:", error)
  }
}

// 获取已关闭的公告列表
function getDismissedAnnouncements(): Set<string> {
  const dismissed = new Set<string>()
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('announcement_dismissed_')) {
        const announcementId = key.replace('announcement_dismissed_', '')
        dismissed.add(announcementId)
      }
    }
  } catch (error) {
    console.warn("[v0] 无法获取已关闭的公告列表:", error)
  }
  return dismissed
}