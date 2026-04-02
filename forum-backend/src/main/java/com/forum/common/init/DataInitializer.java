package com.forum.common.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 * 用于初始化权限、角色权限关联等基础数据
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("开始初始化基础数据...");
        initPermissions();
        initRolePermissions();
        log.info("基础数据初始化完成");
    }

    /**
     * 初始化权限数据
     */
    private void initPermissions() {
        // 检查是否已存在权限数据
        Long count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM sys_permission",
            Long.class
        );
        
        if (count != null && count > 0) {
            log.info("权限数据已存在，跳过初始化");
            return;
        }

        log.info("开始初始化权限数据...");
        
        String sql = """
            INSERT INTO sys_permission (parent_id, name, code, type, status, sort, created_at, updated_at) VALUES
            -- 用户管理权限 (type=1 表示模块, type=2 表示按钮)
            (0, '用户管理', 'user', 1, 1, 1, NOW(), NOW()),
            (1, '查看用户', 'user:view', 2, 1, 1, NOW(), NOW()),
            (1, '新增用户', 'user:create', 2, 1, 2, NOW(), NOW()),
            (1, '编辑用户', 'user:update', 2, 1, 3, NOW(), NOW()),
            (1, '删除用户', 'user:delete', 2, 1, 4, NOW(), NOW()),
            (1, '分配角色', 'user:assign-role', 2, 1, 5, NOW(), NOW()),
            
            -- 角色管理权限
            (0, '角色管理', 'role', 1, 1, 2, NOW(), NOW()),
            (7, '查看角色', 'role:view', 2, 1, 1, NOW(), NOW()),
            (7, '新增角色', 'role:create', 2, 1, 2, NOW(), NOW()),
            (7, '编辑角色', 'role:update', 2, 1, 3, NOW(), NOW()),
            (7, '删除角色', 'role:delete', 2, 1, 4, NOW(), NOW()),
            (7, '分配权限', 'role:assign-permission', 2, 1, 5, NOW(), NOW()),
            
            -- 权限管理权限
            (0, '权限管理', 'permission', 1, 1, 3, NOW(), NOW()),
            (13, '查看权限', 'permission:view', 2, 1, 1, NOW(), NOW()),
            
            -- 分类管理权限
            (0, '分类管理', 'category', 1, 1, 4, NOW(), NOW()),
            (15, '查看分类', 'category:view', 2, 1, 1, NOW(), NOW()),
            (15, '新增分类', 'category:create', 2, 1, 2, NOW(), NOW()),
            (15, '编辑分类', 'category:update', 2, 1, 3, NOW(), NOW()),
            (15, '删除分类', 'category:delete', 2, 1, 4, NOW(), NOW()),
            
            -- 标签管理权限
            (0, '标签管理', 'tag', 1, 1, 5, NOW(), NOW()),
            (20, '查看标签', 'tag:view', 2, 1, 1, NOW(), NOW()),
            (20, '新增标签', 'tag:create', 2, 1, 2, NOW(), NOW()),
            (20, '编辑标签', 'tag:update', 2, 1, 3, NOW(), NOW()),
            (20, '删除标签', 'tag:delete', 2, 1, 4, NOW(), NOW()),
            
            -- 新闻管理权限
            (0, '新闻管理', 'news', 1, 1, 6, NOW(), NOW()),
            (25, '查看新闻', 'news:view', 2, 1, 1, NOW(), NOW()),
            (25, '新增新闻', 'news:create', 2, 1, 2, NOW(), NOW()),
            (25, '编辑新闻', 'news:update', 2, 1, 3, NOW(), NOW()),
            (25, '删除新闻', 'news:delete', 2, 1, 4, NOW(), NOW()),
            (25, '发布新闻', 'news:publish', 2, 1, 5, NOW(), NOW()),
            
            -- 文件管理权限
            (0, '文件管理', 'file', 1, 1, 7, NOW(), NOW()),
            (31, '查看文件', 'file:view', 2, 1, 1, NOW(), NOW()),
            (31, '上传文件', 'file:upload', 2, 1, 2, NOW(), NOW()),
            (31, '编辑文件', 'file:update', 2, 1, 3, NOW(), NOW()),
            (31, '删除文件', 'file:delete', 2, 1, 4, NOW(), NOW()),
            
            -- 日志管理权限
            (0, '日志管理', 'log', 1, 1, 8, NOW(), NOW()),
            (36, '查看日志', 'log:view', 2, 1, 1, NOW(), NOW()),
            (36, '删除日志', 'log:delete', 2, 1, 2, NOW(), NOW());
            """;
        
        jdbcTemplate.execute(sql);
        log.info("权限数据初始化完成");
    }

    /**
     * 初始化角色权限关联数据
     */
    private void initRolePermissions() {
        // 检查是否已存在角色权限关联数据
        Long count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM role_permission",
            Long.class
        );
        
        if (count != null && count > 0) {
            log.info("角色权限关联数据已存在，跳过初始化");
            return;
        }

        log.info("开始初始化角色权限关联数据...");
        
        // 为超级管理员角色分配所有权限
        jdbcTemplate.execute("""
            INSERT INTO role_permission (role_id, permission_id)
            SELECT 1, id FROM sys_permission;
            """);
        
        // 为普通用户角色分配只读权限
        jdbcTemplate.execute("""
            INSERT INTO role_permission (role_id, permission_id) VALUES
            (2, 2),   -- user:view
            (2, 8),   -- role:view
            (2, 14),  -- category:view
            (2, 19),  -- tag:view
            (2, 24),  -- news:view
            (2, 30),  -- file:view
            (2, 35);  -- log:view
            """);
        
        log.info("角色权限关联数据初始化完成");
    }
}
