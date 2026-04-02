import { request } from "@/utils/request";

// 新闻信息
export interface NewsInfo {
  id: number;
  title: string;
  summary?: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  category?: {
    id: number;
    categoryName: string;
  };
  authorId: number;
  author?: {
    id: number;
    nickname: string;
  };
  status: number;
  isTop: boolean;
  isHot: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{
    id: number;
    tagName: string;
    color?: string;
  }>;
}

// 标签信息
export interface TagInfo {
  id: number;
  tagName: string;
  color?: string;
  sort: number;
  status: number;
}

// 分类信息
export interface CategoryInfo {
  id: number;
  categoryName: string;
  parentId: number;
  categoryPath: string;
  sort: number;
  status: number;
  description?: string;
  icon?: string;
  children?: CategoryInfo[];
}

// 新闻查询参数
export interface NewsQueryParams {
  keyword?: string;
  categoryId?: number;
  status?: number;
  pageNum?: number;
  pageSize?: number;
}

// 新闻创建/更新参数
export interface NewsParams {
  id?: number;
  title: string;
  summary?: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  tagIds?: number[];
  isOriginal?: boolean;
  source?: string;
  sourceUrl?: string;
}

// 分页响应
export interface PageResponse<T> {
  data: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 新闻相关 API
export const newsApi = {
  /**
   * 分页查询新闻列表
   */
  pageNews(params: NewsQueryParams): Promise<PageResponse<NewsInfo>> {
    return request.get<PageResponse<NewsInfo>>("/v1/news", { params });
  },

  /**
   * 获取新闻详情
   */
  getNews(id: number): Promise<NewsInfo> {
    return request.get<NewsInfo>(`/v1/news/${id}`);
  },

  /**
   * 创建新闻
   */
  createNews(params: NewsParams): Promise<NewsInfo> {
    return request.post<NewsInfo>("/v1/news", params);
  },

  /**
   * 更新新闻
   */
  updateNews(id: number, params: NewsParams): Promise<NewsInfo> {
    return request.put<NewsInfo>(`/v1/news/${id}`, params);
  },

  /**
   * 删除新闻
   */
  deleteNews(id: number): Promise<void> {
    return request.delete<void>(`/v1/news/${id}`);
  },

  /**
   * 发布新闻
   */
  publishNews(id: number): Promise<void> {
    return request.put<void>(`/v1/news/${id}/publish`);
  },

  /**
   * 下架新闻
   */
  offlineNews(id: number): Promise<void> {
    return request.put<void>(`/v1/news/${id}/offline`);
  },

  /**
   * 置顶新闻
   */
  setTopNews(id: number, top: boolean): Promise<void> {
    return request.put<void>(`/v1/news/${id}/top`, null, { params: { top } });
  },

  /**
   * 设置热门
   */
  setHotNews(id: number, hot: boolean): Promise<void> {
    return request.put<void>(`/v1/news/${id}/hot`, null, { params: { hot } });
  },

  /**
   * 获取公开新闻列表
   */
  getPublicNewsList(params: NewsQueryParams): Promise<PageResponse<NewsInfo>> {
    return request.get<PageResponse<NewsInfo>>('/v1/news/public/list', { params });
  },

  /**
   * 获取精选新闻
   */
  getFeaturedNews(params: NewsQueryParams): Promise<PageResponse<NewsInfo>> {
    return request.get<PageResponse<NewsInfo>>('/v1/news/public/featured', { params });
  },

  /**
   * 点赞新闻
   */
  likeNews(id: number): Promise<void> {
    return request.put<void>(`/v1/news/${id}/like`);
  },
};

// 分类相关 API
export const categoryApi = {
  /**
   * 分页查询分类列表
   */
  pageCategories(params: {
    pageNum: number;
    pageSize: number;
  }): Promise<PageResponse<CategoryInfo>> {
    return request.get<PageResponse<CategoryInfo>>("/categories", { params });
  },

  /**
   * 获取分类树
   */
  getCategoryTree(): Promise<CategoryInfo[]> {
    return request.get<CategoryInfo[]>("/categories/tree");
  },

  /**
   * 创建分类
   */
  createCategory(params: any): Promise<CategoryInfo> {
    return request.post<CategoryInfo>("/categories", params);
  },

  /**
   * 更新分类
   */
  updateCategory(id: number, params: any): Promise<CategoryInfo> {
    return request.put<CategoryInfo>(`/categories/${id}`, params);
  },

  /**
   * 删除分类
   */
  deleteCategory(id: number): Promise<void> {
    return request.delete<void>(`/categories/${id}`);
  },
};

// 标签相关 API
export const tagApi = {
  /**
   * 分页查询标签列表
   */
  pageTags(params: {
    pageNum: number;
    pageSize: number;
    keyword?: string;
  }): Promise<PageResponse<TagInfo>> {
    return request.get<PageResponse<TagInfo>>("/tags", { params });
  },

  /**
   * 获取所有启用的标签
   */
  getAllEnabledTags(): Promise<TagInfo[]> {
    return request.get<TagInfo[]>("/tags/enabled");
  },

  /**
   * 创建标签
   */
  createTag(params: any): Promise<TagInfo> {
    return request.post<TagInfo>("/tags", params);
  },

  /**
   * 更新标签
   */
  updateTag(id: number, params: any): Promise<TagInfo> {
    return request.put<TagInfo>(`/tags/${id}`, params);
  },

  /**
   * 删除标签
   */
  deleteTag(id: number): Promise<void> {
    return request.delete<void>(`/tags/${id}`);
  },
};

// 导出新闻相关 API
export const getNewsList = (params: NewsQueryParams) => newsApi.getPublicNewsList(params);
export const getFeaturedNews = (params: NewsQueryParams) => newsApi.getFeaturedNews(params);
export const getNewsById = (id: number) => newsApi.getNews(id);
export const likeNews = (id: number) => newsApi.likeNews(id);
