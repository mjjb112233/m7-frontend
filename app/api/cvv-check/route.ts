/**
 * CVV检测API路由
 */

import { NextRequest, NextResponse } from 'next/server'
import * as cvvAPI from './index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token, ...data } = body

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'start-detection':
        const startResult = await cvvAPI.startDetection(token, data)
        return NextResponse.json(startResult)
      
      case 'stop-detection':
        const stopResult = await cvvAPI.stopDetection(token, data.detectionId)
        return NextResponse.json(stopResult)
      
      case 'detection-results':
        const resultsResult = await cvvAPI.fetchDetectionResults(token, data.detectionId)
        return NextResponse.json(resultsResult)
      
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
    const detectionId = searchParams.get('detectionId')

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'user-status':
        const statusResult = await cvvAPI.fetchUserDetectionStatus(token)
        return NextResponse.json(statusResult)
      
      case 'config':
        const configResult = await cvvAPI.fetchDetectionConfig(token)
        return NextResponse.json(configResult)
      
      case 'detection-progress':
        const progressResult = await cvvAPI.fetchDetectionProgress(token, detectionId || undefined)
        return NextResponse.json(progressResult)
      
      case 'reset-detection-status':
        const resetResult = await cvvAPI.resetDetectionStatus(token)
        return NextResponse.json(resetResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
