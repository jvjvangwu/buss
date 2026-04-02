package com.forum.modules.tag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 标签 DTO
 */
@Data
public class TagDTO {

    /**
     * 标签ID（更新时使用）
     */
    private Long id;

    /**
     * 标签名称
     */
    @NotBlank(message = "标签名称不能为空")
    @Size(max = 30, message = "标签名称长度不能超过30个字符")
    private String tagName;

    /**
     * 标签颜色
     */
    @Size(max = 20, message = "标签颜色长度不能超过20个字符")
    private String color;

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
    @Size(max = 100, message = "描述长度不能超过100个字符")
    private String description;
}