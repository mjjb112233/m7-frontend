/**
 * 路由相关常量
 */

// 页面路由
export const ROUTES = {
  HOME: '/',
  LOGIN: '/pages/login',
  REGISTER: '/pages/register',
  ACCOUNT: '/pages/account',
  CVV_CHECK: '/pages/cvv-check',
  BIN_CLASSIFY: '/pages/bin-classify',
  INFO_GENERATE: '/pages/info-generate',
  RECHARGE: '/pages/recharge',
} as const

// 导航菜单项
export const NAV_ITEMS = {
  HOME: { href: '/', label: 'nav.home', icon: 'CreditCard' },
  CVV_CHECK: { href: '/pages/cvv-check', label: 'nav.cvvCheck', icon: 'Shield' },
  BIN_CLASSIFY: { href: '/pages/bin-classify', label: 'nav.binClassify', icon: 'CreditCard' },
  INFO_GENERATE: { href: '/pages/info-generate', label: 'nav.infoGenerate', icon: 'Zap' },
  RECHARGE: { href: '/pages/recharge', label: 'nav.recharge', icon: 'Zap' },
  LOGIN: { href: '/pages/login', label: 'nav.login', icon: 'LogIn' },
  REGISTER: { href: '/pages/register', label: 'nav.register', icon: 'UserPlus' },
} as const

// 用户权限级别对应的菜单
export const USER_LEVEL_MENUS = {
  GUEST: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'RECHARGE'],
  LEVEL_1: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'RECHARGE'],
  LEVEL_2: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'RECHARGE', 'INFO_GENERATE'],
  LEVEL_3_PLUS: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'RECHARGE', 'INFO_GENERATE'],
} as const

// 受保护的路由（需要登录）
export const PROTECTED_ROUTES = [
  '/pages/account',
  '/pages/info-generate',
] as const

// 需要特定权限级别的路由
export const PERMISSION_ROUTES = {
  '/pages/info-generate': 2,
} as const
