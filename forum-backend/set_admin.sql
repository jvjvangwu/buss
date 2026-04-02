-- 设置 testuser 为超级管理员

-- 先删除 testuser 的现有角色
DELETE FROM user_role WHERE user_id = (SELECT id FROM sys_user WHERE username = 'testuser');

-- 为 testuser 添加超级管理员角色
INSERT INTO user_role (user_id, role_id)
VALUES (
    (SELECT id FROM sys_user WHERE username = 'testuser'),
    (SELECT id FROM sys_role WHERE code = 'ROLE_ADMIN')
);

-- 验证结果
SELECT u.username, r.name AS role_name, r.code AS role_code
FROM sys_user u
JOIN user_role ur ON u.id = ur.user_id
JOIN sys_role r ON ur.role_id = r.id
WHERE u.username = 'testuser';
