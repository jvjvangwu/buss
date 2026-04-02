package com.forum.modules.log.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 操作日志查询DTO
 */
@Data
public class OperationLogQueryDTO {
    
    /**
     * 操作类型
     */
    private String operationType;
    
    /**
     * 操作人名称
     */
    private String operatorName;
    
    /**
     * 开始时间
     */
    private LocalDateTime startTime;
    
    /**
     * 结束时间
     */
    private LocalDateTime endTime;
    
    /**
     * 操作状态
     */
    private Integer status;
    
    /**
     * 关键字
     */
    private String keyword;
    
    /**
     * 页码
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
}
