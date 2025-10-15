# M7前端项目结构要求文档

## 📋 项目概述

本文档定义了M7前端项目的标准目录结构和开发规范，确保代码组织清晰、维护性强、组件复用性高。

## 🏗️ 核心设计原则

### 1. 模块化设计
- 每个页面功能独立，包含自己的组件、状态管理、数据获取逻辑
- 组件职责单一，便于测试和维护
- 避免全局状态污染，每个模块管理自己的状态

### 2. 目录结构规范
- 页面级组件放在 `app/pages/[page-name]/` 目录下
- 每个页面目录包含：组件、状态管理、数据获取、类型定义
- 共享组件放在 `components/` 目录下
- API接口放在 `app/api/` 目录下

## 📁 标准目录结构

```
m7-frontend/
├── app/                          # Next.js App Router 根目录
│   ├── api/                      # API接口目录
│   │   ├── auth/                 # 认证相关API
│   │   │   ├── index.ts          # API函数定义
│   │   │   ├── mock-data.ts      # 模拟数据
│   │   │   └── route.ts          # Next.js API路由
│   │   ├── cvv-check/            # CVV检测API
│   │   ├── bin-classify/         # BIN分类API
│   │   ├── info-generate/        # 信息生成API
│   │   └── recharge/             # 充值相关API
│   ├── pages/                    # 页面目录
│   │   ├── cvv-check/            # CVV检测页面
│   │   │   ├── page.tsx          # 页面主组件
│   │   │   ├── components/       # 页面专用组件
│   │   │   │   ├── CardInput.tsx
│   │   │   │   ├── DetectionStatus.tsx
│   │   │   │   ├── ResultsDisplay.tsx
│   │   │   │   └── index.ts      # 组件导出
│   │   │   ├── hooks/            # 页面专用Hooks
│   │   │   │   ├── useCVVDetection.ts
│   │   │   │   ├── useDetectionConfig.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/         # 页面专用服务
│   │   │   │   ├── cvvDetectionService.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/            # 页面专用类型
│   │   │   │   ├── detection.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/            # 页面专用工具
│   │   │   │   ├── cardValidation.ts
│   │   │   │   └── index.ts
│   │   │   └── constants/        # 页面专用常量
│   │   │       └── index.ts
│   │   ├── bin-classify/         # BIN分类页面
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── CardInput.tsx
│   │   │   │   ├── ClassificationConfig.tsx
│   │   │   │   ├── ProcessingStatus.tsx
│   │   │   │   ├── ResultsTable.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useBinClassify.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── binClassifyService.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── classification.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── cardParser.ts
│   │   │       └── index.ts
│   │   ├── info-generate/        # 信息生成页面
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── CardInput.tsx
│   │   │   │   ├── PriceQuery.tsx
│   │   │   │   ├── GenerationProgress.tsx
│   │   │   │   ├── ResultsDisplay.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useInfoGenerate.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── infoGenerateService.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── generation.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── dataProcessor.ts
│   │   │       └── index.ts
│   │   ├── recharge/             # 充值页面
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── PackageList.tsx
│   │   │   │   ├── ExchangeCode.tsx
│   │   │   │   ├── RechargeHistory.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useRecharge.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── rechargeService.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── recharge.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── paymentUtils.ts
│   │   │       └── index.ts
│   │   ├── login/                # 登录页面
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── index.ts
│   │   │   └── services/
│   │   │       ├── authService.ts
│   │   │       └── index.ts
│   │   ├── register/             # 注册页面
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── index.ts
│   │   │   └── services/
│   │   │       ├── registerService.ts
│   │   │       └── index.ts
│   │   └── account/              # 账户页面
│   │       ├── page.tsx
│   │       ├── components/
│   │       │   ├── ProfileCard.tsx
│   │       │   ├── StatsCard.tsx
│   │       │   └── index.ts
│   │       ├── hooks/
│   │       │   ├── useUserProfile.ts
│   │       │   └── index.ts
│   │       └── services/
│   │           ├── userService.ts
│   │           └── index.ts
│   ├── shared/                   # 共享组件和工具
│   │   ├── components/          # 跨页面共享组件
│   │   │   ├── CVVDetectionCard.tsx
│   │   │   ├── RechargePackageCard.tsx
│   │   │   ├── UserProfileCard.tsx
│   │   │   └── index.ts
│   │   ├── hooks/               # 跨页面共享Hooks
│   │   │   ├── useCVVDetection.ts
│   │   │   ├── useRechargePackages.ts
│   │   │   └── index.ts
│   │   ├── types/               # 跨页面共享类型
│   │   │   ├── common.ts
│   │   │   └── index.ts
│   │   ├── utils/               # 跨页面共享工具
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── constants/           # 跨页面共享常量
│   │       ├── api.ts
│   │       └── index.ts
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/                  # 全局共享组件
│   ├── ui/                      # 基础UI组件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── business/                # 业务组件
│   │   ├── user-dropdown.tsx
│   │   ├── announcement-banner.tsx
│   │   └── ...
│   └── layout/                   # 布局组件
│       ├── header.tsx
│       ├── auth-guard.tsx
│       └── ...
├── contexts/                    # React Context
│   ├── auth-context.tsx
│   └── language-context.tsx
├── lib/                         # 工具库
│   ├── api-client.ts
│   ├── utils.ts
│   └── ...
├── constants/                    # 全局常量
│   ├── routes.ts
│   ├── api.ts
│   └── config.ts
└── docs/                        # 文档
    ├── API_DOCUMENTATION.md
    └── ...
```

## 📝 详细规范说明

### 1. 页面目录结构

每个页面目录必须包含以下子目录：

#### `components/` - 页面专用组件
- 只在该页面使用的组件
- 组件名称使用PascalCase
- 每个组件一个文件
- 通过 `index.ts` 统一导出

```typescript
// app/pages/cvv-check/components/index.ts
export { CardInput } from './CardInput'
export { DetectionStatus } from './DetectionStatus'
export { ResultsDisplay } from './ResultsDisplay'
```

#### `hooks/` - 页面专用Hooks
- 页面状态管理逻辑
- 数据获取和处理逻辑
- 业务逻辑封装

```typescript
// app/pages/cvv-check/hooks/useCVVDetection.ts
export const useCVVDetection = () => {
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState(null)
  
  const startDetection = async (config) => {
    // 检测逻辑
  }
  
  return { status, results, startDetection }
}
```

#### `services/` - 页面专用服务
- API调用封装
- 数据处理服务
- 外部服务集成

```typescript
// app/pages/cvv-check/services/cvvDetectionService.ts
export class CVVDetectionService {
  static async startDetection(config: DetectionConfig) {
    // API调用逻辑
  }
  
  static async getDetectionStatus(taskId: string) {
    // 状态查询逻辑
  }
}
```

#### `types/` - 页面专用类型
- 页面相关的TypeScript类型定义
- 接口类型
- 枚举类型

```typescript
// app/pages/cvv-check/types/detection.ts
export interface DetectionConfig {
  mode: 'charge_test' | 'live_test'
  channels: number[]
  cvvList: string[]
}

export interface DetectionResult {
  validCount: number
  invalidCount: number
  validCards: string[]
  invalidCards: string[]
}
```

#### `utils/` - 页面专用工具
- 页面特定的工具函数
- 数据处理函数
- 验证函数

```typescript
// app/pages/cvv-check/utils/cardValidation.ts
export const validateCardNumber = (cardNumber: string): boolean => {
  // 卡号验证逻辑
}

export const formatCardNumber = (cardNumber: string): string => {
  // 卡号格式化逻辑
}
```

### 2. 组件开发规范

#### 组件命名
- 使用PascalCase命名
- 文件名与组件名一致
- 组件名要有意义，体现功能

#### 组件结构
```typescript
// app/pages/cvv-check/components/CardInput.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CardInputProps {
  onCardsChange: (cards: string[]) => void
  disabled?: boolean
}

export const CardInput = ({ onCardsChange, disabled = false }: CardInputProps) => {
  const [inputValue, setInputValue] = useState('')
  
  const handleSubmit = () => {
    const cards = inputValue.split('\n').filter(card => card.trim())
    onCardsChange(cards)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>输入卡号</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入卡号，每行一个"
          disabled={disabled}
        />
        <Button onClick={handleSubmit} disabled={disabled}>
          确认
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 3. 状态管理规范

#### 页面级状态管理
- 使用React Hooks进行状态管理
- 状态逻辑封装在自定义Hooks中
- 避免全局状态污染

```typescript
// app/pages/cvv-check/hooks/useCVVDetection.ts
import { useState, useCallback } from 'react'
import { CVVDetectionService } from '../services/cvvDetectionService'
import { DetectionConfig, DetectionResult } from '../types/detection'

export const useCVVDetection = () => {
  const [status, setStatus] = useState<'idle' | 'detecting' | 'completed' | 'error'>('idle')
  const [results, setResults] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const startDetection = useCallback(async (config: DetectionConfig) => {
    try {
      setStatus('detecting')
      setError(null)
      
      const result = await CVVDetectionService.startDetection(config)
      setResults(result)
      setStatus('completed')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])
  
  const resetDetection = useCallback(() => {
    setStatus('idle')
    setResults(null)
    setError(null)
  }, [])
  
  return {
    status,
    results,
    error,
    startDetection,
    resetDetection
  }
}
```

### 4. 数据获取规范

#### 服务层封装
- 所有API调用封装在服务层
- 统一错误处理
- 统一数据格式

```typescript
// app/pages/cvv-check/services/cvvDetectionService.ts
import { apiClient } from '@/lib/api-client'
import { DetectionConfig, DetectionResult } from '../types/detection'

export class CVVDetectionService {
  static async startDetection(config: DetectionConfig): Promise<DetectionResult> {
    try {
      const response = await apiClient.post('/api/cvv-check', {
        action: 'start',
        data: config
      })
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error('CVV检测启动失败:', error)
      throw error
    }
  }
  
  static async getDetectionStatus(taskId: string): Promise<DetectionResult> {
    try {
      const response = await apiClient.get(`/api/cvv-check?action=status&taskId=${taskId}`)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error('获取检测状态失败:', error)
      throw error
    }
  }
}
```

### 5. 类型定义规范

#### 页面级类型定义
- 每个页面定义自己的类型
- 类型文件按功能分类
- 统一导出接口

```typescript
// app/pages/cvv-check/types/index.ts
export * from './detection'
export * from './config'
export * from './result'
```

```typescript
// app/pages/cvv-check/types/detection.ts
export interface DetectionConfig {
  mode: 'charge_test' | 'live_test'
  channels: number[]
  cvvList: string[]
  timeout?: number
}

export interface DetectionStatus {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
}

export interface DetectionResult {
  taskId: string
  validCount: number
  invalidCount: number
  totalCount: number
  validCards: string[]
  invalidCards: string[]
  processingTime: number
  createdAt: string
}
```

### 6. 工具函数规范

#### 页面专用工具
- 工具函数按功能分类
- 纯函数，无副作用
- 完整的类型定义

```typescript
// app/pages/cvv-check/utils/cardValidation.ts
export const validateCardNumber = (cardNumber: string): boolean => {
  // 移除空格和连字符
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // 检查长度
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }
  
  // 检查是否只包含数字
  if (!/^\d+$/.test(cleaned)) {
    return false
  }
  
  // Luhn算法验证
  return luhnCheck(cleaned)
}

const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0
  let isEven = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  return cleaned.replace(/(.{4})/g, '$1 ').trim()
}
```

## 🚀 实施步骤

### 第一阶段：目录结构创建
1. 为每个页面创建标准目录结构
2. 创建必要的子目录（components, hooks, services, types, utils）
3. 创建各目录的 index.ts 文件

### 第二阶段：组件迁移
1. 将现有组件按页面分类迁移
2. 更新组件导入路径
3. 确保组件功能正常

### 第三阶段：状态管理重构
1. 创建页面专用的Hooks
2. 封装状态管理逻辑
3. 移除全局状态依赖

### 第四阶段：服务层重构
1. 创建页面专用的服务类
2. 封装API调用逻辑
3. 统一错误处理

### 第五阶段：类型定义完善
1. 为每个页面定义完整的类型
2. 创建类型导出文件
3. 确保类型安全

## 📋 检查清单

### 目录结构检查
- [ ] 每个页面都有完整的目录结构
- [ ] 所有子目录都有 index.ts 文件
- [ ] 组件按功能合理分类
- [ ] 没有重复的组件定义

### 代码质量检查
- [ ] 所有组件都有完整的类型定义
- [ ] Hooks封装了状态管理逻辑
- [ ] 服务层统一了API调用
- [ ] 工具函数都是纯函数

### 功能完整性检查
- [ ] 页面功能正常工作
- [ ] 组件间通信正常
- [ ] 数据获取逻辑正确
- [ ] 错误处理完善

## 🎯 预期效果

实施完成后，项目将具备以下特点：

1. **高内聚低耦合**：每个页面功能独立，组件职责明确
2. **易于维护**：代码结构清晰，修改影响范围可控
3. **便于测试**：组件和逻辑分离，便于单元测试
4. **可复用性强**：组件设计合理，便于在其他页面复用
5. **类型安全**：完整的TypeScript类型定义，减少运行时错误

## 📚 参考资料

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [React Hooks 最佳实践](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript 项目结构指南](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [组件设计原则](https://react.dev/learn/thinking-in-react)
