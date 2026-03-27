# 论坛系统用户认证模块 API 文档

## 文档概述

本目录包含论坛系统用户认证模块的完整API文档，为开发人员提供详细的接口说明、使用示例和类型定义。

## 文档结构

### 1. 完整API文档
- **文件**: `auth-api-documentation.md`
- **内容**: 详细的API接口说明，包含：
  - 接口概览和描述
  - 请求/响应格式
  - 错误码说明
  - TypeScript类型定义
  - 使用示例
  - 安全考虑
  - 测试用例
- **用途**: 开发参考、API设计文档

### 2. 快速参考文档
- **文件**: `auth-api-quick-reference.md`
- **内容**: 简洁的API速查表，包含：
  - 接口速查表
  - HTTP状态码参考
  - 错误码速查
  - 请求示例 (cURL、JavaScript、TypeScript)
  - 速率限制说明
- **用途**: 快速查阅、开发调试

### 3. OpenAPI规范
- **文件**: `auth-openapi-spec.yaml`
- **内容**: 符合OpenAPI 3.0规范的API定义，包含：
  - 完整的路径定义
  - 请求/响应模式
  - 安全方案
  - 组件定义
  - 示例数据
- **用途**: API测试、客户端代码生成、文档生成

### 4. TypeScript类型定义
- **文件**: `../backend/src/types/auth.types.ts`
- **内容**: 完整的TypeScript类型定义，包含：
  - 基础类型和接口
  - 请求/响应DTO
  - 枚举类型
  - 工具类型
- **用途**: TypeScript项目类型安全、代码提示

## 核心功能

### 认证功能
1. **用户注册** - 创建新用户账户
2. **用户登录** - 获取访问令牌
3. **用户登出** - 终止当前会话
4. **令牌刷新** - 更新访问令牌
5. **邮箱验证** - 验证用户邮箱
6. **密码管理** - 忘记密码和重置密码

### 用户管理
1. **获取用户信息** - 获取当前用户详情
2. **更新个人资料** - 修改用户信息
3. **会话管理** - 查看和管理活跃会话

## 技术栈

### 后端技术
- **运行时**: Node.js (>=18.0.0)
- **框架**: Express.js
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT (JSON Web Tokens)
- **验证**: Zod
- **缓存**: Redis
- **邮件**: Nodemailer

### 前端技术
- **HTTP客户端**: Axios
- **状态管理**: 本地存储 (localStorage/sessionStorage)
- **类型安全**: TypeScript

## 快速开始

### 1. 环境设置
```bash
# 克隆项目
git clone <repository-url>
cd forum-project

# 安装依赖
cd backend
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库、JWT密钥等
```

### 2. 启动开发服务器
```bash
# 启动后端服务器
cd backend
npm run dev

# 启动前端开发服务器
cd frontend
npm run dev
```

### 3. API测试
```bash
# 使用cURL测试登录接口
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234"}'
```

## 认证流程

### 1. 用户注册流程
```
用户提交注册信息 → 验证输入 → 创建用户记录 → 发送验证邮件 → 返回注册结果
```

### 2. 用户登录流程
```
用户提交凭证 → 验证凭证 → 检查账户状态 → 生成JWT令牌 → 返回令牌和用户信息
```

### 3. 令牌刷新流程
```
客户端提交刷新令牌 → 验证刷新令牌 → 生成新访问令牌 → 返回新令牌
```

### 4. 密码重置流程
```
用户请求密码重置 → 发送重置邮件 → 用户点击重置链接 → 验证重置令牌 → 更新密码
```

## 安全特性

### 1. 密码安全
- 使用bcryptjs进行密码哈希
- 密码强度策略 (至少8位，包含大小写字母和数字)
- 密码重置令牌有效期15分钟

### 2. 令牌安全
- JWT访问令牌有效期1小时
- 刷新令牌有效期7天
- 使用不同密钥签名访问令牌和刷新令牌
- 刷新令牌单次使用

### 3. 速率限制
- 登录接口: 5次/分钟
- 注册接口: 10次/小时
- 密码重置: 3次/小时
- 常规接口: 100次/分钟

### 4. 输入验证
- 使用Zod进行严格验证
- 防止SQL注入和XSS攻击
- 邮箱格式和用户名格式验证

## 错误处理

### 错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息",
    "field": "字段名 (可选)"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 常见错误码
| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 |
| `TOKEN_EXPIRED` | 401 | 令牌已过期 |
| `EMAIL_NOT_VERIFIED` | 403 | 邮箱未验证 |
| `USER_NOT_FOUND` | 404 | 用户不存在 |
| `USERNAME_ALREADY_EXISTS` | 409 | 用户名已存在 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁 |

## 客户端集成

### 前端集成示例
```typescript
// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 添加请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 添加响应拦截器 (处理令牌过期)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 处理令牌过期
      await refreshToken();
      // 重试原始请求
    }
    return Promise.reject(error);
  }
);
```

### 令牌存储策略
```typescript
// 存储令牌
function storeTokens(token: string, refreshToken: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
}

// 清除令牌
function clearTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
}
```

## 测试

### 单元测试
```bash
# 运行测试
cd backend
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### 集成测试
```bash
# 使用Postman或类似工具测试API
# 导入 Postman 集合 (可从 docs/postman-collection.json 导入)
```

## 部署

### 生产环境配置
```env
# 服务器配置
NODE_ENV=production
PORT=3000

# 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT配置
JWT_SECRET=your-strong-jwt-secret-key
JWT_REFRESH_SECRET=your-strong-jwt-refresh-secret-key

# Redis配置
REDIS_URL=redis://host:6379

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Docker部署
```dockerfile
# Dockerfile 示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 监控和日志

### 日志配置
```typescript
// 使用Winston进行日志记录
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 监控指标
- 认证成功率/失败率
- 令牌使用情况
- 用户活跃度
- 错误率统计

## 更新和维护

### 版本管理
- 使用语义化版本控制 (SemVer)
- 维护变更日志 (CHANGELOG.md)
- 向后兼容性保证

### 文档更新
1. 更新API文档时，同步更新所有相关文档
2. 更新TypeScript类型定义
3. 更新OpenAPI规范
4. 更新测试用例

## 支持

### 问题报告
- GitHub Issues: [项目Issues页面]
- 邮件支持: api-support@forum.com
- 文档问题: 提交到 `docs/` 目录的PR

### 社区支持
- 论坛: [社区论坛链接]
- Discord: [Discord服务器链接]
- Stack Overflow: 使用标签 `forum-api`

## 贡献指南

### 代码贡献
1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

### 文档贡献
1. 检查现有文档
2. 更新相关文件
3. 确保格式一致
4. 提交PR

### 测试贡献
1. 编写测试用例
2. 确保测试通过
3. 维护测试覆盖率

## 许可证

本项目基于 [MIT许可证](LICENSE) 发布。

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-01  
**维护团队**: API文档团队  
**联系**: docs@forum.com