# 部署方案总结

## 当前部署状态

### ✅ Vercel 部署（已上线）
- **URL**: https://web-2ennenn5i-griffin-zh.vercel.app
- **状态**: 运行中
- **数据库**: SQLite（内存模式，重启后数据清除）
- **测试账号**: test_student / test123

### 📦 腾讯云部署（配置已就绪）

#### 新增文件
```
workspace/web/
├── docker/
│   ├── Dockerfile           # 多阶段构建镜像
│   └── .dockerignore
├── deploy/
│   ├── kubernetes.yaml      # TKE Kubernetes 配置
│   └── docker-compose.yml   # Docker Compose 配置
├── .env.tencent             # 腾讯云环境变量模板
└── deploy-tencent.sh        # 部署脚本

根目录:
├── TENCENT_DEPLOY_GUIDE.md  # 详细部署指南
└── TENCENT_QUICK_START.md   # 快速开始指南
```

#### 三种部署方案

| 方案 | 成本 | 难度 | 适用场景 |
|------|------|------|----------|
| **轻量应用服务器** | ~50元/月 | 简单 | 个人项目、测试 |
| **CVM 云服务器** | ~100元/月 | 中等 | 小型项目 |
| **TKE 容器服务** | ~150元/月 | 复杂 | 生产环境、高可用 |

#### 推荐方案：轻量应用服务器

**优点**: 性价比高，预装 Docker，适合新手

**部署步骤**:
1. 创建轻量服务器（选择 Docker 镜像）
2. SSH 登录，克隆代码
3. 配置 .env 文件
4. 运行 docker-compose up -d
5. 配置域名（可选）

**详细步骤见**: `TENCENT_QUICK_START.md`

---

## 数据库方案

### 当前（Vercel）
- SQLite 内存模式
- 重启后数据丢失
- 适合测试，不适合生产

### 推荐（腾讯云）
- **TDSQL for PostgreSQL**: 腾讯云原生数据库
- **自建 PostgreSQL**: 在 CVM 上安装
- 数据持久化，支持备份

---

## 下一步建议

### 立即可做
1. ✅ 测试 Vercel 部署的功能
2. ✅ 使用测试账号登录体验

### 如需国内访问
1. 创建腾讯云轻量应用服务器
2. 按照 `TENCENT_QUICK_START.md` 部署
3. 配置数据库（TDSQL 或自建 PostgreSQL）

### 生产环境优化
1. 配置 CDN 加速
2. 启用 HTTPS
3. 配置自动备份
4. 设置监控告警

---

## 成本对比

| 项目 | Vercel | 腾讯云轻量 | 腾讯云 TKE |
|------|--------|-----------|-----------|
| 月费用 | 免费 | ~50元 | ~150元 |
| 数据库 | 无（内存） | 需自建 | TDSQL ~100元 |
| 国内访问 | 慢 | 快 | 快 |
| 维护难度 | 低 | 中 | 高 |

---

## 联系信息
- GitHub: https://github.com/griffinxu80-star/math-practice-web
- Vercel: https://vercel.com/griffin-zh/web
