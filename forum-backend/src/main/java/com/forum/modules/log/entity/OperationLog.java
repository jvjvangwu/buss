package com.forum.modules.log.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 操作日志实体
 */
@Data
@TableName("sys_operation_log")
public class OperationLog {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 操作人ID
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 操作人名称
     */
    @TableField("username")
    private String username;
    
    /**
     * 操作类型
     */
    @TableField("operation")
    private String operation;
    
    /**
     * 请求方法
     */
    @TableField("method")
    private String method;
    
    /**
     * 请求参数
     */
    @TableField("params")
    private String params;
    
    /**
     * 客户端IP
     */
    @TableField("ip")
    private String ip;
    
    /**
     * 响应结果
     */
    @TableField("result")
    private String result;
    
    /**
     * 错误信息
     */
    @TableField("error_msg")
    private String errorMsg;
    
    /**
     * 操作耗时 (毫秒)
     */
    @TableField("duration")
    private Integer duration;
    
    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
}
