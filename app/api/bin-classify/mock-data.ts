/**
 * BIN分类API模拟数据
 */

// 模拟BIN分类任务状态
export const mockBinClassifyTasks = new Map<string, {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  results?: any[]
  error?: string
}>()

// 模拟BIN分类配置
export const mockBinClassifyConfig = {
  supportedFormats: [
    {
      id: 'single',
      name: '单卡号',
      description: '每行一个卡号',
      example: '4532123456789012'
    },
    {
      id: 'csv',
      name: 'CSV格式',
      description: '逗号分隔的卡号列表',
      example: '4532123456789012,4532123456789013'
    },
    {
      id: 'json',
      name: 'JSON格式',
      description: 'JSON数组格式',
      example: '["4532123456789012", "4532123456789013"]'
    }
  ],
  processingOptions: [
    {
      id: 'fast',
      name: '快速模式',
      description: '快速处理，准确率95%',
      price: 0.1,
      estimatedTime: '1-2分钟'
    },
    {
      id: 'standard',
      name: '标准模式',
      description: '标准处理，准确率98%',
      price: 0.2,
      estimatedTime: '3-5分钟'
    },
    {
      id: 'premium',
      name: '高级模式',
      description: '高精度处理，准确率99.5%',
      price: 0.5,
      estimatedTime: '5-10分钟'
    }
  ]
}

// 模拟BIN数据
export const mockBinData = [
  {
    bin: '453212',
    bank: 'Visa',
    country: 'US',
    type: 'Credit',
    level: 'Gold',
    currency: 'USD'
  },
  {
    bin: '453213',
    bank: 'Visa',
    country: 'US',
    type: 'Credit',
    level: 'Platinum',
    currency: 'USD'
  },
  {
    bin: '453214',
    bank: 'Visa',
    country: 'CA',
    type: 'Debit',
    level: 'Standard',
    currency: 'CAD'
  },
  {
    bin: '453215',
    bank: 'Visa',
    country: 'UK',
    type: 'Credit',
    level: 'Gold',
    currency: 'GBP'
  },
  {
    bin: '453216',
    bank: 'Visa',
    country: 'AU',
    type: 'Credit',
    level: 'Standard',
    currency: 'AUD'
  }
]

// 模拟获取BIN分类配置
export function getMockBinClassifyConfig() {
  return {
    success: true,
    data: mockBinClassifyConfig
  }
}

// 模拟启动BIN分类任务
export function getMockStartBinClassify(cardNumbers: string[], options: any) {
  const taskId = `bin_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // 创建任务
  mockBinClassifyTasks.set(taskId, {
    taskId,
    status: 'pending',
    progress: 0
  })
  
  // 模拟异步处理
  setTimeout(() => {
    const task = mockBinClassifyTasks.get(taskId)
    if (task) {
      task.status = 'processing'
      task.progress = 50
    }
  }, 1000)
  
  setTimeout(() => {
    const task = mockBinClassifyTasks.get(taskId)
    if (task) {
      task.status = 'completed'
      task.progress = 100
      task.results = generateMockBinResults(cardNumbers)
    }
  }, 5000)
  
  return {
    success: true,
    data: {
      taskId,
      status: 'pending'
    },
    message: 'BIN分类任务已启动'
  }
}

// 模拟获取BIN分类结果
export function getMockBinClassifyResults(taskId: string) {
  const task = mockBinClassifyTasks.get(taskId)
  
  if (!task) {
    return {
      success: false,
      message: '任务不存在'
    }
  }
  
  if (task.status === 'failed') {
    return {
      success: false,
      message: task.error || '任务处理失败'
    }
  }
  
  if (task.status === 'completed') {
    return {
      success: true,
      data: {
        taskId,
        status: task.status,
        progress: task.progress,
        results: task.results,
        summary: {
          total: task.results?.length || 0,
          processed: task.results?.length || 0,
          success: task.results?.filter((r: any) => r.status === 'success').length || 0,
          failed: task.results?.filter((r: any) => r.status === 'failed').length || 0
        }
      }
    }
  }
  
  return {
    success: true,
    data: {
      taskId,
      status: task.status,
      progress: task.progress,
      message: getStatusMessage(task.status)
    }
  }
}

// 生成模拟BIN结果
function generateMockBinResults(cardNumbers: string[]) {
  return cardNumbers.map((cardNumber, index) => {
    const bin = cardNumber.substring(0, 6)
    const binInfo = mockBinData.find(b => b.bin === bin) || mockBinData[Math.floor(Math.random() * mockBinData.length)]
    
    return {
      cardNumber,
      bin,
      status: Math.random() > 0.1 ? 'success' : 'failed',
      bank: binInfo.bank,
      country: binInfo.country,
      type: binInfo.type,
      level: binInfo.level,
      currency: binInfo.currency,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      processingTime: Math.random() * 1000 + 100, // 100-1100ms
      timestamp: new Date().toISOString()
    }
  })
}

// 获取状态消息
function getStatusMessage(status: string): string {
  switch (status) {
    case 'pending':
      return '任务等待处理中...'
    case 'processing':
      return '正在处理BIN分类...'
    case 'completed':
      return 'BIN分类完成'
    case 'failed':
      return 'BIN分类失败'
    default:
      return '未知状态'
  }
}
