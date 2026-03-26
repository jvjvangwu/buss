package com.forum.modules.news.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 新闻 VO
 */
@Data
public class NewsVO {

    /**
     * 新闻ID
     */
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 摘要
     */
    private String summary;

    /**
     * 内容
     */
    private String content;

    /**
     * 封面图片URL
     */
    private String coverImage;

    /**
     * 作者信息
     */
    private AuthorInfo author;

    /**
     * 分类信息
     */
    private CategoryInfo category;

    /**
     * 标签列表
     */
    private List<TagInfo> tags;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 浏览次数
     */
    private Integer viewCount;

    /**
     * 点赞次数
     */
    private Integer likeCount;

    /**
     * 评论次数
     */
    private Integer commentCount;

    /**
     * 是否置顶
     */
    private Boolean isTop;

    /**
     * 是否热门
     */
    private Boolean isHot;

    /**
     * 发布时间
     */
    private LocalDateTime publishAt;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 作者信息
     */
    @Data
    public static class AuthorInfo {
        private Long id;
        private String nickname;
        private String avatar;
    }

    /**
     * 分类信息
     */
    @Data
    public static class CategoryInfo {
        private Long id;
        private String categoryName;
    }

    /**
     * 标签信息
     */
    @Data
    public static class TagInfo {
        private Long id;
        private String tagName;
        private String color;
    }
}
