import { LoginFormData, LoginFormErrors } from '../types/auth';

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // 用户名验证
  if (!data.username.trim()) {
    errors.username = '用户名不能为空';
  } else if (data.username.length < 3) {
    errors.username = '用户名至少需要3个字符';
  } else if (data.username.length > 20) {
    errors.username = '用户名不能超过20个字符';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = '用户名只能包含字母、数字和下划线';
  }

  // 密码验证
  if (!data.password) {
    errors.password = '密码不能为空';
  } else if (data.password.length < 6) {
    errors.password = '密码至少需要6个字符';
  } else if (data.password.length > 50) {
    errors.password = '密码不能超过50个字符';
  }

  return errors;
};

export const isLoginFormValid = (errors: LoginFormErrors): boolean => {
  return Object.keys(errors).length === 0;
};