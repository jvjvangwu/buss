package com.forum.modules.file.dto;

import lombok.Data;

/**
 * 文件上传 DTO
 */
@Data
public class FileDTO {

    /**
     * 文件ID（更新时使用）
     */
    private Long id;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 描述
     */
    private String description;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;
}
