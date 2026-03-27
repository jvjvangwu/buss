# 快速开始指南

## 环境要求

- Node.js 16+ 
- npm 7+ 或 yarn 1.22+
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

## 安装步骤

### 1. 安装依赖
```bash
cd forum-project/frontend
npm install
# 或
yarn install
```

### 2. 配置环境变量
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑.env文件，根据实际情况修改
# 主要配置API基础URL
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3001 启动

## 测试登录功能

### 使用测试账户
在登录页面中，可以使用以下测试账户：
- 用户名: `demo_user`
- 密码: `demo123`

### 表单验证测试
1. 尝试输入少于3个字符的用户名
2. 尝试输入少于6个字符的密码
3. 输入特殊字符的用户名
4. 测试"记住我"功能
5. 切换密码可见性

### API集成
如需完整功能，需要后端API支持：
- 登录接口：`POST /api/auth/login`
- 响应格式参考 `src/types/auth.ts`

## 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物位于 `dist/` 目录

## 运行测试

```bash
# 运行所有测试
npm test
# 或
yarn test

# 运行测试覆盖率
npm run test:coverage
# 或
yarn test:coverage

# 打开测试UI
npm run test:ui
# 或
yarn test:ui
```

## 代码检查

```bash
# 代码格式化
npm run lint
# 或
yarn lint

# 自动修复
npm run lint -- --fix
# 或
yarn lint --fix
```

## 项目结构说明

```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件  
├── hooks/         # 自定义Hook
├── services/      # API服务
├── types/         # 类型定义
├── utils/         # 工具函数
├── App.tsx        # 主应用
└── index.tsx      # 入口文件
```

## 常见问题

### 1. 端口占用
如果3001端口被占用，修改 `vite.config.ts` 中的端口配置

### 2. API连接失败
检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置
确保后端API服务正在运行

### 3. 样式不生效
确保已正确安装Tailwind CSS依赖
检查 `tailwind.config.js` 配置

### 4. TypeScript错误
运行 `npm run build` 检查类型错误
确保所有导入路径正确

## 下一步

1. 集成后端API
2. 添加用户注册功能
3. 实现忘记密码流程
4. 添加社交登录
5. 完善用户个人中心

## 获取帮助

- 查看详细文档：`README.md`
- 查看项目总结：`PROJECT_SUMMARY.md`
- 检查TypeScript类型定义
- 运行测试确保功能正常