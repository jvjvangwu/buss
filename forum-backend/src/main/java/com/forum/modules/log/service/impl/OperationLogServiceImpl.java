package com.forum.modules.log.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.log.entity.OperationLog;
import com.forum.modules.log.mapper.OperationLogMapper;
import com.forum.modules.log.service.OperationLogService;
import com.forum.modules.log.dto.OperationLogQueryDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 操作日志服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OperationLogServiceImpl implements OperationLogService {
    
    private final OperationLogMapper operationLogMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(OperationLog operationLog) {
        operationLogMapper.insert(operationLog);
    }
    
    @Override
    public IPage<OperationLog> page(OperationLogQueryDTO queryDTO) {
        Page<OperationLog> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());
        return operationLogMapper.selectPage(page, queryDTO);
    }
    
    @Override
    public OperationLog getById(Long id) {
        return operationLogMapper.selectById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBatch(Long[] ids) {
        for (Long id : ids) {
            operationLogMapper.deleteById(id);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void clear() {
        // 清空所有操作日志
        operationLogMapper.delete(null);
    }
}
