// 公告模拟数据
export const mockAnnouncements = [
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
  },
  {
    id: 'ann_003',
    type: 'warning',
    title: '重要提醒',
    message: '请定期备份您的数据',
    priority: 3,
    position: 'top',
    carouselDuration: 5000,
    createdAt: new Date().toISOString(),
    isActive: true
  }
]


