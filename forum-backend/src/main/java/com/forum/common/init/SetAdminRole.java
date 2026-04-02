package com.forum.common.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 设置用户为超级管理员
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SetAdminRole implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("开始设置超级管理员角色...");
        setAdminRoleForUser();
        log.info("超级管理员角色设置完成");
    }

    /**
     * 为 testuser 设置超级管理员角色
     */
    private void setAdminRoleForUser() {
        try {
            // 先删除 testuser 的现有角色
            jdbcTemplate.update("DELETE FROM user_role WHERE user_id = (SELECT id FROM sys_user WHERE username = 'testuser')");
            
            // 为 testuser 添加超级管理员角色
            jdbcTemplate.update("""
                INSERT INTO user_role (user_id, role_id)
                VALUES (
                    (SELECT id FROM sys_user WHERE username = 'testuser'),
                    (SELECT id FROM sys_role WHERE code = 'ROLE_ADMIN')
                )
                """);
            
            log.info("成功为 testuser 设置超级管理员角色");
        } catch (Exception e) {
            log.error("设置超级管理员角色失败: {}", e.getMessage());
        }
    }
}
