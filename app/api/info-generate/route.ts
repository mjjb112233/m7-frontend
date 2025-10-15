/**
 * 信息生成API路由
 */

import { NextRequest, NextResponse } from 'next/server'
import * as infoAPI from './index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token, ...data } = body

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'start':
        const startResult = await infoAPI.startInfoGenerate(token, data)
        return NextResponse.json(startResult)
      
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
    const taskId = searchParams.get('taskId')
    const type = searchParams.get('type')
    const count = searchParams.get('count')

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'config':
        const configResult = await infoAPI.fetchInfoGenerateConfig(token)
        return NextResponse.json(configResult)
      
      case 'price':
        if (!type || !count) {
          return NextResponse.json({ success: false, message: '缺少参数' }, { status: 400 })
        }
        const priceResult = await infoAPI.fetchInfoGeneratePrice(token, type, parseInt(count))
        return NextResponse.json(priceResult)
      
      case 'results':
        if (!taskId) {
          return NextResponse.json({ success: false, message: '缺少TaskId' }, { status: 400 })
        }
        const resultsResult = await infoAPI.fetchInfoGenerateResults(token, taskId)
        return NextResponse.json(resultsResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
