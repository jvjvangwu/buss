/**
 * 用户认证模块 TypeScript 类型定义
 * 版本: 1.0.0
 * 最后更新: 2024-01-01
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
  code: string;
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
 * 用户实体接口
 */
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * 用户统计信息
 */
export interface UserStats {
  postCount: number;
  commentCount: number;
  likeCount: number;
  followerCount: number;
  followingCount: number;
  reputation: number;
}

/**
 * 用户响应DTO
 */
export interface UserResponseDto {
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
 * 用户简略信息DTO
 */
export interface UserBriefDto {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
}

// ==================== 认证请求类型 ====================

/**
 * 登录请求DTO
 */
export interface LoginRequestDto {
  username: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  deviceName?: string;
}

/**
 * 注册请求DTO
 */
export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  displayName?: string;
  inviteCode?: string;
}

/**
 * 刷新令牌请求DTO
 */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * 忘记密码请求DTO
 */
export interface ForgotPasswordRequestDto {
  email: string;
}

/**
 * 重置密码请求DTO
 */
export interface ResetPasswordRequestDto {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * 验证邮箱请求DTO
 */
export interface VerifyEmailRequestDto {
  token: string;
}

/**
 * 重新发送验证邮件请求DTO
 */
export interface ResendVerificationRequestDto {
  email: string;
}

/**
 * 更新个人资料请求DTO
 */
export interface UpdateProfileRequestDto {
  displayName?: string;
  avatar?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

/**
 * 更新邮箱请求DTO
 */
export interface UpdateEmailRequestDto {
  newEmail: string;
  currentPassword: string;
}

// ==================== 认证响应类型 ====================

/**
 * 令牌响应DTO
 */
export interface TokenResponseDto {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * 登录响应DTO
 */
export interface LoginResponseDto {
  token: TokenResponseDto;
  user: UserResponseDto;
}

/**
 * 注册响应DTO
 */
export interface RegisterResponseDto {
  userId: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  requiresEmailVerification: boolean;
}

/**
 * 验证响应DTO
 */
export interface VerificationResponseDto {
  verified: boolean;
  message: string;
}

/**
 * 密码重置响应DTO
 */
export interface PasswordResetResponseDto {
  reset: boolean;
  message: string;
}

// ==================== JWT相关类型 ====================

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  sub: string;           // 用户ID
  username: string;      // 用户名
  email: string;         // 邮箱
  role: UserRole;        // 角色
  jti?: string;          // JWT ID
  iat?: number;          // 签发时间
  exp?: number;          // 过期时间
  nbf?: number;          // 生效时间
  iss?: string;          // 签发者
  aud?: string;          // 接收者
}

/**
 * 刷新令牌载荷接口
 */
export interface RefreshTokenPayload {
  sub: string;           // 用户ID
  jti: string;           // JWT ID
  iat: number;           // 签发时间
  exp: number;           // 过期时间
}

/**
 * 令牌信息接口
 */
export interface TokenInfo {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  revoked: boolean;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 设备相关类型 ====================

/**
 * 设备信息
 */
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'desktop';
  os?: string;
  browser?: string;
  lastActiveAt: string;
  currentDevice: boolean;
}

/**
 * 设备管理请求DTO
 */
export interface DeviceManagementRequestDto {
  deviceId: string;
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

// ==================== 验证器类型 ====================

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * 验证结果接口
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// ==================== 事件类型 ====================

/**
 * 用户事件类型
 */
export type UserEventType = 
  | 'user.registered'
  | 'user.logged_in'
  | 'user.logged_out'
  | 'user.email_verified'
  | 'user.password_changed'
  | 'user.profile_updated'
  | 'user.suspended'
  | 'user.activated';

/**
 * 用户事件数据
 */
export interface UserEventData {
  userId: string;
  username: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ==================== 配置类型 ====================

/**
 * 认证配置接口
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  requireEmailVerification: boolean;
  allowRegistration: boolean;
  maxLoginAttempts: number;
  lockTimeMinutes: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  usernameMinLength: number;
  usernameMaxLength: number;
  usernameRegex: string;
}

/**
 * 速率限制配置
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
}

// ==================== 枚举类型 ====================

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

/**
 * 日志级别枚举
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

/**
 * 设备类型枚举
 */
export enum DeviceType {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  UNKNOWN = 'unknown',
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

/**
 * 空对象检查
 */
export type EmptyObject = Record<string, never>;

/**
 * 非空对象
 */
export type NonEmptyObject<T> = T extends EmptyObject ? never : T;

// ==================== 响应工具函数类型 ====================

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

/**
 * 分页响应构造器类型
 */
export type PaginatedSuccessResponse<T> = SuccessResponse<PaginatedResponse<T>>;

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
  UserEntity,
  UserStats,
  UserResponseDto,
  UserBriefDto,
  
  // 认证请求类型
  LoginRequestDto,
  RegisterRequestDto,
  RefreshTokenRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto,
  ResendVerificationRequestDto,
  UpdateProfileRequestDto,
  UpdateEmailRequestDto,
  
  // 认证响应类型
  TokenResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
  VerificationResponseDto,
  PasswordResetResponseDto,
  
  // JWT相关类型
  JwtPayload,
  RefreshTokenPayload,
  TokenInfo,
  
  // 设备相关类型
  DeviceInfo,
  DeviceManagementRequestDto,
  
  // 会话相关类型
  SessionInfo,
  SessionManagementResponse,
  
  // 验证器类型
  ValidationError,
  ValidationResult,
  
  // 事件类型
  UserEventType,
  UserEventData,
  
  // 配置类型
  AuthConfig,
  RateLimitConfig,
  
  // 枚举类型
  ErrorCode,
  LogLevel,
  DeviceType,
  
  // 工具类型
  Optional,
  Required,
  Readonly,
  EmptyObject,
  NonEmptyObject,
  
  // 响应工具函数类型
  SuccessResponse,
  ErrorResponse,
  PaginatedSuccessResponse,
};