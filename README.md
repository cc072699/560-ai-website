# 五六零人工智能科技（北海）有限公司 — 企业官网及内容管控系统

<p align="center">
  <strong>轻量 · 高性能 · 所见即所得</strong>
</p>

<p align="center">
  基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 构建的企业级门户网站，集成独立管理后台，<br />
  实现零数据库运维的前台展示与内容管控一体化解决方案。
</p>

---

## 项目简介

五六零人工智能科技企业官网是一个**轻量级、高性能**的公司门户系统，采用前沿的 Next.js 16 全栈框架与 React 19 服务器组件架构。

系统创新性地采用**本地 JSON 文件存储**替代传统数据库，配合 Git 版本管理实现零运维成本的内容管控。内置的独立管理后台（`/admin`）提供直观的所见即所得编辑体验，让运营人员无需技术介入即可完成全站内容更新。

---

## 核心特性

### 1. 响应式精美前台
- **沉浸式 Hero 首屏**：全屏动态展示企业品牌形象与核心价值主张
- **产品矩阵**：网格化呈现人工智能产品体系，支持灵活排序与分类
- **标杆案例分级展示**：首页展示精选案例简述，详情页提供完整深度内容
- **性能优化的关于我们**：采用 `requestAnimationFrame` 滚动性能节流策略，确保 60fps 流畅体验

### 2. 独立管理后台
- **安全认证**：基于 NextAuth.js 的受保护路由，确保后台安全访问
- **`/admin` 配置中心**：统一管理首页、产品、案例、关于等各模块内容
- **所见即所得编辑**：实时预览编辑效果，操作直观高效

### 3. 轻量化 JSON 存储
- **零数据库运维**：无 MySQL / PostgreSQL 等外部依赖，开箱即用
- **本地 `data/*.json` 存储**：结构化数据文件，易于理解和调试
- **Git 版本回滚**：每次内容变更均可通过 Git 历史回溯，数据安全可控

### 4. 首/案例显示分离
- **首页简述**：在首页展示精选案例的精简摘要，保持页面干净聚焦
- **`/cases` 深度详述**：案例详情页展示完整的技术方案、实施过程与效果数据
- 后台可独立编辑首页展示内容与详情页内容，互不干扰

### 5. 性能与健壮性优化
- **`requestAnimationFrame` 滚动节流**：关于页面滚动事件经 RAF 节流处理，避免频繁计算导致的主线程阻塞
- **深层默认值防护**：全链路可选链操作符（`?.`）与默认值兜底，防止数据缺失导致的页面白屏

---

## 技术栈

| 类别       | 技术                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| 框架       | [Next.js 16](https://nextjs.org)（App Router + Server Components）              |
| UI 库      | [React 19](https://react.dev)                                                  |
| 语言       | [TypeScript](https://www.typescriptlang.org)（严格模式）                        |
| 样式       | [Tailwind CSS](https://tailwindcss.com)                                        |
| 动画       | [Framer Motion](https://www.framer.com/motion)                                 |
| 认证       | [NextAuth.js](https://next-auth.js.org)                                        |

---

## 快速开始

### 环境要求
- Node.js >= 20
- npm >= 10（或使用 pnpm / yarn）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000) 即可预览。

### 生产构建

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

---

## 项目结构

```
├── src/
│   ├── app/                   # App Router 页面路由
│   │   ├── about/             # 关于我们
│   │   ├── admin/             # 管理后台
│   │   ├── cases/             # 标杆案例
│   │   ├── contact/           # 联系我们
│   │   └── products/          # 产品中心
│   ├── components/            # 可复用 UI 组件
│   └── lib/                   # 工具函数与数据获取
├── data/                      # JSON 数据存储
│   ├── home.json              # 首页配置
│   ├── products.json          # 产品数据
│   ├── cases*.json            # 案例数据
│   ├── about.json             # 关于我们
│   └── contact.json           # 联系信息
├── docs/                      # 项目文档与设计稿
├── public/
│   └── uploads/               # 上传资源文件
├── next.config.ts             # Next.js 配置
├── tailwind.config.ts         # Tailwind CSS 配置
└── tsconfig.json              # TypeScript 配置
```

---

## 部署

本项目支持部署至任何支持 Next.js 的托管平台，推荐使用 [Vercel](https://vercel.com) 或自有 Node.js 服务器。

部署前请确保已执行 `npm run build` 完成生产构建，并正确配置环境变量。

---

## 许可证

版权所有 © 2024-2025 五六零人工智能科技（北海）有限公司。保留所有权利。