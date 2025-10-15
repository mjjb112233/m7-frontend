/**
 * BIN分类API路由
 */

import { NextRequest, NextResponse } from 'next/server'
import * as binAPI from './index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token, ...data } = body

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'start':
        const startResult = await binAPI.startBinClassify(token, data)
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

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'config':
        const configResult = await binAPI.fetchBinClassifyConfig(token)
        return NextResponse.json(configResult)
      
      case 'results':
        if (!taskId) {
          return NextResponse.json({ success: false, message: '缺少TaskId' }, { status: 400 })
        }
        const resultsResult = await binAPI.fetchBinClassifyResults(token, taskId)
        return NextResponse.json(resultsResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
