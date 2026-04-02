---
alwaysApply: false
description: 前端代码
---
# 项目代码风格与组件使用规则

## 1. 代码风格规则

### 1.1 TypeScript 配置
- **目标版本**: ESNext
- **模块系统**: ESNext
- **严格模式**: 启用
- **JSX**: 保留
- **路径别名**: 
  - `@/` → `src/`
  - `@views/` → `src/views/`
  - `@imgs/` → `src/assets/images/`
  - `@icons/` → `src/assets/icons/`
  - `@utils/` → `src/utils/`
  - `@stores/` → `src/store/`
  - `@styles/` → `src/assets/styles/`

### 1.2 ESLint 规则
- **引号**: 单引号
- **分号**: 不使用
- **变量声明**: 使用 `let` 或 `const`，禁止 `var`
- **类型检查**: 允许 `any` 类型
- **Vue 组件名称**: 允许单字组件名称
- **空行**: 最多 1 个空行
- **多行语句**: 禁止意外的多行

### 1.3 Prettier 规则
- **行宽**: 100 字符
- **缩进**: 2 空格
- **使用制表符**: 否
- **分号**: 不使用
- **Vue 缩进**: 缩进 script 和 style 标签
- **引号**: 单引号
- **对象属性引号**: 仅在需要时使用
- **括号空格**: 启用
- **尾随逗号**: 不使用
- **箭头函数括号**: 总是使用
- **HTML 空白敏感度**: 严格
- **行尾**: 自动

### 1.4 Stylelint 规则
- **继承规范**: 标准规范 + SCSS 推荐规范 + Vue 推荐规范
- **允许的伪类**: `global`、`export`、`deep`
- **允许的 SCSS 规则**: `apply`、`use`、`mixin`、`include`、`extend`、`each`、`if`、`else`、`for`、`while`、`reference`
- **类名命名**: 无强制规则
- **空样式**: 允许

## 2. 组件使用规则

### 2.1 组件定义
- **使用 script setup**: 推荐使用 `<script setup lang="ts">`
- **组件命名**: PascalCase 命名（如 `ArtSvgIcon`）
- **组件注册**: 自动注册（通过 unplugin-vue-components）
- **属性定义**: 使用 TypeScript 接口定义 props

### 2.2 自动导入
- **API 自动导入**: Vue、Vue Router、Pinia、@vueuse/core
- **组件自动导入**: Element Plus 组件
- **导入路径**: 使用路径别名（如 `@/components/`）

### 2.3 组件结构
- **模板**: 简洁明了，使用 v-if/v-else 合理控制渲染
- **脚本**: 逻辑清晰，使用组合式 API
- **样式**: 优先使用 Tailwind CSS，复杂样式使用 SCSS

## 3. 命名规范

### 3.1 文件命名
- **组件文件**: PascalCase（如 `ArtSvgIcon.vue`）
- **工具文件**: 小驼峰（如 `useAuth.ts`）
- **API 文件**: 小驼峰（如 `user.ts`）
- **配置文件**: 小驼峰（如 `setting.ts`）

### 3.2 变量命名
- **常量**: 大驼峰（如 `ApiUrl`）
- **变量**: 小驼峰（如 `userInfo`）
- **函数**: 小驼峰（如 `getUserList`）
- **类名**: PascalCase（如 `RouteRegistry`）
- **接口**: PascalCase，以 `I` 开头（如 `IUser`）

### 3.3 组件命名
- **核心组件**: 前缀 `Art` + PascalCase（如 `ArtSvgIcon`）
- **业务组件**: 语义化命名

## 4. 目录结构规则

### 4.1 核心目录
- **src/api/**: API 接口定义
- **src/assets/**: 静态资源（图片、样式）
- **src/components/**: 公共组件
- **src/config/**: 配置文件
- **src/directives/**: 自定义指令
- **src/enums/**: 枚举类型
- **src/hooks/**: 自定义 Hooks
- **src/locales/**: 国际化文件
- **src/mock/**: Mock 数据
- **src/plugins/**: 插件
- **src/router/**: 路由配置

### 4.2 组件目录
- **src/components/core/**: 核心组件
  - **base/**: 基础组件
  - **forms/**: 表单组件
  - **layouts/**: 布局组件
  - **tables/**: 表格组件
  - **charts/**: 图表组件
- **src/components/business/**: 业务组件

## 5. 开发流程规则

### 5.1 依赖管理
- **包管理器**: pnpm
- **Node 版本**: >=20.19.0
- **依赖安装**: `pnpm install`

### 5.2 开发命令
- **启动开发**: `pnpm dev`
- **生产构建**: `pnpm build`
- **预览构建**: `pnpm serve`
- **代码检查**: `pnpm lint`
- **自动修复**: `pnpm fix`
- **格式化**: `pnpm lint:prettier`
- **样式检查**: `pnpm lint:stylelint`

### 5.3 代码提交
- **提交规范**: 使用 commitizen
- **提交前检查**: lint-staged 自动检查

## 6. 性能优化规则

### 6.1 构建优化
- **目标环境**: ES2015
- **代码分割**: 动态导入
- **压缩配置**: 生产环境移除 console 和 debugger
- **依赖预构建**: 预构建大型依赖

### 6.2 资源优化
- **图片格式**: 优先使用 WebP 格式
- **资源压缩**: gzip 压缩
- **按需加载**: 组件和 API 按需导入

## 7. 最佳实践

### 7.1 Vue 3 最佳实践
- **组合式 API**: 优先使用
- **响应式 API**: 使用 `ref` 和 `computed`
- **生命周期**: 使用 `onMounted` 等组合式 API
- **事件处理**: 使用 `defineEmits`
- **属性传递**: 使用 `defineProps`

### 7.2 TypeScript 最佳实践
- **类型定义**: 为所有变量和函数添加类型
- **接口使用**: 合理使用接口定义数据结构
- **泛型使用**: 适当使用泛型提高代码复用性
- **类型断言**: 谨慎使用，确保类型安全

### 7.3 样式最佳实践
- **Tailwind CSS**: 优先使用工具类
- **SCSS**: 用于复杂样式和变量
- **BEM 命名**: 组件样式使用 BEM 规范
- **样式隔离**: 组件样式使用 scoped

## 8. 注意事项

### 8.1 自动生成文件
- **自动导入文件**: `.auto-import.json`、`src/types/import/` 下的文件
- **组件声明文件**: `src/types/import/components.d.ts`
- **Git 忽略**: 这些文件已在 `.gitignore` 中配置

### 8.2 环境变量
- **开发环境**: `.env.development`
- **生产环境**: `.env.production`
- **通用配置**: `.env`

### 8.3 第三方库
- **图标库**: Iconify
- **组件库**: src/components/core 下的组件
- **UI 库**: Element Plus
- **图表库**: ECharts
- **富文本编辑器**: WangEditor
- **工具库**: @vueuse/core
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios

### 8.4 国际化配置
- **开发环境**: 不需要配置国际化，默认使用中文
- **生产环境**: 不需要配置国际化，默认使用中文