#!/bin/bash
# 腾讯云 TKE 部署脚本
# 使用方法: bash deploy-tencent.sh

set -e

echo "=== 小学数学自测辅导 - 腾讯云部署 ==="

# 配置变量
REGISTRY="ccr.ccs.tencentyun.com"
NAMESPACE="math-practice"
IMAGE_NAME="web-server"
CLUSTER_ID="your-cluster-id"
SERVICE_NAME="math-practice-service"
DEPLOYMENT_NAME="math-practice-deployment"

# Docker 登录
echo "登录腾讯云容器镜像服务..."
docker login --username=qq13787138307 $REGISTRY

# 构建镜像
echo "构建 Docker 镜像..."
cd workspace/web
docker build -f docker/Dockerfile -t $REGISTRY/$NAMESPACE/$IMAGE_NAME:latest .

# 推送镜像
echo "推送镜像..."
docker push $REGISTRY/$NAMESPACE/$IMAGE_NAME:latest

echo "=== 部署完成 ==="
echo "请访问腾讯云控制台管理您的服务"
