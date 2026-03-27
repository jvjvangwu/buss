# 测试文档

## 概述

本文档描述了论坛系统的测试策略、测试类型和测试执行方法。

## 测试类型

### 1. 前端组件测试
- **框架**: Vitest + React Testing Library
- **位置**: `frontend/src/components/__tests__/`
- **覆盖范围**: React组件、自定义hooks、工具函数
- **示例**: LoginForm组件测试、useLoginForm hook测试

### 2. 后端API测试
- **框架**: Jest + Supertest
- **位置**: `auth-api/src/__tests__/`
- **覆盖范围**: 控制器、中间件、工具函数、验证器
- **示例**: AuthController测试、JWT工具测试

### 3. 集成测试
- **框架**: Jest + Supertest
- **位置**: `auth-api/src/test/integration/`
- **覆盖范围**: 完整的API端点测试，包括数据库交互
- **示例**: 用户注册、登录、认证流程测试

## 测试结构

### 前端测试结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   └── LoginForm.test.tsx
│   │   └── LoginForm.tsx
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   └── useLoginForm.test.ts
│   │   └── useLoginForm.ts
│   ├── pages/
│   │   ├── __tests__/
│   │   │   └── LoginPage.test.tsx
│   │   └── LoginPage.tsx
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── authService.test.ts
│   │   └── authService.ts
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── validation.test.ts
│   │   └── validation.ts
│   └── test/
│       └── setup.ts
├── vitest.config.ts
└── package.json
```

### 后端测试结构
```
auth-api/
├── src/
│   ├── controllers/
│   │   ├── __tests__/
│   │   │   └── auth.controller.test.ts
│   │   └── auth.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── jwt.test.ts
│   │   └── jwt.ts
│   ├── validators/
│   │   ├── __tests__/
│   │   │   └── auth.validator.test.ts
│   │   └── auth.validator.ts
│   └── test/
│       ├── integration/
│       │   └── auth.integration.test.ts
│       ├── setup.ts
│       └── test-server.ts
├── jest.config.js
└── package.json
```

## 测试执行

### 前端测试
```bash
# 进入前端目录
cd forum-project/frontend

# 安装依赖
npm install

# 运行测试
npm test

# 运行测试并查看覆盖率
npm run test:coverage

# 运行测试UI
npm run test:ui

# 监听模式运行测试
npm run test:watch
```

### 后端测试
```bash
# 进入后端目录
cd auth-api

# 安装依赖
npm install

# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行测试并查看覆盖率
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 测试覆盖率

### 前端覆盖率目标
- 组件: ≥80%
- Hooks: ≥90%
- 工具函数: ≥95%
- 服务: ≥85%

### 后端覆盖率目标
- 控制器: ≥85%
- 中间件: ≥80%
- 工具函数: ≥95%
- 验证器: ≥90%

## 测试策略

### 1. 单元测试策略
- 每个函数/方法都有对应的测试
- 测试边界条件和错误情况
- 使用模拟(mocks)隔离依赖
- 测试纯函数和业务逻辑

### 2. 组件测试策略
- 测试组件渲染和用户交互
- 测试组件状态变化
- 测试事件处理
- 使用React Testing Library最佳实践

### 3. 集成测试策略
- 测试完整的API端点
- 测试数据库交互
- 测试认证和授权流程
- 使用真实的HTTP请求

### 4. 端到端测试策略（未来）
- 使用Cypress或Playwright
- 测试完整的用户流程
- 测试跨浏览器兼容性
- 测试性能指标

## 测试数据管理

### 测试数据原则
1. **隔离性**: 每个测试使用独立的数据集
2. **可重复性**: 测试结果不依赖外部状态
3. **简洁性**: 使用最小必要的数据
4. **真实性**: 使用接近生产环境的数据格式

### 测试数据工厂
```typescript
// 示例测试数据工厂
const createTestUser = (overrides = {}) => ({
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123',
  firstName: 'Test',
  lastName: 'User',
  ...overrides,
});
```

## 持续集成

### GitHub Actions配置（示例）
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd forum-project/frontend && npm ci && npm test
      
  test-backend:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd auth-api && npm ci && npm test
```

## 测试最佳实践

### 1. 测试命名约定
- 描述性测试名称
- 使用`describe`和`it`块组织测试
- 遵循"应该(should)"模式

### 2. 测试组织
- 按功能模块组织测试文件
- 使用setup/teardown管理测试状态
- 避免测试间的依赖

### 3. 断言最佳实践
- 使用明确的断言消息
- 测试一个概念每个测试
- 避免过度断言

### 4. 模拟最佳实践
- 只模拟必要的依赖
- 验证模拟的调用
- 使用类型安全的模拟

## 故障排除

### 常见问题

1. **测试超时**
   - 增加测试超时时间
   - 检查异步操作是否完成
   - 避免长时间运行的操作

2. **模拟问题**
   - 确保正确导入模拟模块
   - 检查模拟函数的实现
   - 使用`vi.clearAllMocks()`清理状态

3. **环境问题**
   - 检查环境变量配置
   - 确保测试数据库可用
   - 验证端口未被占用

4. **覆盖率问题**
   - 检查测试路径配置
   - 排除不需要覆盖的文件
   - 使用正确的覆盖率报告器

### 调试技巧
```bash
# 前端测试调试
npm test -- --no-coverage --verbose

# 后端测试调试
npm test -- --verbose

# 运行单个测试文件
npm test -- path/to/test/file.test.ts
```

## 未来改进

### 短期改进
1. 增加更多的集成测试
2. 添加快照测试
3. 实现测试数据工厂

### 长期改进
1. 实现端到端测试
2. 添加性能测试
3. 实现负载测试
4. 添加安全测试

## 相关文档

- [Vitest文档](https://vitest.dev/)
- [Jest文档](https://jestjs.io/)
- [React Testing Library文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest文档](https://github.com/visionmedia/supertest)