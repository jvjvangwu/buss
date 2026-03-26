package com.forum.modules.news.dto;

import lombok.Data;

/**
 * 新闻查询 DTO
 */
@Data
public class NewsQueryDTO {

    /**
     * 标题关键词
     */
    private String keyword;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 作者ID
     */
    private Long authorId;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 是否置顶
     */
    private Boolean isTop;

    /**
     * 是否热门
     */
    private Boolean isHot;

    /**
     * 页码
     */
    private Integer pageNum = 1;

    /**
     * 每页大小
     */
    private Integer pageSize = 10;
}
