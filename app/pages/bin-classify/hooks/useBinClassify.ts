import { useState, useCallback } from "react"
import { CardInfo, GroupedResult, ProcessingStatus, ClassificationResult, BinClassifyConfig, BinClassifyState } from "@/app/shared/types"
import { useBinClassifyAPI } from "@/app/api"

export function useBinClassify() {
  const api = useBinClassifyAPI()
  
  // 基础状态
  const [cardInput, setCardInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("country")
  const [groupedResults, setGroupedResults] = useState<GroupedResult>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 处理状态
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    currentCard: "",
    progress: 0
  })
  
  // 分类结果
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  
  // 配置
  const [config, setConfig] = useState<BinClassifyConfig>({
    selectedCategory: "country",
    groupBy: "country",
    sortOrder: "asc"
  })
  
  // 错误状态
  const [error, setError] = useState<string | null>(null)

  // 处理卡片分类
  const processCards = useCallback(async (cards: string[]) => {
    setIsProcessing(true)
    setProcessingStatus({
      isProcessing: true,
      processedCount: 0,
      totalCount: cards.length,
      currentCard: "",
      progress: 0
    })

    const startTime = Date.now()
    const results: CardInfo[] = []
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      setProcessingStatus(prev => ({
        ...prev,
        processedCount: i + 1,
        currentCard: card,
        progress: ((i + 1) / cards.length) * 100
      }))
      
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 生成卡片信息
      const cardInfo = generateCardInfo(card)
      results.push(cardInfo)
    }

    // 按选择的分类进行分组
    const grouped = groupCardsByCategory(results, config.selectedCategory)
    setGroupedResults(grouped)
    
    const processingTime = Date.now() - startTime
    setClassificationResult({
      groupedResults: grouped,
      totalCards: results.length,
      categories: Object.keys(grouped),
      processingTime
    })
    
    setIsProcessing(false)
    setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
  }, [config.selectedCategory])

  // 切换分组展开状态
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey)
      } else {
        newSet.add(groupKey)
      }
      return newSet
    })
  }, [])

  // 收起所有分组
  const collapseAll = useCallback(() => {
    setExpandedGroups(new Set())
  }, [])

  // 重置状态
  const resetState = useCallback(() => {
    setCardInput("")
    setGroupedResults({})
    setExpandedGroups(new Set())
    setIsProcessing(false)
    setClassificationResult(null)
    setProcessingStatus({
      isProcessing: false,
      processedCount: 0,
      totalCount: 0,
      currentCard: "",
      progress: 0
    })
  }, [])

  // 开始分类
  const handleStartClassification = useCallback(async () => {
    if (!cardInput.trim()) return
    
    const cards = cardInput.split('\n').filter(line => line.trim())
    await processCards(cards)
  }, [cardInput, processCards])

  // 停止分类
  const handleStopClassification = useCallback(() => {
    setIsProcessing(false)
    setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
  }, [])

  // 重置
  const handleReset = useCallback(() => {
    resetState()
  }, [resetState])

  // 切换分组
  const handleToggleGroup = useCallback((groupKey: string) => {
    toggleGroup(groupKey)
  }, [toggleGroup])

  // 导出结果
  const handleExportResults = useCallback(() => {
    if (!classificationResult) return
    
    const data = JSON.stringify(classificationResult, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'classification-results.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [classificationResult])

  // 重试
  const handleRetry = useCallback(() => {
    handleStartClassification()
  }, [handleStartClassification])

  return {
    // 状态
    cardInput,
    setCardInput,
    selectedCategory,
    setSelectedCategory,
    groupedResults,
    expandedGroups,
    isProcessing,
    processingStatus,
    classificationResult,
    config,
    setConfig,
    isLoading: isProcessing,
    error,
    setError,
    
    // 方法
    processCards,
    toggleGroup,
    collapseAll,
    resetState,
    handleStartClassification,
    handleStopClassification,
    handleReset,
    handleToggleGroup,
    handleExportResults,
    handleRetry
  }
}

// 生成卡片信息的辅助函数
function generateCardInfo(cardData: string): CardInfo {
  const [cardNumber] = cardData.split("|")
  const bin = cardNumber.substring(0, 6)
  
  // 模拟BIN查询结果
  const mockData = {
    "400000": { brand: "Visa", type: "Credit", level: "Classic", bank: "Test Bank", country: "US", currency: "USD" },
    "500000": { brand: "Mastercard", type: "Credit", level: "Gold", bank: "Test Bank", country: "CA", currency: "CAD" },
    "300000": { brand: "American Express", type: "Credit", level: "Platinum", bank: "Test Bank", country: "US", currency: "USD" }
  }
  
  const data = mockData[bin as keyof typeof mockData] || {
    brand: "Unknown",
    type: "Credit",
    level: "Standard",
    bank: "Unknown Bank",
    country: "Unknown",
    currency: "USD"
  }
  
  return {
    cardNumber,
    brand: data.brand,
    type: data.type,
    level: data.level,
    bank: data.bank,
    country: data.country,
    currency: data.currency
  }
}

// 按分类分组卡片
function groupCardsByCategory(cards: CardInfo[], category: string): GroupedResult {
  const grouped: GroupedResult = {}
  
  cards.forEach(card => {
    const key = card[category as keyof CardInfo] as string
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(card)
  })
  
  return grouped
}
