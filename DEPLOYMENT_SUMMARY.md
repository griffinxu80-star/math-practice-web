# 网页版部署完成

## 部署信息

### 生产环境
- **主部署 URL**: https://web-gd8zdks9y-griffin-zh.vercel.app
- **自定义别名**: 
  - https://web-griffinxu80-star-griffin-zh.vercel.app
  - https://web-griffin-zh.vercel.app
  - https://web-snowy-ten-b2hi342j7d.vercel.app

### 管理后台
- **Vercel Dashboard**: https://vercel.com/griffin-zh/web

## 环境变量配置

| 变量名 | 值 | 类型 |
|--------|-----|------|
| JWT_SECRET | math-practice-web-secret-2024 | Sensitive |
| JWT_EXPIRES_IN | 7d | Sensitive |

## 技术栈

- **前端**: Vue 3 + TypeScript + Vant UI + Pinia + Vue Router
- **后端**: Express + TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产 - 待配置)
- **部署平台**: Vercel (免备案，支持自定义域名)

## 后续步骤

### 1. 配置数据库（可选）
如需使用 Supabase PostgreSQL：
1. 访问 https://supabase.com 创建项目
2. 复制连接字符串
3. 在 Vercel 添加环境变量 DATABASE_URL

### 2. 绑定自定义域名
1. 访问 https://vercel.com/griffin-zh/web/settings/domains
2. 添加自定义域名
3. 配置 DNS 解析

### 3. 功能测试清单
- [ ] 用户注册/登录
- [ ] 自测诊断 (F01)
- [ ] 提升训练 (F02)
- [ ] 积分系统 (F06)
- [ ] 家长端 (F10)

## 注意事项

1. 当前使用 SQLite，数据存储在内存中，重启后数据会丢失
2. 生产环境建议配置 Supabase 或 Railway PostgreSQL
3. 自定义域名需 ICP 备案后才能在国内使用
4. 短信验证码需配置阿里云/腾讯云短信服务
