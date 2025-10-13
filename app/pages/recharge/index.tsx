"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import { useRecharge } from "./hooks/useRecharge"
import { 
  PackageList, 
  CustomRecharge, 
  RechargeHistory, 
  PaymentDialog, 
  ExchangeDialog, 
  PageHeader 
} from "./components"

export default function RechargePage() {
  return <RechargeContent />
}

function RechargeContent() {
  const {
    // 状态
    packages,
    selectedPackage,
    customAmount,
    isLoading,
    showPaymentDialog,
    currentOrder,
    history,
    exchangeCode,
    showExchangeDialog,
    
    // 操作
    setSelectedPackage,
    setCustomAmount,
    setShowPaymentDialog,
    setShowExchangeDialog,
    setExchangeCode,
    createOrder,
    handleExchangeCode,
  } = useRecharge()

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg)
  }

  const handlePackageRecharge = (pkg: any) => {
    createOrder(pkg.id, pkg.amount)
  }

  const handleCustomRecharge = (amount: number) => {
    createOrder('custom', amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader />

          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="packages">充值套餐</TabsTrigger>
              <TabsTrigger value="custom">自定义金额</TabsTrigger>
              <TabsTrigger value="history">充值历史</TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-6">
              <PackageList
                packages={packages}
                selectedPackage={selectedPackage}
                isLoading={isLoading}
                onPackageSelect={handlePackageSelect}
                onPackageRecharge={handlePackageRecharge}
              />
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <CustomRecharge
                customAmount={customAmount}
                isLoading={isLoading}
                onAmountChange={setCustomAmount}
                onRecharge={handleCustomRecharge}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <RechargeHistory
                history={history}
                isLoading={isLoading}
                onExchangeCode={() => setShowExchangeDialog(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PaymentDialog
        isOpen={showPaymentDialog}
        order={currentOrder}
        onClose={() => setShowPaymentDialog(false)}
      />

      <ExchangeDialog
        isOpen={showExchangeDialog}
        exchangeCode={exchangeCode}
        isLoading={isLoading}
        onCodeChange={setExchangeCode}
        onExchange={handleExchangeCode}
        onClose={() => setShowExchangeDialog(false)}
      />
    </div>
  )
}