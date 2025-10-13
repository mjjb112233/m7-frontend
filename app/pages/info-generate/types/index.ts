export interface GeneratedInfo {
  cardNumber: string
  month: string
  year: string
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface GetGeneratePriceResponse {
  success: boolean
  message: string
  data: {
    price: number
  }
}

export interface GenerateInfoResponse {
  success: boolean
  message: string
  data: {
    successCount: number
    failedCount: number
    totalCost: number
    successData: GeneratedInfo[]
    failedCardNumbers: string[]
    generateTime: string
  }
}

export interface InfoGenerateState {
  cardNumbers: string
  generatedData: GeneratedInfo[]
  isGenerating: boolean
  pricePerCard: number
  priceLoading: boolean
  showResultDialog: boolean
  generateResult: GenerateInfoResponse['data'] | null
  failedCardNumbers: string[]
  showToast: boolean
  toastMessage: string
  toastType: "success" | "error"
}

export interface InfoGenerateActions {
  setCardNumbers: (value: string) => void
  setGeneratedData: (data: GeneratedInfo[]) => void
  setIsGenerating: (loading: boolean) => void
  setPricePerCard: (price: number) => void
  setPriceLoading: (loading: boolean) => void
  setShowResultDialog: (show: boolean) => void
  setGenerateResult: (result: GenerateInfoResponse['data'] | null) => void
  setFailedCardNumbers: (cards: string[]) => void
  showToastMessage: (message: string, type?: "success" | "error") => void
  fetchGeneratePrice: () => Promise<void>
  handleGenerate: () => Promise<void>
  copyToClipboard: (info: GeneratedInfo) => void
  copyAllFailedCards: () => void
  exportData: () => void
  getCardCount: () => number
}
