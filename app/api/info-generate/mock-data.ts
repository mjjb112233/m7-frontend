/**
 * 信息生成API模拟数据
 */

// 模拟信息生成任务状态
export const mockInfoGenerateTasks = new Map<string, {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  results?: any[]
  error?: string
}>()

// 模拟信息生成配置
export const mockInfoGenerateConfig = {
  supportedTypes: [
    {
      id: 'personal',
      name: '个人信息',
      description: '生成个人身份信息',
      fields: ['name', 'email', 'phone', 'address', 'ssn'],
      price: 0.5
    },
    {
      id: 'financial',
      name: '金融信息',
      description: '生成金融相关信息',
      fields: ['bank_account', 'credit_card', 'routing_number'],
      price: 1.0
    },
    {
      id: 'business',
      name: '商业信息',
      description: '生成商业相关信息',
      fields: ['company_name', 'ein', 'business_address', 'phone'],
      price: 0.8
    }
  ],
  generationOptions: [
    {
      id: 'basic',
      name: '基础生成',
      description: '基础信息生成',
      price: 0.1,
      quality: 'standard'
    },
    {
      id: 'premium',
      name: '高级生成',
      description: '高质量信息生成',
      price: 0.3,
      quality: 'high'
    },
    {
      id: 'enterprise',
      name: '企业级生成',
      description: '企业级质量生成',
      price: 0.5,
      quality: 'enterprise'
    }
  ]
}

// 模拟个人信息数据
const mockPersonalData = {
  names: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'],
  emails: ['john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com', 'david@example.com'],
  phones: ['555-0123', '555-0124', '555-0125', '555-0126', '555-0127'],
  addresses: [
    '123 Main St, New York, NY 10001',
    '456 Oak Ave, Los Angeles, CA 90210',
    '789 Pine Rd, Chicago, IL 60601',
    '321 Elm St, Houston, TX 77001',
    '654 Maple Dr, Phoenix, AZ 85001'
  ],
  ssn: ['123-45-6789', '234-56-7890', '345-67-8901', '456-78-9012', '567-89-0123']
}

// 模拟金融信息数据
const mockFinancialData = {
  banks: ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank'],
  accountNumbers: ['1234567890', '2345678901', '3456789012', '4567890123', '5678901234'],
  routingNumbers: ['021000021', '021000022', '021000023', '021000024', '021000025'],
  creditCards: ['4532123456789012', '4532123456789013', '4532123456789014', '4532123456789015', '4532123456789016']
}

// 模拟商业信息数据
const mockBusinessData = {
  companies: ['Tech Solutions Inc', 'Global Services LLC', 'Innovation Corp', 'Future Systems Ltd', 'Digital Dynamics'],
  ein: ['12-3456789', '23-4567890', '34-5678901', '45-6789012', '56-7890123'],
  businessAddresses: [
    '100 Business Blvd, Suite 100, New York, NY 10001',
    '200 Corporate Dr, Floor 2, Los Angeles, CA 90210',
    '300 Enterprise Ave, Office 300, Chicago, IL 60601',
    '400 Commerce St, Suite 400, Houston, TX 77001',
    '500 Industry Way, Floor 5, Phoenix, AZ 85001'
  ]
}

// 模拟获取信息生成配置
export function getMockInfoGenerateConfig() {
  return {
    success: true,
    data: mockInfoGenerateConfig
  }
}

// 模拟获取信息生成价格
export function getMockInfoGeneratePrice(type: string, count: number) {
  const typeConfig = mockInfoGenerateConfig.supportedTypes.find(t => t.id === type)
  
  if (!typeConfig) {
    return {
      success: false,
      message: '不支持的信息类型'
    }
  }
  
  const totalPrice = typeConfig.price * count
  
  return {
    success: true,
    data: {
      type,
      count,
      unitPrice: typeConfig.price,
      totalPrice,
      currency: 'M币'
    }
  }
}

// 模拟启动信息生成
export function getMockStartInfoGenerate(type: string, count: number, options: any) {
  const taskId = `info_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // 创建任务
  mockInfoGenerateTasks.set(taskId, {
    taskId,
    status: 'pending',
    progress: 0
  })
  
  // 模拟异步处理
  setTimeout(() => {
    const task = mockInfoGenerateTasks.get(taskId)
    if (task) {
      task.status = 'processing'
      task.progress = 30
    }
  }, 1000)
  
  setTimeout(() => {
    const task = mockInfoGenerateTasks.get(taskId)
    if (task) {
      task.status = 'completed'
      task.progress = 100
      task.results = generateMockInfoResults(type, count)
    }
  }, 3000)
  
  return {
    success: true,
    data: {
      taskId,
      status: 'pending'
    },
    message: '信息生成任务已启动'
  }
}

// 模拟获取信息生成结果
export function getMockInfoGenerateResults(taskId: string) {
  const task = mockInfoGenerateTasks.get(taskId)
  
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
          generated: task.results?.length || 0,
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

// 生成模拟信息结果
function generateMockInfoResults(type: string, count: number) {
  const results = []
  
  for (let i = 0; i < count; i++) {
    let data: any = {}
    
    switch (type) {
      case 'personal':
        data = {
          name: mockPersonalData.names[Math.floor(Math.random() * mockPersonalData.names.length)],
          email: mockPersonalData.emails[Math.floor(Math.random() * mockPersonalData.emails.length)],
          phone: mockPersonalData.phones[Math.floor(Math.random() * mockPersonalData.phones.length)],
          address: mockPersonalData.addresses[Math.floor(Math.random() * mockPersonalData.addresses.length)],
          ssn: mockPersonalData.ssn[Math.floor(Math.random() * mockPersonalData.ssn.length)]
        }
        break
      case 'financial':
        data = {
          bank: mockFinancialData.banks[Math.floor(Math.random() * mockFinancialData.banks.length)],
          accountNumber: mockFinancialData.accountNumbers[Math.floor(Math.random() * mockFinancialData.accountNumbers.length)],
          routingNumber: mockFinancialData.routingNumbers[Math.floor(Math.random() * mockFinancialData.routingNumbers.length)],
          creditCard: mockFinancialData.creditCards[Math.floor(Math.random() * mockFinancialData.creditCards.length)]
        }
        break
      case 'business':
        data = {
          companyName: mockBusinessData.companies[Math.floor(Math.random() * mockBusinessData.companies.length)],
          ein: mockBusinessData.ein[Math.floor(Math.random() * mockBusinessData.ein.length)],
          address: mockBusinessData.businessAddresses[Math.floor(Math.random() * mockBusinessData.businessAddresses.length)],
          phone: mockPersonalData.phones[Math.floor(Math.random() * mockPersonalData.phones.length)]
        }
        break
    }
    
    results.push({
      id: `info_${i + 1}`,
      type,
      data,
      status: Math.random() > 0.05 ? 'success' : 'failed',
      quality: Math.random() * 0.3 + 0.7, // 0.7-1.0
      timestamp: new Date().toISOString()
    })
  }
  
  return results
}

// 获取状态消息
function getStatusMessage(status: string): string {
  switch (status) {
    case 'pending':
      return '任务等待处理中...'
    case 'processing':
      return '正在生成信息...'
    case 'completed':
      return '信息生成完成'
    case 'failed':
      return '信息生成失败'
    default:
      return '未知状态'
  }
}
