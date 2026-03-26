# 论坛项目技术规范文档

## 1. 项目目录结构

### 1.1 前端目录结构（Vue3 + TypeScript + Vite）

```
forum-frontend/
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/                   # API 接口层
│   │   ├── auth.ts           # 认证相关接口
│   │   ├── user.ts           # 用户相关接口
│   │   ├── news.ts           # 新闻相关接口
│   │   └── index.ts          # API 统一导出
│   ├── assets/               # 静态资源
│   │   ├── images/
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   └── global.scss
│   │   └── icons/
│   ├── components/           # 公共组件
│   │   ├── common/           # 通用组件
│   │   │   ├── Button.vue
│   │   │   ├── Modal.vue
│   │   │   └── Table.vue
│   │   ├── layout/           # 布局组件
│   │   │   ├── Header.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── Footer.vue
│   │   │   └── MainLayout.vue
│   │   └── business/         # 业务组件
│   │       ├── NewsCard.vue
│   │       ├── CommentList.vue
│   │       └── UserAvatar.vue
│   ├── composables/          # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   └── useTable.ts
│   ├── directives/           # 自定义指令
│   │   ├── permission.ts     # 权限指令
│   │   └── loading.ts
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useRequest.ts
│   │   └── useStorage.ts
│   ├── router/               # 路由配置
│   │   ├── index.ts
│   │   ├── routes.ts         # 路由表
│   │   └── guards.ts         # 路由守卫
│   ├── stores/               # Pinia 状态管理
│   │   ├── index.ts
│   │   ├── modules/
│   │   │   ├── user.ts
│   │   │   ├── permission.ts
│   │   │   └── app.ts
│   ├── types/                # TypeScript 类型定义
│   │   ├── api.d.ts
│   │   ├── user.d.ts
│   │   ├── news.d.ts
│   │   └── global.d.ts
│   ├── utils/                # 工具函数
│   │   ├── request.ts        # Axios 封装
│   │   ├── auth.ts           # Token 管理
│   │   ├── permission.ts     # 权限工具
│   │   ├── storage.ts        # 本地存储
│   │   └── validate.ts       # 表单验证
│   ├── views/                # 页面视图
│   │   ├── auth/
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── news/
│   │   │   ├── List.vue
│   │   │   ├── Detail.vue
│   │   │   └── Edit.vue
│   │   ├── user/
│   │   │   ├── Profile.vue
│   │   │   └── Settings.vue
│   │   └── error/
│   │       ├── 404.vue
│   │       └── 403.vue
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
├── .env.development          # 开发环境配置
├── .env.production           # 生产环境配置
├── .eslintrc.js              # ESLint 配置
├── .prettierrc               # Prettier 配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── package.json
```

### 1.2 后端目录结构（Spring Boot 3）

```
forum-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── forum/
│   │   │           ├── ForumApplication.java
│   │   │           ├── common/              # 公共模块
│   │   │           │   ├── config/          # 配置类
│   │   │           │   │   ├── SecurityConfig.java
│   │   │           │   │   ├── CorsConfig.java
│   │   │           │   │   ├── SwaggerConfig.java
│   │   │           │   │   └── MyBatisConfig.java
│   │   │           │   ├── constant/        # 常量定义
│   │   │           │   │   ├── SecurityConstants.java
│   │   │           │   │   └── SystemConstants.java
│   │   │           │   ├── enums/           # 枚举类
│   │   │           │   │   ├── ResultCode.java
│   │   │           │   │   └── UserStatus.java
│   │   │           │   ├── exception/       # 异常处理
│   │   │           │   │   ├── GlobalExceptionHandler.java
│   │   │           │   │   ├── BusinessException.java
│   │   │           │   │   └── AuthenticationException.java
│   │   │           │   └── utils/           # 工具类
│   │   │           │       ├── JwtUtils.java
│   │   │           │       ├── RedisUtils.java
│   │   │           │       └── BeanCopyUtils.java
│   │   │           ├── security/            # 安全模块
│   │   │           │   ├── filter/
│   │   │           │   │   └── JwtAuthenticationFilter.java
│   │   │           │   ├── handler/
│   │   │           │   │   ├── AuthenticationEntryPointImpl.java
│   │   │           │   │   └── AccessDeniedHandlerImpl.java
│   │   │           │   ├── service/
│   │   │           │   │   ├── UserDetailsServiceImpl.java
│   │   │           │   │   └── PermissionService.java
│   │   │           │   └── WechatOAuthService.java
│   │   │           ├── modules/             # 业务模块
│   │   │           │   ├── user/            # 用户模块
│   │   │           │   │   ├── controller/
│   │   │           │   │   │   └── UserController.java
│   │   │           │   │   ├── service/
│   │   │           │   │   │   ├── UserService.java
│   │   │           │   │   │   └── impl/
│   │   │           │   │   │       └── UserServiceImpl.java
│   │   │           │   │   ├── mapper/
│   │   │           │   │   │   └── UserMapper.java
│   │   │           │   │   ├── entity/
│   │   │           │   │   │   └── User.java
│   │   │           │   │   ├── dto/
│   │   │           │   │   │   ├── UserDTO.java
│   │   │           │   │   │   └── UserQueryDTO.java
│   │   │           │   │   └── vo/
│   │   │           │   │       └── UserVO.java
│   │   │           │   ├── role/            # 角色模块
│   │   │           │   │   ├── controller/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── mapper/
│   │   │           │   │   ├── entity/
│   │   │           │   │   └── dto/
│   │   │           │   ├── permission/      # 权限模块
│   │   │           │   │   ├── controller/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── mapper/
│   │   │           │   │   ├── entity/
│   │   │           │   │   └── dto/
│   │   │           │   ├── news/            # 新闻模块
│   │   │           │   │   ├── controller/
│   │   │           │   │   │   └── NewsController.java
│   │   │           │   │   ├── service/
│   │   │           │   │   │   ├── NewsService.java
│   │   │           │   │   │   └── impl/
│   │   │           │   │   │       └── NewsServiceImpl.java
│   │   │           │   │   ├── mapper/
│   │   │           │   │   │   └── NewsMapper.java
│   │   │           │   │   ├── entity/
│   │   │           │   │   │   └── News.java
│   │   │           │   │   ├── dto/
│   │   │           │   │   │   ├── NewsDTO.java
│   │   │           │   │   │   └── NewsQueryDTO.java
│   │   │           │   │   └── vo/
│   │   │           │   │       └── NewsVO.java
│   │   │           │   ├── category/        # 分类模块
│   │   │           │   └── tag/             # 标签模块
│   │   │           └── api/                 # API 统一响应
│   │   │               └── Result.java
│   │   └── resources/
│   │       ├── application.yml              # 主配置文件
│   │       ├── application-dev.yml          # 开发环境配置
│   │       ├── application-prod.yml         # 生产环境配置
│   │       ├── mapper/                      # MyBatis XML
│   │       │   ├── UserMapper.xml
│   │       │   └── NewsMapper.xml
│   │       └── db/                          # 数据库脚本
│   │           └── migration/
│   └── test/                                # 测试代码
│       └── java/
│           └── com/
│               └── forum/
│                   └── ForumApplicationTests.java
├── pom.xml                                  # Maven 配置
└── README.md
```

---

## 2. 核心数据库表 DDL（PostgreSQL 15+）

### 2.1 用户表（users）

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) COMMENT '密码（BCrypt加密）',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    nickname VARCHAR(100) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像URL',
    gender SMALLINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    birthday DATE COMMENT '生日',
    bio TEXT COMMENT '个人简介',
    wechat_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    wechat_unionid VARCHAR(100) UNIQUE COMMENT '微信UnionID',
    status SMALLINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常，2-待激活',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    last_login_at TIMESTAMP COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID'
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_wechat_openid ON users(wechat_openid);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.id IS '用户ID';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.password IS '密码（BCrypt加密）';
COMMENT ON COLUMN users.email IS '邮箱';
COMMENT ON COLUMN users.phone IS '手机号';
COMMENT ON COLUMN users.nickname IS '昵称';
COMMENT ON COLUMN users.avatar IS '头像URL';
COMMENT ON COLUMN users.gender IS '性别：0-未知，1-男，2-女';
COMMENT ON COLUMN users.birthday IS '生日';
COMMENT ON COLUMN users.bio IS '个人简介';
COMMENT ON COLUMN users.wechat_openid IS '微信OpenID';
COMMENT ON COLUMN users.wechat_unionid IS '微信UnionID';
COMMENT ON COLUMN users.status IS '状态：0-禁用，1-正常，2-待激活';
COMMENT ON COLUMN users.email_verified IS '邮箱是否验证';
COMMENT ON COLUMN users.last_login_at IS '最后登录时间';
COMMENT ON COLUMN users.last_login_ip IS '最后登录IP';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';
COMMENT ON COLUMN users.deleted_at IS '软删除时间';
COMMENT ON COLUMN users.created_by IS '创建人ID';
COMMENT ON COLUMN users.updated_by IS '更新人ID';
```

### 2.2 角色表（roles）

```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(255) COMMENT '角色描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status SMALLINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID'
);

CREATE INDEX idx_roles_role_code ON roles(role_code);
CREATE INDEX idx_roles_status ON roles(status);

COMMENT ON TABLE roles IS '角色表';
COMMENT ON COLUMN roles.id IS '角色ID';
COMMENT ON COLUMN roles.role_name IS '角色名称';
COMMENT ON COLUMN roles.role_code IS '角色编码';
COMMENT ON COLUMN roles.description IS '角色描述';
COMMENT ON COLUMN roles.sort_order IS '排序';
COMMENT ON COLUMN roles.status IS '状态：0-禁用，1-正常';
COMMENT ON COLUMN roles.created_at IS '创建时间';
COMMENT ON COLUMN roles.updated_at IS '更新时间';
COMMENT ON COLUMN roles.deleted_at IS '软删除时间';
COMMENT ON COLUMN roles.created_by IS '创建人ID';
COMMENT ON COLUMN roles.updated_by IS '更新人ID';

-- 初始化角色数据
INSERT INTO roles (role_name, role_code, description, sort_order) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限', 1),
('管理员', 'ADMIN', '系统管理员，拥有大部分管理权限', 2),
('版主', 'MODERATOR', '版主，负责内容审核', 3),
('普通用户', 'USER', '普通注册用户', 4),
('游客', 'GUEST', '未登录游客', 5);
```

### 2.3 权限表（permissions）

```sql
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码（如：user:create）',
    resource_type VARCHAR(50) NOT NULL COMMENT '资源类型：menu-菜单，button-按钮，api-API接口',
    resource_url VARCHAR(255) COMMENT '资源路径',
    parent_id BIGINT DEFAULT 0 COMMENT '父权限ID',
    description VARCHAR(255) COMMENT '权限描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status SMALLINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID'
);

CREATE INDEX idx_permissions_permission_code ON permissions(permission_code);
CREATE INDEX idx_permissions_resource_type ON permissions(resource_type);
CREATE INDEX idx_permissions_parent_id ON permissions(parent_id);
CREATE INDEX idx_permissions_status ON permissions(status);

COMMENT ON TABLE permissions IS '权限表';
COMMENT ON COLUMN permissions.id IS '权限ID';
COMMENT ON COLUMN permissions.permission_name IS '权限名称';
COMMENT ON COLUMN permissions.permission_code IS '权限编码（如：user:create）';
COMMENT ON COLUMN permissions.resource_type IS '资源类型：menu-菜单，button-按钮，api-API接口';
COMMENT ON COLUMN permissions.resource_url IS '资源路径';
COMMENT ON COLUMN permissions.parent_id IS '父权限ID';
COMMENT ON COLUMN permissions.description IS '权限描述';
COMMENT ON COLUMN permissions.sort_order IS '排序';
COMMENT ON COLUMN permissions.status IS '状态：0-禁用，1-正常';
COMMENT ON COLUMN permissions.created_at IS '创建时间';
COMMENT ON COLUMN permissions.updated_at IS '更新时间';
COMMENT ON COLUMN permissions.deleted_at IS '软删除时间';
COMMENT ON COLUMN permissions.created_by IS '创建人ID';
COMMENT ON COLUMN permissions.updated_by IS '更新人ID';

-- 初始化权限数据（按钮级权限示例）
INSERT INTO permissions (permission_name, permission_code, resource_type, resource_url, parent_id, description, sort_order) VALUES
-- 用户管理模块
('用户管理', 'user:manage', 'menu', '/user', 0, '用户管理菜单', 1),
('查看用户', 'user:view', 'button', '/api/users', 1, '查看用户列表', 1),
('创建用户', 'user:create', 'button', '/api/users', 1, '创建新用户', 2),
('编辑用户', 'user:edit', 'button', '/api/users/*', 1, '编辑用户信息', 3),
('删除用户', 'user:delete', 'button', '/api/users/*', 1, '删除用户', 4),
('分配角色', 'user:assign-role', 'button', '/api/users/*/roles', 1, '为用户分配角色', 5),

-- 角色管理模块
('角色管理', 'role:manage', 'menu', '/role', 0, '角色管理菜单', 2),
('查看角色', 'role:view', 'button', '/api/roles', 7, '查看角色列表', 1),
('创建角色', 'role:create', 'button', '/api/roles', 7, '创建新角色', 2),
('编辑角色', 'role:edit', 'button', '/api/roles/*', 7, '编辑角色信息', 3),
('删除角色', 'role:delete', 'button', '/api/roles/*', 7, '删除角色', 4),
('分配权限', 'role:assign-permission', 'button', '/api/roles/*/permissions', 7, '为角色分配权限', 5),

-- 新闻管理模块
('新闻管理', 'news:manage', 'menu', '/news', 0, '新闻管理菜单', 3),
('查看新闻', 'news:view', 'button', '/api/news', 13, '查看新闻列表', 1),
('创建新闻', 'news:create', 'button', '/api/news', 13, '创建新闻', 2),
('编辑新闻', 'news:edit', 'button', '/api/news/*', 13, '编辑新闻', 3),
('删除新闻', 'news:delete', 'button', '/api/news/*', 13, '删除新闻', 4),
('发布新闻', 'news:publish', 'button', '/api/news/*/publish', 13, '发布新闻', 5),
('审核新闻', 'news:audit', 'button', '/api/news/*/audit', 13, '审核新闻', 6);
```

### 2.4 用户角色关联表（user_roles）

```sql
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    created_by BIGINT COMMENT '创建人ID',
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

COMMENT ON TABLE user_roles IS '用户角色关联表';
COMMENT ON COLUMN user_roles.id IS '主键ID';
COMMENT ON COLUMN user_roles.user_id IS '用户ID';
COMMENT ON COLUMN user_roles.role_id IS '角色ID';
COMMENT ON COLUMN user_roles.created_at IS '创建时间';
COMMENT ON COLUMN user_roles.created_by IS '创建人ID';
```

### 2.5 角色权限关联表（role_permissions）

```sql
CREATE TABLE role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    created_by BIGINT COMMENT '创建人ID',
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

COMMENT ON TABLE role_permissions IS '角色权限关联表';
COMMENT ON COLUMN role_permissions.id IS '主键ID';
COMMENT ON COLUMN role_permissions.role_id IS '角色ID';
COMMENT ON COLUMN role_permissions.permission_id IS '权限ID';
COMMENT ON COLUMN role_permissions.created_at IS '创建时间';
COMMENT ON COLUMN role_permissions.created_by IS '创建人ID';
```

### 2.6 新闻表（news）

```sql
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '标题',
    summary VARCHAR(500) COMMENT '摘要',
    content TEXT NOT NULL COMMENT '内容',
    cover_image VARCHAR(500) COMMENT '封面图片URL',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    category_id BIGINT COMMENT '分类ID',
    status SMALLINT DEFAULT 0 COMMENT '状态：0-草稿，1-待审核，2-已发布，3-已下架，4-已拒绝',
    publish_at TIMESTAMP COMMENT '发布时间',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    comment_count INT DEFAULT 0 COMMENT '评论次数',
    is_top BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    is_original BOOLEAN DEFAULT TRUE COMMENT '是否原创',
    source VARCHAR(200) COMMENT '来源',
    source_url VARCHAR(500) COMMENT '来源URL',
    audit_status SMALLINT COMMENT '审核状态：0-待审核，1-通过，2-拒绝',
    audit_by BIGINT COMMENT '审核人ID',
    audit_at TIMESTAMP COMMENT '审核时间',
    audit_remark VARCHAR(500) COMMENT '审核备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID',
    CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_news_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_news_title ON news(title);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_publish_at ON news(publish_at);
CREATE INDEX idx_news_is_top ON news(is_top);
CREATE INDEX idx_news_is_hot ON news(is_hot);
CREATE INDEX idx_news_created_at ON news(created_at);

COMMENT ON TABLE news IS '新闻表';
COMMENT ON COLUMN news.id IS '新闻ID';
COMMENT ON COLUMN news.title IS '标题';
COMMENT ON COLUMN news.summary IS '摘要';
COMMENT ON COLUMN news.content IS '内容';
COMMENT ON COLUMN news.cover_image IS '封面图片URL';
COMMENT ON COLUMN news.author_id IS '作者ID';
COMMENT ON COLUMN news.category_id IS '分类ID';
COMMENT ON COLUMN news.status IS '状态：0-草稿，1-待审核，2-已发布，3-已下架，4-已拒绝';
COMMENT ON COLUMN news.publish_at IS '发布时间';
COMMENT ON COLUMN news.view_count IS '浏览次数';
COMMENT ON COLUMN news.like_count IS '点赞次数';
COMMENT ON COLUMN news.comment_count IS '评论次数';
COMMENT ON COLUMN news.is_top IS '是否置顶';
COMMENT ON COLUMN news.is_hot IS '是否热门';
COMMENT ON COLUMN news.is_original IS '是否原创';
COMMENT ON COLUMN news.source IS '来源';
COMMENT ON COLUMN news.source_url IS '来源URL';
COMMENT ON COLUMN news.audit_status IS '审核状态：0-待审核，1-通过，2-拒绝';
COMMENT ON COLUMN news.audit_by IS '审核人ID';
COMMENT ON COLUMN news.audit_at IS '审核时间';
COMMENT ON COLUMN news.audit_remark IS '审核备注';
COMMENT ON COLUMN news.created_at IS '创建时间';
COMMENT ON COLUMN news.updated_at IS '更新时间';
COMMENT ON COLUMN news.deleted_at IS '软删除时间';
COMMENT ON COLUMN news.created_by IS '创建人ID';
COMMENT ON COLUMN news.updated_by IS '更新人ID';
```

### 2.7 分类表（categories）

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
    category_code VARCHAR(50) NOT NULL UNIQUE COMMENT '分类编码',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    icon VARCHAR(100) COMMENT '图标',
    description VARCHAR(255) COMMENT '描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status SMALLINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID'
);

CREATE INDEX idx_categories_category_code ON categories(category_code);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

COMMENT ON TABLE categories IS '分类表';
COMMENT ON COLUMN categories.id IS '分类ID';
COMMENT ON COLUMN categories.category_name IS '分类名称';
COMMENT ON COLUMN categories.category_code IS '分类编码';
COMMENT ON COLUMN categories.parent_id IS '父分类ID';
COMMENT ON COLUMN categories.icon IS '图标';
COMMENT ON COLUMN categories.description IS '描述';
COMMENT ON COLUMN categories.sort_order IS '排序';
COMMENT ON COLUMN categories.status IS '状态：0-禁用，1-正常';
COMMENT ON COLUMN categories.created_at IS '创建时间';
COMMENT ON COLUMN categories.updated_at IS '更新时间';
COMMENT ON COLUMN categories.deleted_at IS '软删除时间';
COMMENT ON COLUMN categories.created_by IS '创建人ID';
COMMENT ON COLUMN categories.updated_by IS '更新人ID';

-- 初始化分类数据
INSERT INTO categories (category_name, category_code, parent_id, description, sort_order) VALUES
('科技', 'tech', 0, '科技相关新闻', 1),
('互联网', 'internet', 1, '互联网行业新闻', 1),
('人工智能', 'ai', 1, '人工智能相关新闻', 2),
('区块链', 'blockchain', 1, '区块链相关新闻', 3),
('财经', 'finance', 0, '财经相关新闻', 2),
('股票', 'stock', 5, '股票市场新闻', 1),
('基金', 'fund', 5, '基金相关新闻', 2),
('生活', 'life', 0, '生活相关新闻', 3),
('健康', 'health', 8, '健康养生新闻', 1),
('旅游', 'travel', 8, '旅游相关新闻', 2);
```

### 2.8 标签表（tags）

```sql
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    tag_code VARCHAR(50) NOT NULL UNIQUE COMMENT '标签编码',
    color VARCHAR(20) COMMENT '标签颜色',
    description VARCHAR(255) COMMENT '描述',
    use_count INT DEFAULT 0 COMMENT '使用次数',
    status SMALLINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP COMMENT '软删除时间',
    created_by BIGINT COMMENT '创建人ID',
    updated_by BIGINT COMMENT '更新人ID'
);

CREATE INDEX idx_tags_tag_code ON tags(tag_code);
CREATE INDEX idx_tags_status ON tags(status);
CREATE INDEX idx_tags_use_count ON tags(use_count);

COMMENT ON TABLE tags IS '标签表';
COMMENT ON COLUMN tags.id IS '标签ID';
COMMENT ON COLUMN tags.tag_name IS '标签名称';
COMMENT ON COLUMN tags.tag_code IS '标签编码';
COMMENT ON COLUMN tags.color IS '标签颜色';
COMMENT ON COLUMN tags.description IS '描述';
COMMENT ON COLUMN tags.use_count IS '使用次数';
COMMENT ON COLUMN tags.status IS '状态：0-禁用，1-正常';
COMMENT ON COLUMN tags.created_at IS '创建时间';
COMMENT ON COLUMN tags.updated_at IS '更新时间';
COMMENT ON COLUMN tags.deleted_at IS '软删除时间';
COMMENT ON COLUMN tags.created_by IS '创建人ID';
COMMENT ON COLUMN tags.updated_by IS '更新人ID';

-- 初始化标签数据
INSERT INTO tags (tag_name, tag_code, color, description) VALUES
('ChatGPT', 'chatgpt', '#10a37f', 'ChatGPT相关'),
('GPT-4', 'gpt-4', '#10a37f', 'GPT-4相关'),
('新能源', 'new-energy', '#22c55e', '新能源汽车'),
('比特币', 'bitcoin', '#f7931a', '比特币相关'),
('元宇宙', 'metaverse', '#6366f1', '元宇宙相关');
```

### 2.9 新闻标签关联表（news_tags）

```sql
CREATE TABLE news_tags (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL COMMENT '新闻ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT fk_news_tags_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT fk_news_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (news_id, tag_id)
);

CREATE INDEX idx_news_tags_news_id ON news_tags(news_id);
CREATE INDEX idx_news_tags_tag_id ON news_tags(tag_id);

COMMENT ON TABLE news_tags IS '新闻标签关联表';
COMMENT ON COLUMN news_tags.id IS '主键ID';
COMMENT ON COLUMN news_tags.news_id IS '新闻ID';
COMMENT ON COLUMN news_tags.tag_id IS '标签ID';
COMMENT ON COLUMN news_tags.created_at IS '创建时间';
```

---

## 3. API 接口设计规范

### 3.1 RESTful API 规范

#### 3.1.1 URL 规范

```
基础路径: /api/v1

资源命名规则:
- 使用名词复数形式: /users, /news, /roles
- 使用小写字母和连字符: /user-roles, /news-tags
- 避免动词: ❌ /getUsers, ✅ GET /users
- 层级关系: /users/{userId}/roles

示例:
GET    /api/v1/users              # 获取用户列表
GET    /api/v1/users/{id}         # 获取单个用户
POST   /api/v1/users              # 创建用户
PUT    /api/v1/users/{id}         # 更新用户（全量）
PATCH  /api/v1/users/{id}         # 更新用户（部分）
DELETE /api/v1/users/{id}         # 删除用户
GET    /api/v1/users/{id}/roles   # 获取用户的角色列表
POST   /api/v1/users/{id}/roles   # 为用户分配角色
```

#### 3.1.2 HTTP 方法规范

| HTTP 方法 | 操作 | 幂等性 | 示例 |
|-----------|------|--------|------|
| GET | 查询资源 | 是 | GET /api/v1/users |
| POST | 创建资源 | 否 | POST /api/v1/users |
| PUT | 全量更新资源 | 是 | PUT /api/v1/users/1 |
| PATCH | 部分更新资源 | 是 | PATCH /api/v1/users/1 |
| DELETE | 删除资源 | 是 | DELETE /api/v1/users/1 |

#### 3.1.3 HTTP 状态码规范

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功（GET、PUT、PATCH、DELETE） |
| 201 | Created | 成功创建资源（POST） |
| 204 | No Content | 成功但无返回内容（DELETE） |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如唯一性约束） |
| 422 | Unprocessable Entity | 语义错误（验证失败） |
| 500 | Internal Server Error | 服务器内部错误 |

### 3.2 统一响应格式

#### 3.2.1 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 业务数据
  },
  "timestamp": 1703275200000
}
```

#### 3.2.2 分页响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [
      // 数据列表
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 10
  },
  "timestamp": 1703275200000
}
```

#### 3.2.3 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "errors": [
    {
      "field": "username",
      "message": "用户名不能为空"
    },
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": 1703275200000
}
```

### 3.3 认证接口

#### 3.3.1 账号密码登录

```
POST /api/v1/auth/login

Request:
{
  "username": "admin",
  "password": "123456",
  "rememberMe": true
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": "https://example.com/avatar.jpg",
      "roles": ["ADMIN"],
      "permissions": ["user:view", "user:create", "user:edit"]
    }
  },
  "timestamp": 1703275200000
}
```

#### 3.3.2 微信 OAuth 登录

```
POST /api/v1/auth/wechat-login

Request:
{
  "code": "wxcode123456",
  "state": "randomstate"
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "username": "wx_user_123",
      "nickname": "微信用户",
      "avatar": "https://wx.qlogo.cn/...",
      "roles": ["USER"],
      "permissions": ["news:view", "news:create"]
    }
  },
  "timestamp": 1703275200000
}
```

#### 3.3.3 刷新 Token

```
POST /api/v1/auth/refresh

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": 1703275200000
}
```

#### 3.3.4 退出登录

```
POST /api/v1/auth/logout

Headers:
Authorization: Bearer {accessToken}

Response:
{
  "code": 200,
  "message": "退出成功",
  "data": null,
  "timestamp": 1703275200000
}
```

### 3.4 用户接口

#### 3.4.1 获取用户列表

```
GET /api/v1/users?pageNum=1&pageSize=10&username=admin&status=1

Headers:
Authorization: Bearer {accessToken}

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "avatar": "https://example.com/avatar.jpg",
        "status": 1,
        "roles": [
          {
            "id": 1,
            "roleName": "超级管理员",
            "roleCode": "SUPER_ADMIN"
          }
        ],
        "createdAt": "2024-01-01 00:00:00"
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 10
  },
  "timestamp": 1703275200000
}
```

#### 3.4.2 创建用户

```
POST /api/v1/users

Headers:
Authorization: Bearer {accessToken}

Request:
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "phone": "13800138001",
  "nickname": "新用户",
  "roleIds": [4]
}

Response:
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 10,
    "username": "newuser",
    "nickname": "新用户",
    "email": "newuser@example.com",
    "phone": "13800138001",
    "status": 1,
    "createdAt": "2024-01-01 00:00:00"
  },
  "timestamp": 1703275200000
}
```

### 3.5 新闻接口

#### 3.5.1 获取新闻列表

```
GET /api/v1/news?pageNum=1&pageSize=10&categoryId=1&status=2&keyword=科技

Headers:
Authorization: Bearer {accessToken}

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "人工智能技术发展趋势",
        "summary": "本文探讨了人工智能技术的最新发展趋势...",
        "coverImage": "https://example.com/cover.jpg",
        "author": {
          "id": 1,
          "nickname": "管理员",
          "avatar": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": 1,
          "categoryName": "科技"
        },
        "tags": [
          {"id": 1, "tagName": "ChatGPT", "color": "#10a37f"},
          {"id": 2, "tagName": "GPT-4", "color": "#10a37f"}
        ],
        "status": 2,
        "viewCount": 1234,
        "likeCount": 56,
        "commentCount": 10,
        "isTop": true,
        "isHot": true,
        "publishAt": "2024-01-01 10:00:00",
        "createdAt": "2024-01-01 09:00:00"
      }
    ],
    "total": 50,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 5
  },
  "timestamp": 1703275200000
}
```

#### 3.5.2 创建新闻

```
POST /api/v1/news

Headers:
Authorization: Bearer {accessToken}

Request:
{
  "title": "人工智能技术发展趋势",
  "summary": "本文探讨了人工智能技术的最新发展趋势...",
  "content": "# 人工智能技术发展趋势\n\n## 概述\n...",
  "coverImage": "https://example.com/cover.jpg",
  "categoryId": 1,
  "tagIds": [1, 2],
  "isOriginal": true,
  "source": "",
  "sourceUrl": ""
}

Response:
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "title": "人工智能技术发展趋势",
    "status": 0,
    "createdAt": "2024-01-01 09:00:00"
  },
  "timestamp": 1703275200000
}
```

---

## 4. 权限设计方案（按钮级）

### 4.1 权限模型（RBAC）

采用 **RBAC（基于角色的访问控制）** 模型，支持按钮级权限控制。

```
用户（User） ──┐
              ├──> 用户角色关联（UserRole） ──┐
角色（Role） ─┘                                ├──> 角色权限关联（RolePermission） ──┐
                                              │                                      │
权限（Permission） ───────────────────────────┘                                      │
                                                                                    │
资源（Resource） ←─────────────────────────────────────────────────────────────────┘
```

### 4.2 权限类型

| 权限类型 | 说明 | 示例 |
|----------|------|------|
| menu | 菜单权限 | 用户管理菜单、角色管理菜单 |
| button | 按钮权限 | 创建用户、删除用户、编辑用户 |
| api | API 接口权限 | /api/users、/api/roles |

### 4.3 权限编码规范

```
格式: {模块}:{操作}

示例:
- user:view      # 查看用户
- user:create    # 创建用户
- user:edit      # 编辑用户
- user:delete    # 删除用户
- news:publish   # 发布新闻
- news:audit     # 审核新闻
```

### 4.4 后端权限实现

#### 4.4.1 权限注解

```java
package com.forum.common.annotation;

import java.lang.annotation.*;

/**
 * 权限注解
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequirePermission {
    /**
     * 需要的权限编码
     */
    String[] value() default {};

    /**
     * 逻辑关系：AND-需要所有权限，OR-需要任一权限
     */
    Logical logical() default Logical.AND;

    enum Logical {
        AND, OR
    }
}

/**
 * 角色注解
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireRole {
    /**
     * 需要的角色编码
     */
    String[] value() default {};

    /**
     * 逻辑关系：AND-需要所有角色，OR-需要任一角色
     */
    Logical logical() default Logical.AND;

    enum Logical {
        AND, OR
    }
}
```

#### 4.4.2 权限切面

```java
package com.forum.security.aspect;

import com.forum.common.annotation.RequirePermission;
import com.forum.common.exception.BusinessException;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;

/**
 * 权限切面
 */
@Aspect
@Component
@RequiredArgsConstructor
public class PermissionAspect {

    private final PermissionService permissionService;

    @Around("@annotation(com.forum.common.annotation.RequirePermission)")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        RequirePermission annotation = method.getAnnotation(RequirePermission.class);

        String[] permissions = annotation.value();
        if (permissions.length == 0) {
            return point.proceed();
        }

        Set<String> userPermissions = permissionService.getCurrentUserPermissions();

        boolean hasPermission;
        if (annotation.logical() == RequirePermission.Logical.AND) {
            hasPermission = Arrays.stream(permissions)
                    .allMatch(userPermissions::contains);
        } else {
            hasPermission = Arrays.stream(permissions)
                    .anyMatch(userPermissions::contains);
        }

        if (!hasPermission) {
            throw new BusinessException("无权限访问");
        }

        return point.proceed();
    }
}
```

#### 4.4.3 权限服务

```java
package com.forum.security.service;

import com.forum.modules.user.entity.User;
import com.forum.modules.permission.mapper.PermissionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

/**
 * 权限服务
 */
@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionMapper permissionMapper;

    /**
     * 获取当前用户权限
     */
    public Set<String> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new HashSet<>();
        }

        User user = (User) authentication.getPrincipal();
        return permissionMapper.selectPermissionsByUserId(user.getId());
    }

    /**
     * 检查当前用户是否有指定权限
     */
    public boolean hasPermission(String permission) {
        return getCurrentUserPermissions().contains(permission);
    }

    /**
     * 检查当前用户是否有任一权限
     */
    public boolean hasAnyPermission(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).anyMatch(userPermissions::contains);
    }

    /**
     * 检查当前用户是否有所有权限
     */
    public boolean hasAllPermissions(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).allMatch(userPermissions::contains);
    }
}
```

#### 4.4.4 Controller 使用示例

```java
package com.forum.modules.user.controller;

import com.forum.common.annotation.RequirePermission;
import com.forum.common.annotation.RequireRole;
import com.forum.modules.user.dto.UserDTO;
import com.forum.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取用户列表
     */
    @GetMapping
    @RequirePermission("user:view")
    public Result<List<UserDTO>> list(@RequestParam(required = false) String username) {
        return Result.success(userService.list(username));
    }

    /**
     * 创建用户
     */
    @PostMapping
    @RequirePermission("user:create")
    public Result<UserDTO> create(@RequestBody @Valid UserDTO userDTO) {
        return Result.success(userService.create(userDTO));
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    @RequirePermission("user:edit")
    public Result<UserDTO> update(@PathVariable Long id, @RequestBody @Valid UserDTO userDTO) {
        return Result.success(userService.update(id, userDTO));
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @RequirePermission("user:delete")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }

    /**
     * 分配角色
     */
    @PostMapping("/{id}/roles")
    @RequirePermission("user:assign-role")
    public Result<Void> assignRoles(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        userService.assignRoles(id, roleIds);
        return Result.success();
    }
}
```

### 4.5 前端权限实现

#### 4.5.1 权限指令

```typescript
// src/directives/permission.ts
import { usePermissionStore } from '@/stores/modules/permission';

/**
 * 权限指令
 * 使用方式: v-permission="'user:create'" 或 v-permission="['user:create', 'user:edit']"
 */
export const permission = {
  mounted(el: HTMLElement, binding: any) {
    const permissionStore = usePermissionStore();
    const { value } = binding;

    if (!value) return;

    const permissions = Array.isArray(value) ? value : [value];
    const hasPermission = permissions.some((p: string) => 
      permissionStore.hasPermission(p)
    );

    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  },
};

/**
 * 注册权限指令
 */
export function setupPermissionDirective(app: App) {
  app.directive('permission', permission);
}
```

#### 4.5.2 权限 Store

```typescript
// src/stores/modules/permission.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<string[]>([]);

  /**
   * 设置权限
   */
  function setPermissions(perms: string[]) {
    permissions.value = perms;
  }

  /**
   * 检查是否有指定权限
   */
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission);
  }

  /**
   * 检查是否有任一权限
   */
  function hasAnyPermission(perms: string[]): boolean {
    return perms.some((p) => permissions.value.includes(p));
  }

  /**
   * 检查是否有所有权限
   */
  function hasAllPermissions(perms: string[]): boolean {
    return perms.every((p) => permissions.value.includes(p));
  }

  /**
   * 清空权限
   */
  function clearPermissions() {
    permissions.value = [];
  }

  return {
    permissions,
    setPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    clearPermissions,
  };
});
```

#### 4.5.3 权限组件

```vue
<!-- src/components/common/Permission.vue -->
<template>
  <slot v-if="hasPermission" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissionStore } from '@/stores/modules/permission';

const props = defineProps<{
  permission?: string | string[];
  mode?: 'any' | 'all'; // any-任一权限，all-所有权限
}>();

const permissionStore = usePermissionStore();

const hasPermission = computed(() => {
  if (!props.permission) return true;

  const permissions = Array.isArray(props.permission)
    ? props.permission
    : [props.permission];

  if (props.mode === 'all') {
    return permissionStore.hasAllPermissions(permissions);
  }

  return permissionStore.hasAnyPermission(permissions);
});
</script>
```

#### 4.5.4 Vue 组件使用示例

```vue
<template>
  <div class="user-management">
    <el-button
      v-permission="'user:create'"
      type="primary"
      @click="handleCreate"
    >
      创建用户
    </el-button>

    <!-- 或使用组件方式 -->
    <Permission :permission="'user:create'">
      <el-button type="primary" @click="handleCreate">
        创建用户
      </el-button>
    </Permission>

    <!-- 多个权限（任一） -->
    <Permission :permission="['user:edit', 'user:delete']">
      <el-button type="danger" @click="handleBatchDelete">
        批量删除
      </el-button>
    </Permission>

    <!-- 多个权限（全部） -->
    <Permission :permission="['user:edit', 'user:assign-role']" mode="all">
      <el-button type="warning" @click="handleEditWithRole">
        编辑并分配角色
      </el-button>
    </Permission>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/modules/permission';
import Permission from '@/components/common/Permission.vue';

const permissionStore = usePermissionStore();

// 在代码中检查权限
function handleAction() {
  if (!permissionStore.hasPermission('user:delete')) {
    ElMessage.error('无权限删除用户');
    return;
  }
  // 执行删除操作
}
</script>
```

### 4.6 权限数据初始化

#### 4.6.1 角色权限关联初始化

```sql
-- 超级管理员拥有所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- 管理员权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), -- 用户管理
(2, 7), (2, 8), (2, 9), (2, 10), -- 角色管理
(2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18); -- 新闻管理

-- 版主权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 13), (3, 14), (3, 15), (3, 16), (3, 18); -- 新闻管理（不含发布）

-- 普通用户权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 13), (4, 14), (4, 15); -- 新闻管理（查看、创建、编辑）
```

---

## 5. 开发环境配置

### 5.1 前端环境配置

#### 5.1.1 Node.js 环境

```bash
# 推荐版本
Node.js: >= 18.0.0
npm: >= 9.0.0
pnpm: >= 8.0.0 (推荐使用 pnpm)
```

#### 5.1.2 package.json

```json
{
  "name": "forum-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "element-plus": "^2.5.0",
    "axios": "^1.6.0",
    "@element-plus/icons-vue": "^2.3.0",
    "dayjs": "^1.11.0",
    "lodash-es": "^4.17.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "vue-tsc": "^1.8.0",
    "@types/node": "^20.10.0",
    "@types/lodash-es": "^4.17.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-plugin-vue": "^9.19.0",
    "prettier": "^3.1.0",
    "sass": "^1.69.0",
    "unplugin-auto-import": "^0.17.0",
    "unplugin-vue-components": "^0.26.0"
  }
}
```

#### 5.1.3 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus', '@element-plus/icons-vue'],
        },
      },
    },
  },
});
```

#### 5.1.4 .env.development

```bash
# 开发环境配置
VITE_APP_TITLE=论坛系统
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_UPLOAD_URL=http://localhost:8080/api/v1/upload
```

#### 5.1.5 .env.production

```bash
# 生产环境配置
VITE_APP_TITLE=论坛系统
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_UPLOAD_URL=https://api.example.com/api/v1/upload
```

### 5.2 后端环境配置

#### 5.2.1 JDK 环境

```bash
# 推荐版本
JDK: 17 或 21 (LTS)
Maven: >= 3.8.0
```

#### 5.2.2 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.forum</groupId>
    <artifactId>forum-backend</artifactId>
    <version>1.0.0</version>
    <name>forum-backend</name>
    <description>论坛系统后端</description>

    <properties>
        <java.version>17</java.version>
        <mybatis-plus.version>3.5.5</mybatis-plus.version>
        <jjwt.version>0.12.3</jjwt.version>
        <knife4j.version>4.4.0</knife4j.version>
        <hutool.version>5.8.24</hutool.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- API Documentation -->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
            <version>${knife4j.version}</version>
        </dependency>

        <!-- Utilities -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 5.2.3 application.yml

```yaml
spring:
  application:
    name: forum-backend

  profiles:
    active: dev

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
    serialization:
      write-dates-as-timestamps: false

server:
  port: 8080
  servlet:
    context-path: /

# MyBatis Plus 配置
mybatis-plus:
  mapper-locations: classpath:mapper/**/*.xml
  type-aliases-package: com.forum.modules.*.entity
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deletedAt
      logic-delete-value: 'NOW()'
      logic-not-delete-value: 'NULL'
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# Knife4j API 文档配置
knife4j:
  enable: true
  setting:
    language: zh_cn
```

#### 5.2.4 application-dev.yml

```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/forum_dev?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: postgres
    password: postgres
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  data:
    redis:
      host: localhost
      port: 6379
      password:
      database: 0
      timeout: 5000ms
      lettuce:
        pool:
          max-active: 20
          max-idle: 10
          min-idle: 5
          max-wait: 3000ms

# JWT 配置
jwt:
  secret: your-secret-key-at-least-256-bits-long-for-hs256-algorithm
  access-token-expiration: 7200000  # 2小时
  refresh-token-expiration: 604800000  # 7天
  header: Authorization
  prefix: "Bearer "

# 微信配置
wechat:
  app-id: your-wechat-app-id
  app-secret: your-wechat-app-secret
  redirect-uri: http://localhost:3000/auth/wechat/callback

# 日志配置
logging:
  level:
    root: INFO
    com.forum: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
```

#### 5.2.5 application-prod.yml

```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://prod-db-host:5432/forum_prod?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      minimum-idle: 10
      maximum-pool-size: 50
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  data:
    redis:
      host: ${REDIS_HOST}
      port: 6379
      password: ${REDIS_PASSWORD}
      database: 0
      timeout: 5000ms
      lettuce:
        pool:
          max-active: 50
          max-idle: 20
          min-idle: 10
          max-wait: 3000ms

# JWT 配置
jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: 7200000
  refresh-token-expiration: 604800000
  header: Authorization
  prefix: "Bearer "

# 微信配置
wechat:
  app-id: ${WECHAT_APP_ID}
  app-secret: ${WECHAT_APP_SECRET}
  redirect-uri: https://example.com/auth/wechat/callback

# 日志配置
logging:
  level:
    root: WARN
    com.forum: INFO
  file:
    name: /var/log/forum/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
```

### 5.3 数据库环境配置

#### 5.3.1 PostgreSQL 安装

```bash
# Windows (使用安装程序)
# 下载: https://www.postgresql.org/download/windows/

# macOS (使用 Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 5.3.2 创建数据库

```sql
-- 连接 PostgreSQL
psql -U postgres

-- 创建数据库
CREATE DATABASE forum_dev ENCODING 'UTF8';

-- 创建用户（可选）
CREATE USER forum_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE forum_dev TO forum_user;

-- 切换数据库
\c forum_dev

-- 执行初始化脚本
\i /path/to/init.sql
```

### 5.4 Redis 环境配置

#### 5.4.1 Redis 安装

```bash
# Windows (使用 WSL 或 Docker)
docker run -d -p 6379:6379 --name redis redis:7-alpine

# macOS (使用 Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### 5.4.2 Redis 配置

```bash
# 连接 Redis
redis-cli

# 测试连接
127.0.0.1:6379> ping
PONG

# 设置密码（可选）
127.0.0.1:6379> CONFIG SET requirepass "your_password"
```

### 5.5 开发工具配置

#### 5.5.1 IDE 推荐

**前端:**
- VS Code
  - 插件: Volar, TypeScript Vue Plugin, ESLint, Prettier

**后端:**
- IntelliJ IDEA Ultimate
  - 插件: Lombok, MyBatisX, Spring Boot Assistant

#### 5.5.2 Git 配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置换行符（Windows）
git config --global core.autocrlf true

# 配置编辑器
git config --global core.editor "code --wait"
```

#### 5.5.3 .gitignore

```gitignore
# 前端
node_modules/
dist/
*.local
.DS_Store

# 后端
target/
!.mvn/wrapper/maven-wrapper.jar
*.log
*.gz

# IDE
.idea/
*.iml
.vscode/
*.swp
*.swo

# 环境配置
.env.local
.env.*.local
application-local.yml

# 日志
logs/
*.log

# 临时文件
*.tmp
*.temp
```

---

## 附录

### A. 技术栈版本清单

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue.js | 3.4+ |
| 前端语言 | TypeScript | 5.3+ |
| 构建工具 | Vite | 5.0+ |
| UI 框架 | Element Plus | 2.5+ |
| 状态管理 | Pinia | 2.1+ |
| 路由 | Vue Router | 4.2+ |
| HTTP 客户端 | Axios | 1.6+ |
| 后端框架 | Spring Boot | 3.2+ |
| 后端语言 | Java | 17/21 |
| 数据库 | PostgreSQL | 15+ |
| 缓存 | Redis | 7+ |
| 权限框架 | Spring Security | 6.x |
| JWT | jjwt | 0.12.3 |
| ORM | MyBatis Plus | 3.5.5 |
| API 文档 | Knife4j | 4.4.0 |

### B. 参考资料

- [Vue.js 官方文档](https://vuejs.org/)
- [Element Plus 官方文档](https://element-plus.org/)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [MyBatis Plus 官方文档](https://baomidou.com/)

---

**文档版本**: v1.0  
**创建日期**: 2024-01-01  
**最后更新**: 2024-01-01  
**维护者**: 开发团队
