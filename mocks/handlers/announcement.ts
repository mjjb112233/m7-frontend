import { http, HttpResponse } from 'msw'
import { createApiResponse, createErrorResponse } from './index'

// 模拟公告数据
const mockAnnouncements = [
  {
    id: '1',
    title: '系统维护通知',
    content: '系统将于今晚进行维护，预计停机2小时',
    type: 'info',
    position: 'top',
    isActive: true,
    startTime: '2024-01-15T00:00:00Z',
    endTime: '2024-01-20T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: '新功能上线',
    content: 'CVV检测功能已优化，检测速度提升50%',
    type: 'success',
    position: 'top',
    isActive: true,
    startTime: '2024-01-15T00:00:00Z',
    endTime: '2024-01-25T23:59:59Z',
    createdAt: '2024-01-15T09:00:00Z'
  }
]

export const announcementHandlers = [
  // 获取公告列表
  http.get('*/api/announcements', ({ request }) => {
    // 在开发模式下，跳过认证检查
    if (process.env.NODE_ENV === 'development') {
      const url = new URL(request.url)
      const position = url.searchParams.get('position')
      const forceRefresh = url.searchParams.get('forceRefresh')
      
      // 模拟根据位置过滤公告
      let filteredAnnouncements = mockAnnouncements.filter(announcement => 
        announcement.isActive && 
        (!position || announcement.position === position)
      )
      
      return createApiResponse(filteredAnnouncements)
    }
    
    const url = new URL(request.url)
    const position = url.searchParams.get('position')
    const forceRefresh = url.searchParams.get('forceRefresh')
    
    // 模拟根据位置过滤公告
    let filteredAnnouncements = mockAnnouncements.filter(announcement => 
      announcement.isActive && 
      (!position || announcement.position === position)
    )
    
    return createApiResponse(filteredAnnouncements)
  }),

  // 获取公告详情
  http.get('*/api/announcements/:id', ({ request, params }) => {
    const announcementId = params.id as string
    const announcement = mockAnnouncements.find(a => a.id === announcementId)
    
    if (!announcement) {
      return createErrorResponse('公告不存在', 404)
    }
    
    return createApiResponse(announcement)
  }),

  // 创建公告（管理员功能）
  http.post('*/api/announcements', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const body = await request.json() as any
    
    if (body.title && body.content) {
      const newAnnouncement = {
        id: (mockAnnouncements.length + 1).toString(),
        ...body,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      
      mockAnnouncements.push(newAnnouncement)
      return createApiResponse(newAnnouncement)
    }
    
    return createErrorResponse('公告信息不完整', 400)
  }),

  // 更新公告（管理员功能）
  http.put('*/api/announcements/:id', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const announcementId = params.id as string
    const announcementIndex = mockAnnouncements.findIndex(a => a.id === announcementId)
    
    if (announcementIndex === -1) {
      return createErrorResponse('公告不存在', 404)
    }
    
    const body = await request.json() as any
    mockAnnouncements[announcementIndex] = {
      ...mockAnnouncements[announcementIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return createApiResponse(mockAnnouncements[announcementIndex])
  }),

  // 删除公告（管理员功能）
  http.delete('*/api/announcements/:id', ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return createErrorResponse('未授权访问', 401)
    }
    
    const announcementId = params.id as string
    const announcementIndex = mockAnnouncements.findIndex(a => a.id === announcementId)
    
    if (announcementIndex === -1) {
      return createErrorResponse('公告不存在', 404)
    }
    
    mockAnnouncements.splice(announcementIndex, 1)
    return createApiResponse({ success: true })
  })
]
