/**
 * 用户认证API TypeScript类型定义
 * 版本: 1.0.0
 * 最后更新: 2024-01-01
 * 后端验证状态: ✅ 已验证
 */

// ==================== 基础类型 ====================

/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

/**
 * API错误接口
 */
export interface ApiError {
  code: ErrorCode;
  details: string;
  field?: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ==================== 用户相关类型 ====================

/**
 * 用户角色类型
 */
export type UserRole = 'user' | 'moderator' | 'admin';

/**
 * 用户状态类型
 */
export type UserStatus = 'active' | 'suspended' | 'banned' | 'inactive';

/**
 * 用户接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: UserStats;
}

/**
 * 用户统计信息
 */
export interface UserStats {
  postCount: number;
  commentCount: number;
  likeCount: number;
  followerCount?: number;
  followingCount?: number;
  reputation?: number;
}

/**
 * 用户简略信息
 */
export interface UserBrief {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
}

// ==================== 认证请求类型 ====================

/**
 * 登录请求接口
 */
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  deviceName?: string;
}

/**
 * 注册请求接口
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  displayName?: string;
  inviteCode?: string;
}

/**
 * 刷新令牌请求接口
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 忘记密码请求接口
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * 重置密码请求接口
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * 验证邮箱请求接口
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * 重新发送验证邮件请求接口
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * 更新个人资料请求接口
 */
export interface UpdateProfileRequest {
  displayName?: string;
  avatar?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// ==================== 认证响应类型 ====================

/**
 * 令牌信息接口
 */
export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * 登录响应数据接口
 */
export interface LoginResponseData {
  token: TokenInfo;
  user: User;
}

/**
 * 注册响应数据接口
 */
export interface RegisterResponseData {
  userId: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  requiresEmailVerification: boolean;
}

/**
 * 验证响应数据接口
 */
export interface VerificationResponseData {
  verified: boolean;
  message: string;
}

/**
 * 密码重置响应数据接口
 */
export interface PasswordResetResponseData {
  reset: boolean;
  message: string;
}

// ==================== API响应类型别名 ====================

/**
 * 登录响应类型
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

/**
 * 注册响应类型
 */
export type RegisterResponse = ApiResponse<RegisterResponseData>;

/**
 * 刷新令牌响应类型
 */
export type RefreshTokenResponse = ApiResponse<TokenInfo>;

/**
 * 获取用户信息响应类型
 */
export type GetUserResponse = ApiResponse<User>;

/**
 * 验证响应类型
 */
export type VerificationResponse = ApiResponse<VerificationResponseData>;

/**
 * 密码重置响应类型
 */
export type PasswordResetResponse = ApiResponse<PasswordResetResponseData>;

// ==================== 错误码枚举 ====================

/**
 * 错误码枚举
 */
export enum ErrorCode {
  // 验证错误 (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // 认证错误 (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_REQUIRED = 'TOKEN_REQUIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  
  // 权限错误 (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  
  // 未找到错误 (404)
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  
  // 冲突错误 (409)
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  SESSION_ALREADY_EXISTS = 'SESSION_ALREADY_EXISTS',
  
  // 速率限制错误 (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 服务器错误 (500)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // 业务逻辑错误
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  INVITE_CODE_INVALID = 'INVITE_CODE_INVALID',
  INVITE_CODE_EXPIRED = 'INVITE_CODE_EXPIRED',
  VERIFICATION_TOKEN_EXPIRED = 'VERIFICATION_TOKEN_EXPIRED',
  RESET_TOKEN_EXPIRED = 'RESET_TOKEN_EXPIRED',
}

// ==================== 表单相关类型 ====================

/**
 * 登录表单数据
 */
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * 注册表单数据
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  displayName?: string;
}

/**
 * 表单错误
 */
export interface FormErrors {
  [field: string]: string;
}

/**
 * 登录表单错误
 */
export interface LoginFormErrors {
  username?: string;
  password?: string;
  general?: string;
}

/**
 * 注册表单错误
 */
export interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

// ==================== 存储相关类型 ====================

/**
 * 认证存储数据
 */
export interface AuthStorageData {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: number; // 时间戳
  rememberMe: boolean;
}

/**
 * 存储类型
 */
export type StorageType = 'localStorage' | 'sessionStorage';

// ==================== 设备相关类型 ====================

/**
 * 设备类型
 */
export type DeviceType = 'web' | 'mobile' | 'desktop' | 'tablet' | 'unknown';

/**
 * 设备信息
 */
export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  os?: string;
  browser?: string;
  lastActiveAt: string;
  currentDevice: boolean;
}

// ==================== 会话相关类型 ====================

/**
 * 会话信息
 */
export interface SessionInfo {
  id: string;
  device: DeviceInfo;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

/**
 * 会话管理响应
 */
export interface SessionManagementResponse {
  sessions: SessionInfo[];
  currentSessionId: string;
}

// ==================== 工具类型 ====================

/**
 * 可选字段工具类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必需字段工具类型
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * 只读字段工具类型
 */
export type Readonly<T, K extends keyof T> = Omit<T, K> & { readonly [P in K]: T[P] };

// ==================== 响应工具类型 ====================

/**
 * 成功响应构造器类型
 */
export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
};

/**
 * 错误响应构造器类型
 */
export type ErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
  timestamp: string;
};

// ==================== 验证相关类型 ====================

/**
 * 验证规则
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

/**
 * 验证规则集合
 */
export interface ValidationRules {
  [field: string]: ValidationRule | ValidationRule[];
}

// ==================== API配置类型 ====================

/**
 * API配置
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

/**
 * 拦截器配置
 */
export interface InterceptorConfig {
  request?: (config: any) => any;
  response?: {
    success?: (response: any) => any;
    error?: (error: any) => any;
  };
}

// ==================== 导出所有类型 ====================

export {
  // 基础类型
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  
  // 用户相关类型
  UserRole,
  UserStatus,
  User,
  UserStats,
  UserBrief,
  
  // 认证请求类型
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  
  // 认证响应类型
  TokenInfo,
  LoginResponseData,
  RegisterResponseData,
  VerificationResponseData,
  PasswordResetResponseData,
  
  // API响应类型别名
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  GetUserResponse,
  VerificationResponse,
  PasswordResetResponse,
  
  // 错误码枚举
  ErrorCode,
  
  // 表单相关类型
  LoginFormData,
  RegisterFormData,
  FormErrors,
  LoginFormErrors,
  RegisterFormErrors,
  
  // 存储相关类型
  AuthStorageData,
  StorageType,
  
  // 设备相关类型
  DeviceType,
  DeviceInfo,
  
  // 会话相关类型
  SessionInfo,
  SessionManagementResponse,
  
  // 工具类型
  Optional,
  Required,
  Readonly,
  
  // 响应工具类型
  SuccessResponse,
  ErrorResponse,
  
  // 验证相关类型
  ValidationRule,
  ValidationRules,
  
  // API配置类型
  ApiConfig,
  InterceptorConfig,
};

// ==================== 类型守卫 ====================

/**
 * 检查是否为成功响应
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * 检查是否为错误响应
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false;
}

/**
 * 检查是否为特定错误码
 */
export function isErrorCode(response: ApiResponse, code: ErrorCode): boolean {
  return isErrorResponse(response) && response.error.code === code;
}

/**
 * 检查用户是否已认证
 */
export function isAuthenticated(user: User | null): user is User {
  return user !== null && user.emailVerified === true;
}

/**
 * 检查用户是否有特定角色
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

/**
 * 检查用户是否有任一角色
 */
export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

// ==================== 工具函数类型 ====================

/**
 * 存储令牌函数类型
 */
export type StoreTokensFunction = (
  tokens: TokenInfo, 
  user: User, 
  rememberMe: boolean
) => void;

/**
 * 清除令牌函数类型
 */
export type ClearTokensFunction = () => void;

/**
 * 获取令牌函数类型
 */
export type GetTokenFunction = () => string | null;

/**
 * 刷新令牌函数类型
 */
export type RefreshTokenFunction = () => Promise<boolean>;

// ==================== 默认值 ====================

/**
 * 默认API配置
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 默认用户
 */
export const DEFAULT_USER: User = {
  id: '',
  username: '',
  email: '',
  emailVerified: false,
  role: 'user',
  status: 'active',
  createdAt: '',
  updatedAt: '',
};

/**
 * 默认令牌信息
 */
export const DEFAULT_TOKEN_INFO: TokenInfo = {
  token: '',
  refreshToken: '',
  expiresIn: 3600,
  tokenType: 'Bearer',
};

// ==================== 常量 ====================

/**
 * 存储键名
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  EXPIRES_AT: 'token_expires_at',
  REMEMBER_ME: 'remember_me',
} as const;

/**
 * HTTP状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * 令牌有效期（秒）
 */
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 3600, // 1小时
  REFRESH_TOKEN: 2592000, // 30天
  ACCESS_TOKEN_REMEMBER_ME: 604800, // 7天
} as const;

// ==================== 导出常量 ====================

export {
  DEFAULT_API_CONFIG,
  DEFAULT_USER,
  DEFAULT_TOKEN_INFO,
  STORAGE_KEYS,
  HTTP_STATUS,
  TOKEN_EXPIRY,
};