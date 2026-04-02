import { request } from "@/utils/request";

// 消息查询参数
export interface MessageQueryParams {
  pageNum: number;
  pageSize: number;
  type?: string;
  status?: string;
}

// 消息信息
export interface MessageInfo {
  id: number;
  title: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
}

// 消息分页响应
export interface MessagePageResponse {
  data: MessageInfo[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 消息相关 API
export const messageApi = {
  // 获取消息列表
  pageMessages: (params: MessageQueryParams) => {
    return request<MessagePageResponse>({
      url: "/api/v1/messages",
      method: "get",
      params,
    });
  },

  // 标记消息为已读
  markAsRead: (id: number) => {
    return request({
      url: `/api/v1/messages/${id}/read`,
      method: "put",
    });
  },

  // 全部标记为已读
  markAllAsRead: () => {
    return request({
      url: "/api/v1/messages/read-all",
      method: "put",
    });
  },

  // 获取未读消息数量
  getUnreadCount: () => {
    return request<{ count: number }>({
      url: "/api/v1/messages/unread-count",
      method: "get",
    });
  },
};
