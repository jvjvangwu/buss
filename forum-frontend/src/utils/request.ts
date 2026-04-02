import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import router from "@/router";

// 统一响应格式
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应格式
interface PageResponse<T = any> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token && userStore.token !== "") {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;

    // 检查是否是统一响应格式
    if (typeof data === 'object' && data !== null && 'code' in data) {
      // 成功响应
      if (data.code === 200 || data.code === 201) {
        return data.data;
      }

      // 业务错误
      ElMessage.error(data.message || "请求失败");
      return Promise.reject(new Error(data.message || "请求失败"));
    } else {
      // 直接返回数据（适用于后端直接返回对象的情况）
      return data;
    }
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          // 未授权，清除用户信息并跳转新闻首页
          const userStore = useUserStore();
          userStore.clearUser();
          router.push({ name: "PublicNewsHome" });
          ElMessage.error("登录已过期，请重新登录");
          break;
        case 403:
          ElMessage.error("无权限访问");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(data?.message || "请求失败");
      }
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }

    return Promise.reject(error);
  },
);

// 封装请求方法
const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.put(url, data, config);
  },

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.patch(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export { service as axiosInstance, request };
export type { ApiResponse, PageResponse };
