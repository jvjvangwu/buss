---
alwaysApply: true
---
## 一、通用开发礼节（必读）

1. 代码简洁实用，拒绝过度设计
2. 控制圈复杂度，函数短小、可复用、无重复
3. 合理模块设计，适当使用设计模式
4. 解释用通俗语言，关键逻辑配暗黑兼容 Mermaid 图
5. 实现需讲清原理、步骤，配可渲染流程图
6. 改动前通读全部代码，最小化修改，不影响其他模块
7. 改动后给出 10 条测试用例（输入+预期结果）

## 二、Bug 修复实验性规则（必读）
1. 理解：复述问题与代码关键点
2. 分析：给出至少 2 种可能根因
3. 计划：说明验证方式 + 修复方案
4. 确认：修改前请用户确认
5. 执行：按方案最小改动修复
6. 审查：自检修改是否合理
7. 解释：说明改了什么、为什么改

## 三、MCP 交互反馈规则（必读）
1. 全程必须调用 MCP mcp-feedback-enhanced
2. 收到反馈立即调整并再次调用
3. 仅用户说「结束」时停止
4. 任务完成前必须主动征求反馈

## 四、AI 输出核心约束（Java 后端·仅后端场景读取）

### 适用技术栈
JDK21、Spring Boot 3、Spring Security、Redis、PostgreSQL、MyBatis-Plus

### 核心原则
所有输出必须基于**对应版本官方文档**，严禁编造、臆造、无依据搜索，确保方案准确、合规、可上生产。

### 1. 输入指令要求
- 必须明确**具体版本**，禁止模糊版本
- 提问必须包含：版本 + 场景 + 诉求 + 约束
- 必须要求标注**官方依据**
- 明确输出格式：完整代码 / 方案 / 配置

### 2. 输出禁止性规则
- 禁止非权威来源、编造 API/注解/配置、跨版本混用
- 代码必须带完整异常处理、标准注释、参数校验
- 禁止硬编码敏感信息、无校验入参、不安全写法
- 方案必须标注：适用场景、不适用场景、风险点
- 优化/排障方案必须给出**验证方法**

### 3. 验证与纠错规则
- 验证优先级：**官方文档 > 大厂实践 > 经验**
- 冲突即违规：反馈 → 重输 → 仍违规则废弃
- 核心技术官方文档（按实际版本替换）：
    - JDK21：https://docs.oracle.com/en/java/javase/21/
    - Spring Boot：https://docs.spring.io/spring-boot/docs/{version}/reference/html/
    - Spring Security：https://docs.spring.io/spring-security/reference/index.html
    - Redis：https://redis.io/documentation/（选择对应版本）
    - PostgreSQL：https://www.postgresql.org/docs/{version}/

### 4. 场景附加约束
- 微服务：禁止编造配置，必须带熔断/降级
- 缓存：禁止违背数据结构设计，禁止编造更新策略
- 排障：禁止编造 JVM/Arthas 命令，必须依据官方
- 数据库：禁止编造 MyBatis/PostgreSQL 语法，事务必须规范

### 5. 违规应急方案
- 无法修正则直接弃用，以官方文档为准
- 上生产前必须：单元测试 + 压测 + 代码扫描
- 记录问题台账，避免重复踩坑

## 五、AI 输出核心约束（Vue2 前端·仅 Vue2 场景读取）
### 前置要求
生成回答前**必须先确认**：用户是否明确要求 Vue2 版本，未明确则先追问，禁止默认混用 Vue3 特性。

### 适用技术栈
Vue2、Vue Router 3、Vuex 3、Element UI、Axios、Webpack 4

### 核心原则
所有输出基于 Vue2 官方文档，严禁混入 Vue3 特性（如 Composition API、setup 语法糖），确保代码可在 Vue2 环境运行。

### 1. 输入指令要求
- 必须明确 Vue2 具体版本（如 2.6.14），禁止仅标注 Vue2
- 提问必须包含：业务场景 + 核心诉求 + 环境约束（如兼容 IE11）
- 必须要求标注 Vue2 官方文档具体链接/章节

### 2. 输出禁止性规则
- 禁止使用 Vue3 专属 API（如 createApp、ref、reactive、Pinia）
- 禁止混用 Vue Router 4、Vuex 4 特性，必须适配 Vue Router 3/Vuex 3
- 代码必须符合 Vue2 选项式 API 规范，注释含参数/返回值/使用场景
- 禁止输出无兼容性处理的代码（如 ES6+ 未转译、CSS 新特性未兼容）
- 方案必须标注：Vue2 适用场景 + 版本限制（如 2.6.x 支持、2.5.x 不支持）

### 3. 验证与纠错规则
- 验证优先级：Vue2 官方文档 > Element UI 官方文档 > 大厂最佳实践
- 核心技术官方文档（按实际版本替换）：
    - Vue2：https://v2.cn.vuejs.org/v2/guide/{章节}.html
    - Vue Router 3：https://router.vuejs.org/zh/guide/（v3 分支）
    - Vuex 3：https://vuex.vuejs.org/zh/guide/（v3 分支）
    - Element UI：https://element.eleme.io/#/zh-CN/component/installation

### 4. 场景附加约束
- 组件开发：禁止使用 Vue3 组件语法，必须遵循 Vue2 组件通信规则（props/$emit/$parent）
- 状态管理：禁止编造 Vuex 3 语法，必须使用 mutations/actions 规范
- 兼容性：IE11 场景需输出兼容代码，禁止使用箭头函数、let/const 未转译
- 打包部署：禁止编造 Webpack 4 配置，必须依据 Vue CLI 3/4 官方规范

## 六、AI 输出核心约束（Vue3 前端·仅 Vue3 场景读取）
### 前置要求
生成回答前**必须先确认**：用户是否明确要求 Vue3 版本，未明确则先追问，禁止默认混用 Vue2 特性。

### 适用技术栈
Vue3、Vue Router 4、Pinia、Vuex 4、Element Plus、Vite、Axios

### 核心原则
所有输出基于 Vue3 官方文档，优先使用 Composition API，严禁混入 Vue2 废弃特性，确保代码符合 Vue3 规范。

### 1. 输入指令要求
- 必须明确 Vue3 具体版本（如 3.3.4），禁止仅标注 Vue3
- 提问必须包含：业务场景 + 核心诉求 + 构建工具（Vite/Webpack）
- 必须要求标注 Vue3 官方文档具体链接/章节

### 2. 输出禁止性规则
- 禁止使用 Vue2 废弃 API（如 $on/$off、filter、new Vue）
- 禁止混用 Vue Router 3、Vuex 3 特性，必须适配 Vue Router 4/Pinia
- 代码优先使用 Composition API + setup 语法糖，注释含响应式数据/方法说明
- 禁止输出无 TypeScript 类型定义的代码（核心业务组件需标注类型）
- 方案必须标注：Vue3 版本限制（如 3.2.x 支持 setup 语法糖、3.0.x 不支持）

### 3. 验证与纠错规则
- 验证优先级：Vue3 官方文档 > Element Plus 官方文档 > Vite 官方文档
- 核心技术官方文档（按实际版本替换）：
    - Vue3：https://cn.vuejs.org/guide/{章节}.html
    - Vue Router 4：https://router.vuejs.org/zh/guide/（v4 分支）
    - Pinia：https://pinia.vuejs.org/zh/guide/
    - Element Plus：https://element-plus.org/zh-CN/guide/installation.html
    - Vite：https://vitejs.dev/guide/

### 4. 场景附加约束
- 组件开发：禁止使用 Vue2 选项式 API 为主，优先 setup 语法糖
- 状态管理：优先推荐 Pinia，禁止编造 Pinia 语法，遵循官方规范
- 构建部署：禁止编造 Vite 配置，必须依据官方规范（如环境变量、插件使用）
- 兼容性：禁止输出未做 polyfill 的代码，适配主流浏览器（Chrome 87+、Firefox 78+）

## 七、通用违规应急方案（前后端通用·对应场景读取）
1. 输出内容与官方文档冲突则直接弃用，以对应版本官方文档为准
2. 前端代码需做：本地运行验证 + 兼容性测试 + ESLint 代码扫描
3. 前后端均需建立问题台账，记录版本冲突、API 编造等违规类型及修正方案
