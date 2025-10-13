"use client"
import React, { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCVVDetection } from "@/app/shared/hooks"
import { useCVVCheckAPI } from "@/app/api"
import { CreditCard, CheckCircle, X, Settings, Search, BarChart3 } from "lucide-react"

// 导入步骤组件
import { InputStep } from "./steps/input"
import { PrecheckStep } from "./steps/precheck"
import { ConfigStepV2 as ConfigStep } from "./steps/config/ConfigStepV2"
import { DetectingStep } from "./steps/detecting"
import { ResultsStep } from "./steps/results"
import { StepIndicator } from "./components/StepIndicator"
import { StatusAlert } from "./components/StatusAlert"
import { ErrorAlert } from "@/app/pages/cvv-check/components/ErrorAlert"

export default function CVVCheckPage() {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const cvvDetection = useCVVDetection(token)
  const cvvAPI = useCVVCheckAPI()

  // 移除登录验证，允许所有用户访问
  // 如果没有用户，创建一个模拟用户
  if (!user) {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      level: 2,
      mCoins: 1000,
      lastLogin: new Date().toISOString()
    }
    // 这里我们继续渲染页面，但使用模拟用户
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('cvvCheck.title')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('cvvCheck.description')}
            </p>
          </div>

          {/* 状态指示器 */}
          <StepIndicator 
            currentStep={cvvDetection.currentStep}
            steps={[
              { id: 'config', label: t('cvvCheck.steps.config'), icon: Settings },
              { id: 'input', label: t('cvvCheck.steps.input'), icon: CreditCard },
              { id: 'precheck', label: t('cvvCheck.steps.precheck'), icon: CheckCircle },
              { id: 'detecting', label: t('cvvCheck.steps.detecting'), icon: Search },
              { id: 'results', label: t('cvvCheck.steps.results'), icon: BarChart3 }
            ]}
          />

          {/* 状态提示 */}
          {cvvDetection.showNotification && (
            <StatusAlert
              type={cvvDetection.notificationType}
              message={cvvDetection.notificationMessage}
              onClose={() => cvvDetection.setShowNotification(false)}
            />
          )}

          {/* 错误提示 */}
          {cvvDetection.error && (
            <ErrorAlert
              message={cvvDetection.error}
              onClose={() => cvvDetection.setError('')}
            />
          )}

          {/* 步骤内容 */}
          <div className="mt-8">
            {cvvDetection.currentStep === 'config' && (
              <ConfigStep
                onNext={cvvDetection.handleConfigNext}
                onConfigSelected={(config) => {
                  cvvDetection.setSelectedChannel(config.channel)
                  // 可以在这里处理配置选择
                }}
              />
            )}

            {cvvDetection.currentStep === 'input' && (
              <InputStep
                inputText={cvvDetection.inputText}
                setInputText={cvvDetection.setInputText}
                onNext={cvvDetection.handleInputNext}
                onBack={cvvDetection.handleInputBack}
                isLoading={cvvDetection.isLoading}
              />
            )}

            {cvvDetection.currentStep === 'precheck' && (
              <PrecheckStep
                precheckResults={cvvDetection.precheckResults}
                selectedChannel={cvvDetection.selectedChannel}
                onNext={cvvDetection.handlePrecheckNext}
                onBack={cvvDetection.handlePrecheckBack}
                isLoading={cvvDetection.isLoading}
              />
            )}

            {cvvDetection.currentStep === 'detecting' && (
              <DetectingStep
                localDetectionUuid={cvvDetection.userDetectionStatus?.detectionId || ''}
                selectedChannel={cvvDetection.selectedChannel}
                detectionStatus={cvvDetection.status}
                detectionProgress={cvvDetection.detectionProgress}
                onStop={cvvDetection.handleStopDetection}
                onComplete={cvvDetection.handleDetectionComplete}
                isLoading={cvvDetection.isLoadingStatus || cvvDetection.isLoadingProgress}
                stopButtonCountdown={cvvDetection.stopButtonCountdown}
              />
            )}

            {cvvDetection.currentStep === 'results' && (
              <ResultsStep
                detectionId={cvvDetection.userDetectionStatus?.detectionId || null}
                onRetest={cvvDetection.handleRetest}
                copySuccess={cvvDetection.copySuccess}
                setCopySuccess={cvvDetection.setCopySuccess}
                isLoading={cvvDetection.isLoadingResult}
              />
            )}
          </div>

          {/* 底部提示 */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('cvvCheck.tips.title')}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('cvvCheck.tips.tip1')}</li>
                <li>• {t('cvvCheck.tips.tip2')}</li>
                <li>• {t('cvvCheck.tips.tip3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}