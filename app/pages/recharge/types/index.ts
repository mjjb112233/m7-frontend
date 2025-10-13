import { RechargePackage, RechargeOrder, RechargeHistory } from "@/app/shared/types"

export interface RechargeState {
  packages: RechargePackage[]
  selectedPackage: RechargePackage | null
  customAmount: string
  isLoading: boolean
  showPaymentDialog: boolean
  currentOrder: RechargeOrder | null
  history: RechargeHistory[]
  exchangeCode: string
  showExchangeDialog: boolean
}

export interface RechargeActions {
  setPackages: (packages: RechargePackage[]) => void
  setSelectedPackage: (pkg: RechargePackage | null) => void
  setCustomAmount: (amount: string) => void
  setIsLoading: (loading: boolean) => void
  setShowPaymentDialog: (show: boolean) => void
  setCurrentOrder: (order: RechargeOrder | null) => void
  setHistory: (history: RechargeHistory[]) => void
  setExchangeCode: (code: string) => void
  setShowExchangeDialog: (show: boolean) => void
  fetchPackages: () => Promise<void>
  createOrder: (packageId: string, amount: number) => Promise<void>
  fetchHistory: () => Promise<void>
  handleExchangeCode: () => Promise<void>
}

export interface PackageCardProps {
  pkg: RechargePackage
  isSelected: boolean
  isLoading: boolean
  onSelect: (pkg: RechargePackage) => void
  onRecharge: (pkg: RechargePackage) => void
}

export interface CustomRechargeProps {
  customAmount: string
  isLoading: boolean
  onAmountChange: (amount: string) => void
  onRecharge: (amount: number) => void
}

export interface RechargeHistoryProps {
  history: RechargeHistory[]
  isLoading: boolean
  onExchangeCode: () => void
}

export interface PaymentDialogProps {
  isOpen: boolean
  order: RechargeOrder | null
  onClose: () => void
}

export interface ExchangeDialogProps {
  isOpen: boolean
  exchangeCode: string
  isLoading: boolean
  onCodeChange: (code: string) => void
  onExchange: () => void
  onClose: () => void
}
