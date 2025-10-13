import { NextResponse } from "next/server"

/**
 * 通用API路由处理函数
 * 用于创建标准化的API处理器
 */
export function createApiHandler(
  handler: () => Promise<NextResponse> | NextResponse,
  options: {
    requireAuth?: boolean
    method?: string
    description?: string
  } = {}
) {
  return async function apiHandler() {
    try {
      console.log(`[API] ${options.description || 'API请求'}`)
      
      // 执行真实的API逻辑
      return await handler()

    } catch (error) {
      console.error(`[API] ${options.description || 'API请求'}错误:`, error)
      return NextResponse.json(
        { success: false, message: "服务器内部错误，请稍后重试" },
        { status: 500 }
      )
    }
  }
}

/**
 * 带认证的API路由处理函数
 */
export function createAuthApiHandler(
  handler: (request: Request) => Promise<NextResponse> | NextResponse,
  options: {
    description?: string
  } = {}
) {
  return async function authApiHandler(request: Request) {
    try {
      console.log(`[API] ${options.description || '认证API请求'}`)
      
      // 基本认证检查
      const authHeader = request.headers.get("Authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { success: false, message: "未授权访问" },
          { status: 401 }
        )
      }

      // 执行真实的API逻辑
      return await handler(request)

    } catch (error) {
      console.error(`[API] ${options.description || '认证API请求'}错误:`, error)
      return NextResponse.json(
        { success: false, message: "服务器内部错误，请稍后重试" },
        { status: 500 }
      )
    }
  }
}
