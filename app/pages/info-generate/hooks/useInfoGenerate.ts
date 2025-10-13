import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/auth-context"
import { InfoGenerateState, InfoGenerateActions, GeneratedInfo, GenerateInfoResponse } from "../types"

export function useInfoGenerate(): InfoGenerateState & InfoGenerateActions {
  const authContext = useContext(AuthContext)
  const token = authContext?.token
  const refreshUserInfo = authContext?.refreshUserInfo

  // 状态管理
  const [cardNumbers, setCardNumbers] = useState("")
  const [generatedData, setGeneratedData] = useState<GeneratedInfo[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [pricePerCard, setPricePerCard] = useState(2.0)
  const [priceLoading, setPriceLoading] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [generateResult, setGenerateResult] = useState<GenerateInfoResponse['data'] | null>(null)
  const [failedCardNumbers, setFailedCardNumbers] = useState<string[]>([])

  // 提示相关状态
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // 显示提示
  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // 获取生成价格
  const fetchGeneratePrice = async () => {
    if (!token) return

    setPriceLoading(true)
    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const data = await authenticatedRequest('/info-generate/price', token, {
        method: 'GET'
      })

      if (data.success && data.data) {
        const priceData = data.data as any
        console.log('🔍 获取到价格信息:', priceData)
        setPricePerCard(priceData.price)
      } else {
        console.error('获取生成价格失败:', data.message)
      }
    } catch (error) {
      console.error('获取生成价格错误:', error)
    } finally {
      setPriceLoading(false)
    }
  }

  // 生成信息
  const handleGenerate = async () => {
    if (!token) {
      alert("请先登录")
      return
    }

    if (!cardNumbers.trim()) {
      alert("请输入卡号")
      return
    }

    const cardNumberList = cardNumbers
      .split('\n')
      .map(card => card.trim())
      .filter(card => card.length > 0)

    if (cardNumberList.length === 0) {
      alert("请输入有效的卡号")
      return
    }

    setIsGenerating(true)

    try {
      const { authenticatedRequest } = await import('@/lib/api-client')
      const data = await authenticatedRequest('/info-generate/generate', token, {
        method: 'POST',
        body: JSON.stringify({
          cardNumbers: cardNumberList,
          pricePerCard: pricePerCard
        })
      })

      if (data.success && data.data) {
        const generateData = data.data as any
        setGenerateResult(generateData)
        setGeneratedData(generateData.successData)
        setFailedCardNumbers(generateData.failedCardNumbers)
        setShowResultDialog(true)
        
        // 刷新用户信息以获取最新的M币余额
        await refreshUserInfo?.()
      } else {
        alert('生成失败: ' + data.message)
      }
    } catch (error) {
      console.error('生成信息错误:', error)
      alert('生成失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  // 页面加载时获取价格
  useEffect(() => {
    if (token) {
      fetchGeneratePrice()
    }
  }, [token])

  // 复制到剪贴板
  const copyToClipboard = (info: GeneratedInfo) => {
    const text = `卡号: ${info.cardNumber}\n有效期: ${info.month}/${info.year}\n姓名: ${info.fullName}\n电话: ${info.phone}\n地址: ${info.address}\n城市: ${info.city}\n州: ${info.state}\n邮编: ${info.zipCode}\n国家: ${info.country}`
    
    navigator.clipboard.writeText(text).then(() => {
      showToastMessage("信息已复制到剪贴板", "success")
    }).catch(() => {
      showToastMessage("复制失败", "error")
    })
  }

  // 复制所有失败卡号
  const copyAllFailedCards = () => {
    const allFailedCards = failedCardNumbers.join('\n')
    navigator.clipboard.writeText(allFailedCards).then(() => {
      showToastMessage("失败卡号已复制到剪贴板", "success")
    }).catch(() => {
      showToastMessage("复制失败", "error")
    })
  }

  const exportData = () => {
    if (!generatedData || generatedData.length === 0) return

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "卡号,有效期,姓名,电话,地址,城市,州,邮编,国家\n" +
      generatedData
        .map(
          (info) =>
            `${info.cardNumber},${info.month}/${info.year},${info.fullName},${info.phone},${info.address},${info.city},${info.state},${info.zipCode},${info.country}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "generated_info.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCardCount = () => {
    return cardNumbers
      .trim()
      .split("\n")
      .filter((card) => card.trim()).length
  }

  return {
    // 状态
    cardNumbers,
    generatedData,
    isGenerating,
    pricePerCard,
    priceLoading,
    showResultDialog,
    generateResult,
    failedCardNumbers,
    showToast,
    toastMessage,
    toastType,
    
    // 操作
    setCardNumbers,
    setGeneratedData,
    setIsGenerating,
    setPricePerCard,
    setPriceLoading,
    setShowResultDialog,
    setGenerateResult,
    setFailedCardNumbers,
    showToastMessage,
    fetchGeneratePrice,
    handleGenerate,
    copyToClipboard,
    copyAllFailedCards,
    exportData,
    getCardCount,
  }
}
