// 用户信息类型
interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status: number;
  roles: string[];
  permissions: string[];
  createdAt?: string;
}

// 用户列表项类型
interface UserListItem {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: number;
  roles: Array<{
    id: number;
    roleName: string;
    roleCode: string;
  }>;
  createdAt: string;
}

// 用户查询参数
interface UserQueryParams {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  phone?: string;
  status?: number;
}

// 创建用户参数
interface CreateUserParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  nickname?: string;
  roleIds?: number[];
}

// 更新用户参数
interface UpdateUserParams {
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: number;
  birthday?: string;
  bio?: string;
}

export type {
  UserInfo,
  UserListItem,
  UserQueryParams,
  CreateUserParams,
  UpdateUserParams,
};
