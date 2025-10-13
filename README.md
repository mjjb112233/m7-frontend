# M7 Frontend - 多功能前端应用

一个基于 Next.js 14 的现代化前端应用，提供 CVV 检测、充值管理和 BIN 分类等功能。

## 🚀 功能特性

### 1. CVV 检测页面 (`/cvv-check`)
- **无需登录**即可使用
- 多步骤检测流程：配置 → 输入 → 预检 → 检测 → 结果
- 支持多种检测通道和模式
- 实时进度显示和状态更新

### 2. 充值管理页面 (`/recharge`)
- **无需登录**即可使用
- **套餐充值**：预设充值套餐选择
- **自定义充值**：用户自定义金额
- **充值码兑换**：支持兑换码功能（测试码：TEST123）
- **充值历史**：查看历史充值记录

### 3. BIN 分类页面 (`/bin-classify`)
- **无需登录**即可使用
- 银行卡号批量分类
- 支持按国家、银行、类型等维度分组
- 实时处理状态显示

## 🛠️ 技术栈

- **框架**: Next.js 14.2.16
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: 自定义组件库
- **状态管理**: React Context
- **开发工具**: ESLint, TypeScript

## 📦 项目结构

```
m7-frontend/
├── app/                          # Next.js App Router
│   ├── pages/                    # 页面组件
│   │   ├── cvv-check/           # CVV检测页面
│   │   ├── recharge/            # 充值页面
│   │   └── bin-classify/        # BIN分类页面
│   ├── api/                      # API路由
│   └── shared/                   # 共享组件和工具
├── components/                   # 通用组件
│   ├── ui/                      # UI基础组件
│   ├── layout/                  # 布局组件
│   └── business/                # 业务组件
├── contexts/                    # React Context
├── lib/                         # 工具库
├── mocks/                       # Mock数据
└── docs/                        # 文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📱 页面功能

### CVV 检测页面
- 访问：`/cvv-check`
- 功能：银行卡CVV码检测
- 特点：多步骤流程，实时状态更新

### 充值页面
- 访问：`/recharge`
- 功能：
  - 套餐充值：选择预设套餐
  - 自定义充值：输入自定义金额
  - 充值码兑换：使用兑换码（测试码：TEST123）
  - 充值历史：查看历史记录

### BIN 分类页面
- 访问：`/bin-classify`
- 功能：银行卡号批量分类
- 特点：支持多种分类维度

## 🔧 开发说明

### 登录验证
所有页面已移除登录验证，可以直接访问使用。

### 模拟数据
- 充值页面使用模拟数据
- 支持测试功能验证

### 测试
- 创建了测试页面：`test-results.html`
- 包含所有功能测试链接

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请通过 GitHub Issues 联系。
