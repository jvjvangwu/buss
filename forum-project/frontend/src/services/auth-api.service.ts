/**
 * 用户认证API服务
 * 基于后端实现的完整前端服务封装
 * 版本: 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  // 类型导入
  ApiResponse,
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
  GetUserResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  ErrorCode,
  // 常量导入
  DEFAULT_API_CONFIG,
  STORAGE_KEYS,
  HTTP_STATUS,
  TOKEN_EXPIRY,
  // 工具函数导入
  isErrorResponse,
  isErrorCode,
} from '../types/auth-api.types';

/**
 * 认证服务配置
 */
export interface AuthServiceConfig {
  baseURL?: string;
  timeout?: number;
  enableAutoRefresh?: boolean;
  enableRequestLogging?: boolean;
  enableErrorLogging?: boolean;
}

/**
 * 认证服务类
 */
export class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<boolean> | null = null;
  private config: Required<AuthServiceConfig>;

  constructor(config: AuthServiceConfig = {}) {
    this.config = {
      baseURL: config.baseURL || DEFAULT_API_CONFIG.baseURL,
      timeout: config.timeout || DEFAULT_API_CONFIG.timeout,
      enableAutoRefresh: config.enableAutoRefresh ?? true,
      enableRequestLogging: config.enableRequestLogging ?? false,
      enableErrorLogging: config.enableErrorLogging ?? true,
    };

    this.api = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: DEFAULT_API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  // ==================== 公共API方法 ====================

  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', data);
      
      if (this.config.enableRequestLogging) {
        console.log('登录请求成功:', response.data);
      }

      if (response.data.success && response.data.data) {
        this.storeAuthData(response.data.data, data.rememberMe || false);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('登录请求失败:', error);
      }
      return this.handleError(error, '登录失败');
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>('/auth/register', data);
      
      if (this.config.enableRequestLogging) {
        console.log('注册请求成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('注册请求失败:', error);
      }
      return this.handleError(error, '注册失败');
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<GetUserResponse> {
    try {
      const response = await this.api.get<GetUserResponse>('/auth/me');
      
      if (this.config.enableRequestLogging) {
        console.log('获取用户信息成功:', response.data);
      }

      // 更新存储的用户信息
      if (response.data.success && response.data.data) {
        this.updateStoredUser(response.data.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('获取用户信息失败:', error);
      }
      return this.handleError(error, '获取用户信息失败');
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('未找到刷新令牌');
      }

      const requestData: RefreshTokenRequest = { refreshToken };
      const response = await this.api.post<RefreshTokenResponse>('/auth/refresh', requestData);
      
      if (this.config.enableRequestLogging) {
        console.log('刷新令牌成功:', response.data);
      }

      if (response.data.success && response.data.data) {
        this.storeTokens(response.data.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('刷新令牌失败:', error);
      }
      
      // 刷新失败时清除认证数据
      this.clearAuthData();
      
      return this.handleError(error, '刷新令牌失败');
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      let response: AxiosResponse<ApiResponse>;

      if (refreshToken) {
        response = await this.api.post<ApiResponse>('/auth/logout', { refreshToken });
      } else {
        response = await this.api.post<ApiResponse>('/auth/logout');
      }

      if (this.config.enableRequestLogging) {
        console.log('登出成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('登出失败:', error);
      }
      
      // 即使API调用失败，也清除本地存储
      this.clearAuthData();
      
      return this.handleError(error, '登出失败');
    } finally {
      // 确保清除本地存储
      this.clearAuthData();
    }
  }

  /**
   * 忘记密码
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/forgot-password', data);
      
      if (this.config.enableRequestLogging) {
        console.log('忘记密码请求成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('忘记密码请求失败:', error);
      }
      return this.handleError(error, '忘记密码请求失败');
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/reset-password', data);
      
      if (this.config.enableRequestLogging) {
        console.log('重置密码请求成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('重置密码请求失败:', error);
      }
      return this.handleError(error, '重置密码请求失败');
    }
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/verify-email', data);
      
      if (this.config.enableRequestLogging) {
        console.log('验证邮箱请求成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('验证邮箱请求失败:', error);
      }
      return this.handleError(error, '验证邮箱请求失败');
    }
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerification(data: ResendVerificationRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/resend-verification', data);
      
      if (this.config.enableRequestLogging) {
        console.log('重新发送验证邮件成功:', response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('重新发送验证邮件失败:', error);
      }
      return this.handleError(error, '重新发送验证邮件失败');
    }
  }

  /**
   * 更新个人资料
   */
  async updateProfile(data: UpdateProfileRequest): Promise<GetUserResponse> {
    try {
      const response = await this.api.put<GetUserResponse>('/auth/me', data);
      
      if (this.config.enableRequestLogging) {
        console.log('更新个人资料成功:', response.data);
      }

      // 更新存储的用户信息
      if (response.data.success && response.data.data) {
        this.updateStoredUser(response.data.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.config.enableErrorLogging) {
        console.error('更新个人资料失败:', error);
      }
      return this.handleError(error, '更新个人资料失败');
    }
  }

  // ==================== 工具方法 ====================

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getStoredUser();
    
    return !!token && !!user && user.emailVerified === true;
  }

  /**
   * 获取当前用户
   */
  getCurrentUserFromStorage(): User | null {
    return this.getStoredUser();
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return this.getFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    return this.getFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * 检查令牌是否过期
   */
  isTokenExpired(): boolean {
    const expiresAtStr = this.getFromStorage(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAtStr) return true;

    const expiresAt = parseInt(expiresAtStr, 10);
    return Date.now() > expiresAt;
  }

  /**
   * 清除所有认证数据
   */
  clearAuthData(): void {
    const storage = this.getStorage();
    
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key);
    });

    if (this.config.enableRequestLogging) {
      console.log('认证数据已清除');
    }
  }

  /**
   * 获取Axios实例（用于自定义请求）
   */
  getApiInstance(): AxiosInstance {
    return this.api;
  }

  // ==================== 私有方法 ====================

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器 - 添加认证头
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (this.config.enableRequestLogging) {
          console.log('请求:', {
            method: config.method,
            url: config.url,
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        if (this.config.enableErrorLogging) {
          console.error('请求拦截器错误:', error);
        }
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理令牌过期
    if (this.config.enableAutoRefresh) {
      this.api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // 检查是否为401错误且不是刷新令牌请求
          if (
            error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login')
          ) {
            originalRequest._retry = true;

            try {
              // 使用单例模式避免重复刷新
              if (!this.refreshPromise) {
                this.refreshPromise = this.refreshTokenInternal();
              }

              const refreshed = await this.refreshPromise;
              
              if (refreshed) {
                // 更新原始请求的认证头
                const newToken = this.getAccessToken();
                if (newToken) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                
                // 重新发送原始请求
                return this.api(originalRequest);
              }
            } catch (refreshError) {
              if (this.config.enableErrorLogging) {
                console.error('令牌刷新失败:', refreshError);
              }
            } finally {
              this.refreshPromise = null;
            }
          }

          return Promise.reject(error);
        }
      );
    }
  }

  /**
   * 内部刷新令牌方法
   */
  private async refreshTokenInternal(): Promise<boolean> {
    try {
      const response = await this.refreshToken();
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * 存储认证数据
   */
  private storeAuthData(data: LoginResponseData, rememberMe: boolean): void {
    const { token, refreshToken, expiresIn, user } = data;
    const storage = rememberMe ? localStorage : sessionStorage;

    // 存储令牌
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token.token);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken);
    
    // 存储用户信息
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // 计算并存储过期时间
    const expiresAt = Date.now() + (expiresIn * 1000);
    storage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
    
    // 存储记住我状态
    storage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());

    if (this.config.enableRequestLogging) {
      console.log('认证数据已存储:', {
        rememberMe,
        expiresIn,
        userId: user.id,
      });
    }
  }

  /**
   * 存储令牌
   */
  private storeTokens(tokens: { token: string; refreshToken: string; expiresIn: number }): void {
    const storage = this.getStorage();

    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.token);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    storage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    if (this.config.enableRequestLogging) {
      console.log('令牌已更新');
    }
  }

  /**
   * 更新存储的用户信息
   */
  private updateStoredUser(user: User): void {
    const storage = this.getStorage();
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * 获取存储的用户信息
   */
  private getStoredUser(): User | null {
    const userStr = this.getFromStorage(STORAGE_KEYS.USER);
    
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      if (this.config.enableErrorLogging) {
        console.error('解析用户信息失败:', error);
      }
      return null;
    }
  }

  /**
   * 从存储中获取数据
   */
  private getFromStorage(key: string): string | null {
    // 先检查localStorage，再检查sessionStorage
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   * 获取当前使用的存储
   */
  private getStorage(): Storage {
    const rememberMe = this.getFromStorage(STORAGE_KEYS.REMEMBER_ME);
    return rememberMe === 'true' ? localStorage : sessionStorage;
  }

  /**
   * 处理错误响应
   */
  private handleError(error: any, defaultMessage: string): ApiResponse {
    if (error.response) {
      // 服务器返回了错误响应
      const response = error.response.data as ApiResponse;
      
      if (isErrorResponse(response)) {
        return response;
      }
      
      return {
        success: false,
        message: response.message || defaultMessage,
        error: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          details: '服务器返回了无效的响应格式',
        },
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // 请求已发送但没有收到响应
      return {
        success: false,
        message: '网络错误，请检查网络连接',
        error: {
          code: ErrorCode.EXTERNAL_SERVICE_ERROR,
          details: '无法连接到服务器',
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      // 请求配置出错
      return {
        success: false,
        message: defaultMessage,
        error: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          details: error.message || '未知错误',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * 创建认证服务实例
 */
export function createAuthService(config?: AuthServiceConfig): AuthService {
  return new AuthService(config);
}

/**
 * 默认认证服务实例
 */
export const authService = createAuthService();

/**
 * 开发环境认证服务实例（带日志）
 */
export const authServiceWithLogging = createAuthService({
  enableRequestLogging: true,
  enableErrorLogging: true,
});

/**
 * 生产环境认证服务实例（无日志）
 */
export const authServiceProduction = createAuthService({
  enableRequestLogging: false,
  enableErrorLogging: false,
});

// ==================== 工具函数导出 ====================

/**
 * 检查是否为特定错误
 */
export function isSpecificError(response: ApiResponse, code: ErrorCode): boolean {
  return isErrorResponse(response) && isErrorCode(response, code);
}

/**
 * 提取错误信息
 */
export function extractErrorMessage(response: ApiResponse): string {
  if (isErrorResponse(response)) {
    return response.error.details || response.message;
  }
  return response.message;
}

/**
 * 创建登录请求数据
 */
export function createLoginRequest(
  username: string,
  password: string,
  rememberMe: boolean = false,
  deviceId?: string,
  deviceName?: string
): LoginRequest {
  return {
    username,
    password,
    rememberMe,
    ...(deviceId && { deviceId }),
    ...(deviceName && { deviceName }),
  };
}

/**
 * 创建注册请求数据
 */
export function createRegisterRequest(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreeToTerms: boolean,
  displayName?: string
): RegisterRequest {
  return {
    username,
    email,
    password,
    confirmPassword,
    agreeToTerms,
    ...(displayName && { displayName }),
  };
}

// ==================== 默认导出 ====================

export default authService;