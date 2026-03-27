#!/usr/bin/env pwsh
# 论坛系统测试脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       论坛系统测试脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了必要的工具
function Check-Command {
    param($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) {
            return $true
        }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# 检查Node.js
if (-not (Check-Command "node")) {
    Write-Host "❌ 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 检查npm
if (-not (Check-Command "npm")) {
    Write-Host "❌ 未找到npm，请先安装npm" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 环境检查通过" -ForegroundColor Green
Write-Host ""

# 主菜单
function Show-Menu {
    Write-Host "请选择测试类型：" -ForegroundColor Yellow
    Write-Host "1. 前端测试 (React组件测试)" -ForegroundColor Cyan
    Write-Host "2. 后端测试 (API测试)" -ForegroundColor Cyan
    Write-Host "3. 集成测试" -ForegroundColor Cyan
    Write-Host "4. 运行所有测试" -ForegroundColor Cyan
    Write-Host "5. 查看测试覆盖率" -ForegroundColor Cyan
    Write-Host "6. 退出" -ForegroundColor Cyan
    Write-Host ""
}

# 运行前端测试
function Run-Frontend-Tests {
    Write-Host "🚀 运行前端测试..." -ForegroundColor Green
    Write-Host ""
    
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    
    if (-not (Test-Path $frontendPath)) {
        Write-Host "❌ 前端目录不存在: $frontendPath" -ForegroundColor Red
        return
    }
    
    Set-Location $frontendPath
    
    # 检查依赖
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 安装前端依赖..." -ForegroundColor Yellow
        npm ci
    }
    
    Write-Host "🧪 运行前端单元测试..." -ForegroundColor Yellow
    npm test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 前端测试失败" -ForegroundColor Red
    } else {
        Write-Host "✅ 前端测试通过" -ForegroundColor Green
    }
    
    Set-Location $PSScriptRoot
}

# 运行后端测试
function Run-Backend-Tests {
    Write-Host "🚀 运行后端测试..." -ForegroundColor Green
    Write-Host ""
    
    $backendPath = Join-Path $PSScriptRoot "..\auth-api"
    
    if (-not (Test-Path $backendPath)) {
        Write-Host "❌ 后端目录不存在: $backendPath" -ForegroundColor Red
        return
    }
    
    Set-Location $backendPath
    
    # 检查依赖
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 安装后端依赖..." -ForegroundColor Yellow
        npm ci
    }
    
    Write-Host "🧪 运行后端单元测试..." -ForegroundColor Yellow
    npm test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 后端测试失败" -ForegroundColor Red
    } else {
        Write-Host "✅ 后端测试通过" -ForegroundColor Green
    }
    
    Set-Location $PSScriptRoot
}

# 运行集成测试
function Run-Integration-Tests {
    Write-Host "🚀 运行集成测试..." -ForegroundColor Green
    Write-Host ""
    
    $backendPath = Join-Path $PSScriptRoot "..\auth-api"
    
    if (-not (Test-Path $backendPath)) {
        Write-Host "❌ 后端目录不存在: $backendPath" -ForegroundColor Red
        return
    }
    
    Set-Location $backendPath
    
    # 检查依赖
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 安装后端依赖..." -ForegroundColor Yellow
        npm ci
    }
    
    Write-Host "🔗 运行集成测试..." -ForegroundColor Yellow
    npm run test:integration
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 集成测试失败" -ForegroundColor Red
    } else {
        Write-Host "✅ 集成测试通过" -ForegroundColor Green
    }
    
    Set-Location $PSScriptRoot
}

# 运行所有测试
function Run-All-Tests {
    Write-Host "🚀 运行所有测试..." -ForegroundColor Green
    Write-Host ""
    
    Run-Frontend-Tests
    Write-Host ""
    
    Run-Backend-Tests
    Write-Host ""
    
    Run-Integration-Tests
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "       所有测试完成" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

# 查看测试覆盖率
function Show-Coverage {
    Write-Host "📊 查看测试覆盖率..." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "前端覆盖率报告位置:" -ForegroundColor Yellow
    Write-Host "  forum-project/frontend/coverage/index.html" -ForegroundColor White
    Write-Host ""
    
    Write-Host "后端覆盖率报告位置:" -ForegroundColor Yellow
    Write-Host "  auth-api/coverage/index.html" -ForegroundColor White
    Write-Host ""
    
    Write-Host "要查看覆盖率报告，请用浏览器打开上述HTML文件" -ForegroundColor Cyan
}

# 主循环
do {
    Show-Menu
    $choice = Read-Host "请输入选项 (1-6)"
    
    switch ($choice) {
        "1" { Run-Frontend-Tests }
        "2" { Run-Backend-Tests }
        "3" { Run-Integration-Tests }
        "4" { Run-All-Tests }
        "5" { Show-Coverage }
        "6" { 
            Write-Host "👋 再见！" -ForegroundColor Green
            exit 0
        }
        default { Write-Host "❌ 无效选项，请重新选择" -ForegroundColor Red }
    }
    
    Write-Host ""
    $continue = Read-Host "是否继续？(y/n)"
} while ($continue -eq "y" -or $continue -eq "Y")

Write-Host "👋 再见！" -ForegroundColor Green