# 论坛系统 (Forum System)

一个功能完整的在线论坛系统，支持用户注册登录、帖子发布、评论回复、分类标签、搜索等功能。

## ✨ 功能特性

- **用户认证** - 注册、登录、JWT令牌认证、邮箱验证、密码重置
- **帖子管理** - 发布、编辑、删除、置顶、收藏
- **评论系统** - 楼层回复、嵌套评论、点赞
- **分类标签** - 分类浏览、标签筛选
- **搜索功能** - 全文搜索、关键词高亮
- **用户中心** - 个人资料、我的帖子、我的评论
- **权限管理** - 用户、版主、管理员角色
- **响应式设计** - 支持桌面和移动端

## 🛠 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Axios (HTTP客户端)

### 后端
- Node.js 18+
- Express.js + TypeScript
- PostgreSQL + TypeORM
- JWT (身份认证)
- Zod (数据验证)

### 部署
- Docker + Docker Compose
- Nginx (反向代理)

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd forum-project
```

### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置环境变量

```bash
# 复制环境配置示例
cp docs/.env.example backend/.env

# 编辑 backend/.env 文件，配置以下关键项：
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (数据库)
# - JWT_SECRET, JWT_REFRESH_SECRET (JWT密钥)
```

### 4. 启动服务

```bash
# 启动后端 (端口 8080)
cd backend
npm run dev

# 启动前端 (端口 5173)
cd frontend
npm run dev
```

### 5. 访问应用

- 前端: http://localhost:5173
- 后端API: http://localhost:8080/api
- 健康检查: http://localhost:8080/health

## 📁 项目结构

```
forum-project/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── entities/        # 数据实体
│   │   ├── middleware/      # 中间件
│   │   ├── routes/          # 路由
│   │   ├── schemas/         # 验证模式
│   │   ├── types/           # 类型定义
│   │   └── index.ts         # 入口文件
│   └── package.json
│
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API服务
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── types/           # 类型定义
│   │   └── utils/           # 工具函数
│   └── package.json
│
├── docs/                    # 项目文档
│   ├── .env.example         # 环境变量示例
│   ├── README.md           # 认证API文档
│   └── auth-*.md           # 认证相关文档
│
├── docker/                   # Docker配置
├── scripts/                 # 脚本文件
└── README.md               # 项目说明
```

## 📚 API 文档

### 认证 API

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户 |
| PUT | /api/auth/profile | 更新个人资料 |

详细API文档见 [docs/README.md](docs/README.md)

### 帖子 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/posts | 获取帖子列表 |
| GET | /api/posts/:id | 获取帖子详情 |
| POST | /api/posts | 创建帖子 |
| PUT | /api/posts/:id | 更新帖子 |
| DELETE | /api/posts/:id | 删除帖子 |

### 评论 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/posts/:id/comments | 获取评论 |
| POST | /api/posts/:id/comments | 创建评论 |
| DELETE | /api/comments/:id | 删除评论 |

## 🧪 测试

```bash
# 运行后端测试
cd backend
npm test

# 运行前端测试
cd frontend
npm test

# 运行集成测试
npm run test:integration
```

## 🐳 Docker 部署

```bash
# 使用 Docker Compose 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 最佳实践

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
```

## 📄 许可证

MIT License - see [LICENSE](LICENSE) for details

---

**版本**: 1.0.0  
**最后更新**: 2026-03-27