-- 初始化权限数据
INSERT INTO sys_permission (parent_id, name, code, type, status, sort, created_at, updated_at) VALUES
-- 用户管理权限
(0, '用户管理', 'user', 'module', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '查看用户', 'user:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '新增用户', 'user:create', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '编辑用户', 'user:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '删除用户', 'user:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '分配角色', 'user:assign-role', 'button', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 角色管理权限
(0, '角色管理', 'role', 'module', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '查看角色', 'role:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '新增角色', 'role:create', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '编辑角色', 'role:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '删除角色', 'role:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '分配权限', 'role:assign-permission', 'button', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 分类管理权限
(0, '分类管理', 'category', 'module', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, '查看分类', 'category:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, '新增分类', 'category:create', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, '编辑分类', 'category:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, '删除分类', 'category:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 标签管理权限
(0, '标签管理', 'tag', 'module', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, '查看标签', 'tag:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, '新增标签', 'tag:create', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, '编辑标签', 'tag:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, '删除标签', 'tag:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 新闻管理权限
(0, '新闻管理', 'news', 'module', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, '查看新闻', 'news:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, '新增新闻', 'news:create', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, '编辑新闻', 'news:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, '删除新闻', 'news:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, '发布新闻', 'news:publish', 'button', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 文件管理权限
(0, '文件管理', 'file', 'module', 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, '查看文件', 'file:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, '上传文件', 'file:upload', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, '编辑文件', 'file:update', 'button', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, '删除文件', 'file:delete', 'button', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 日志管理权限
(0, '日志管理', 'log', 'module', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, '查看日志', 'log:view', 'button', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, '删除日志', 'log:delete', 'button', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 为超级管理员角色分配所有权限
INSERT INTO role_permission (role_id, permission_id)
SELECT 1, id FROM sys_permission;

-- 为普通用户角色分配部分权限（只读权限）
INSERT INTO role_permission (role_id, permission_id) VALUES
(2, 2),   -- user:view
(2, 8),   -- role:view
(2, 14),  -- category:view
(2, 19),  -- tag:view
(2, 24),  -- news:view
(2, 30),  -- file:view
(2, 35);  -- log:view
