# 小学数学自测辅导 - 网页版部署完整指南

## 一、项目概述

| 项目 | 说明 |
|------|------|
| 技术栈 | Vue 3 + TypeScript + Vant (前端) / Express + TypeScript (后端) |
| 数据库 | SQLite (本地) / PostgreSQL (Supabase 云端) |
| 部署平台 | Vercel (免费，支持 Serverless) |
| 功能范围 | F01-F11 全功能 + F12 账号体系 |
| 题库规模 | 124 个知识点，1240 道题目 |

## 二、本地开发流程

### 2.1 环境要求
- Node.js 20+
- npm 9+

### 2.2 安装依赖
```powershell
cd workspace\web\server
npm install

cd ..\client
npm install
```

### 2.3 初始化数据库（本地开发）
```powershell
cd ..\server
npm run db:seed
```

### 2.4 启动开发服务器
**终端 1 - 后端：**
```powershell
cd workspace\web\server
npm run dev
# 访问 http://localhost:3000/api/v1/health
```

**终端 2 - 前端：**
```powershell
cd workspace\web\client
npm run dev
# 访问 http://localhost:5173
```

### 2.5 测试账号
- 学生：用户名 `teststudent`，密码 `test123`，年级 5
- 家长：用户名 `parenttest`，密码 `test123`，年级 4-6 任意

## 三、部署到 Vercel（生成分享链接）

### 3.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`math-practice-web`（或你喜欢的名称）
3. 选择 **Public** 或 **Private**
4. 点击 **Create repository**

### 3.2 推送代码到 GitHub

**方法 A：使用 PowerShell 脚本**
```powershell
# 在项目根目录双击运行 deploy.ps1
.\deploy.ps1
```

**方法 B：手动执行**
```powershell
cd "E:\360MoveData\Users\admin\Documents\小学数学自测及辅导"
git init
git add .
git commit -m "初版：小学数学自测辅导网页版"
git branch -M main
git remote add origin https://github.com/你的用户名/math-practice-web.git
git push -u origin main
```

### 3.3 部署到 Vercel

1. 访问 https://vercel.com，登录
2. 点击 **"Add New..."** → **"Project"**
3. 在 **"Import Git Repository"** 中找到 `math-practice-web`，点击 **"Import"**
4. 配置部署设置：
   - **Framework Preset**: `Vite`
   - **Root Directory**: `workspace/web`
   - **Build Command**: 留空（使用默认）
   - **Output Directory**: 留空
5. **Environment Variables**：
   | 变量名 | 值 |
   |--------|-----|
   | `JWT_SECRET` | `my-secret-2024-change-in-production` |
   | `JWT_EXPIRES_IN` | `7d` |
6. 点击 **"Deploy"**
7. 等待 2-3 分钟部署完成
8. 点击 **"Visit"** 打开网站
9. **复制网址分享给用户**（如：https://math-practice-web.vercel.app）

### 3.4 部署到 Supabase（可选，生产环境）

如果需要云端数据库：

1. 按照 `SUPABASE_SETUP.md` 创建 Supabase 项目
2. 在 Vercel 项目设置中添加环境变量：
   - `DATABASE_URL`: Supabase 连接字符串
   - `JWT_SECRET`: 与 3.3 步骤中相同
3. 重新部署

## 四、目录结构

```
小学数学自测及辅导/
├── workspace/web/
│   ├── client/                    # 前端
│   │   ├── src/
│   │   │   ├── views/            # 页面组件（19 个）
│   │   │   ├── api/              # API 客户端
│   │   │   ├── stores/           # Pinia 状态管理
│   │   │   └── router/           # Vue Router
│   │   ├── dist/                 # 构建产物
│   │   └── package.json
│   ├── server/                    # 后端
│   │   ├── src/
│   │   │   ├── routes/           # API 路由
│   │   │   ├── services/         # 业务逻辑
│   │   │   ├── middleware/       # 认证中间件
│   │   │   └── models/           # 数据库模块
│   │   ├── database/
│   │   │   ├── migrations/       # 数据库迁移
│   │   │   └── seed/             # 种子数据
│   │   ├── data/                 # SQLite 数据文件
│   │   └── dist/                 # 编译产物
│   ├── vercel.json               # Vercel 配置
│   └── README.md
├── deploy.ps1                    # 部署脚本
├── SUPABASE_SETUP.md            # Supabase 初始化指南
├── DEPLOY_GUIDE.md              # 本文档
└── .gitignore
```

## 五、API 端点

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/v1/auth/register | 注册 | 否 |
| POST | /api/v1/auth/login | 登录 | 否 |
| GET | /api/v1/auth/me | 获取当前用户 | 是 |
| GET | /api/v1/knowledge/tree | 知识点树 | 否 |
| GET | /api/v1/knowledge/questions | 题目列表 | 否 |
| POST | /api/v1/exam/create | 创建考试 | 是 |
| POST | /api/v1/exam/start | 开始考试 | 是 |
| POST | /api/v1/exam/submit | 提交答案 | 是 |
| GET | /api/v1/exam/history | 考试历史 | 是 |
| GET | /api/v1/mastery/weak | 薄弱知识点 | 是 |
| POST | /api/v1/mastery/update | 更新掌握度 | 是 |
| GET | /api/v1/points/balance | 积分余额 | 是 |
| POST | /api/v1/points/earn | 获得积分 | 是 |
| POST | /api/v1/points/spend | 消耗积分 | 是 |
| GET | /api/v1/shop/items | 商城商品 | 否 |
| POST | /api/v1/shop/redeem | 兑换商品 | 是 |
| GET | /api/v1/wrong-questions | 错题本 | 是 |
| GET | /api/v1/parent/children | 绑定的孩子 | 是（家长） |
| POST | /api/v1/parent/bind | 绑定孩子 | 是（家长） |
| GET | /api/v1/gamification | 成就列表 | 是 |

## 六、功能清单

| 编号 | 功能 | 状态 |
|------|------|------|
| F01 | 自测诊断 | ✅ |
| F02 | 提升训练 | ✅ |
| F03 | 学期复习 | ✅ |
| F04 | 新学期预习 | ✅ |
| F05 | 周自测 | ✅ |
| F06 | 积分系统 | ✅ |
| F07 | 成就/徽章 | ✅ |
| F08 | 小游戏 | ✅ |
| F09 | 积分商城 | ✅ |
| F10 | 家长端 | ✅ |
| F11 | 题库管理 | ✅ |
| F12 | 账号体系 | ✅ |

## 七、合规说明

- ✅ 题库来源：国家中小学智慧教育平台等官方公开资源改编
- ✅ 无排行榜、无真实时长兑换
- ✅ 无人民币支付（商城仅积分兑换虚拟奖励）
- ✅ 未成年人保护：注册时选择年级，家长端需绑定孩子
- ✅ 数据加密：密码使用 bcrypt 加密存储
- ✅ 隐私协议：网页端包含隐私协议和监护人同意页面

## 八、后续优化方向

1. **题库扩充**：每个知识点补充至 20+ 题，增加多选题和几何题
2. **GeoGebra 嵌入**：几何题直接嵌入 GeoGebra 交互组件
3. **微信扫码登录**：备案域名后对接微信开放平台
4. **账号打通**：与小程序端通过 unionid/手机号关联
5. **埋点分析**：集成网页端专属埋点（断点、扫码入口曝光等）
6. **性能优化**：首屏加载优化、图片压缩、CDN 加速

## 九、技术支持

- 项目地址：`workspace/web/`
- 后端代码：`workspace/web/server/`
- 前端代码：`workspace/web/client/`
- 数据库配置：`workspace/web/server/database/`
