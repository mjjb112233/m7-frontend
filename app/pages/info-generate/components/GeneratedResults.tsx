import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, User, CreditCard, Phone, MapPin, Copy } from "lucide-react"
import { InfoGenerateState, InfoGenerateActions } from "../types"
import { getCardColorTheme } from "../utils"

interface GeneratedResultsProps {
  state: Pick<InfoGenerateState, 'generatedData'>
  actions: Pick<InfoGenerateActions, 'exportData' | 'copyToClipboard'>
}

export function GeneratedResults({ state, actions }: GeneratedResultsProps) {
  const { generatedData } = state
  const { exportData, copyToClipboard } = actions

  if (!generatedData || generatedData.length === 0) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-60"></div>
        <CardContent className="relative p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">暂无生成数据</p>
          <p className="text-sm text-gray-400 mt-1">输入卡号并点击生成按钮开始</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          生成结果 ({generatedData.length}条)
        </h2>
        <Button
          variant="outline"
          onClick={exportData}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300"
        >
          <Download className="h-4 w-4" />
          <span>导出CSV</span>
        </Button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {generatedData.map((info, index) => {
          const colorTheme = getCardColorTheme(index)

          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${colorTheme.from} to-${colorTheme.to} opacity-60`}
              ></div>
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-${colorTheme.accent}/20 to-${colorTheme.accent}/10 rounded-full -translate-y-12 translate-x-12`}
              ></div>
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 bg-gradient-to-br from-${colorTheme.accent} to-${colorTheme.accent} rounded-lg flex items-center justify-center shadow-lg`}
                    >
                      <CreditCard className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-mono text-sm font-medium text-gray-900">{info.cardNumber}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(info)}
                    className={`text-gray-500 hover:text-${colorTheme.accent.split("-")[0]}-600 hover:bg-${colorTheme.accent.split("-")[0]}-50 transition-all duration-300`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-gray-600">姓名:</span>
                    <span className="font-medium text-gray-900">{info.fullName}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                      <CreditCard className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-gray-600">有效期:</span>
                    <span className="font-medium text-gray-900">{info.month}/{info.year}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-sm">
                      <Phone className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-gray-600">电话:</span>
                    <span className="font-medium font-mono text-gray-900">{info.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                      <MapPin className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-gray-600">国家:</span>
                    <span className="font-medium text-gray-900">{info.country}</span>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mt-0.5 shadow-sm">
                        <MapPin className="h-2 w-2 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-600 text-xs">地址:</div>
                        <div className="font-medium text-gray-900">
                          {info.address}<br />
                          {info.city}, {info.state} {info.zipCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${colorTheme.accent} to-${colorTheme.accent}`}
                ></div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
