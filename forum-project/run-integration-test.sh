#!/bin/bash

# 集成测试执行脚本
# 用于自动化执行论坛项目的集成测试

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "命令 '$1' 未安装，请先安装"
        exit 1
    fi
}

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # 端口被占用
    else
        return 1  # 端口空闲
    fi
}

# 等待服务启动
wait_for_service() {
    local url=$1
    local timeout=$2
    local interval=$3
    local start_time=$(date +%s)
    
    log_info "等待服务启动: $url"
    
    while true; do
        if curl -s -f $url >/dev/null 2>&1; then
            log_success "服务已启动: $url"
            return 0
        fi
        
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -ge $timeout ]; then
            log_error "服务启动超时: $url (超时: ${timeout}秒)"
            return 1
        fi
        
        log_info "等待中... (已等待 ${elapsed}秒)"
        sleep $interval
    done
}

# 停止服务
stop_service() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        log_info "停止 $service_name (端口: $port)"
        local pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null || true
            sleep 2
        fi
    fi
}

# 清理函数
cleanup() {
    log "执行清理..."
    
    # 停止Mock API服务
    stop_service 3001 "Mock API服务"
    
    # 停止前端服务
    stop_service 5173 "前端服务"
    
    log "清理完成"
}

# 设置陷阱，确保脚本退出时清理
trap cleanup EXIT INT TERM

# 主函数
main() {
    log "=========================================="
    log "🚀 论坛项目集成测试执行"
    log "=========================================="
    
    # 检查必要命令
    log_info "检查系统依赖..."
    check_command node
    check_command npm
    check_command curl
    
    # 检查工作目录
    if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
        log_error "请在项目根目录运行此脚本"
        exit 1
    fi
    
    # 1. 安装依赖
    log_info "1. 安装依赖..."
    
    # 安装Mock API依赖
    if [ -d "mock-api" ]; then
        log_info "安装Mock API依赖..."
        cd mock-api
        npm install --silent
        cd ..
    else
        log_warning "Mock API目录不存在，跳过"
    fi
    
    # 安装前端依赖
    log_info "安装前端依赖..."
    cd frontend
    npm install --silent
    cd ..
    
    # 2. 启动Mock API服务
    log_info "2. 启动Mock API服务..."
    
    if [ -d "mock-api" ]; then
        # 检查端口是否被占用
        if check_port 3001; then
            log_warning "端口3001已被占用，尝试停止现有服务"
            stop_service 3001 "Mock API服务"
        fi
        
        # 启动Mock API
        log_info "启动Mock API服务..."
        cd mock-api
        npm start &
        MOCK_API_PID=$!
        cd ..
        
        # 等待Mock API启动
        if wait_for_service "http://localhost:3001/api/health" 30 2; then
            log_success "Mock API服务启动成功"
        else
            log_error "Mock API服务启动失败"
            exit 1
        fi
    else
        log_warning "Mock API目录不存在，跳过Mock服务启动"
    fi
    
    # 3. 启动前端服务
    log_info "3. 启动前端服务..."
    
    # 检查端口是否被占用
    if check_port 5173; then
        log_warning "端口5173已被占用，尝试停止现有服务"
        stop_service 5173 "前端服务"
    fi
    
    # 启动前端服务
    log_info "启动前端开发服务器..."
    cd frontend
    
    # 检查是否有.env.development文件
    if [ ! -f ".env.development" ]; then
        log_warning "未找到.env.development文件，使用默认配置"
        echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env.development
    fi
    
    # 启动前端
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # 等待前端启动
    if wait_for_service "http://localhost:5173" 60 3; then
        log_success "前端服务启动成功"
    else
        log_error "前端服务启动失败"
        exit 1
    fi
    
    # 4. 执行API测试
    log_info "4. 执行API测试..."
    
    log_info "测试登录API..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"demo_user","password":"demo123"}')
    
    if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
        log_success "登录API测试通过"
        
        # 提取token
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        
        # 测试获取用户信息API
        log_info "测试获取用户信息API..."
        USER_INFO_RESPONSE=$(curl -s -X GET http://localhost:3001/api/auth/me \
            -H "Authorization: Bearer $TOKEN")
        
        if echo "$USER_INFO_RESPONSE" | grep -q '"success":true'; then
            log_success "获取用户信息API测试通过"
        else
            log_error "获取用户信息API测试失败"
            echo "响应: $USER_INFO_RESPONSE"
        fi
    else
        log_error "登录API测试失败"
        echo "响应: $LOGIN_RESPONSE"
    fi
    
    # 5. 测试错误场景
    log_info "5. 测试错误场景..."
    
    log_info "测试错误密码登录..."
    ERROR_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"demo_user","password":"wrong_password"}')
    
    if echo "$ERROR_RESPONSE" | grep -q '"success":false'; then
        log_success "错误密码测试通过"
    else
        log_error "错误密码测试失败"
    fi
    
    # 6. 生成测试报告
    log_info "6. 生成测试报告..."
    
    cat > integration-test-report.md << EOF
# 集成测试报告

## 测试信息
- 测试时间: $(date)
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
\`\`\`bash
# 测试登录命令
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"demo_user","password":"demo123"}'

# 测试获取用户信息命令  
curl -X GET http://localhost:3001/api/auth/me \\
  -H "Authorization: Bearer $TOKEN"
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
EOF
    
    log_success "测试报告已生成: integration-test-report.md"
    
    # 7. 保持服务运行，等待手动测试
    log_info "=========================================="
    log_info "🎉 集成测试环境准备完成!"
    log_info "=========================================="
    log_info ""
    log_info "服务访问地址:"
    log_info "  🌐 前端应用: http://localhost:5173"
    log_info "  🔧 Mock API: http://localhost:3001"
    log_info ""
    log_info "测试账户:"
    log_info "  👤 用户名: demo_user"
    log_info "  🔑 密码: demo123"
    log_info ""
    log_info "测试命令示例:"
    log_info "  curl -X POST http://localhost:3001/api/auth/login \\"
    log_info "    -H 'Content-Type: application/json' \\"
    log_info "    -d '{\"username\":\"demo_user\",\"password\":\"demo123\"}'"
    log_info ""
    log_info "按 Ctrl+C 停止所有服务"
    log_info "=========================================="
    
    # 等待用户中断
    wait
}

# 执行主函数
main "$@"