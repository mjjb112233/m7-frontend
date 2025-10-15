import Header from '@/components/layout/header'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">登录</h1>
        <p className="text-xl text-gray-600">登录页面内容</p>
      </div>
    </div>
  )
}