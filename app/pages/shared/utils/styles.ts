/**
 * 共享样式工具
 */

// 渐变背景样式
export const gradientStyles = {
  // 主要渐变
  primary: "bg-gradient-to-br from-blue-500 to-cyan-500",
  secondary: "bg-gradient-to-br from-purple-500 to-pink-500",
  success: "bg-gradient-to-br from-green-500 to-emerald-500",
  warning: "bg-gradient-to-br from-yellow-500 to-orange-500",
  danger: "bg-gradient-to-br from-red-500 to-pink-500",
  
  // 卡片渐变
  cardBlue: "bg-gradient-to-br from-blue-50 to-cyan-50",
  cardPurple: "bg-gradient-to-br from-purple-50 to-pink-50",
  cardGreen: "bg-gradient-to-br from-green-50 to-emerald-50",
  cardYellow: "bg-gradient-to-br from-yellow-50 to-orange-50",
  cardRed: "bg-gradient-to-br from-red-50 to-pink-50",
  cardGray: "bg-gradient-to-br from-gray-50 to-slate-50",
  
  // 边框渐变
  borderBlue: "border-blue-200",
  borderPurple: "border-purple-200",
  borderGreen: "border-green-200",
  borderYellow: "border-yellow-200",
  borderRed: "border-red-200",
  borderGray: "border-gray-200",
  
  // 文本渐变
  textBlue: "text-blue-600",
  textPurple: "text-purple-600",
  textGreen: "text-green-600",
  textYellow: "text-yellow-600",
  textRed: "text-red-600",
  textGray: "text-gray-600",
} as const

// 阴影样式
export const shadowStyles = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
} as const

// 圆角样式
export const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const

// 动画样式
export const animationStyles = {
  fadeIn: "animate-in fade-in duration-300",
  slideIn: "animate-in slide-in-from-bottom-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-300",
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
} as const

// 组合样式函数
export function getCardStyles(variant: "cardBlue" | "cardPurple" = "cardBlue") {
  return {
    background: gradientStyles[variant],
    border: gradientStyles[`border${variant.replace('card', '')}` as keyof typeof gradientStyles] || "",
    text: gradientStyles[`text${variant.replace('card', '')}` as keyof typeof gradientStyles] || "",
  }
}

export function getButtonStyles(variant: "primary" | "secondary" | "success" | "warning" | "danger" = "primary") {
  return {
    background: gradientStyles[variant],
    hover: `hover:opacity-90 transition-all duration-300`,
  }
}
