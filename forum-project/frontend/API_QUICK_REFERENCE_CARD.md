# API快速参考卡片 - 用户认证

## 📋 基础信息
- **基础URL**: `http://localhost:3000/api`
- **认证方式**: `Authorization: Bearer <token>`
- **内容类型**: `application/json`

## 🔐 登录接口
```http
POST /auth/login
```

### 请求体
```json
{
  "username": "用户名或邮箱",
  "password": "密码",
  "rememberMe": false
}
```

### 成功响应
```json
{
  "success": true,
  "data": {
    "token": "访问令牌",
    "refreshToken": "刷新令牌",
    "expiresIn": 3600,
    "user": { /* 用户信息 */ }
  }
}
```

### 前端代码示例
```typescript
// 登录函数
async function login(username: string, password: string, rememberMe: boolean) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, rememberMe })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // 存储令牌
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', data.data.token);
    storage.setItem('refreshToken', data.data.refreshToken);
    storage.setItem('user', JSON.stringify(data.data.user));
    
    return data.data.user;
  }
  
  throw new Error(data.message);
}
```

## 👤 获取用户信息
```http
GET /auth/me
Authorization: Bearer <token>
```

### 响应
```json
{
  "success": true,
  "data": {
    "id": "用户ID",
    "username": "用户名",
    "email": "邮箱",
    "avatar": "头像URL",
    "emailVerified": true
  }
}
```

## 🔄 刷新令牌
```http
POST /auth/refresh
```

### 请求体
```json
{
  "refreshToken": "刷新令牌"
}
```

### 响应
```json
{
  "success": true,
  "data": {
    "token": "新访问令牌",
    "refreshToken": "新刷新令牌",
    "expiresIn": 3600
  }
}
```

## 🚪 登出
```http
POST /auth/logout
Authorization: Bearer <token>
```

## ⚠️ 错误码速查
| 错误码 | 含义 | 处理建议 |
|--------|------|----------|
| `INVALID_CREDENTIALS` | 用户名或密码错误 | 检查输入，提供重试 |
| `EMAIL_NOT_VERIFIED` | 邮箱未验证 | 提示验证邮箱 |
| `TOKEN_EXPIRED` | 令牌过期 | 自动刷新令牌 |
| `TOKEN_INVALID` | 令牌无效 | 重新登录 |
| `RATE_LIMIT_EXCEEDED` | 请求过于频繁 | 等待后重试 |

## 🛠️ Axios配置
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 自动添加令牌
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 自动刷新令牌
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // 处理令牌过期
      await refreshToken();
      // 重试请求
    }
    return Promise.reject(error);
  }
);
```

## 📝 TypeScript类型
```typescript
// 用户类型
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  emailVerified: boolean;
}

// 登录请求
interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// API响应
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}
```

## 🎯 快速开始步骤
1. **安装axios**: `npm install axios`
2. **配置API客户端**: 使用上面的Axios配置
3. **实现登录页面**: 调用`/auth/login`接口
4. **存储令牌**: 根据`rememberMe`选择存储方式
5. **添加认证头**: 自动为请求添加`Authorization`头
6. **处理令牌过期**: 配置自动刷新

## 📞 紧急联系人
- **后端API问题**: backend-agent-1
- **文档问题**: API文档专家
- **前端实现问题**: frontend-agent-1

---

**版本**: 1.0  
**最后更新**: 2024-01-01  
**状态**: ✅ 已验证可用