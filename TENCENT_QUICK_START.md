# 腾讯云部署 - 快速开始

## 当前状态
- ✅ Vercel 已部署: https://web-2ennenn5i-griffin-zh.vercel.app
- ✅ 代码已推送 GitHub
- ✅ 腾讯云部署配置已准备

## 下一步操作（需手动完成）

### 步骤 1: 创建腾讯云账号
1. 访问 https://cloud.tencent.com
2. 注册/登录账号
3. 完成实名认证

### 步骤 2: 选择部署方案

#### 方案 A: 轻量应用服务器（推荐新手）
1. 控制台 → 轻量应用服务器 → 创建
2. 选择「Docker 镜像」
3. 配置：2核2G，广州地域
4. 记录公网 IP

#### 方案 B: TKE 容器服务（推荐生产）
1. 控制台 → 容器服务 → 集群 → 创建
2. 选择「标准集群」
3. 创建数据库：TDSQL for PostgreSQL

### 步骤 3: 部署应用

#### 如果使用轻量服务器：
```bash
# SSH 登录
ssh root@您的服务器IP

# 克隆代码
git clone https://github.com/griffinxu80-star/math-practice-web.git
cd math-practice-web/workspace/web

# 创建 .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
JWT_SECRET=your-random-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/math_practice
EOF

# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 如果使用 TKE：
1. 创建容器镜像仓库 CCR
2. 构建并推送镜像
3. 部署到 TKE 集群
4. 配置公网访问

### 步骤 4: 配置数据库

#### 选项 1: 使用腾讯云 TDSQL
1. 控制台 → 云数据库 → PostgreSQL
2. 创建实例
3. 记录连接信息
4. 更新 .env 中的 DATABASE_URL

#### 选项 2: 服务器自建 PostgreSQL
```bash
# Ubuntu
apt install postgresql postgresql-contrib -y
systemctl start postgresql
sudo -u postgres psql
CREATE DATABASE math_practice;
CREATE USER math_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE math_practice TO math_user;
\q
```

### 步骤 5: 初始化数据库
```bash
# 运行迁移
cd workspace/web/server
node database/migrations/run.js

# 种子数据
node database/seed/index.js
```

### 步骤 6: 配置域名（可选）
1. 购买域名（如腾讯云 DNSPod）
2. 配置 DNS 解析指向服务器 IP
3. 申请 SSL 证书
4. 配置 Nginx 反向代理

---

## 成本对比

| 方案 | 月费用 | 优点 | 缺点 |
|------|--------|------|------|
| Vercel（当前） | 免费 | 简单，免维护 | 国内访问慢 |
| 轻量服务器 | ~50元 | 便宜，国内快 | 需手动维护 |
| TKE | ~150元 | 高可用，自动扩缩 | 配置复杂 |

---

## 测试账号（已创建）
- 学生: test_student / test123
- 家长: test_parent / test123

---
