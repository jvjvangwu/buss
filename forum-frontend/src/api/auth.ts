import { request } from '@/utils/request';
import type { UserInfo } from '@/types/user';

// 登录请求参数
interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 登录响应
interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  user: UserInfo;
}

// 微信登录请求参数
interface WechatLoginParams {
  code: string;
  state?: string;
}

// 刷新 Token 请求参数
interface RefreshTokenParams {
  refreshToken: string;
}

// 刷新 Token 响应
interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

// 认证相关 API
export const authApi = {
  /**
   * 账号密码登录
   */
  login(params: LoginParams): Promise<LoginResponse> {
    return request.post<LoginResponse>('/auth/login', params);
  },

  /**
   * 微信 OAuth 登录
   */
  wechatLogin(params: WechatLoginParams): Promise<LoginResponse> {
    return request.post<LoginResponse>('/auth/wechat-login', params);
  },

  /**
   * 刷新 Token
   */
  refreshToken(params: RefreshTokenParams): Promise<RefreshTokenResponse> {
    return request.post<RefreshTokenResponse>('/auth/refresh', params);
  },

  /**
   * 退出登录
   */
  logout(): Promise<void> {
    return request.post<void>('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Promise<UserInfo> {
    return request.get<UserInfo>('/auth/me');
  },
};
