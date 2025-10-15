/**
 * 共享类型定义
 */

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  level: number
  mCoins: number
  createdAt: string
}

export interface UserStats {
  balance: number
  todayUsage: number
  totalSpent: number
  lastLogin: string
}

// 充值相关类型
export interface RechargePackage {
  id: string
  name: string
  amount: number
  coins: number
  bonus: number
  description: string
  popular: boolean
  originalPrice?: number
  discount?: number
}

// 套餐数据接口（用于充值页面）
export interface PackageData {
  id: number           // 套餐ID
  mCoins: number       // M币数量
  usdt: number         // USDT价格
  discount: number     // 折扣比例
  popular: boolean     // 是否为热门套餐
  title: string        // 套餐标题
  description: string  // 套餐描述
  features: string[]   // 套餐特性列表
  icon: string         // 图标名称
  gradient: string     // 渐变色彩
  bgGradient: string   // 背景渐变
  borderColor: string  // 边框颜色
}

export interface RechargeOrder {
  orderId: string
  amount: number
  coins: number
  paymentUrl: string
  qrCode: string
  status: string
  createdAt: string
}

export interface RechargeHistory {
  id: string
  amount: number
  coins: number
  status: string
  createdAt: string
  completedAt?: string
}

// CVV检测相关类型
export interface CVVDetectionConfig {
  mode: string
  channels: string[]
  autoStop: boolean
  validStopCount: number
}

// 通道类型
export interface Channel {
  id: string
  name: string
  status: 'online' | 'busy' | 'offline'
  consumption?: number
  rate?: number
  speed: string
  description: string
}

// 检测模式类型
export interface DetectionMode {
  'mode-id': number
  name: string
  'channels-data': {
    channels: Channel[]
    description?: string
  }
}

// 检测配置类型
export interface DetectionConfig {
  detectionModes: DetectionMode[]
}

// 检测模式类型枚举
export type DetectionModeType = 'charge_test' | 'no_cvv' | 'with_cvv'

// 用户检测状态
export interface UserDetectionStatus {
  status: 'idle' | 'detecting' | 'completed' | 'error'
  detectionId?: string | null
  progress?: number
  message?: string
}

// 检测进度数据
export interface DetectionProgressData {
  progress: number
  message: string
  processedCount: number
  totalCount: number
  currentCard?: string
}

// 检测结果数据
export interface DetectionResultData {
  validCount: number
  invalidCount: number
  totalCount: number
  validCards: string[]
  invalidCards: string[]
  detectionTime: string
  results: Array<{
    cardNumber: string
    isValid: boolean
    cvv?: string
    brand?: string
    type?: string
    level?: string
  }>
}

// 错误类型
export type ErrorType = 'network' | 'auth' | 'validation' | 'server' | 'timeout'

export interface CVVDetectionStatus {
  status: 'idle' | 'detecting' | 'completed' | 'error'
  progress: number
  message: string
  detectionId?: string
}

export interface CVVDetectionResults {
  validCount: number
  invalidCount: number
  totalCount: number
  validCards: string[]
  invalidCards: string[]
  detectionTime: string
}

// BIN分类相关类型
export interface CardInfo {
  cardNumber: string
  brand: string
  type: string
  level: string
  bank: string
  country: string
  currency: string
}

export interface GroupedResult {
  [key: string]: CardInfo[]
}

export interface ProcessingStatus {
  isProcessing: boolean
  processedCount: number
  totalCount: number
  currentCard: string
  progress: number
}

export interface ClassificationResult {
  groupedResults: GroupedResult
  totalCards: number
  categories: string[]
  processingTime: number
}

export interface BinClassifyConfig {
  selectedCategory: "country" | "bank" | "type" | "level" | "currency"
  groupBy: string
  sortOrder: "asc" | "desc"
}

export interface BinClassifyState {
  cardInput: string
  selectedCategory: string
  groupedResults: GroupedResult
  expandedGroups: Set<string>
  isProcessing: boolean
  processingStatus: ProcessingStatus
  classificationResult: ClassificationResult | null
  config: BinClassifyConfig
}

// 公告类型
export interface Announcement {
  id: string
  type: 'maintenance' | 'promotion' | 'update'
  title: string
  message: string
  priority: number
  carouselDuration: number
  position?: 'top' | 'hero' | 'floating'
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// CVV检测相关类型
export interface CVVDetectionRequest {
  cvvs: string[]
  autoStopCount: number
  channelId: string
  modeId: string
}

export interface CVVDetectionResponse {
  success: boolean
  data?: {
    detectionId: string
    totalCost: number
  }
  message?: string
}

// BIN分类相关类型
export interface BINClassifyRequest {
  cardNumbers: string[]
  category: string
}

export interface BINClassifyResponse {
  success: boolean
  data?: {
    results: Array<{
      cardNumber: string
      brand: string
      type: string
      level: string
      bank: string
      country: string
      currency: string
    }>
  }
  message?: string
}

// 卡信息提取相关类型
export interface ExtractCodeRequest {
  extractCode: string
  verificationCode: string
}

export interface ExtractCodeResponse {
  success: boolean
  data?: {
    extractCode: string
    cardInfo: CardInfo[]
    totalCards: number
    extractTime: string
    dataSource: string
    isPaymentRequired: boolean
    amount: number
    status: string
    remarks: string
  }
  message?: string
}

// 信息生成相关类型
export interface InfoGenerateRequest {
  cardNumbers: string[]
}

export interface InfoGenerateResponse {
  success: boolean
  data?: {
    successData: Array<{
      cardNumber: string
      generatedInfo: {
        name: string
        address: string
        phone: string
        email: string
      }
    }>
    failedCardNumbers: string[]
    totalCost: number
  }
  message?: string
}

// 语言类型
export type Language = "zh" | "en"

// 用户等级
export const USER_LEVELS = {
  GUEST: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
} as const

export type UserLevel = typeof USER_LEVELS[keyof typeof USER_LEVELS]

// 公告位置
export type AnnouncementPosition = "top" | "hero" | "floating"

// 公告类型
export type AnnouncementType = "maintenance" | "promotion" | "update"

// 公告UI类型
export type AnnouncementUIType = "info" | "warning" | "success" | "error"

// 检测状态
export type DetectionStatus = "not_detected" | "detecting" | "completed"

// 系统状态
export type SystemStatus = "normal" | "abnormal" | "maintenance"

// 支付状态
export type PaymentStatus = "pending" | "paid" | "expired" | "cancelled"

// 提取码状态
export type ExtractCodeStatus = "unused" | "used" | "expired"

// 分页参数
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  message?: string
}

// 通用类型
export interface ApiResponse<T> {
  success: boolean
  data?: T | null
  message?: string
  error?: string
}
