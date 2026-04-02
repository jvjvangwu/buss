import { request } from "@/utils/request";

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  gender?: number;
  bio?: string;
  status: number;
  roles?: RoleInfo[];
  createdAt: string;
}

// 角色信息
export interface RoleInfo {
  id: number;
  roleName: string;
  roleCode: string;
}

// 用户查询参数
export interface UserQueryParams {
  username?: string;
  email?: string;
  phone?: string;
  nickname?: string;
  status?: number;
  pageNum?: number;
  pageSize?: number;
}

// 用户创建/更新参数
export interface UserParams {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  gender?: number;
  bio?: string;
  roleIds?: number[];
}

// 分页响应
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 用户相关 API
export const userApi = {
  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Promise<UserInfo> {
    return request.get<UserInfo>("/users/current");
  },

  /**
   * 获取用户详情
   */
  getUser(id: number): Promise<UserInfo> {
    return request.get<UserInfo>(`/users/${id}`);
  },

  /**
   * 分页查询用户列表
   */
  pageUsers(params: UserQueryParams): Promise<PageResponse<UserInfo>> {
    return request.get<PageResponse<UserInfo>>("/users", { params });
  },

  /**
   * 创建用户
   */
  createUser(params: UserParams): Promise<UserInfo> {
    return request.post<UserInfo>("/users", params);
  },

  /**
   * 更新用户信息
   */
  updateUser(id: number, params: UserParams): Promise<void> {
    return request.put<void>(`/users/${id}`, params);
  },

  /**
   * 更新用户状态
   */
  updateUserStatus(id: number, status: number): Promise<void> {
    return request.put<void>(`/users/${id}/status`, null, {
      params: { status },
    });
  },

  /**
   * 删除用户
   */
  deleteUser(id: number): Promise<void> {
    return request.delete<void>(`/users/${id}`);
  },

  /**
   * 获取用户角色
   */
  getUserRoles(id: number): Promise<RoleInfo[]> {
    return request.get<RoleInfo[]>(`/users/${id}/roles`);
  },

  /**
   * 分配角色
   */
  assignRoles(id: number, roleIds: { roleIds: number[] }): Promise<void> {
    return request.post<void>(`/users/${id}/roles`, roleIds);
  },
};
