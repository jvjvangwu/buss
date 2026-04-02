package com.forum.common.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 直接设置用户为超级管理员
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SetAdminRoleDirect implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("开始设置 testuser 为超级管理员...");
        
        try {
            // 检查是否存在超级管理员角色
            Integer adminRoleCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM sys_role WHERE code = 'ROLE_ADMIN'",
                Integer.class
            );
            
            if (adminRoleCount == null || adminRoleCount == 0) {
                log.error("超级管理员角色不存在，创建角色...");
                jdbcTemplate.update("""
                    INSERT INTO sys_role (name, code, description, status, is_system, created_at, updated_at, deleted)
                    VALUES ('超级管理员', 'ROLE_ADMIN', '系统超级管理员', 1, 1, NOW(), NOW(), 0)
                    """);
                log.info("超级管理员角色创建成功");
            }
            
            // 删除 testuser 的现有角色
            jdbcTemplate.update("""
                DELETE FROM user_role 
                WHERE user_id = (SELECT id FROM sys_user WHERE username = 'testuser')
                """);
            log.info("已删除 testuser 的现有角色");
            
            // 为 testuser 添加超级管理员角色
            jdbcTemplate.update("""
                INSERT INTO user_role (user_id, role_id)
                VALUES (
                    (SELECT id FROM sys_user WHERE username = 'testuser'),
                    (SELECT id FROM sys_role WHERE code = 'ROLE_ADMIN')
                )
                """);
            log.info("已为 testuser 添加超级管理员角色");
            
            // 验证结果
            Integer roleCount = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) 
                FROM user_role ur
                JOIN sys_role r ON ur.role_id = r.id
                WHERE ur.user_id = (SELECT id FROM sys_user WHERE username = 'testuser')
                AND r.code = 'ROLE_ADMIN'
                """,
                Integer.class
            );
            
            if (roleCount != null && roleCount > 0) {
                log.info("成功设置 testuser 为超级管理员");
            } else {
                log.error("设置 testuser 为超级管理员失败");
            }
            
        } catch (Exception e) {
            log.error("设置超级管理员失败: {}", e.getMessage());
            e.printStackTrace();
        }
        
        log.info("超级管理员设置完成");
    }
}
