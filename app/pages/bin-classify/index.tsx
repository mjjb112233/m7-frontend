"use client"

import { CreditCard } from "lucide-react"
import Header from "@/components/layout/header"
import { useBinClassify } from "./hooks/useBinClassify"
import { CardInput, ClassificationConfig, StatisticsCard, GroupedResults } from "./components"

export default function BinClassifyPage() {
  return <BinClassifyContent />
}

function BinClassifyContent() {
  const {
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
    isLoading,
    error,
    setError,
    
    // 方法
    handleStartClassification,
    handleStopClassification,
    handleReset,
    handleToggleGroup,
    handleExportResults,
    handleRetry,
  } = useBinClassify()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                BIN分类检测
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              输入银行卡号，快速获取BIN信息，包括发卡银行、国家、品牌、类型等详细信息
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：输入和配置 */}
            <div className="lg:col-span-1 space-y-6">
              <CardInput
                cardInput={cardInput}
                setCardInput={setCardInput}
                onStart={handleStartClassification}
                onStop={handleStopClassification}
                onReset={handleReset}
                isProcessing={isProcessing}
                processingStatus={processingStatus}
                error={error}
                setError={setError}
              />

              <ClassificationConfig
                config={config}
                setConfig={setConfig}
                disabled={isProcessing}
              />
            </div>

            {/* 右侧：结果展示 */}
            <div className="lg:col-span-2 space-y-6">
              {classificationResult && (
                <StatisticsCard
                  result={classificationResult}
                  onExport={handleExportResults}
                />
              )}

              {groupedResults.length > 0 && (
                <GroupedResults
                  groupedResults={groupedResults}
                  expandedGroups={expandedGroups}
                  onToggleGroup={handleToggleGroup}
                  onRetry={handleRetry}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
