import { request } from "../utils/request";

export interface FileInfo {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileQueryParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  fileType?: string;
}

export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const fileApi = {
  pageFiles(params: FileQueryParams): Promise<PageResponse<FileInfo>> {
    return request.get<PageResponse<FileInfo>>("/files", { params });
  },

  uploadFile(formData: FormData): Promise<FileInfo> {
    return request.post<FileInfo>("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  batchUploadFiles(formData: FormData): Promise<FileInfo[]> {
    return request.post<FileInfo[]>("/files/batch-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateFile(id: number, params: any): Promise<FileInfo> {
    return request.put<FileInfo>(`/files/${id}`, params);
  },

  deleteFile(id: number): Promise<void> {
    return request.delete<void>(`/files/${id}`);
  },

  getFileById(id: number): Promise<FileInfo> {
    return request.get<FileInfo>(`/files/${id}`);
  },

  downloadFile(fileName: string): string {
    return `/api/v1/files/download/${fileName}`;
  },
};
