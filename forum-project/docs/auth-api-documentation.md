# 论坛系统用户认证模块 API 文档

## 概述

本文档详细描述了论坛系统的用户认证模块API接口。认证模块负责用户注册、登录、登出、令牌管理和用户信息获取等功能。

**基础URL**: `http://localhost:3000/api`

**认证方式**: Bearer Token (JWT)

## 目录

1. [接口概览](#接口概览)
2. [通用响应格式](#通用响应格式)
3. [错误码说明](#错误码说明)
4. [认证接口](#认证接口)
   - [用户注册](#用户注册)
   - [用户登录](#用户登录)
   - [用户登出](#用户登出)
   - [刷新令牌](#刷新令牌)
   - [获取当前用户信息](#获取当前用户信息)
5. [TypeScript 类型定义](#typescript-类型定义)
6. [使用示例](#使用示例)

## 接口概览

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| POST | `/auth/register` | 用户注册 | 不需要 |
| POST | `/auth/login` | 用户登录 | 不需要 |
| POST | `/auth/logout` | 用户登出 | 需要 |
| POST | `/auth/refresh` | 刷新访问令牌 | 需要刷新令牌 |
| GET  | `/auth/me` | 获取当前用户信息 | 需要 |
| POST | `/auth/forgot-password` | 忘记密码 | 不需要 |
| POST | `/auth/reset-password` | 重置密码 | 需要重置令牌 |
| POST | `/auth/verify-email` | 验证邮箱 | 需要验证令牌 |
| POST | `/auth/resend-verification` | 重新发送验证邮件 | 不需要 |

## 通用响应格式

### 成功响应格式

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 具体数据
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 错误码说明

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `USER_NOT_FOUND` | 404 | 用户不存在 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 |
| `EMAIL_ALREADY_EXISTS` | 409 | 邮箱已注册 |
| `USERNAME_ALREADY_EXISTS` | 409 | 用户名已存在 |
| `TOKEN_EXPIRED` | 401 | 令牌已过期 |
| `TOKEN_INVALID` | 401 | 令牌无效 |
| `INSUFFICIENT_PERMISSIONS` | 403 | 权限不足 |
| `EMAIL_NOT_VERIFIED` | 403 | 邮箱未验证 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁 |
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 |

## 认证接口

### 用户注册

注册新用户账户。

**Endpoint**: `POST /auth/register`

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```typescript
{
  username: string;      // 用户名 (3-20个字符，字母数字下划线)
  email: string;         // 邮箱地址
  password: string;      // 密码 (至少8个字符，包含大小写字母和数字)
  confirmPassword: string; // 确认密码
  agreeToTerms: boolean; // 同意服务条款
}
```

**请求示例**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "agreeToTerms": true
}
```

**响应示例** (成功):
```json
{
  "success": true,
  "message": "注册成功，请查收验证邮件",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "emailVerified": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**响应示例** (失败 - 用户名已存在):
```json
{
  "success": false,
  "message": "用户名已存在",
  "error": {
    "code": "USERNAME_ALREADY_EXISTS",
    "details": "用户名 'john_doe' 已被注册"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 用户登录

用户登录获取访问令牌。

**Endpoint**: `POST /auth/login`

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```typescript
{
  username: string;      // 用户名或邮箱
  password: string;      // 密码
  rememberMe?: boolean;  // 记住登录状态 (可选)
}
```

**请求示例**:
```json
{
  "username": "john_doe",
  "password": "Password123",
  "rememberMe": true
}
```

**响应示例** (成功):
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
      "avatar": "https://example.com/avatars/john_doe.jpg",
      "emailVerified": true,
      "role": "user",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**响应示例** (失败 - 无效凭证):
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

**响应示例** (失败 - 邮箱未验证):
```json
{
  "success": false,
  "message": "请先验证您的邮箱",
  "error": {
    "code": "EMAIL_NOT_VERIFIED",
    "details": "邮箱未验证，请检查您的收件箱"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 用户登出

注销当前用户会话。

**Endpoint**: `POST /auth/logout`

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**请求体**:
```typescript
{
  refreshToken?: string; // 刷新令牌 (可选，用于撤销刷新令牌)
}
```

**请求示例**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例** (成功):
```json
{
  "success": true,
  "message": "登出成功",
  "data": null,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 刷新令牌

使用刷新令牌获取新的访问令牌。

**Endpoint**: `POST /auth/refresh`

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```typescript
{
  refreshToken: string;  // 刷新令牌
}
```

**请求示例**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例** (成功):
```json
{
  "success": true,
  "message": "令牌刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 获取当前用户信息

获取当前认证用户的信息。

**Endpoint**: `GET /auth/me`

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应示例** (成功):
```json
{
  "success": true,
  "message": "获取用户信息成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatars/john_doe.jpg",
    "displayName": "John Doe",
    "bio": "热爱编程的开发者",
    "emailVerified": true,
    "role": "user",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "lastLoginAt": "2024-01-01T12:00:00.000Z",
    "stats": {
      "postCount": 42,
      "commentCount": 156,
      "likeCount": 320
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## TypeScript 类型定义

### 前端类型定义

```typescript
// src/types/auth.ts

// 登录表单数据
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

// 注册表单数据
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// 表单错误
export interface AuthFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  emailVerified: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: {
    postCount: number;
    commentCount: number;
    likeCount: number;
  };
}

// 登录响应
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: User;
}

// 通用API响应
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
  timestamp: string;
}

// 令牌信息
export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 用户统计信息
export interface UserStats {
  postCount: number;
  commentCount: number;
  likeCount: number;
}
```

### 后端类型定义

```typescript
// src/types/auth.types.ts

// 用户实体
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: 'user' | 'moderator' | 'admin';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 登录请求DTO
export interface LoginRequestDto {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 注册请求DTO
export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// 令牌响应DTO
export interface TokenResponseDto {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 用户响应DTO
export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: {
    postCount: number;
    commentCount: number;
    likeCount: number;
  };
}

// JWT载荷
export interface JwtPayload {
  sub: string;           // 用户ID
  username: string;      // 用户名
  email: string;         // 邮箱
  role: string;          // 角色
  iat?: number;          // 签发时间
  exp?: number;          // 过期时间
}

// 刷新令牌请求DTO
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

// 忘记密码请求DTO
export interface ForgotPasswordRequestDto {
  email: string;
}

// 重置密码请求DTO
export interface ResetPasswordRequestDto {
  token: string;
  password: string;
  confirmPassword: string;
}

// 验证邮箱请求DTO
export interface VerifyEmailRequestDto {
  token: string;
}

// 重新发送验证邮件请求DTO
export interface ResendVerificationRequestDto {
  email: string;
}
```

### 请求验证类型

```typescript
// src/validators/auth.validators.ts

import { z } from 'zod';

// 用户名验证规则
export const usernameSchema = z
  .string()
  .min(3, '用户名至少3个字符')
  .max(20, '用户名最多20个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');

// 邮箱验证规则
export const emailSchema = z
  .string()
  .email('请输入有效的邮箱地址')
  .max(100, '邮箱地址最多100个字符');

// 密码验证规则
export const passwordSchema = z
  .string()
  .min(8, '密码至少8个字符')
  .regex(/[a-z]/, '密码必须包含小写字母')
  .regex(/[A-Z]/, '密码必须包含大写字母')
  .regex(/[0-9]/, '密码必须包含数字');

// 登录请求验证
export const loginRequestSchema = z.object({
  username: z.string().min(1, '请输入用户名或邮箱'),
  password: z.string().min(1, '请输入密码'),
  rememberMe: z.boolean().optional().default(false),
});

// 注册请求验证
export const registerRequestSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, '请确认密码'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: '必须同意服务条款',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 刷新令牌请求验证
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, '刷新令牌不能为空'),
});

// 忘记密码请求验证
export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

// 重置密码请求验证
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1, '重置令牌不能为空'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, '请确认密码'),
}).refine(data => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 验证邮箱请求验证
export const verifyEmailRequestSchema = z.object({
  token: z.string().min(1, '验证令牌不能为空'),
});

// 重新发送验证邮件请求验证
export const resendVerificationRequestSchema = z.object({
  email: emailSchema,
});

// 类型推断
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
export type ResendVerificationRequest = z.infer<typeof resendVerificationRequestSchema>;
```

## 使用示例

### 前端使用示例

```typescript
// 登录示例
import { authService } from '../services/authService';

async function handleLogin(username: string, password: string) {
  try {
    const response = await authService.login({
      username,
      password,
      rememberMe: true,
    });
    
    if (response.success) {
      console.log('登录成功', response.user);
      // 跳转到首页
      window.location.href = '/';
    } else {
      console.error('登录失败', response.message);
    }
  } catch (error) {
    console.error('登录异常', error);
  }
}

// 检查登录状态
function checkAuthStatus() {
  if (authService.isAuthenticated()) {
    console.log('用户已登录');
    return true;
  } else {
    console.log('用户未登录');
    return false;
  }
}

// 获取用户信息
async function getUserProfile() {
  try {
    const userInfo = await authService.getUserInfo();
    console.log('用户信息', userInfo);
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败', error);
    return null;
  }
}

// 登出
async function handleLogout() {
  try {
    await authService.logout();
    console.log('登出成功');
    window.location.href = '/login';
  } catch (error) {
    console.error('登出失败', error);
  }
}
```

### 后端使用示例

```typescript
// 登录控制器示例
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserEntity } from '../entities/User';
import { loginRequestSchema } from '../validators/auth.validators';

export const loginController = async (req: Request, res: Response) => {
  try {
    // 验证请求数据
    const validatedData = loginRequestSchema.parse(req.body);
    
    // 查找用户
    const user = await UserEntity.findOne({
      where: [
        { username: validatedData.username },
        { email: validatedData.username }
      ]
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: '提供的凭证无效'
        }
      });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: '提供的凭证无效'
        }
      });
    }
    
    // 检查邮箱是否已验证
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: '请先验证您的邮箱',
        error: {
          code: 'EMAIL_NOT_VERIFIED',
          details: '邮箱未验证，请检查您的收件箱'
        }
      });
    }
    
    // 生成JWT令牌
    const tokenPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });
    
    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
    
    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();
    
    return res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        refreshToken,
        expiresIn: 3600,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '请求参数验证失败',
        error: {
          code: 'VALIDATION_ERROR',
          details: error.errors.map(e => e.message).join(', ')
        }
      });
    }
    
    console.error('登录错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        details: '请稍后重试'
      }
    });
  }
};
```

### 认证中间件示例

```typescript
// 认证中间件
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供认证令牌',
      error: {
        code: 'TOKEN_REQUIRED',
        details: '请先登录'
      }
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: '令牌已过期',
        error: {
          code: 'TOKEN_EXPIRED',
          details: '请重新登录'
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      message: '令牌无效',
      error: {
        code: 'TOKEN_INVALID',
        details: '认证失败'
      }
    });
  }
};

// 角色权限检查中间件
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
        error: {
          code: 'UNAUTHORIZED',
          details: '请先登录'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: `需要角色: ${roles.join(', ')}`
        }
      });
    }
    
    next();
  };
};
```

## 安全考虑

1. **密码安全**:
   - 密码使用bcryptjs进行哈希存储
   - 密码强度要求：至少8位，包含大小写字母和数字
   - 密码重置令牌有效期15分钟

2. **令牌安全**:
   - JWT令牌有效期1小时
   - 刷新令牌有效期7天
   - 使用不同的密钥对访问令牌和刷新令牌进行签名
   - 刷新令牌单次使用，使用后立即失效

3. **速率限制**:
   - 登录接口：每分钟5次
   - 注册接口：每小时10次
   - 密码重置：每小时3次

4. **输入验证**:
   - 使用Zod进行严格的输入验证
   - 防止SQL注入和XSS攻击
   - 邮箱格式和用户名格式验证

5. **会话管理**:
   - 支持"记住我"功能
   - 登出时撤销刷新令牌
   - 支持多设备同时登录

## 部署配置

### 环境变量

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/forum_db

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Redis配置 (用于会话和速率限制)
REDIS_URL=redis://localhost:6379

# 邮件配置 (用于验证和密码重置)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=noreply@forum.com

# 速率限制配置
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# CORS配置
CORS_ORIGIN=http://localhost:5173,https://forum.example.com
```

## 测试用例

### 单元测试示例

```typescript
// auth.controller.test.ts
import request from 'supertest';
import app from '../app';
import { UserEntity } from '../entities/User';

describe('认证API', () => {
  beforeEach(async () => {
    // 清理测试数据
    await UserEntity.clear();
  });

  describe('POST /auth/register', () => {
    it('应该成功注册新用户', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          agreeToTerms: true
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('应该拒绝重复的用户名', async () => {
      // 先创建一个用户
      await UserEntity.create({
        username: 'existinguser',
        email: 'existing@example.com',
        passwordHash: 'hashedpassword'
      }).save();

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'existinguser',
          email: 'new@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          agreeToTerms: true
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USERNAME_ALREADY_EXISTS');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // 创建测试用户
      const user = UserEntity.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('Password123', 10),
        emailVerified: true
      });
      await user.save();
    });

    it('应该成功登录并返回令牌', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'Password123'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.username).toBe('testuser');
    });

    it('应该拒绝错误的密码', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'WrongPassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
```

## 故障排除

### 常见问题

1. **令牌过期**:
   - 症状：收到`TOKEN_EXPIRED`错误
   - 解决方案：使用刷新令牌获取新的访问令牌

2. **邮箱未验证**:
   - 症状：收到`EMAIL_NOT_VERIFIED`错误
   - 解决方案：检查邮箱收件箱，点击验证链接

3. **速率限制**:
   - 症状：收到`RATE_LIMIT_EXCEEDED`错误
   - 解决方案：等待一段时间后重试

4. **跨域问题**:
   - 症状：前端无法访问API
   - 解决方案：检查CORS配置，确保前端域名在白名单中

### 调试日志

启用调试日志查看认证流程：

```bash
# 设置环境变量
export DEBUG=auth:*

# 启动服务器
npm run dev
```

日志示例：
```
[auth:login] 用户 testuser 尝试登录
[auth:login] 密码验证成功
[auth:jwt] 生成令牌，有效期: 1h
[auth:login] 登录成功，用户ID: 123
```

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持用户注册、登录、登出
- 支持JWT令牌认证
- 支持邮箱验证
- 支持密码重置

### v1.1.0 (计划中)
- 支持OAuth第三方登录
- 支持多因素认证
- 支持设备管理
- 支持会话管理

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-01  
**维护者**: API文档团队  
**联系**: api-docs@forum.com