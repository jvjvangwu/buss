# 快速集成测试脚本
# 简化版本，用于快速验证

Write-Host "🚀 快速集成测试" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

# 1. 检查服务状态
Write-Host "`n1. 检查服务状态..." -ForegroundColor Blue

function Test-Service {
    param($Url, $Name)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3 -ErrorAction Stop
        Write-Host "  ✅ $Name 运行正常 (状态: $($response.StatusCode))" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ❌ $Name 未运行: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

$backendOk = Test-Service -Url "http://localhost:3000" -Name "后端服务"
$frontendOk = Test-Service -Url "http://localhost:5173" -Name "前端服务"
$mockApiOk = Test-Service -Url "http://localhost:3001/api/health" -Name "Mock API服务"

# 2. 测试API端点
Write-Host "`n2. 测试API端点..." -ForegroundColor Blue

if ($mockApiOk) {
    # 测试登录API
    try {
        $body = @{
            username = "demo_user"
            password = "demo123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 5
        
        if ($response.success) {
            Write-Host "  ✅ 登录API测试通过" -ForegroundColor Green
            
            # 测试获取用户信息
            $token = $response.data.token
            $userResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" `
                -Method Get `
                -Headers @{Authorization = "Bearer $token"} `
                -TimeoutSec 5
            
            if ($userResponse.success) {
                Write-Host "  ✅ 获取用户信息API测试通过" -ForegroundColor Green
                Write-Host "     用户: $($userResponse.data.user.username)" -ForegroundColor Gray
            } else {
                Write-Host "  ❌ 获取用户信息API测试失败" -ForegroundColor Red
            }
        } else {
            Write-Host "  ❌ 登录API测试失败: $($response.error.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ API测试异常: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠️  跳过API测试，服务未运行" -ForegroundColor Yellow
}

# 3. 总结
Write-Host "`n3. 测试总结" -ForegroundColor Blue
Write-Host "-" * 40 -ForegroundColor Gray

if ($backendOk) {
    Write-Host "✅ 后端服务: 运行正常" -ForegroundColor Green
} else {
    Write-Host "❌ 后端服务: 未运行" -ForegroundColor Red
    Write-Host "   启动命令: cd backend; npm run dev" -ForegroundColor Gray
}

if ($frontendOk) {
    Write-Host "✅ 前端服务: 运行正常" -ForegroundColor Green
} else {
    Write-Host "❌ 前端服务: 未运行" -ForegroundColor Red
    Write-Host "   启动命令: cd frontend; npm run dev" -ForegroundColor Gray
}

if ($mockApiOk) {
    Write-Host "✅ Mock API: 运行正常" -ForegroundColor Green
} else {
    Write-Host "⚠️  Mock API: 未运行" -ForegroundColor Yellow
    Write-Host "   启动命令: cd mock-api; npm start" -ForegroundColor Gray
}

# 4. 建议
Write-Host "`n4. 下一步建议" -ForegroundColor Blue
Write-Host "-" * 40 -ForegroundColor Gray

if (-not $backendOk -and -not $frontendOk -and -not $mockApiOk) {
    Write-Host "📌 建议先启动Mock API进行测试:" -ForegroundColor Cyan
    Write-Host "   1. cd mock-api" -ForegroundColor Gray
    Write-Host "   2. npm install" -ForegroundColor Gray
    Write-Host "   3. npm start" -ForegroundColor Gray
    Write-Host "`n   然后启动前端:" -ForegroundColor Gray
    Write-Host "   1. cd frontend" -ForegroundColor Gray
    Write-Host "   2. npm run dev" -ForegroundColor Gray
} elseif ($mockApiOk -and $frontendOk) {
    Write-Host "🎉 测试环境已就绪！" -ForegroundColor Green
    Write-Host "   前端: http://localhost:5173" -ForegroundColor Gray
    Write-Host "   Mock API: http://localhost:3001" -ForegroundColor Gray
    Write-Host "`n   测试账户:" -ForegroundColor Gray
    Write-Host "   用户名: demo_user" -ForegroundColor Gray
    Write-Host "   密码: demo123" -ForegroundColor Gray
} else {
    Write-Host "🔧 需要启动缺失的服务" -ForegroundColor Yellow
}

Write-Host "`n按任意键退出..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')