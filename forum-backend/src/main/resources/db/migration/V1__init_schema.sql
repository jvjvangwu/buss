-- 论坛系统数据库初始化脚本
-- 创建时间: 2026-03-26

-- 用户表
CREATE TABLE sys_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    gender SMALLINT DEFAULT 0,
    bio VARCHAR(200),
    status SMALLINT DEFAULT 1,
    wechat_openid VARCHAR(100) UNIQUE,
    wechat_unionid VARCHAR(100),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted SMALLINT DEFAULT 0
);

-- 角色表
CREATE TABLE sys_role (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    status SMALLINT DEFAULT 1,
    is_system SMALLINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted SMALLINT DEFAULT 0
);

-- 权限表
CREATE TABLE sys_permission (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    type SMALLINT NOT NULL,
    parent_id BIGINT,
    path VARCHAR(255),
    icon VARCHAR(50),
    sort INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

-- 角色权限关联表
CREATE TABLE role_permission (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

-- 新闻分类表
CREATE TABLE news_category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted SMALLINT DEFAULT 0
);

-- 新闻标签表
CREATE TABLE news_tag (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted SMALLINT DEFAULT 0
);

-- 新闻表
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500),
    content TEXT NOT NULL,
    cover VARCHAR(255),
    category_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    status SMALLINT DEFAULT 0,
    is_top SMALLINT DEFAULT 0,
    view_count INT DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted SMALLINT DEFAULT 0
);

-- 新闻标签关联表
CREATE TABLE news_tag_relation (
    news_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (news_id, tag_id)
);

-- 操作日志表
CREATE TABLE sys_operation_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50),
    operation VARCHAR(50) NOT NULL,
    method VARCHAR(200),
    params TEXT,
    ip VARCHAR(50),
    result TEXT,
    error_msg TEXT,
    duration INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE sys_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 文件表
CREATE TABLE sys_file (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    uploader_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_user_username ON sys_user(username);
CREATE INDEX idx_user_email ON sys_user(email);
CREATE INDEX idx_user_status ON sys_user(status);
CREATE INDEX idx_role_code ON sys_role(code);
CREATE INDEX idx_permission_parent_id ON sys_permission(parent_id);
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_operation_log_user_id ON sys_operation_log(user_id);
CREATE INDEX idx_operation_log_created_at ON sys_operation_log(created_at);

-- 插入默认管理员角色
INSERT INTO sys_role (name, code, description, status, is_system) 
VALUES ('超级管理员', 'ROLE_ADMIN', '系统超级管理员，拥有所有权限', 1, 1);

-- 插入默认普通用户角色
INSERT INTO sys_role (name, code, description, status, is_system) 
VALUES ('普通用户', 'ROLE_USER', '普通用户角色', 1, 0);

-- 插入默认系统配置
INSERT INTO sys_config (config_key, config_value, description) VALUES
('site_name', '企业论坛', '站点名称'),
('site_logo', '/logo.png', '站点Logo'),
('site_description', '企业级论坛系统', '站点描述'),
('items_per_page', '10', '每页显示条目数'),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx', '允许的文件类型'),
('max_file_size', '10485760', '最大文件大小(字节)');

-- 插入默认分类
INSERT INTO news_category (name, sort, status) VALUES
('公司动态', 1, 1),
('技术分享', 2, 1),
('产品更新', 3, 1),
('行业资讯', 4, 1);

-- 插入默认标签
INSERT INTO news_tag (name, color, status) VALUES
('重要', '#ff4d4f', 1),
('公告', '#faad14', 1),
('技术', '#1890ff', 1),
('产品', '#52c41a', 1);
