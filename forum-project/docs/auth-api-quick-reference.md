# 用户认证模块 API 快速参考

## 基础信息

- **基础URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`

## 接口速查表

### 1. 用户注册
- **方法**: `POST`
- **路径**: `/auth/register`
- **认证**: 不需要
- **请求体**:
  ```json
  {
    "username": "string (3-20字符)",
    "email": "string (有效邮箱)",
    "password": "string (至少8字符)",
    "confirmPassword": "string",
    "agreeToTerms": "boolean"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "注册成功，请查收验证邮件",
    "data": { "userId": "uuid", "username": "string", "email": "string" }
  }
  ```

### 2. 用户登录
- **方法**: `POST`
- **路径**: `/auth/login`
- **认证**: 不需要
- **请求体**:
  ```json
  {
    "username": "string (用户名或邮箱)",
    "password": "string",
    "rememberMe": "boolean (可选)"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "token": "jwt_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 3600,
      "user": { /* 用户信息 */ }
    }
  }
  ```

### 3. 用户登出
- **方法**: `POST`
- **路径**: `/auth/logout`
- **认证**: 需要 (Bearer Token)
- **请求头**: `Authorization: Bearer <token>`
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "登出成功",
    "data": null
  }
  ```

### 4. 刷新令牌
- **方法**: `POST`
- **路径**: `/auth/refresh`
- **认证**: 需要刷新令牌
- **请求体**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "令牌刷新成功",
    "data": {
      "token": "new_jwt_token",
      "refreshToken": "new_jwt_refresh_token",
      "expiresIn": 3600
    }
  }
  ```

### 5. 获取用户信息
- **方法**: `GET`
- **路径**: `/auth/me`
- **认证**: 需要 (Bearer Token)
- **请求头**: `Authorization: Bearer <token>`
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "获取用户信息成功",
    "data": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "avatar": "string (可选)",
      "role": "user|moderator|admin"
    }
  }
  ```

### 6. 忘记密码
- **方法**: `POST`
- **路径**: `/auth/forgot-password`
- **认证**: 不需要
- **请求体**:
  ```json
  {
    "email": "string (有效邮箱)"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "密码重置邮件已发送",
    "data": null
  }
  ```

### 7. 重置密码
- **方法**: `POST`
- **路径**: `/auth/reset-password`
- **认证**: 需要重置令牌
- **请求体**:
  ```json
  {
    "token": "string (重置令牌)",
    "password": "string (新密码)",
    "confirmPassword": "string"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "密码重置成功",
    "data": null
  }
  ```

### 8. 验证邮箱
- **方法**: `POST`
- **路径**: `/auth/verify-email`
- **认证**: 需要验证令牌
- **请求体**:
  ```json
  {
    "token": "string (验证令牌)"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "邮箱验证成功",
    "data": null
  }
  ```

### 9. 重新发送验证邮件
- **方法**: `POST`
- **路径**: `/auth/resend-verification`
- **认证**: 不需要
- **请求体**:
  ```json
  {
    "email": "string (有效邮箱)"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "验证邮件已重新发送",
    "data": null
  }
  ```

## HTTP 状态码参考

| 状态码 | 描述 | 常见场景 |
|--------|------|----------|
| 200 | 成功 | 请求成功完成 |
| 201 | 已创建 | 用户注册成功 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未授权 | 令牌无效或过期 |
| 403 | 禁止访问 | 权限不足或邮箱未验证 |
| 404 | 未找到 | 用户不存在 |
| 409 | 冲突 | 用户名或邮箱已存在 |
| 429 | 请求过多 | 超过速率限制 |
| 500 | 服务器错误 | 服务器内部错误 |

## 错误码速查

| 错误码 | HTTP状态码 | 描述 | 解决方案 |
|--------|------------|------|----------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 | 检查请求参数格式 |
| `USER_NOT_FOUND` | 404 | 用户不存在 | 检查用户名或邮箱 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 | 检查登录凭证 |
| `EMAIL_ALREADY_EXISTS` | 409 | 邮箱已注册 | 使用其他邮箱或找回密码 |
| `USERNAME_ALREADY_EXISTS` | 409 | 用户名已存在 | 选择其他用户名 |
| `TOKEN_EXPIRED` | 401 | 令牌已过期 | 使用刷新令牌获取新令牌 |
| `TOKEN_INVALID` | 401 | 令牌无效 | 重新登录获取新令牌 |
| `INSUFFICIENT_PERMISSIONS` | 403 | 权限不足 | 联系管理员提升权限 |
| `EMAIL_NOT_VERIFIED` | 403 | 邮箱未验证 | 检查邮箱并点击验证链接 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁 | 等待一段时间后重试 |

## 请求示例

### cURL 示例

```bash
# 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password123"}'

# 获取用户信息 (需要令牌)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 刷新令牌
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### JavaScript Fetch 示例

```javascript
// 登录函数
async function login(username, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      rememberMe: true,
    }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // 存储令牌
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
}

// 获取用户信息函数
async function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// 刷新令牌函数
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // 更新存储的令牌
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return data.data;
  } else {
    // 刷新失败，需要重新登录
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw new Error(data.message);
  }
}
```

### TypeScript Axios 示例

```typescript
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器 (添加令牌)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 (处理令牌过期)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是401错误且不是刷新令牌请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 尝试刷新令牌
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await axios.post(
          'http://localhost:3000/api/auth/refresh',
          { refreshToken }
        );
        
        if (refreshResponse.data.success) {
          // 存储新令牌
          localStorage.setItem('token', refreshResponse.data.data.token);
          localStorage.setItem('refreshToken', refreshResponse.data.data.refreshToken);
          
          // 更新原始请求的Authorization头
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.token}`;
          
          // 重新发送原始请求
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除令牌并重定向到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API调用示例
export const authAPI = {
  login: (data: { username: string; password: string; rememberMe?: boolean }) =>
    api.post('/auth/login', data),
  
  register: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string; confirmPassword: string }) =>
    api.post('/auth/reset-password', data),
};
```

## 速率限制

| 接口 | 限制规则 | 说明 |
|------|----------|------|
| `/auth/login` | 5次/分钟 | 防止暴力破解 |
| `/auth/register` | 10次/小时 | 防止垃圾注册 |
| `/auth/forgot-password` | 3次/小时 | 防止邮件轰炸 |
| `/auth/resend-verification` | 3次/小时 | 防止邮件轰炸 |
| 其他接口 | 100次/分钟 | 常规限制 |

## 安全建议

1. **生产环境配置**:
   - 使用强JWT密钥
   - 启用HTTPS
   - 配置正确的CORS策略
   - 使用环境变量存储敏感信息

2. **客户端安全**:
   - 令牌存储在安全的地方 (httpOnly cookies 或 secure storage)
   - 实现自动令牌刷新
   - 处理令牌过期场景

3. **监控和日志**:
   - 记录失败的登录尝试
   - 监控异常请求模式
   - 设置告警机制

## 测试数据

### 测试用户账户

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 测试令牌 (开发环境)

- **JWT_SECRET**: `dev-jwt-secret-key`
- **JWT_REFRESH_SECRET**: `dev-jwt-refresh-secret-key`

## 支持与反馈

- **文档问题**: 提交到 `docs/` 目录的GitHub Issues
- **API问题**: 提交到后端仓库的Issues
- **紧急支持**: contact@forum.com

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-01  
**适用版本**: API v1.0+