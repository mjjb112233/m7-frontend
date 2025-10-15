/**
 * 充值API路由
 */

import { NextRequest, NextResponse } from 'next/server'
import * as rechargeAPI from './index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token, ...data } = body

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'create-order':
        const createResult = await rechargeAPI.createRechargeOrder(token, data.packageId, data.paymentMethod)
        return NextResponse.json(createResult)
      
      case 'payment':
        const paymentResult = await rechargeAPI.processRechargePayment(data.orderId, data.paymentData)
        return NextResponse.json(paymentResult)
      
      case 'callback':
        const callbackResult = await rechargeAPI.handleRechargeCallback(data.orderId, data.callbackData)
        return NextResponse.json(callbackResult)
      
      case 'exchange-code':
        const exchangeResult = await rechargeAPI.exchangeRechargeCode(token, data.code)
        return NextResponse.json(exchangeResult)
      
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
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')

    if (!token) {
      return NextResponse.json({ success: false, message: '缺少Token' }, { status: 401 })
    }

    switch (action) {
      case 'config':
        const configResult = await rechargeAPI.fetchRechargeConfig(token)
        return NextResponse.json(configResult)
      
      case 'packages':
        const packagesResult = await rechargeAPI.fetchRechargePackages(token)
        return NextResponse.json(packagesResult)
      
      case 'history':
        const historyResult = await rechargeAPI.fetchRechargeHistory(token, parseInt(page || '1'), parseInt(limit || '10'))
        return NextResponse.json(historyResult)
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
