/**
 * 认证API路由
 */

import { NextRequest, NextResponse } from 'next/server'
import * as authAPI from './index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'login':
        const loginResult = await authAPI.login(data)
        return NextResponse.json(loginResult)
      
      case 'register':
        const registerResult = await authAPI.register(data)
        return NextResponse.json(registerResult)
      
      case 'logout':
        const logoutResult = await authAPI.logout(data.token)
        return NextResponse.json(logoutResult)
      
      case 'refresh':
        const refreshResult = await authAPI.refreshToken(data.token)
        return NextResponse.json(refreshResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const token = searchParams.get('token')

    switch (action) {
      case 'user':
        if (!token) {
          return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
        }
        const userResult = await authAPI.getUserInfo(token)
        return NextResponse.json(userResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
