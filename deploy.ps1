# 小学数学自测辅导 - 网页版部署脚本
# 使用方法：双击运行或右键"使用 PowerShell 运行"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "小学数学自测辅导 - 网页版部署准备" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[1/4] 检查 Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误：未找到 Node.js，请先安装 Node.js 20+" -ForegroundColor Red
    exit 1
}
Write-Host "  Node.js 版本：$nodeVersion" -ForegroundColor Green

# 检查 npm
Write-Host "[2/4] 检查 npm..." -ForegroundColor Yellow
$npmVersion = npm --version
Write-Host "  npm 版本：$npmVersion" -ForegroundColor Green

# 安装依赖
Write-Host "[3/4] 安装依赖..." -ForegroundColor Yellow
Set-Location "workspace\web\server"
npm install
Set-Location "../client"
npm install
Set-Location "../../.."
Write-Host "  依赖安装完成" -ForegroundColor Green

# 初始化 Git
Write-Host "[4/4] 初始化 Git 仓库..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "初版：小学数学自测辅导网页版"
    Write-Host "  Git 仓库初始化完成" -ForegroundColor Green
} else {
    Write-Host "  Git 仓库已存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "部署步骤：" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 登录 GitHub：https://github.com" -ForegroundColor White
Write-Host "2. 创建新仓库（名称如：math-practice-web）" -ForegroundColor White
Write-Host "3. 复制仓库地址（如：https://github.com/用户名/math-practice-web.git）" -ForegroundColor White
Write-Host ""
Write-Host "4. 执行以下命令推送代码：" -ForegroundColor Yellow
Write-Host "   git remote add origin <你的仓库地址>" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. 部署到 Vercel：" -ForegroundColor White
Write-Host "   - 登录 https://vercel.com" -ForegroundColor White
Write-Host "   - Import Git Repository，选择刚推送的仓库" -ForegroundColor White
Write-Host "   - Root Directory 填写：workspace/web" -ForegroundColor White
Write-Host "   - 添加环境变量：JWT_SECRET（任意字符串）" -ForegroundColor White
Write-Host "   - 点击 Deploy" -ForegroundColor White
Write-Host ""
Write-Host "6. 获取分享链接：" -ForegroundColor White
Write-Host "   部署完成后，Vercel 会生成 https://xxx.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "本地测试命令：" -ForegroundColor Yellow
Write-Host "   cd workspace/web/server && npm run dev" -ForegroundColor Cyan
Write-Host "   cd ../client && npm run dev" -ForegroundColor Cyan
Write-Host ""
