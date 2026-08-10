# 小学数学自测辅导 - 网页版

## 技术栈
- **前端**：Vue 3 + TypeScript + Vant UI + Pinia + Vue Router
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite（本地开发）→ PostgreSQL（Supabase 生产）
- **部署**：Vercel（免备案，免费额度充足）

---

## 功能列表（F01-F12）

| 编号 | 功能 | 说明 |
|------|------|------|
| F01 | 自测诊断 | 选单元→作答→提交→薄弱点报告 |
| F02 | 提升训练 | 针对薄弱点渐进难度训练 |
| F03 | 学期复习 | 已学知识点系统回顾 |
| F04 | 新学期预习 | 下期知识点轻量导入 |
| F05 | 周自测 | 每周轻量自测 + 周报 |
| F06 | 积分 | 积分获取/扣分规则（幂等账本） |
| F07 | 成就/徽章 | 等级/成就/徽章解锁 |
| F08 | 小游戏 | 闯关地图 + 每日一题 |
| F09 | 积分商城 | 虚拟奖励兑换（无支付） |
| F10 | 家长端 | 报告/目标/错题本/多孩 M:N 绑定 |
| F11 | 题库管理 | 自主命题、知识点打标 |
| F12 | 账号体系 | 用户名+密码登录（微信扫码预留） |

---

## 题库数据

- **来源**：国家中小学智慧教育平台等官方公开资源，自主改编
- **知识点覆盖**：4-6 年级数学，按教材单元组织（29 个知识点，每点 8+ 题，共 203 题）
- **合规**：`source_type=original`，无爬原题/原图，所有题目均为原创改编

---

## 一、本地开发

### 1. 安装依赖
```bash
cd workspace/web/server
npm install

cd ../client
npm install
```

### 2. 初始化数据库 + 启动
```bash
cd ../server
npm run db:seed    # 初始化 SQLite + 导入题库
npm run dev        # 后端 http://localhost:3000
```
```bash
cd ../client
npm run dev        # 前端 http://localhost:5173
```

### 3. 测试账号
- 学生：用户名 `student1`，密码 `123456`，年级选 4-6
- 家长：用户名 `parent1`，密码 `123456`

---

## 二、Vercel 部署（生成可分享链接）

### 步骤 1：创建 Supabase 数据库
1. 访问 https://supabase.com，注册并创建新项目（免费计划）
2. 记录数据库密码

### 步骤 2：初始化数据库表
1. 进入 Supabase Dashboard → SQL Editor
2. 复制 `workspace/web/server/database/migrations/001_init.sql` 内容
3. 复制 `workspace/web/server/database/migrations/002_fix_fk_to_users.sql` 内容
4. 依次执行，确认表结构创建成功

### 步骤 3：获取连接字符串
1. Supabase Dashboard → Settings → Database
2. 复制连接字符串，格式：
   ```
   postgresql://postgres:你的密码@db.xxx.supabase.co:5432/postgres
   ```

### 步骤 4：推送到 GitHub
```bash
git init
git add .
git commit -m "初版部署"
git push origin main
```

### 步骤 5：Vercel 部署
1. 登录 https://vercel.com，Import 项目
2. Project Settings → Environment Variables 添加：
   | 变量名 | 值 |
   |--------|-----|
   | `DATABASE_URL` | Supabase 连接字符串 |
   | `JWT_SECRET` | 任意随机字符串（如 `my-secret-2024`） |
   | `JWT_EXPIRES_IN` | `7d` |
3. 点击 Deploy

### 步骤 6：获取分享链接
部署完成后，Vercel 生成 `https://xxx.vercel.app`，直接分享即可使用。

---

## 三、API 端点

| 方法 | 路径 | 说明 | 需认证 |
|------|------|------|--------|
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
| GET | /api/v1/gamification/ | 成就列表 | 是 |

---

## 四、合规说明

- 题库来源：国家中小学智慧教育平台等官方公开资源改编
- 无排行榜、无真实时长兑换
- 无人民币支付（商城仅积分兑换虚拟奖励）
- 未成年人保护：注册时选择年级，家长端需绑定孩子
- 数据加密：密码使用 bcrypt 加密存储

---

## 五、目录结构

```
workspace/web/
├── client/                     # 前端（Vue 3 + TS）
│   ├── src/
│   │   ├── views/              # 页面组件（Exam, Training, Shop 等）
│   │   ├── api/                # API 客户端
│   │   ├── stores/             # Pinia 状态管理
│   │   └── router/             # Vue Router
│   └── dist/                   # 构建产物
├── server/                     # 后端（Express + TS）
│   ├── src/
│   │   ├── models/             # 数据库模块（SQLite/PostgreSQL）
│   │   ├── routes/             # API 路由
│   │   ├── services/           # 业务逻辑
│   │   └── middleware/         # 认证中间件
│   ├── database/
│   │   ├── migrations/         # 数据库迁移脚本
│   │   └── seed/               # 种子数据（203 题 + 29 知识点）
│   ├── data/                   # SQLite 数据文件（本地开发）
│   └── dist/                   # 编译产物
├── vercel.json                 # Vercel 部署配置
└── README.md                   # 本文档
```

---

## 六、后续优化方向

1. **题库扩充**：每个知识点补充至 20+ 题，增加多选题和几何题
2. **GeoGebra 嵌入**：几何题直接嵌入 GeoGebra 交互组件
3. **微信扫码登录**：备案域名后对接微信开放平台
4. **账号打通**：与小程序端通过 unionid/手机号关联
5. **埋点分析**：集成网页端专属埋点（断点、扫码入口曝光等）