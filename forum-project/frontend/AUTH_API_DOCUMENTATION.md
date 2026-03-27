# 用户认证API文档 - 前端专用

**收件人**: frontend-agent-1 (前端开发)
**发件人**: API文档专家
**日期**: 2024-01-01
**状态**: 基于后端实现编写

## 概述
本文档专门为前端开发人员提供用户认证API的使用指南。所有接口已由后端同事实现，可直接使用。

## 基础信息

### API基础URL
- **开发环境**: `http://localhost:3000/api`
- **生产环境**: `https://api.forum.com/api`

### 内容类型
所有请求使用 `application/json`

### 认证方式
使用Bearer Token认证：
```http
Authorization: Bearer <access_token>
```

## 核心接口

### 1. 用户登录接口

#### 接口信息
- **方法**: `POST`
- **路径**: `/auth/login`
- **认证**: 不需要
- **速率限制**: 5次/分钟

#### 请求示例
```typescript
// TypeScript接口定义
interface LoginRequest {
  username: string;      // 用户名或邮箱
  password: string;      // 密码
  rememberMe?: boolean;  // 记住登录状态，默认false
  deviceId?: string;     // 设备ID (可选)
  deviceName?: string;   // 设备名称 (可选)
}

// JavaScript请求示例
const loginData = {
  username: "john_doe",     // 或 "john@example.com"
  password: "Password123",
  rememberMe: true,
  deviceId: "web-browser-001",
  deviceName: "Chrome on Windows"
};
```

#### 响应示例 (成功)
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

#### 响应示例 (失败)
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

#### 令牌有效期
- **rememberMe: false**: 访问令牌1小时，刷新令牌30天
- **rememberMe: true**: 访问令牌7天，刷新令牌30天

#### 前端处理逻辑
```typescript
// 登录成功后存储令牌
function handleLoginSuccess(response) {
  const { token, refreshToken, expiresIn, user } = response.data;
  
  // 根据rememberMe选择存储方式
  if (loginData.rememberMe) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  
  // 设置令牌过期时间
  const expiresAt = Date.now() + (expiresIn * 1000);
  localStorage.setItem('token_expires_at', expiresAt.toString());
}
```

### 2. 获取当前用户信息

#### 接口信息
- **方法**: `GET`
- **路径**: `/auth/me`
- **认证**: 需要 (Bearer Token)

#### 请求示例
```typescript
// 需要设置认证头
const headers = {
  'Authorization': `Bearer ${accessToken}`
};
```

#### 响应示例
```json
{
  "success": true,
  "message": "获取用户信息成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatars/john_doe.jpg",
    "bio": "热爱编程的开发者",
    "emailVerified": true,
    "role": "user",
    "status": "active",
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

### 3. 刷新令牌接口

#### 接口信息
- **方法**: `POST`
- **路径**: `/auth/refresh`
- **认证**: 需要刷新令牌

#### 请求示例
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}

const refreshData = {
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};
```

#### 响应示例
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

## TypeScript类型定义

### 完整类型定义文件
```typescript
// auth.types.ts

// API响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  details: string;
  field?: string;
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  emailVerified: boolean;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: UserStats;
}

export interface UserStats {
  postCount: number;
  commentCount: number;
  likeCount: number;
  followerCount?: number;
  followingCount?: number;
  reputation?: number;
}

// 登录相关类型
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  deviceName?: string;
}

export interface LoginResponseData {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export type LoginResponse = ApiResponse<LoginResponseData>;

// 令牌相关类型
export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = ApiResponse<TokenInfo>;

// 用户信息相关类型
export type GetUserResponse = ApiResponse<User>;

// 错误码类型
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'USERNAME_ALREADY_EXISTS'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'RATE_LIMIT_EXCEEDED';
```

## Axios配置示例

### 基础配置
```typescript
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 请求拦截器 (添加令牌)
```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  sessionStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 响应拦截器 (处理令牌过期)
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是401错误且不是刷新令牌请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 尝试刷新令牌
        const refreshToken = localStorage.getItem('refresh_token') || 
                            sessionStorage.getItem('refresh_token');
        
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        
        if (refreshResponse.data.success) {
          // 存储新令牌
          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;
          
          // 保持原来的存储方式
          if (localStorage.getItem('access_token')) {
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', newRefreshToken);
          } else {
            sessionStorage.setItem('access_token', token);
            sessionStorage.setItem('refresh_token', newRefreshToken);
          }
          
          // 更新原始请求的Authorization头
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // 重新发送原始请求
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除令牌并重定向到登录页
        clearAuthData();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 工具函数
```typescript
// 清除认证数据
function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('token_expires_at');
  
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token_expires_at');
}

// 检查令牌是否过期
function isTokenExpired() {
  const expiresAt = localStorage.getItem('token_expires_at') || 
                   sessionStorage.getItem('token_expires_at');
  
  if (!expiresAt) return true;
  
  return Date.now() > parseInt(expiresAt);
}

// 获取当前用户
function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// 检查是否已登录
function isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token') || 
                sessionStorage.getItem('access_token');
  
  return !!token && !isTokenExpired();
}
```

## API服务封装

### AuthService类
```typescript
import { LoginRequest, LoginResponse, User, RefreshTokenRequest, RefreshTokenResponse } from './types/auth';

class AuthService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.api.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleTokenRefresh(error);
        }
        return Promise.reject(error);
      }
    );
  }

  // 登录
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', data);
    const result = response.data;
    
    if (result.success) {
      this.storeAuthData(result.data, data.rememberMe);
    }
    
    return result;
  }

  // 获取用户信息
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get('/auth/me');
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
    return null;
  }

  // 刷新令牌
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await this.api.post('/auth/refresh', { refreshToken });
      
      if (response.data.success) {
        this.storeTokens(response.data.data);
        return true;
      }
    } catch (error) {
      console.error('刷新令牌失败:', error);
    }
    
    this.clearAuthData();
    return false;
  }

  // 登出
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await this.api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // 存储认证数据
  private storeAuthData(data: any, rememberMe: boolean = false) {
    const { token, refreshToken, expiresIn, user } = data;
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('access_token', token);
    storage.setItem('refresh_token', refreshToken);
    storage.setItem('user', JSON.stringify(user));
    
    const expiresAt = Date.now() + (expiresIn * 1000);
    storage.setItem('token_expires_at', expiresAt.toString());
  }

  // 存储令牌
  private storeTokens(tokens: any) {
    const storage = localStorage.getItem('access_token') ? localStorage : sessionStorage;
    
    storage.setItem('access_token', tokens.token);
    storage.setItem('refresh_token', tokens.refreshToken);
    
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    storage.setItem('token_expires_at', expiresAt.toString());
  }

  // 获取访问令牌
  private getAccessToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  // 获取刷新令牌
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  }

  // 清除认证数据
  private clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
    
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token_expires_at');
  }

  // 处理令牌刷新
  private async handleTokenRefresh(error: any): Promise<void> {
    const originalRequest = error.config;
    
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshed = await this.refreshToken();
      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${this.getAccessToken()}`;
        return this.api(originalRequest);
      }
    }
    
    throw error;
  }
}

// 导出单例实例
export const authService = new AuthService();
```

## 登录页面实现示例

### React组件示例
```tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { LoginRequest } from '../types/auth';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        // 登录成功，跳转到首页
        window.location.href = '/';
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="login-container">
      <h2>用户登录</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名或邮箱</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            记住登录状态
          </label>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
```

## 错误处理指南

### 常见错误及处理
1. **INVALID_CREDENTIALS** (用户名或密码错误)
   - 显示错误提示
   - 清空密码字段
   - 可提供忘记密码链接

2. **EMAIL_NOT_VERIFIED** (邮箱未验证)
   - 提示用户检查邮箱
   - 提供重新发送验证邮件的选项
   - 可跳转到验证页面

3. **ACCOUNT_LOCKED** (账户被锁定)
   - 显示锁定信息和解锁时间
   - 提供联系管理员的方式

4. **TOKEN_EXPIRED** (令牌过期)
   - 自动尝试刷新令牌
   - 刷新失败则跳转到登录页

5. **RATE_LIMIT_EXCEEDED** (请求过于频繁)
   - 显示等待时间
   - 禁用提交按钮一段时间

### 错误处理组件
```tsx
import React from 'react';

interface ErrorDisplayProps {
  errorCode: string;
  errorMessage: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errorCode, 
  errorMessage, 
  onRetry 
}) => {
  const getErrorDetails = () => {
    switch (errorCode) {
      case 'INVALID_CREDENTIALS':
        return {
          title: '登录失败',
          message: '用户名或密码错误，请重试',
          action: '重试登录',
        };
      case 'EMAIL_NOT_VERIFIED':
        return {
          title: '邮箱未验证',
          message: '请检查您的邮箱并完成验证',
          action: '重新发送验证邮件',
        };
      case 'TOKEN_EXPIRED':
        return {
          title: '会话已过期',
          message: '请重新登录',
          action: '重新登录',
        };
      default:
        return {
          title: '发生错误',
          message: errorMessage,
          action: '重试',
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div className="error-display">
      <h3>{details.title}</h3>
      <p>{details.message}</p>
      {onRetry && (
        <button onClick={onRetry}>
          {details.action}
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
```

## 测试数据

### 开发环境测试账号
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 测试令牌 (仅开发环境)
```typescript
// 访问令牌示例 (已过期，仅用于测试格式)
const testAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// 刷新令牌示例
const testRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwianRpIjoiMTIzNDU2Nzg5MCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE4ODMxMDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
```

## 开发工具

### 1. API测试脚本
```javascript
// test-auth.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testLogin() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: 'testuser',
      password: 'Test1234',
      rememberMe: true
    });
    
    console.log('登录成功:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('登录失败:', error.response?.data || error.message);
  }
}

async function testGetUser(token) {
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('获取用户信息成功:', response.data);
  } catch (error) {
    console.error('获取用户信息失败:', error.response?.data || error.message);
  }
}

// 运行测试
(async () => {
  const authData = await testLogin();
  if (authData) {
    await testGetUser(authData.token);
  }
})();
```

### 2. 环境配置
```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=论坛系统(开发版)

# .env.production
VITE_API_BASE_URL=https://api.forum.com/api
VITE_APP_NAME=论坛系统
```

## 常见问题解答

### Q1: 登录后如何保持用户状态？
A: 使用`rememberMe`参数决定令牌存储方式：
- `true`: 使用localStorage，关闭浏览器后仍保持登录
- `false`: 使用sessionStorage，关闭浏览器后需要重新登录

### Q2: 令牌过期如何处理？
A: 配置axios拦截器自动刷新令牌。当收到401错误时，自动使用刷新令牌获取新访问令牌。

### Q3: 如何实现自动登录？
A: 在应用启动时检查localStorage/sessionStorage中是否有有效令牌，如果有则自动获取用户信息。

### Q4: 多标签页登录状态如何同步？
A: 使用storage事件监听令牌变化：
```javascript
window.addEventListener('storage', (event) => {
  if (event.key === 'access_token') {
    // 令牌发生变化，更新应用状态
  }
});
```

### Q5: 如何实现登出所有设备？
A: 后端已实现令牌黑名单，登出时会使所有令牌失效。前端只需清除本地存储。

## 支持与反馈

如遇到API使用问题，请联系：
- **后端开发**: backend-agent-1
- **API文档**: API文档专家
- **紧急问题**: 项目负责人

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-01  
**适用前端框架**: React/Vue/Angular/原生JavaScript  
**状态**: ✅ 已通过后端验证