package com.forum.modules.log.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.log.entity.OperationLog;
import com.forum.modules.log.service.OperationLogService;
import com.forum.modules.log.dto.OperationLogQueryDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 操作日志控制器
 */
@RestController
@RequestMapping("/api/v1/logs/operation")
@Tag(name = "操作日志管理", description = "操作日志相关接口")
@RequiredArgsConstructor
public class OperationLogController {
    
    private final OperationLogService operationLogService;
    
    @Operation(summary = "分页查询操作日志")
    @GetMapping
    public IPage<OperationLog> page(OperationLogQueryDTO queryDTO) {
        return operationLogService.page(queryDTO);
    }
    
    @Operation(summary = "获取操作日志详情")
    @GetMapping("/{id}")
    public OperationLog getById(@PathVariable Long id) {
        return operationLogService.getById(id);
    }
    
    @Operation(summary = "批量删除操作日志")
    @DeleteMapping("/batch")
    public void deleteBatch(@RequestBody Long[] ids) {
        operationLogService.deleteBatch(ids);
    }
    
    @Operation(summary = "清空操作日志")
    @DeleteMapping("/clear")
    public void clear() {
        operationLogService.clear();
    }
}
