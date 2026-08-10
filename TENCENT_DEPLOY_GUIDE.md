# 腾讯云部署方案

## 方案概述

本项目支持两种腾讯云部署方式：

### 方案一：腾讯云云服务器（CVM）- 最简单
- 适合：快速部署、小型项目
- 成本：约 50-100元/月
- 优点：简单直接，完整控制

### 方案二：腾讯云容器服务 TKE - 推荐
- 适合：生产环境、高可用需求
- 成本：按资源使用计费
- 优点：自动扩缩容、高可用

### 方案三：腾讯云轻量应用服务器 - 最经济
- 适合：个人项目、低流量
- 成本：约 30-50元/月
- 优点：性价比最高

---

## 前置准备

### 1. 创建腾讯云账号
访问 https://cloud.tencent.com 注册账号

### 2. 开通所需服务
- 容器服务 TKE（推荐）或 云服务器 CVM
- 云数据库 PostgreSQL（TDSQL 或自建）
- 容器镜像服务 CCR

### 3. 配置 CI/CD（可选）
- GitHub Actions 或 腾讯云云函数 SCF

---

## 方案一：CVM 部署步骤

### 1. 创建云服务器
1. 登录腾讯云控制台
2. 选择「云服务器」→「创建」
3. 配置：
   - 地域：建议选择靠近用户的地区（如广州）
   - 镜像：Ubuntu 22.04 LTS 或 CentOS 8
   - 配置：2核4G 起步
   - 存储：50GB SSD

### 2. 安装依赖
```bash
# SSH 登录服务器
ssh root@your-server-ip

# 安装 Docker
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 3. 部署应用
```bash
# 克隆代码
git clone https://github.com/griffinxu80-star/math-practice-web.git
cd math-practice-web/workspace/web

# 创建 .env 文件
cp .env.tencent .env
# 编辑 .env，填入实际配置

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 4. 配置域名（可选）
```bash
# 安装 Nginx
apt install nginx -y

# 配置反向代理
cat > /etc/nginx/sites-available/math-practice << 'EOF'
server {
    listen 80;
    server_name math.practice.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/math-practice /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 方案二：TKE 容器服务部署（推荐）

### 1. 创建 TKE 集群
1. 登录腾讯云控制台
2. 选择「容器服务」→「集群」→「创建集群」
3. 选择「标准集群」→「公有云集群」
4. 配置：
   - 集群名称：math-practice
   - 地域：广州
   - Kubernetes 版本：1.28
   - 节点数：2（2核4G）

### 2. 创建云数据库 PostgreSQL
1. 选择「云数据库」→「SQL Server/PostgreSQL」→「创建」
2. 或使用 TDSQL for PostgreSQL
3. 记录连接信息：
   - 主机地址
   - 端口：5432
   - 用户名
   - 密码
   - 数据库名：math_practice

### 3. 创建容器镜像仓库
1. 选择「容器镜像服务」→「个人实例」→「创建仓库」
2. 仓库名称：math-practice
3. 类型：私有

### 4. 构建并推送镜像
```bash
# 登录镜像仓库
docker login --username=您的用户名 ccr.ccs.tencentyun.com

# 构建镜像
cd workspace/web
docker build -f docker/Dockerfile -t ccr.ccs.tencentyun.com/math-practice/web-server:latest .

# 推送镜像
docker push ccr.ccs.tencentyun.com/math-practice/web-server:latest
```

### 5. 部署到 TKE
```bash
# 安装 kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && mv kubectl /usr/local/bin/

# 配置集群访问
tke get-credentials math-practice

# 应用部署配置
kubectl apply -f deploy/kubernetes.yaml

# 查看状态
kubectl get pods -n math-practice
kubectl get services -n math-practice
```

### 6. 配置公网访问
1. 在 TKE 控制台创建「公网访问」
2. 或配置 Ingress + 负载均衡

---

## 方案三：轻量应用服务器部署

### 1. 创建轻量应用服务器
1. 登录腾讯云控制台
2. 选择「轻量应用服务器」→「创建」
3. 配置：
   - 地域：广州
   - 镜像：Docker 镜像
   - 配置：2核2G（最低）或 2核4G（推荐）
   - 流量包：100GB/月

### 2. 部署应用
轻量服务器已预装 Docker，直接执行：
```bash
cd /root/math-practice-web/workspace/web
docker-compose up -d
```

---

## 数据库初始化

### PostgreSQL 初始化脚本
```sql
-- 运行 database/migrations/*.sql 文件
-- 或使用 Sequelize/TypeORM 自动迁移

-- 种子数据
INSERT INTO users (id, username, password_hash, role, grade, name) VALUES
('user_001', 'test_student', '$2a$10$...', 'student', 4, '测试学生'),
('user_002', 'test_parent', '$2a$10$...', 'parent', NULL, '测试家长');
```

---

## 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| NODE_ENV | 环境 | production |
| PORT | 端口 | 3000 |
| JWT_SECRET | JWT 密钥 | 随机字符串 |
| JWT_EXPIRES_IN | Token 有效期 | 7d |
| DATABASE_URL | 数据库连接 | postgresql://... |

---

## 成本估算

| 方案 | 月费用 | 适用场景 |
|------|--------|----------|
| CVM 2核4G | ~100元 | 小型项目 |
| TKE + PostgreSQL | ~150元 | 生产环境 |
| 轻量服务器 2核2G | ~50元 | 个人/测试 |

---

## 后续优化

1. **CDN 加速**：配置腾讯云 CDN 加速静态资源
2. **监控告警**：启用腾讯云 Cloud Monitor
3. **自动备份**：配置数据库自动备份
4. **CI/CD**：配置 GitHub Actions 自动部署

---

## 故障排查

### 查看日志
```bash
# Docker 日志
docker-compose logs -f

# Kubernetes 日志
kubectl logs -n math-practice -l app=math-practice
```

### 检查健康
```bash
curl https://your-domain.com/api/health
```

---
文档生成时间: 2026-08-10
