/**
 * CVV检测API模拟数据
 */

import { UserDetectionStatus, DetectionMode, Channel, DetectionProgressData, DetectionResultData } from '@/app/shared/types'

// 模拟检测状态存储
export const mockDetectionStates = new Map<string, {
  status: UserDetectionStatus
  detectionId?: string
  progress?: DetectionProgressData
  results?: DetectionResultData
}>()

// 模拟检测配置
export const mockDetectionConfig = {
  detectionModes: [
    {
      id: 1,
      name: '扣费测试',
      description: '真实扣费检测模式',
      price: 1.0,
      enabled: true
    },
    {
      id: 2,
      name: '免费测试',
      description: '免费检测模式（仅限新用户）',
      price: 0.0,
      enabled: true
    }
  ] as DetectionMode[],
  channels: [
    {
      id: 1,
      name: '高速通道',
      rate: '99.9%',
      speed: '100/分钟',
      description: '高准确率检测通道',
      status: 'online' as const,
      consumption: 1.0,
      enabled: true
    },
    {
      id: 2,
      name: '标准通道',
      rate: '95.0%',
      speed: '50/分钟',
      description: '标准准确率检测通道',
      status: 'online' as const,
      consumption: 0.5,
      enabled: true
    },
    {
      id: 3,
      name: '经济通道',
      rate: '90.0%',
      speed: '30/分钟',
      description: '经济型检测通道',
      status: 'offline' as const,
      consumption: 0.3,
      enabled: false
    }
  ] as Channel[]
}

// 模拟用户检测状态
export function getMockUserDetectionStatus(userId: string) {
  const state = mockDetectionStates.get(userId)
  
  if (!state) {
    return {
      success: true,
      data: {
        status: 'idle' as UserDetectionStatus,
        detectionId: null
      }
    }
  }
  
  return {
    success: true,
    data: {
      status: state.status,
      detectionId: state.detectionId || null
    }
  }
}

// 模拟检测配置响应
export function getMockDetectionConfig() {
  return {
    success: true,
    data: mockDetectionConfig
  }
}

// 模拟检测进度
export function getMockDetectionProgress(detectionId: string) {
  // 查找检测状态
  let detectionState = null
  for (const [userId, state] of mockDetectionStates.entries()) {
    if (state.detectionId === detectionId) {
      detectionState = state
      break
    }
  }
  
  if (!detectionState) {
    return {
      success: false,
      message: '检测任务不存在'
    }
  }
  
  // 模拟进度数据
  const progress: DetectionProgressData = {
    detectionId,
    status: detectionState.status,
    progress: Math.min(100, (detectionState.progress?.progress || 0) + Math.random() * 20),
    processed: Math.floor(Math.random() * 100),
    total: 100,
    success: Math.floor(Math.random() * 50),
    failed: Math.floor(Math.random() * 10),
    message: '正在检测中...',
    estimatedTime: Math.max(0, Math.floor(Math.random() * 300))
  }
  
  return {
    success: true,
    data: progress
  }
}

// 模拟检测结果
export function getMockDetectionResults(detectionId: string) {
  // 查找检测状态
  let detectionState = null
  for (const [userId, state] of mockDetectionStates.entries()) {
    if (state.detectionId === detectionId) {
      detectionState = state
      break
    }
  }
  
  if (!detectionState) {
    return {
      success: false,
      message: '检测任务不存在'
    }
  }
  
  // 模拟结果数据
  const results: DetectionResultData = {
    detectionId,
    status: 'completed',
    total: 100,
    success: 85,
    failed: 15,
    results: Array.from({ length: 100 }, (_, i) => ({
      cvv: String(100 + i).padStart(3, '0'),
      status: Math.random() > 0.15 ? 'valid' : 'invalid',
      confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      channel: Math.floor(Math.random() * 3) + 1
    })),
    summary: {
      validCount: 85,
      invalidCount: 15,
      successRate: 85.0,
      averageConfidence: 0.87,
      totalTime: Math.floor(Math.random() * 1800) + 300 // 5-35分钟
    }
  }
  
  return {
    success: true,
    data: results
  }
}

// 模拟启动检测
export function getMockStartDetection(userId: string, requestData: any) {
  const detectionId = `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // 更新用户检测状态
  mockDetectionStates.set(userId, {
    status: 'detecting',
    detectionId,
    progress: {
      detectionId,
      status: 'detecting',
      progress: 0,
      processed: 0,
      total: requestData.cvvList?.length || 0,
      success: 0,
      failed: 0,
      message: '检测已启动',
      estimatedTime: 1800
    }
  })
  
  return {
    success: true,
    data: {
      detectionId,
      status: 'detecting'
    },
    message: '检测已启动'
  }
}

// 模拟停止检测
export function getMockStopDetection(userId: string, detectionId: string) {
  const state = mockDetectionStates.get(userId)
  
  if (!state || state.detectionId !== detectionId) {
    return {
      success: false,
      message: '检测任务不存在'
    }
  }
  
  // 更新状态为已停止
  mockDetectionStates.set(userId, {
    ...state,
    status: 'stopped'
  })
  
  return {
    success: true,
    data: {
      success: true
    },
    message: '检测已停止'
  }
}

// 模拟重置检测状态
export function getMockResetDetectionStatus(userId: string) {
  mockDetectionStates.delete(userId)
  
  return {
    success: true,
    data: {
      success: true
    },
    message: '检测状态已重置'
  }
}
