"use client"

import Header from "@/components/layout/header"
import { User } from "lucide-react"
import { useInfoGenerate } from "./hooks/useInfoGenerate"
import { CardInput, FailedCards, GeneratedResults, ResultDialog, Toast } from "./components"

export default function InfoGeneratePage() {
  const {
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
  } = useInfoGenerate()

  const state = {
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
  }

  const actions = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">智能信息生成系统</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">根据卡号生成完整的身份信息，使用真实地理位置数据</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CardInput 
              state={{
                cardNumbers,
                isGenerating,
                pricePerCard,
              }}
              actions={{
                setCardNumbers,
                handleGenerate,
                getCardCount,
              }}
            />

            <FailedCards 
              state={{
                failedCardNumbers,
              }}
              actions={{
                copyAllFailedCards,
                setFailedCardNumbers,
              }}
            />
          </div>

          <div className="space-y-4">
            <GeneratedResults 
              state={{
                generatedData,
              }}
              actions={{
                exportData,
                copyToClipboard,
              }}
            />
          </div>
        </div>
      </div>

      <ResultDialog 
        state={{
          showResultDialog,
          generateResult,
        }}
        onClose={() => setShowResultDialog(false)}
      />

      <Toast 
        state={{
          showToast,
          toastMessage,
          toastType,
        }}
      />
    </div>
  )
}