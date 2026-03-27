#!/bin/bash

# 论坛系统测试脚本

echo "========================================"
echo "       论坛系统测试脚本"
echo "========================================"
echo ""

# 检查是否安装了必要的工具
check_command() {
    command -v $1 >/dev/null 2>&1
}

# 检查Node.js
if ! check_command "node"; then
    echo "❌ 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm
if ! check_command "npm"; then
    echo "❌ 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 主菜单
show_menu() {
    echo "请选择测试类型："
    echo "1. 前端测试 (React组件测试)"
    echo "2. 后端测试 (API测试)"
    echo "3. 集成测试"
    echo "4. 运行所有测试"
    echo "5. 查看测试覆盖率"
    echo "6. 退出"
    echo ""
}

# 运行前端测试
run_frontend_tests() {
    echo "🚀 运行前端测试..."
    echo ""
    
    local frontend_path="frontend"
    
    if [ ! -d "$frontend_path" ]; then
        echo "❌ 前端目录不存在: $frontend_path"
        return
    fi
    
    cd "$frontend_path"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装前端依赖..."
        npm ci
    fi
    
    echo "🧪 运行前端单元测试..."
    npm test
    
    if [ $? -ne 0 ]; then
        echo "❌ 前端测试失败"
    else
        echo "✅ 前端测试通过"
    fi
    
    cd ..
}

# 运行后端测试
run_backend_tests() {
    echo "🚀 运行后端测试..."
    echo ""
    
    local backend_path="../auth-api"
    
    if [ ! -d "$backend_path" ]; then
        echo "❌ 后端目录不存在: $backend_path"
        return
    fi
    
    cd "$backend_path"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装后端依赖..."
        npm ci
    fi
    
    echo "🧪 运行后端单元测试..."
    npm test
    
    if [ $? -ne 0 ]; then
        echo "❌ 后端测试失败"
    else
        echo "✅ 后端测试通过"
    fi
    
    cd - > /dev/null
}

# 运行集成测试
run_integration_tests() {
    echo "🚀 运行集成测试..."
    echo ""
    
    local backend_path="../auth-api"
    
    if [ ! -d "$backend_path" ]; then
        echo "❌ 后端目录不存在: $backend_path"
        return
    fi
    
    cd "$backend_path"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装后端依赖..."
        npm ci
    fi
    
    echo "🔗 运行集成测试..."
    npm run test:integration
    
    if [ $? -ne 0 ]; then
        echo "❌ 集成测试失败"
    else
        echo "✅ 集成测试通过"
    fi
    
    cd - > /dev/null
}

# 运行所有测试
run_all_tests() {
    echo "🚀 运行所有测试..."
    echo ""
    
    run_frontend_tests
    echo ""
    
    run_backend_tests
    echo ""
    
    run_integration_tests
    echo ""
    
    echo "========================================"
    echo "       所有测试完成"
    echo "========================================"
}

# 查看测试覆盖率
show_coverage() {
    echo "📊 查看测试覆盖率..."
    echo ""
    
    echo "前端覆盖率报告位置:"
    echo "  forum-project/frontend/coverage/index.html"
    echo ""
    
    echo "后端覆盖率报告位置:"
    echo "  auth-api/coverage/index.html"
    echo ""
    
    echo "要查看覆盖率报告，请用浏览器打开上述HTML文件"
}

# 主循环
while true; do
    show_menu
    read -p "请输入选项 (1-6): " choice
    
    case $choice in
        1) run_frontend_tests ;;
        2) run_backend_tests ;;
        3) run_integration_tests ;;
        4) run_all_tests ;;
        5) show_coverage ;;
        6) 
            echo "👋 再见！"
            exit 0
            ;;
        *) echo "❌ 无效选项，请重新选择" ;;
    esac
    
    echo ""
    read -p "是否继续？(y/n): " continue
    if [[ ! $continue =~ ^[Yy]$ ]]; then
        echo "👋 再见！"
        break
    fi
done