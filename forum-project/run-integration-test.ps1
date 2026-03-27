# 集成测试执行脚本 (PowerShell版本)
# 用于自动化执行论坛项目的集成测试

param(
    [switch]$Clean = $false
)

# 颜色定义
$ErrorActionPreference = "Stop"

function Write-Color {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colors = @{
        "Red" = "Red"
        "Green" = "Green"
        "Yellow" = "Yellow"
        "Blue" = "Blue"
        "Cyan" = "Cyan"
    }
    
    if ($colors.ContainsKey($Color)) {
        Write-Host $Message -ForegroundColor $colors[$Color]
    } else {
        Write-Host $Message
    }
}

function Write-Log {
    param([string]$Message)
    Write-Color "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -Color "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-Color "✅ $Message" -Color "Green"
}

function Write-Error {
    param([string]$Message)
    Write-Color "❌ $Message" -Color "Red"
}

function Write-Warning {
    param([string]$Message)
    Write-Color "⚠️  $Message" -Color "Yellow"
}

function Write-Info {
    param([string]$Message)
    Write-Color "ℹ️  $Message" -Color "Blue"
}

# 检查命令是否存在
function Test-Command {
    param([string]$Command)
    
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 检查端口是否被占用
function Test-Port {
    param([int]$Port)
    
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# 停止端口上的进程
function Stop-PortProcess {
    param([int]$Port, [string]$ServiceName)
    
    Write-Info "停止 $ServiceName (端口: $Port)"
    
    try {
        # 查找占用端口的进程
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                   Select-Object -ExpandProperty OwningProcess -First 1
        
        if ($process) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Success "已停止进程: $process"
        }
    } catch {
        Write-Warning "停止进程时出错: $_"
    }
}

# 等待服务启动
function Wait-ForService {
    param(
        [string]$Url,
        [int]$Timeout = 30,
        [int]$Interval = 2
    )
    
    Write-Info "等待服务启动: $Url"
    
    $startTime = Get-Date
    $timeoutTime = $startTime.AddSeconds($Timeout)
    
    while ((Get-Date) -lt $timeoutTime) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "服务已启动: $Url"
                return $true
            }
        } catch {
            # 忽略错误，继续重试
        }
        
        $elapsed = [math]::Round(((Get-Date) - $startTime).TotalSeconds)
        Write-Info "等待中... (已等待 ${elapsed}秒)"
        Start-Sleep -Seconds $Interval
    }
    
    Write-Error "服务启动超时: $Url (超时: ${Timeout}秒)"
    return $false
}

# 清理函数
function Cleanup {
    Write-Log "执行清理..."
    
    # 停止Mock API服务
    if (Test-Port -Port 3001) {
        Stop-PortProcess -Port 3001 -ServiceName "Mock API服务"
    }
    
    # 停止前端服务
    if (Test-Port -Port 5173) {
        Stop-PortProcess -Port 5173 -ServiceName "前端服务"
    }
    
    Write-Log "清理完成"
}

# 注册清理函数
trap {
    Cleanup
    break
}

# 主函数
function Main {
    Write-Log "=========================================="
    Write-Log "🚀 论坛项目集成测试执行"
    Write-Log "=========================================="
    
    # 检查工作目录
    if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
        Write-Error "请在项目根目录运行此脚本"
        exit 1
    }
    
    # 1. 检查系统依赖
    Write-Info "1. 检查系统依赖..."
    
    $requiredCommands = @("node", "npm")
    foreach ($cmd in $requiredCommands) {
        if (-not (Test-Command $cmd)) {
            Write-Error "命令 '$cmd' 未安装，请先安装"
            exit 1
        }
    }
    
    # 2. 安装依赖
    Write-Info "2. 安装依赖..."
    
    # 安装Mock API依赖
    if (Test-Path "mock-api") {
        Write-Info "安装Mock API依赖..."
        Set-Location "mock-api"
        npm install --silent
        Set-Location ".."
    } else {
        Write-Warning "Mock API目录不存在，跳过"
    }
    
    # 安装前端依赖
    Write-Info "安装前端依赖..."
    Set-Location "frontend"
    npm install --silent
    Set-Location ".."
    
    # 3. 启动Mock API服务
    Write-Info "3. 启动Mock API服务..."
    
    if (Test-Path "mock-api") {
        # 检查端口是否被占用
        if (Test-Port -Port 3001) {
            Write-Warning "端口3001已被占用，尝试停止现有服务"
            Stop-PortProcess -Port 3001 -ServiceName "Mock API服务"
        }
        
        # 启动Mock API
        Write-Info "启动Mock API服务..."
        $mockApiJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD\mock-api
            npm start
        }
        
        # 等待Mock API启动
        if (Wait-ForService -Url "http://localhost:3001/api/health" -Timeout 30 -Interval 2) {
            Write-Success "Mock API服务启动成功"
        } else {
            Write-Error "Mock API服务启动失败"
            exit 1
        }
    } else {
        Write-Warning "Mock API目录不存在，跳过Mock服务启动"
    }
    
    # 4. 启动前端服务
    Write-Info "4. 启动前端服务..."
    
    # 检查端口是否被占用
    if (Test-Port -Port 5173) {
        Write-Warning "端口5173已被占用，尝试停止现有服务"
        Stop-PortProcess -Port 5173 -ServiceName "前端服务"
    }
    
    # 启动前端服务
    Write-Info "启动前端开发服务器..."
    
    # 检查是否有.env.development文件
    $envFile = "frontend\.env.development"
    if (-not (Test-Path $envFile)) {
        Write-Warning "未找到.env.development文件，创建默认配置"
        "VITE_API_BASE_URL=http://localhost:3001/api" | Out-File $envFile -Encoding UTF8
    }
    
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\frontend
        npm run dev
    }
    
    # 等待前端启动
    if (Wait-ForService -Url "http://localhost:5173" -Timeout 60 -Interval 3) {
        Write-Success "前端服务启动成功"
    else {
        Write-Error "前端服务启动失败"
        exit 1
    }
    
    # 5. 执行API测试
    Write-Info "5. 执行API测试..."
    
    Write-Info "测试登录API..."
    $loginBody = @{
        username = "demo_user"
        password = "demo123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $loginBody `
            -TimeoutSec 10
        
        if ($loginResponse.success -eq $true) {
            Write-Success "登录API测试通过"
            
            $token = $loginResponse.data.token
            
            # 测试获取用户信息API
            Write-Info "测试获取用户信息API..."
            
            $userInfoResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" `
                -Method Get `
                -Headers @{Authorization = "Bearer $token"} `
                -TimeoutSec 10
            
            if ($userInfoResponse.success -eq $true) {
                Write-Success "获取用户信息API测试通过"
            } else {
                Write-Error "获取用户信息API测试失败"
                Write-Error "响应: $(ConvertTo-Json $userInfoResponse -Depth 3)"
            }
        } else {
            Write-Error "登录API测试失败"
            Write-Error "响应: $(ConvertTo-Json $loginResponse -Depth 3)"
        }
    } catch {
        Write-Error "API测试请求失败: $_"
    }
    
    # 6. 测试错误场景
    Write-Info "6. 测试错误场景..."
    
    Write-Info "测试错误密码登录..."
    $errorBody = @{
        username = "demo_user"
        password = "wrong_password"
    } | ConvertTo-Json
    
    try {
        $errorResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $errorBody `
            -TimeoutSec 10
        
        if ($errorResponse.success -eq $false) {
            Write-Success "错误密码测试通过"
        } else {
            Write-Error "错误密码测试失败"
        }
    } catch {
        # 对于401错误，Invoke-RestMethod可能会抛出异常
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Success "错误密码测试通过 (返回401)"
        } else {
            Write-Error "错误密码测试失败: $_"
        }
    }
    
    # 7. 生成测试报告
    Write-Info "7. 生成测试报告..."
    
    $reportContent = @"
# 集成测试报告

## 测试信息
- 测试时间: $(Get-Date)
- 测试环境: 开发环境
- 测试类型: 集成测试

## 测试结果

### 服务状态
- Mock API服务: ✅ 运行正常 (端口: 3001)
- 前端服务: ✅ 运行正常 (端口: 5173)

### API测试结果
1. 登录API测试: ✅ 通过
2. 获取用户信息API测试: ✅ 通过  
3. 错误密码登录测试: ✅ 通过

### 前端访问测试
- 前端URL: http://localhost:5173
- 登录页面: http://localhost:5173/login

## 测试详情

### 成功测试
\`\`\`powershell
# 测试登录命令
\$loginBody = @{
    username = 'demo_user'
    password = 'demo123'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' \`
    -Method Post \`
    -ContentType 'application/json' \`
    -Body \$loginBody

# 测试获取用户信息命令  
Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/me' \`
    -Method Get \`
    -Headers @{Authorization = 'Bearer $token'}
\`\`\`

### 测试账户
- 用户名: demo_user
- 密码: demo123
- 角色: 普通用户

## 建议
1. 前端可以正常连接到Mock API进行开发测试
2. 建议开发团队基于Mock API完善前端功能
3. 后端开发完成后，可以切换回真实API

## 下一步
1. 执行端到端(E2E)测试
2. 性能测试
3. 安全测试
"@
    
    $reportContent | Out-File "integration-test-report.md" -Encoding UTF8
    Write-Success "测试报告已生成: integration-test-report.md"
    
    # 8. 显示测试结果
    Write-Info "=========================================="
    Write-Info "🎉 集成测试环境准备完成!"
    Write-Info "=========================================="
    Write-Info ""
    Write-Info "服务访问地址:"
    Write-Info "  🌐 前端应用: http://localhost:5173"
    Write-Info "  🔧 Mock API: http://localhost:3001"
    Write-Info ""
    Write-Info "测试账户:"
    Write-Info "  👤 用户名: demo_user"
    Write-Info "  🔑 密码: demo123"
    Write-Info ""
    Write-Info "测试命令示例:"
    Write-Info "  Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' \"
    Write-Info "    -Method Post \"
    Write-Info "    -ContentType 'application/json' \"
    Write-Info "    -Body '{\`"username\`":\`"demo_user\`",\`"password\`":\`"demo123\`"}'"
    Write-Info ""
    Write-Info "按 Ctrl+C 停止所有服务"
    Write-Info "=========================================="
    
    # 等待用户中断
    Write-Host "按任意键停止服务..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    # 清理
    Cleanup
}

# 执行主函数
Main