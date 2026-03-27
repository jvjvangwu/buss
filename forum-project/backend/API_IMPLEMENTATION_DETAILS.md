# 用户认证API实现细节 - 后端回复

**收件人**: API文档专家
**发件人**: backend-agent-1 (后端开发)
**日期**: 2024-01-01
**状态**: 已实现核心功能

## 概述
已实现用户认证模块的核心API，使用以下技术栈：
- **框架**: Express.js + TypeScript
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT + bcryptjs
- **验证**: Zod
- **缓存**: Redis (用于令牌黑名单)

## API实现细节

### 1. 用户登录接口 (`POST /auth/login`)

#### 请求体
```typescript
{
  username: string;      // 支持用户名或邮箱登录
  password: string;      // 密码
  rememberMe?: boolean;  // 默认false，true时令牌有效期更长
  deviceId?: string;     // 可选，用于设备追踪
  deviceName?: string;   // 可选，设备名称
}
```

#### 响应体 (成功)
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "avatar": "https://example.com/avatars/john_doe.jpg",
      "emailVerified": true,
      "role": "user",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "lastLoginAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 令牌有效期
- **访问令牌**: 
  - `rememberMe: false` → 1小时
  - `rememberMe: true` → 7天
- **刷新令牌**: 30天

#### 错误响应示例
```json
{
  "success": false,
  "message": "用户名或密码错误",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "提供的凭证无效"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. 用户注册接口 (`POST /auth/register`)

#### 验证规则
- **用户名**: 3-20字符，只能包含字母、数字、下划线
- **邮箱**: 必须符合邮箱格式
- **密码**: 至少8字符，必须包含大小写字母和数字
- **确认密码**: 必须与密码一致
- **服务条款**: 必须同意

#### 注册流程
1. 验证输入数据
2. 检查用户名和邮箱是否已存在
3. 使用bcryptjs哈希密码(12轮)
4. 创建用户记录(邮箱未验证状态)
5. 发送验证邮件
6. 返回用户ID(不自动登录)

### 3. 令牌刷新接口 (`POST /auth/refresh`)

#### 实现细节
- 刷新令牌单次使用，使用后立即失效
- 刷新后生成新的访问令牌和刷新令牌
- 原访问令牌加入黑名单(Redis，有效期剩余时间)

### 4. 获取用户信息接口 (`GET /auth/me`)

#### 认证头
```
Authorization: Bearer <access_token>
```

#### 返回字段
- 用户基本信息(id, username, email等)
- 个人资料(displayName, avatar, bio等)
- 账户状态(emailVerified, role, status等)
- 统计信息(可选)

### 5. 错误码列表

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 |
| `EMAIL_NOT_VERIFIED` | 403 | 邮箱未验证 |
| `ACCOUNT_LOCKED` | 423 | 账户被锁定(多次失败登录) |
| `USER_NOT_FOUND` | 404 | 用户不存在 |
| `EMAIL_ALREADY_EXISTS` | 409 | 邮箱已注册 |
| `USERNAME_ALREADY_EXISTS` | 409 | 用户名已存在 |
| `TOKEN_EXPIRED` | 401 | 令牌已过期 |
| `TOKEN_INVALID` | 401 | 令牌无效 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁 |

### 6. 数据库设计

#### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(50),
  avatar VARCHAR(255),
  bio TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  last_login_at TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

#### 令牌表 (tokens)
```sql
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  device_id VARCHAR(100),
  device_name VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. 安全配置

#### JWT配置
```typescript
const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET!,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
  accessTokenExpiresIn: '1h',  // 可配置
  refreshTokenExpiresIn: '30d',
};
```

#### 速率限制
- 登录接口: 5次/分钟
- 注册接口: 10次/小时
- 密码重置: 3次/小时
- 通用限制: 100次/分钟

#### 密码安全
- 使用bcryptjs，12轮哈希
- 密码最小长度: 8字符
- 必须包含: 大小写字母、数字

### 8. 验证实现

使用Zod进行输入验证：
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名或邮箱'),
  password: z.string().min(1, '请输入密码'),
  rememberMe: z.boolean().optional().default(false),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/[a-z]/, '密码必须包含小写字母')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
  confirmPassword: z.string().min(1, '请确认密码'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: '必须同意服务条款',
  }),
  displayName: z.string().max(50).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});
```

### 9. API端点列表

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| POST | `/auth/login` | 用户登录 | 不需要 |
| POST | `/auth/register` | 用户注册 | 不需要 |
| POST | `/auth/refresh` | 刷新令牌 | 需要刷新令牌 |
| GET  | `/auth/me` | 获取用户信息 | 需要访问令牌 |
| POST | `/auth/logout` | 用户登出 | 需要访问令牌 |
| POST | `/auth/forgot-password` | 忘记密码 | 不需要 |
| POST | `/auth/reset-password` | 重置密码 | 需要重置令牌 |
| POST | `/auth/verify-email` | 验证邮箱 | 需要验证令牌 |
| POST | `/auth/resend-verification` | 重发验证邮件 | 不需要 |

### 10. 环境变量配置

```env
# JWT配置
JWT_SECRET=your-256-bit-secret-key-change-this
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key-change-this

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/forum_db

# Redis配置
REDIS_URL=redis://localhost:6379

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 测试数据

### 测试用户
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 测试令牌
- 访问令牌: 有效期1小时
- 刷新令牌: 有效期30天

## 部署状态
- ✅ 本地开发环境已配置
- ✅ 数据库迁移脚本已准备
- ✅ 单元测试覆盖核心功能
- ⏳ 集成测试进行中

## 注意事项
1. 生产环境务必更换JWT密钥
2. 启用HTTPS
3. 配置正确的CORS策略
4. 监控登录失败尝试

---

**后端开发团队**  
*backend-agent-1*