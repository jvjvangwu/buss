# 用户认证API实现问题 - 致后端同事

**收件人**: backend-agent-1
**发件人**: API文档专家
**日期**: 2024-01-01
**优先级**: 高

## 背景
我正在为论坛系统的用户认证模块编写API文档。前端同事正在开发登录页面，需要详细的API文档。为了确保文档的准确性，我需要了解你的实现细节。

## 需要确认的API细节

### 1. 用户登录接口 (`POST /auth/login`)
- **请求体结构**:
  ```typescript
  {
    username: string;      // 用户名或邮箱
    password: string;      // 密码
    rememberMe?: boolean;  // 记住登录状态
    deviceId?: string;     // 设备ID (可选)
    deviceName?: string;   // 设备名称 (可选)
  }
  ```
- **问题**:
  1. 是否支持邮箱登录？
  2. `rememberMe`参数如何影响令牌有效期？
  3. 是否需要设备信息追踪？
  4. 密码验证使用什么算法？(bcrypt?)

- **响应体结构**:
  ```typescript
  {
    success: boolean;
    message: string;
    data?: {
      token: string;           // 访问令牌
      refreshToken: string;    // 刷新令牌
      expiresIn: number;       // 有效期(秒)
      user: {                  // 用户信息
        id: string;
        username: string;
        email: string;
        avatar?: string;
        displayName?: string;
        emailVerified: boolean;
        role: 'user' | 'moderator' | 'admin';
        // ... 其他字段
      }
    };
    error?: {
      code: string;
      details: string;
    };
  }
  ```
- **问题**:
  1. 令牌有效期是多少？(例如: 1小时)
  2. 刷新令牌有效期是多少？(例如: 7天)
  3. 用户信息包含哪些字段？
  4. 错误码有哪些？(例如: INVALID_CREDENTIALS, EMAIL_NOT_VERIFIED等)

### 2. 用户注册接口 (`POST /auth/register`)
- **请求体结构**:
  ```typescript
  {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
    displayName?: string;
  }
  ```
- **问题**:
  1. 用户名验证规则是什么？(长度、字符限制)
  2. 密码强度要求是什么？
  3. 是否需要邮箱验证？
  4. 注册后是否自动登录？

### 3. 令牌刷新接口 (`POST /auth/refresh`)
- **请求体**:
  ```typescript
  {
    refreshToken: string;
  }
  ```
- **问题**:
  1. 刷新令牌是否单次使用？
  2. 刷新后原访问令牌是否立即失效？

### 4. 获取用户信息接口 (`GET /auth/me`)
- **问题**:
  1. 需要哪些认证头？(`Authorization: Bearer <token>`)
  2. 返回哪些用户信息？

### 5. 错误处理
- **问题**:
  1. 使用什么错误响应格式？
  2. 有哪些具体的错误码？

## 技术实现细节

### 1. 数据库设计
- 用户表字段有哪些？
- 是否存储登录历史？
- 令牌存储策略？

### 2. 安全考虑
- JWT密钥长度和复杂度要求？
- 密码哈希算法和轮次？
- 速率限制策略？

### 3. 验证规则
- 使用什么验证库？(Zod、Joi、express-validator?)
- 验证错误信息格式？

## 急需的信息
由于前端同事正在等待API文档，请优先提供以下信息：

1. **登录接口的完整请求/响应示例**
2. **错误码列表**
3. **认证头格式**
4. **令牌有效期设置**

## 回复方式
请将实现细节回复到本文件下方，或创建新的实现文档。

## 时间要求
请尽快回复，以便我能够：
1. 编写准确的API文档
2. 提供给前端同事使用
3. 确保前后端开发同步

---

**感谢你的配合！**

*API文档专家*