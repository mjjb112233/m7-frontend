import { useState, useEffect, useCallback } from 'react'
import { CVVDetectionConfig, CVVDetectionStatus, CVVDetectionResults, Channel, DetectionModeType } from '@/app/shared/types'

export function useCVVDetection(token: string | null) {
  // 基础状态
  const [config, setConfig] = useState<CVVDetectionConfig | null>(null)
  const [status, setStatus] = useState<CVVDetectionStatus>({
    status: 'idle',
    progress: 0,
    message: '准备开始检测'
  })
  const [results, setResults] = useState<CVVDetectionResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 步骤状态
  const [currentStep, setCurrentStep] = useState<'config' | 'input' | 'precheck' | 'detecting' | 'results'>('config')
  
  // 输入状态
  const [inputText, setInputText] = useState('')
  const [precheckResults, setPrecheckResults] = useState<any>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [detectionConfig, setDetectionConfig] = useState<CVVDetectionConfig | null>(null)
  
  // 检测状态
  const [userDetectionStatus, setUserDetectionStatus] = useState<any>(null)
  const [detectionProgress, setDetectionProgress] = useState<any>(null)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [isLoadingResult, setIsLoadingResult] = useState(false)
  const [stopButtonCountdown, setStopButtonCountdown] = useState(0)
  
  // 通知状态
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('info')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // 获取配置
  const fetchConfig = useCallback(async () => {
    if (!token) return
    
    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/cvv-check/config', token)
      
      if (response.success && response.data) {
        setConfig(response.data as CVVDetectionConfig)
        setDetectionConfig(response.data as CVVDetectionConfig)
      }
    } catch (error: any) {
      setError(error.message || '获取检测配置失败')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // 开始检测
  const startDetection = useCallback(async (config: any) => {
    if (!token) throw new Error('未登录')
    
    setIsLoading(true)
    setError(null)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest('/cvv-check/start-detection', token, {
        method: 'POST',
        body: JSON.stringify(config)
      })

      if (response.success && response.data) {
        setStatus(prev => ({
          ...prev,
          detectionId: (response.data as any).detectionId
        }))
        return response.data
      } else {
        throw new Error(response.message || '开始检测失败')
      }
    } catch (error: any) {
      setStatus({
        status: 'error',
        progress: 0,
        message: '检测失败'
      })
      setError(error.message || '检测失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // 获取检测进度
  const fetchProgress = useCallback(async (detectionId: string) => {
    if (!token) return

    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest(`/cvv-check/progress/${detectionId}`, token)
      
      if (response.success && response.data) {
        setStatus(prev => ({
          ...prev,
          progress: response.data.progress,
          message: response.data.message
        }))
        setDetectionProgress(response.data)
        return response.data
      }
    } catch (error: any) {
      console.error('获取检测进度失败:', error)
    }
  }, [token])

  // 获取检测结果
  const fetchResults = useCallback(async (detectionId: string) => {
    if (!token) return

    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest(`/cvv-check/results/${detectionId}`, token)
      
      if (response.success && response.data) {
        setResults(response.data as CVVDetectionResults)
        setStatus({
          status: 'completed',
          progress: 100,
          message: '检测完成'
        })
        return response.data
      }
    } catch (error: any) {
      console.error('获取检测结果失败:', error)
    }
  }, [token])

  // 停止检测
  const stopDetection = useCallback(async (detectionId: string) => {
    if (!token) throw new Error('未登录')

    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const response = await authenticatedRequest(`/cvv-check/stop-detection`, token, {
        method: 'POST',
        body: JSON.stringify({ detectionId })
      })

      if (response.success) {
        setStatus(prev => ({
          ...prev,
          status: 'idle',
          message: '检测已停止'
        }))
        return response.data
      }
    } catch (error: any) {
      console.error('停止检测失败:', error)
      throw error
    }
  }, [token])

  // 重置检测状态
  const resetDetection = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      message: '准备开始检测'
    })
    setResults(null)
    setError(null)
    setCurrentStep('config')
    setInputText('')
    setPrecheckResults(null)
    setSelectedChannel(null)
    setUserDetectionStatus(null)
    setDetectionProgress(null)
  }, [])

  // 步骤处理方法
  const handleConfigNext = useCallback(() => {
    setCurrentStep('input')
  }, [])

  const handleInputNext = useCallback(() => {
    if (inputText.trim()) {
      setCurrentStep('precheck')
      // 模拟预检查
      setTimeout(() => {
        setPrecheckResults({ valid: true })
        setCurrentStep('detecting')
        // 模拟开始检测
        startDetection({ mode: 'charge_test', channels: [1], cvvList: inputText.split('\n') })
          .then(() => {
            setCurrentStep('results')
          })
          .catch((error) => {
            setError(error.message)
          })
      }, 2000)
    }
  }, [inputText, startDetection])

  const handleInputBack = useCallback(() => {
    setCurrentStep('config')
  }, [])

  const handlePrecheckNext = useCallback(() => {
    setCurrentStep('detecting')
  }, [])

  const handlePrecheckBack = useCallback(() => {
    setCurrentStep('input')
  }, [])

  const handleStopDetection = useCallback(() => {
    if (userDetectionStatus?.detectionId) {
      stopDetection(userDetectionStatus.detectionId)
        .then(() => {
          setCurrentStep('results')
        })
        .catch((error) => {
          setError(error.message)
        })
    }
  }, [userDetectionStatus, stopDetection])

  const handleDetectionComplete = useCallback(() => {
    setCurrentStep('results')
  }, [])

  const handleRetest = useCallback(() => {
    resetDetection()
  }, [resetDetection])

  // 显示通知
  const showNotificationMessage = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotificationType(type)
    setNotificationMessage(message)
    setShowNotification(true)
  }, [])

  // 初始化数据
  useEffect(() => {
    if (token) {
      fetchConfig()
    }
  }, [token, fetchConfig])

  return {
    // 基础状态
    config,
    status,
    results,
    isLoading,
    error,
    setError,
    
    // 步骤状态
    currentStep,
    setCurrentStep,
    
    // 输入状态
    inputText,
    setInputText,
    precheckResults,
    selectedChannel,
    setSelectedChannel,
    detectionConfig,
    setDetectionConfig,
    
    // 检测状态
    userDetectionStatus,
    setUserDetectionStatus,
    detectionProgress,
    setDetectionProgress,
    isLoadingConfig,
    setIsLoadingConfig,
    isLoadingStatus,
    setIsLoadingStatus,
    isLoadingProgress,
    setIsLoadingProgress,
    isLoadingResult,
    setIsLoadingResult,
    stopButtonCountdown,
    setStopButtonCountdown,
    
    // 通知状态
    showNotification,
    setShowNotification,
    notificationType,
    setNotificationType,
    notificationMessage,
    setNotificationMessage,
    copySuccess,
    setCopySuccess,
    
    // 方法
    fetchConfig,
    startDetection,
    fetchProgress,
    fetchResults,
    stopDetection,
    resetDetection,
    refetch: fetchConfig,
    
    // 步骤处理方法
    handleConfigNext,
    handleInputNext,
    handleInputBack,
    handlePrecheckNext,
    handlePrecheckBack,
    handleStopDetection,
    handleDetectionComplete,
    handleRetest,
    
    // 通知方法
    showNotificationMessage
  }
}