package com.forum.modules.file.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文件 VO
 */
@Data
public class FileVO {

    /**
     * 文件ID
     */
    private Long id;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 原始文件名
     */
    private String originalName;

    /**
     * 文件路径
     */
    private String filePath;

    /**
     * 文件类型
     */
    private String fileType;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * 文件大小（格式化）
     */
    private String fileSizeFormat;

    /**
     * 文件MD5
     */
    private String md5;

    /**
     * 存储类型
     */
    private Integer storageType;

    /**
     * 访问URL
     */
    private String url;

    /**
     * 上传用户ID
     */
    private Long uploadUserId;

    /**
     * 上传用户名
     */
    private String uploadUserName;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 描述
     */
    private String description;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}
