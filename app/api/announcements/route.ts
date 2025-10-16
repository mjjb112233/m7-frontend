import { NextRequest, NextResponse } from 'next/server'

// 公告数据
const announcements = [
  {
    id: 'ann_001',
    type: 'info',
    title: '系统通知',
    message: '欢迎使用 M7 前端项目！',
    priority: 1,
    position: 'top',
    carouselDuration: 5000,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'ann_002', 
    type: 'maintenance',
    title: '系统维护通知',
    message: '系统运行正常，所有功能可用',
    priority: 2,
    position: 'top',
    carouselDuration: 5000,
    createdAt: new Date().toISOString(),
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 过滤公告
    let filteredAnnouncements = announcements.filter(ann => ann.isActive)
    
    if (type) {
      filteredAnnouncements = filteredAnnouncements.filter(ann => ann.type === type)
    }

    // 分页
    const paginatedAnnouncements = filteredAnnouncements.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedAnnouncements,
      total: filteredAnnouncements.length,
      message: '获取公告成功'
    })
  } catch (error) {
    console.error('获取公告失败:', error)
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      message: '获取公告失败'
    }, { status: 500 })
  }
}


