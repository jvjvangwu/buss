import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserInfo } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('accessToken') || '');
  const refreshToken = ref<string>(localStorage.getItem('refreshToken') || '');
  const userInfo = ref<UserInfo | null>(null);
  const permissions = ref<string[]>([]);
  const roles = ref<string[]>([]);

  // 计算属性
  const isLoggedIn = computed(() => !!token.value);
  const username = computed(() => userInfo.value?.username || '');
  const nickname = computed(() => userInfo.value?.nickname || '');
  const avatar = computed(() => userInfo.value?.avatar || '');

  // 设置 Token
  function setToken(accessToken: string, refresh?: string) {
    token.value = accessToken;
    localStorage.setItem('accessToken', accessToken);
    if (refresh) {
      refreshToken.value = refresh;
      localStorage.setItem('refreshToken', refresh);
    }
  }

  // 设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
    permissions.value = info.permissions || [];
    roles.value = info.roles || [];
  }

  // 检查权限
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission);
  }

  // 检查角色
  function hasRole(role: string): boolean {
    return roles.value.includes(role);
  }

  // 清除用户信息
  function clearUser() {
    token.value = '';
    refreshToken.value = '';
    userInfo.value = null;
    permissions.value = [];
    roles.value = [];
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  return {
    // 状态
    token,
    refreshToken,
    userInfo,
    permissions,
    roles,
    // 计算属性
    isLoggedIn,
    username,
    nickname,
    avatar,
    // 方法
    setToken,
    setUserInfo,
    hasPermission,
    hasRole,
    clearUser,
  };
});
