import { InfoGenerateState } from "../types"

interface ToastProps {
  state: Pick<InfoGenerateState, 'showToast' | 'toastMessage' | 'toastType'>
}

export function Toast({ state }: ToastProps) {
  const { showToast, toastMessage, toastType } = state

  if (!showToast) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-left-2 duration-300 ${
        toastType === "success" 
          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      }`}>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  )
}
