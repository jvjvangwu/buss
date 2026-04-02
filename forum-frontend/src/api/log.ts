import { request } from "../utils/request";

export interface OperationLogInfo {
  id: number;
  userId: number;
  username: string;
  operation: string;
  method: string;
  ip: string;
  errorMsg: string;
  duration: number;
  createdAt: string;
}

export interface OperationLogQueryParams {
  pageNum: number;
  pageSize: number;
  username?: string;
  operation?: string;
  startTime?: string;
  endTime?: string;
}

export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const logApi = {
  pageOperationLogs(
    params: OperationLogQueryParams,
  ): Promise<PageResponse<OperationLogInfo>> {
    return request.get<PageResponse<OperationLogInfo>>("/logs/operation", {
      params,
    });
  },

  getOperationLogById(id: number): Promise<OperationLogInfo> {
    return request.get<OperationLogInfo>(`/logs/operation/${id}`);
  },

  deleteOperationLogsBatch(ids: number[]): Promise<void> {
    return request.delete<void>("/logs/operation/batch", { data: ids });
  },

  clearOperationLogs(): Promise<void> {
    return request.delete<void>("/logs/operation/clear");
  },
};
