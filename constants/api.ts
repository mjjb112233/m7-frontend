/**
 * API相关常量
 */

// API基础URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// WebSocket基础URL
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8080"

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER: '/auth/user',
  },
  // 公告相关
  ANNOUNCEMENTS: '/announcements',
  // CVV检测相关
  CVV_CHECK: {
    CONFIG: '/cvv-check/config',
    STATUS: '/cvv-check/status',
    USER_STATUS: '/cvv-check/user-status',
    START_DETECTION: '/cvv-check/start-detection',
    STOP_DETECTION: '/cvv-check/stop-detection',
    DETECTION_PROGRESS: '/cvv-check/detection-progress',
    DETECTION_RESULTS: '/cvv-check/detection-results',
    RESET_DETECTION_STATUS: '/cvv-check/reset-detection-status',
  },
  // BIN分类相关
  BIN_CLASSIFY: {
    CONFIG: '/bin-classify/config',
    START: '/bin-classify/start',
    RESULTS: '/bin-classify/results',
  },
  // 卡信息提取相关
  CARD_EXTRACT: {
    CONFIG: '/card-extract/config',
    START: '/card-extract/start',
    RESULTS: '/card-extract/results',
  },
  // 充值相关
  RECHARGE: {
    CONFIG: '/recharge/config',
    PACKAGES: '/recharge/packages',
    CREATE_ORDER: '/recharge/create-order',
    HISTORY: '/recharge/history',
    PAYMENT: '/recharge/payment',
    CALLBACK: '/recharge/callback',
    EXCHANGE_CODE: '/recharge/exchange-code',
  },
  // 信息生成相关
  INFO_GENERATE: {
    CONFIG: '/info-generate/config',
    START: '/info-generate/start',
    RESULTS: '/info-generate/results',
    PRICE: '/info-generate/price',
    GENERATE: '/info-generate/generate',
  },
} as const

// 请求超时时间
export const REQUEST_TIMEOUT = 30000 // 30秒

// 重试次数
export const MAX_RETRY_ATTEMPTS = 3

// 心跳间隔
export const HEARTBEAT_INTERVAL = 30000 // 30秒
