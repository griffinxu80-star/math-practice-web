# 网页版部署完成

## 访问地址

| 环境 | URL |
|------|-----|
| **最新部署** | https://web-p088ydmj7-griffin-zh.vercel.app |
| **上一部署** | https://web-gd8zdks9y-griffin-zh.vercel.app |
| **别名** | https://web-griffin-zh.vercel.app |
| **别名** | https://web-griffinxu80-star-griffin-zh.vercel.app |

## 管理后台
- **Vercel Dashboard**: https://vercel.com/griffin-zh/web
- **部署详情**: https://vercel.com/griffin-zh/web/7X1MgV8itDg4x3BXyUW36j7wKUQN

## 环境变量配置

已在 Vercel 配置：
- JWT_SECRET: math-practice-web-secret-2024
- JWT_EXPIRES_IN: 7d

## 后续配置

### 1. 配置 Supabase 数据库（推荐）
访问 https://supabase.com 创建免费项目：
`ash
# 在 Vercel 添加环境变量
npx vercel env add DATABASE_URL production
# 粘贴 Supabase 连接字符串
`

### 2. 绑定自定义域名
访问 https://vercel.com/griffin-zh/web/settings/domains
添加您的域名并配置 DNS

### 3. 配置短信服务（如需手机验证码）
- 阿里云短信：https://dysms.console.aliyun.com
- 腾讯云短信：https://console.cloud.tencent.com/smsv2

## 技术栈
- 前端: Vue 3 + TypeScript + Vant UI
- 后端: Express + TypeScript
- 数据库: SQLite (当前) → PostgreSQL (推荐)
- 部署: Vercel

## 注意
- 当前使用 SQLite，数据在重启后会丢失
- 生产环境建议切换到 Supabase PostgreSQL
- 国内访问可能需要配置 CDN 或备案域名

---
部署时间: 2026-08-10
