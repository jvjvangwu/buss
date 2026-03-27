export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}