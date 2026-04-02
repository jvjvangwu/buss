package com.forum.common.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 添加权限管理权限数据
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AddPermissionData implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            log.info("开始添加权限管理权限数据...");
            
            // 检查是否已存在权限管理模块
            Long moduleCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM sys_permission WHERE code = 'permission'",
                Long.class
            );
            
            if (moduleCount != null && moduleCount > 0) {
                log.info("权限管理权限数据已存在，跳过添加");
                return;
            }
            
            // 添加权限管理模块
            jdbcTemplate.execute(
                "INSERT INTO sys_permission (parent_id, name, code, type, status, sort, created_at, updated_at) " +
                "VALUES (0, '权限管理', 'permission', 1, 1, 3, NOW(), NOW())"
            );
            
            // 获取权限管理模块的ID
            Long moduleId = jdbcTemplate.queryForObject(
                "SELECT id FROM sys_permission WHERE code = 'permission'",
                Long.class
            );
            
            if (moduleId != null) {
                // 添加查看权限
                jdbcTemplate.execute(
                    String.format("INSERT INTO sys_permission (parent_id, name, code, type, status, sort, created_at, updated_at) " +
                    "VALUES (%d, '查看权限', 'permission:view', 2, 1, 1, NOW(), NOW())", moduleId)
                );
                
                // 为超级管理员角色分配权限管理权限
                jdbcTemplate.execute(
                    "INSERT INTO role_permission (role_id, permission_id) " +
                    "SELECT 1, id FROM sys_permission WHERE code IN ('permission', 'permission:view')"
                );
                
                log.info("权限管理权限数据添加完成");
            }
        } catch (Exception e) {
                log.error("添加权限管理权限数据失败", e);
        }
    }
}
