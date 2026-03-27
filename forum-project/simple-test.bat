@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 论坛项目集成测试 - 快速检查
echo ========================================
echo.

echo 1. 检查服务状态...
echo.

REM 检查后端服务
echo 检查后端服务 (端口:3000)...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo   ✅ 后端服务正在运行
) else (
    echo   ❌ 后端服务未运行
    echo     启动命令: cd backend ^&^& npm run dev
)

echo.

REM 检查前端服务
echo 检查前端服务 (端口:5173)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo   ✅ 前端服务正在运行
) else (
    echo   ❌ 前端服务未运行
    echo     启动命令: cd frontend ^&^& npm run dev
)

echo.

REM 检查Mock API服务
echo 检查Mock API服务 (端口:3001)...
netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo   ✅ Mock API服务正在运行
) else (
    echo   ⚠️  Mock API服务未运行
    echo     启动命令: cd mock-api ^&^& npm start
)

echo.
echo ========================================
echo 2. 测试建议
echo ========================================
echo.

if not exist "mock-api\server.js" (
    echo 📌 建议:
    echo   1. 首先启动Mock API进行测试
    echo   2. 然后启动前端连接测试
    echo   3. 最后开发后端真实服务
) else (
    echo 📌 当前状态:
    echo   前端代码: 部分完成
    echo   后端代码: 基本未实现
    echo   Mock API: 已准备就绪
)

echo.
echo ========================================
echo 3. 快速启动指南
echo ========================================
echo.

echo 选项A: 使用Mock API测试前端
echo   1. 启动Mock API: cd mock-api ^&^& npm start
echo   2. 启动前端: cd frontend ^&^& npm run dev
echo   3. 访问: http://localhost:5173
echo   4. 测试账户: demo_user / demo123
echo.

echo 选项B: 等待后端开发
echo   1. 完成后端API开发
echo   2. 配置数据库
echo   3. 启动后端: cd backend ^&^& npm run dev
echo   4. 启动前端: cd frontend ^&^& npm run dev
echo.

echo ========================================
echo 测试完成
echo ========================================
echo.

pause