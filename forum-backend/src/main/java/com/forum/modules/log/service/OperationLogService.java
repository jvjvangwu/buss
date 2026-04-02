package com.forum.modules.log.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.log.entity.OperationLog;
import com.forum.modules.log.dto.OperationLogQueryDTO;

/**
 * 操作日志服务
 */
public interface OperationLogService {
    
    /**
     * 保存操作日志
     */
    void save(OperationLog operationLog);
    
    /**
     * 分页查询操作日志
     */
    IPage<OperationLog> page(OperationLogQueryDTO queryDTO);
    
    /**
     * 根据ID获取操作日志
     */
    OperationLog getById(Long id);
    
    /**
     * 批量删除操作日志
     */
    void deleteBatch(Long[] ids);
    
    /**
     * 清空操作日志
     */
    void clear();
}
