import axios from 'axios';
import { LoginFormData, LoginResponse } from '../types/auth';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // 登录
  async login(data: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', data);
      const result = response.data;
      
      if (result.success && result.token) {
        // 存储token
        if (data.rememberMe) {
          localStorage.setItem('auth_token', result.token);
        } else {
          sessionStorage.setItem('auth_token', result.token);
        }
      }
      
      return result;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: '网络错误，请检查网络连接',
      };
    }
  },

  // 登出
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // 即使API调用失败，也清除本地存储
    } finally {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  },

  // 检查登录状态
  isAuthenticated(): boolean {
    return !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));
  },

  // 获取token
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },

  // 获取用户信息（需要后端支持）
  async getUserInfo(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};