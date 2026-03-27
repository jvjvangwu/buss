# 集成测试执行指南

## 概述
本文档指导如何执行论坛项目的集成测试，重点关注用户登录流程的端到端测试。

## 测试环境要求

### 硬件要求
- CPU: 双核以上
- 内存: 4GB以上
- 磁盘空间: 1GB以上

### 软件要求
- Node.js: v18.0.0 或更高版本
- npm: v9.0.0 或更高版本
- PostgreSQL: v12.0 或更高版本 (或使用Docker)
- Git: 版本控制

### 浏览器要求 (E2E测试)
- Chrome: 最新版本
- Firefox: 最新版本
- Edge: 最新版本

## 环境搭建步骤

### 1. 克隆项目
```bash
git clone <项目仓库地址>
cd forum-project
```

### 2. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 数据库设置
#### 选项A: 使用Docker (推荐)
```bash
# 启动PostgreSQL数据库
docker run --name forum-db \
  -e POSTGRES_USER=forum_user \
  -e POSTGRES_PASSWORD=forum_password \
  -e POSTGRES_DB=forum_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### 选项B: 本地安装PostgreSQL
1. 安装PostgreSQL
2. 创建数据库:
```sql
CREATE DATABASE forum_db;
CREATE USER forum_user WITH PASSWORD 'forum_password';
GRANT ALL PRIVILEGES ON DATABASE forum_db TO forum_user;
```

### 4. 环境变量配置
#### 后端环境变量 (.env文件)
在 `backend/.env` 文件中添加:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://forum_user:forum_password@localhost:5432/forum_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### 前端环境变量 (.env文件)
在 `frontend/.env` 文件中添加:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=技术论坛
VITE_APP_ENV=development
```

### 5. 数据库迁移和种子数据
```bash
cd backend

# 运行数据库迁移
npm run migrate:up

# 创建测试数据
npm run seed
```

## 启动服务

### 1. 启动后端服务
```bash
cd backend
npm run dev
```
后端服务将在 http://localhost:3000 启动

### 2. 启动前端服务
```bash
cd frontend
npm run dev
```
前端服务将在 http://localhost:5173 启动

### 3. 验证服务状态
打开浏览器访问:
- 前端: http://localhost:5173
- 后端API: http://localhost:3000/api/health (如果实现)

## 测试执行

### 1. 手动测试
按照 [INTEGRATION_TEST_CASES.md](./INTEGRATION_TEST_CASES.md) 中的测试用例逐一执行。

#### 快速验证步骤:
1. 打开浏览器访问 http://localhost:5173/login
2. 使用测试账户登录:
   - 用户名: `demo_user`
   - 密码: `demo123`
3. 验证登录成功并跳转到首页

### 2. 自动化测试

#### 后端API测试
```bash
cd backend
npm test
```

#### 前端单元测试
```bash
cd frontend
npm test
```

#### E2E测试 (需要安装Playwright)
```bash
cd frontend

# 安装Playwright
npx playwright install

# 运行E2E测试
npm run test:e2e

# 运行带UI的E2E测试
npm run test:e2e:ui
```

### 3. API测试 (使用Postman)
1. 导入Postman集合 (如果提供)
2. 设置环境变量:
   - `base_url`: http://localhost:3000/api
   - `token`: [登录后获取的token]
3. 运行集合测试

## 测试数据

### 预置测试用户
| 用户名 | 密码 | 角色 | 描述 |
|--------|------|------|------|
| demo_user | demo123 | user | 普通测试用户 |
| admin_user | admin123 | admin | 管理员用户 |
| test_user | test123 | user | 另一个测试用户 |

### 测试API端点
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `GET /auth/me` - 获取当前用户信息
- `POST /auth/logout` - 用户登出

## 常见问题排查

### 1. 数据库连接失败
**症状**: 后端启动时报数据库连接错误
**解决方案**:
```bash
# 检查数据库服务是否运行
docker ps | grep postgres

# 或检查本地PostgreSQL服务
sudo systemctl status postgresql

# 验证连接信息
psql -h localhost -U forum_user -d forum_db
```

### 2. 前端无法连接到后端API
**症状**: 前端显示网络错误或CORS错误
**解决方案**:
1. 检查后端CORS配置
2. 验证环境变量 `VITE_API_BASE_URL`
3. 检查后端服务是否运行:
   ```bash
   curl http://localhost:3000/api/health
   ```

### 3. 登录失败
**症状**: 输入正确凭证但登录失败
**解决方案**:
1. 检查数据库种子数据是否创建
2. 验证JWT配置:
   ```bash
   # 检查后端.env文件中的JWT_SECRET
   cat backend/.env | grep JWT
   ```
3. 检查用户密码是否正确加密

### 4. 测试运行失败
**症状**: 自动化测试失败
**解决方案**:
1. 确保测试环境已正确设置
2. 检查测试数据库是否独立:
   ```bash
   # 创建测试数据库
   createdb forum_test
   ```
3. 运行测试前重置数据库:
   ```bash
   cd backend
   npm run test:setup
   ```

## 测试报告

### 生成测试报告
```bash
# 后端测试报告
cd backend
npm run test:coverage

# 前端测试报告
cd frontend
npm run test:coverage

# E2E测试报告
cd frontend
npm run test:e2e:report
```

### 报告位置
- 单元测试覆盖率: `coverage/` 目录
- E2E测试报告: `test-results/` 目录
- API测试报告: `backend/test-reports/` 目录

## 持续集成

### GitHub Actions 示例
```yaml
name: Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: forum_user
          POSTGRES_PASSWORD: forum_password
          POSTGRES_DB: forum_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm test
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
    
    - name: Run E2E tests
      run: |
        cd frontend
        npm run test:e2e
```

## 性能测试

### 使用k6进行负载测试
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // 20个用户持续30秒
    { duration: '1m', target: 50 },   // 50个用户持续1分钟
    { duration: '30s', target: 0 },   // 降为0个用户
  ],
};

export default function () {
  const loginRes = http.post('http://localhost:3000/api/auth/login', {
    username: 'test_user',
    password: 'test123',
  });
  
  check(loginRes, {
    '登录成功': (r) => r.status === 200,
    '响应时间小于500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

运行负载测试:
```bash
k6 run load-test.js
```

## 安全测试

### OWASP ZAP 扫描
```bash
# 启动ZAP
docker run -u zap -p 8080:8080 -i owasp/zap2docker-stable zap.sh -daemon -host 0.0.0.0 -port 8080

# 运行扫描
docker run -u zap -i owasp/zap2docker-stable zap-baseline.py -t http://localhost:5173
```

## 监控和日志

### 后端日志
```bash
# 查看后端日志
cd backend
npm run dev 2>&1 | tee backend.log

# 监控API请求
tail -f backend.log | grep -E "(POST|GET) /api"
```

### 前端日志
浏览器开发者工具中查看:
- Network标签: API请求和响应
- Console标签: JavaScript错误
- Application标签: Storage状态

## 联系和支持

### 遇到问题?
1. 查看项目文档
2. 检查GitHub Issues
3. 联系开发团队

### 紧急联系方式
- 项目经理: [姓名]
- 前端开发: 小A
- 后端开发: 小B
- 测试负责人: [姓名]

---

**最后更新**: 2024年1月
**版本**: 1.0.0