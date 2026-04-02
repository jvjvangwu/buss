package com.forum.modules.log.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.log.entity.OperationLog;
import com.forum.modules.log.dto.OperationLogQueryDTO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 操作日志Mapper
 */
@Mapper
public interface OperationLogMapper extends BaseMapper<OperationLog> {
    
    /**
     * 分页查询操作日志
     */
    IPage<OperationLog> selectPage(Page<OperationLog> page, OperationLogQueryDTO queryDTO);
}
