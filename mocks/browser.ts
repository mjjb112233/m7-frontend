import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 配置MSW worker - 只在浏览器环境中创建
export const worker = typeof window !== 'undefined' 
  ? setupWorker(...handlers)
  : null
