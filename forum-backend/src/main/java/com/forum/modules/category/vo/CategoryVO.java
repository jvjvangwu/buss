package com.forum.modules.category.vo;

import lombok.Data;

import java.util.List;

/**
 * 分类 VO
 */
@Data
public class CategoryVO {

    /**
     * 分类ID
     */
    private Long id;

    /**
     * 分类名称
     */
    private String categoryName;

    /**
     * 父分类ID
     */
    private Long parentId;

    /**
     * 分类路径
     */
    private String categoryPath;

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
     * 图标
     */
    private String icon;

    /**
     * 子分类
     */
    private List<CategoryVO> children;
}