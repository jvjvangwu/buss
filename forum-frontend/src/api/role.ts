import { request } from "@/utils/request";

// 角色信息
export interface RoleInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  sortOrder?: number;
  status: number;
  isSystem: number;
  createdAt: string;
}

// 权限信息
export interface PermissionInfo {
  id: number;
  name: string;
  code: string;
  type: number;
  parentId: number;
  path?: string;
  icon?: string;
  sort: number;
  status: number;
  children?: PermissionInfo[];
}

// 角色查询参数
export interface RoleQueryParams {
  pageNum: number;
  pageSize: number;
  roleName?: string;
}

// 角色参数
export interface RoleParams {
  id?: number;
  name: string;
  code?: string;
  description?: string;
  status: number;
}

// 角色分页响应
export interface RolePageResponse {
  data: RoleInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 角色相关 API
export const roleApi = {
  /**
   * 获取所有角色
   */
  listRoles(): Promise<RoleInfo[]> {
    return request.get<RoleInfo[]>("/roles");
  },

  /**
   * 分页查询角色
   */
  pageRoles(params: RoleQueryParams): Promise<RolePageResponse> {
    return request.get<RolePageResponse>("/roles/page", { params });
  },

  /**
   * 创建角色
   */
  createRole(role: RoleParams): Promise<RoleInfo> {
    return request.post<RoleInfo>("/roles", role);
  },

  /**
   * 更新角色
   */
  updateRole(role: RoleParams): Promise<RoleInfo> {
    return request.put<RoleInfo>("/roles", role);
  },

  /**
   * 更新角色状态
   */
  updateRoleStatus(id: number, status: number): Promise<void> {
    return request.put<void>(`/roles/${id}/status`, null, { params: { status } });
  },

  /**
   * 删除角色
   */
  deleteRole(id: number): Promise<void> {
    return request.delete<void>(`/roles/${id}`);
  },

  /**
   * 获取角色详情
   */
  getRole(id: number): Promise<RoleInfo> {
    return request.get<RoleInfo>(`/roles/${id}`);
  },

  /**
   * 获取角色权限
   */
  getRolePermissions(id: number): Promise<number[]> {
    return request.get<number[]>(`/roles/${id}/permissions`);
  },

  /**
   * 分配权限
   */
  assignPermissions(id: number, permissionIds: number[]): Promise<void> {
    return request.post<void>(`/roles/${id}/permissions`, permissionIds);
  },
};

// 权限相关 API
export const permissionApi = {
  /**
   * 获取所有权限
   */
  listPermissions(): Promise<PermissionInfo[]> {
    return request.get<PermissionInfo[]>("/permissions");
  },

  /**
   * 获取权限树
   */
  getPermissionTree(): Promise<PermissionInfo[]> {
    return request.get<PermissionInfo[]>("/permissions/tree");
  },
};
