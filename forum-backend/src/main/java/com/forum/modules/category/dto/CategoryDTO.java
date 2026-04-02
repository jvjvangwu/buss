package com.forum.modules.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 分类 DTO
 */
@Data
public class CategoryDTO {

    /**
     * 分类ID（更新时使用）
     */
    private Long id;

    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
    @Size(max = 50, message = "分类名称长度不能超过50个字符")
    private String categoryName;

    /**
     * 父分类ID
     */
    private Long parentId;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 描述
     */
    @Size(max = 200, message = "描述长度不能超过200个字符")
    private String description;

    /**
     * 图标
     */
    private String icon;
}