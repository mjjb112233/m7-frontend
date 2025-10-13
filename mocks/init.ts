import { worker } from './browser'

// 启动MSW worker
export const initMocks = async () => {
  if (typeof window !== 'undefined' && worker) {
    // 只在浏览器环境中启动MSW
    await worker.start({
      onUnhandledRequest: 'warn', // 对未处理的请求发出警告
      serviceWorker: {
        url: '/mockServiceWorker.js' // MSW service worker 文件路径
      }
    })
    
    console.log('🚀 MSW 已启动，开始拦截API请求')
  }
}

// 停止MSW worker
export const stopMocks = () => {
  if (typeof window !== 'undefined' && worker) {
    worker.stop()
    console.log('🛑 MSW 已停止')
  }
}
