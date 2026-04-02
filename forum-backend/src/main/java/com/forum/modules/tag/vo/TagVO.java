package com.forum.modules.tag.vo;

import lombok.Data;

/**
 * 标签 VO
 */
@Data
public class TagVO {

    /**
     * 标签ID
     */
    private Long id;

    /**
     * 标签名称
     */
    private String tagName;

    /**
     * 标签颜色
     */
    private String color;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 描述
     */
    private String description;

    /**
     * 使用次数
     */
    private Integer useCount;
}
