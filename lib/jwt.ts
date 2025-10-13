import jwt from 'jsonwebtoken'

// JWT密钥，生产环境应该从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 用户信息接口
export interface UserPayload {
  userId: string
  username: string
  level: number
  mCoins: number
}

/**
 * 生成JWT令牌
 * @param payload 用户信息
 * @param expiresIn 过期时间，默认7天
 * @returns JWT令牌
 */
export function generateJwt(payload: UserPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

/**
 * 验证JWT令牌
 * @param token JWT令牌
 * @returns 解码后的用户信息
 */
export async function verifyJwt(token: string): Promise<UserPayload> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
    return decoded
  } catch (error) {
    throw new Error('无效的令牌')
  }
}

/**
 * 从请求头中提取令牌
 * @param authHeader Authorization请求头
 * @returns 令牌字符串
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
