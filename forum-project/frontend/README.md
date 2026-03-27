# 技术论坛前端项目

这是一个使用React、TypeScript和Tailwind CSS构建的技术论坛前端项目。

## 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ TypeScript类型安全
- ✅ Tailwind CSS样式系统
- ✅ 表单验证（用户名、密码）
- ✅ 记住我功能
- ✅ 密码可见性切换
- ✅ 加载状态管理
- ✅ 错误处理
- ✅ 路由保护
- ✅ API服务层
- ✅ React Query数据管理

## 项目结构

```
src/
├── components/          # 可复用组件
│   └── LoginForm.tsx   # 登录表单组件
├── pages/              # 页面组件
│   └── LoginPage.tsx   # 登录页面
├── hooks/              # 自定义Hook
│   └── useLoginForm.ts # 登录表单Hook
├── services/           # API服务
│   └── authService.ts  # 认证服务
├── types/              # TypeScript类型定义
│   └── auth.ts         # 认证相关类型
├── utils/              # 工具函数
│   └── validation.ts   # 表单验证工具
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 登录组件功能

### 表单验证
- 用户名：3-20个字符，只能包含字母、数字和下划线
- 密码：6-50个字符
- 实时验证和错误提示
- 表单提交前验证

### 用户体验
- 密码可见性切换
- 记住我选项
- 加载状态指示器
- 错误信息展示
- 表单验证状态反馈

### 安全性
- Token存储（localStorage/sessionStorage）
- 请求拦截器自动添加Token
- 响应拦截器处理401错误
- 受保护路由

## 快速开始

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发环境运行
```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3001 启动

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

## 配置说明

### 环境变量
复制 `.env.example` 文件为 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

主要配置项：
- `VITE_API_BASE_URL`: API基础URL
- `VITE_APP_NAME`: 应用名称
- `VITE_ENABLE_DEBUG`: 调试模式开关

### Tailwind CSS配置
配置文件位于 `tailwind.config.js`，可自定义：
- 颜色主题
- 字体
- 动画
- 插件

### API服务
登录API需要后端支持，接口规范：

```typescript
// POST /api/auth/login
interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}
```

## 组件使用示例

### 在页面中使用登录表单
```tsx
import LoginForm from './components/LoginForm';

const MyPage = () => {
  const handleLogin = async (formData) => {
    // 调用API
    const result = await authService.login(formData);
    if (result.success) {
      // 登录成功处理
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};
```

### 自定义验证规则
修改 `src/utils/validation.ts`：

```typescript
export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};
  
  // 自定义验证逻辑
  if (!isValidEmail(data.username)) {
    errors.username = '请输入有效的邮箱地址';
  }
  
  return errors;
};
```

## 开发指南

### 添加新组件
1. 在 `src/components` 创建新组件
2. 使用TypeScript定义props类型
3. 使用Tailwind CSS编写样式
4. 导出组件

### 添加新页面
1. 在 `src/pages` 创建新页面
2. 在 `App.tsx` 中添加路由
3. 如果需要，添加路由保护

### 添加API服务
1. 在 `src/services` 创建新服务
2. 使用 `axios` 实例
3. 添加请求/响应拦截器
4. 导出服务方法

## 测试

运行测试：
```bash
npm test
# 或
yarn test
```

运行测试覆盖率：
```bash
npm run test:coverage
# 或
yarn test:coverage
```

## 代码规范

- 使用TypeScript严格模式
- 遵循React Hooks规则
- 使用函数组件和Hooks
- 组件使用命名导出
- 使用ESLint和Prettier格式化

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT