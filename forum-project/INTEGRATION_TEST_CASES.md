# 集成测试用例

## 用户登录流程端到端测试用例

### 测试套件1: 用户认证流程

#### TC-AUTH-001: 正常登录流程
**优先级**: 高
**描述**: 用户使用正确的用户名和密码登录系统
**前置条件**:
1. 后端服务运行在 http://localhost:3000
2. 前端应用运行在 http://localhost:5173
3. 测试用户已注册 (用户名: demo_user, 密码: demo123)

**测试步骤**:
1. 打开浏览器，访问 http://localhost:5173/login
2. 验证登录页面正常加载
3. 在用户名输入框中输入 "demo_user"
4. 在密码输入框中输入 "demo123"
5. 点击"登录"按钮
6. 等待页面跳转

**预期结果**:
1. 登录页面显示正常，包含用户名、密码输入框和登录按钮
2. 输入用户名和密码后，点击登录按钮
3. 页面跳转到首页 (http://localhost:5173/)
4. 首页显示欢迎信息或用户相关信息
5. localStorage 中存储了有效的 JWT token
6. 浏览器地址栏显示首页URL

**验证点**:
- [ ] 登录页面UI元素完整
- [ ] 输入框可以正常输入
- [ ] 登录按钮可点击
- [ ] 页面跳转成功
- [ ] token正确存储
- [ ] 首页内容正确显示

#### TC-AUTH-002: 用户名错误登录
**优先级**: 中
**描述**: 用户使用错误的用户名尝试登录
**前置条件**: 同TC-AUTH-001

**测试步骤**:
1. 打开登录页面
2. 输入用户名: "wrong_user"
3. 输入密码: "demo123"
4. 点击登录按钮

**预期结果**:
1. 页面不跳转，停留在登录页面
2. 显示错误提示信息："用户名或密码错误"
3. 密码输入框被清空（安全考虑）
4. localStorage 中没有存储token

#### TC-AUTH-003: 密码错误登录
**优先级**: 中
**描述**: 用户使用错误的密码尝试登录
**前置条件**: 同TC-AUTH-001

**测试步骤**:
1. 打开登录页面
2. 输入用户名: "demo_user"
3. 输入密码: "wrong_password"
4. 点击登录按钮

**预期结果**:
1. 页面不跳转，停留在登录页面
2. 显示错误提示信息："用户名或密码错误"
3. 密码输入框被清空
4. localStorage 中没有存储token

#### TC-AUTH-004: 空输入登录
**优先级**: 低
**描述**: 用户不输入任何内容直接点击登录
**前置条件**: 同TC-AUTH-001

**测试步骤**:
1. 打开登录页面
2. 不输入任何内容
3. 直接点击登录按钮

**预期结果**:
1. 页面不跳转
2. 显示验证错误提示："请输入用户名"和"请输入密码"
3. 用户名和密码输入框有红色边框或错误提示

#### TC-AUTH-005: 记住我功能
**优先级**: 中
**描述**: 测试"记住我"功能是否正常工作
**前置条件**: 同TC-AUTH-001

**测试步骤**:
1. 打开登录页面
2. 输入正确的用户名和密码
3. 勾选"记住我"复选框
4. 点击登录按钮
5. 登录成功后关闭浏览器
6. 重新打开浏览器访问应用

**预期结果**:
1. 登录成功跳转到首页
2. token存储在localStorage中（而不是sessionStorage）
3. 重新打开浏览器后自动保持登录状态
4. 不需要重新登录即可访问受保护页面

#### TC-AUTH-006: 不记住我功能
**优先级**: 中
**描述**: 测试不勾选"记住我"时的登录状态保持
**前置条件**: 同TC-AUTH-001

**测试步骤**:
1. 打开登录页面
2. 输入正确的用户名和密码
3. 不勾选"记住我"复选框
4. 点击登录按钮
5. 登录成功后关闭浏览器标签页
6. 重新打开新标签页访问应用

**预期结果**:
1. 登录成功跳转到首页
2. token存储在sessionStorage中
3. 关闭浏览器标签页后，新标签页需要重新登录
4. 重新打开新标签页时跳转到登录页面

### 测试套件2: API接口测试

#### TC-API-001: 登录API测试
**优先级**: 高
**描述**: 测试登录API的正确响应
**测试方法**: API测试 (使用Postman或supertest)

**请求**:
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "demo_user",
  "password": "demo123"
}
```

**预期响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "demo_user",
      "email": "demo@example.com",
      "display_name": "演示用户",
      "role": "user"
    },
    "token": "jwt_token_string"
  }
}
```

**验证点**:
- [ ] 响应状态码为200
- [ ] 响应格式符合预期
- [ ] token字段存在且非空
- [ ] 用户信息完整
- [ ] 响应时间小于500ms

#### TC-API-002: 错误凭证API测试
**优先级**: 中
**描述**: 测试使用错误凭证调用登录API

**请求**:
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "wrong_user",
  "password": "wrong_password"
}
```

**预期响应** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

#### TC-API-003: 获取用户信息API测试
**优先级**: 高
**描述**: 测试使用有效token获取用户信息

**请求**:
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer {valid_token}
```

**预期响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "demo_user",
      "email": "demo@example.com",
      "display_name": "演示用户",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

#### TC-API-004: 无效token API测试
**优先级**: 中
**描述**: 测试使用无效token调用受保护API

**请求**:
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer invalid_token_here
```

**预期响应** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "无效的认证令牌"
  }
}
```

#### TC-API-005: 缺少token API测试
**优先级**: 中
**描述**: 测试不提供token调用受保护API

**请求**:
```http
GET http://localhost:3000/api/auth/me
```

**预期响应** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "需要登录认证"
  }
}
```

### 测试套件3: 前端状态管理测试

#### TC-FRONT-001: 登录状态持久化
**优先级**: 高
**描述**: 验证登录状态在前端的正确管理

**测试步骤**:
1. 成功登录系统
2. 刷新页面
3. 检查是否保持登录状态
4. 检查用户信息是否正确显示

**预期结果**:
1. 刷新页面后仍然保持登录状态
2. 用户信息正确显示在页面上
3. 不需要重新输入凭证

#### TC-FRONT-002: 登出功能
**优先级**: 中
**描述**: 测试用户登出功能

**测试步骤**:
1. 成功登录系统
2. 点击登出按钮
3. 检查页面跳转
4. 尝试访问受保护页面

**预期结果**:
1. 点击登出后跳转到登录页面
2. localStorage/sessionStorage中的token被清除
3. 尝试访问受保护页面时重定向到登录页面

#### TC-FRONT-003: Token过期处理
**优先级**: 中
**描述**: 测试token过期时的处理

**测试步骤**:
1. 使用一个即将过期的token登录
2. 等待token过期
3. 尝试调用需要认证的API
4. 检查前端如何处理

**预期结果**:
1. API调用返回401错误
2. 前端自动跳转到登录页面
3. 显示适当的错误提示

#### TC-FRONT-004: 并发登录处理
**优先级**: 低
**描述**: 测试多个标签页同时登录的状态同步

**测试步骤**:
1. 在一个标签页登录
2. 在另一个标签页打开应用
3. 检查登录状态是否同步
4. 在一个标签页登出
5. 检查另一个标签页的状态

**预期结果**:
1. 第二个标签页自动获取登录状态
2. 一个标签页登出后，另一个标签页也自动登出
3. 状态同步正确

### 测试套件4: 错误处理和边界测试

#### TC-ERROR-001: 网络错误处理
**优先级**: 高
**描述**: 测试后端服务不可用时的前端处理

**测试步骤**:
1. 停止后端服务
2. 在前端尝试登录
3. 检查错误提示

**预期结果**:
1. 显示友好的网络错误提示
2. 不显示技术性错误信息给用户
3. 提供重试选项

#### TC-ERROR-002: 服务器错误处理
**优先级**: 中
**描述**: 测试服务器返回500错误时的处理

**模拟方法**: 修改后端代码，使登录API总是返回500错误

**预期结果**:
1. 前端显示"服务器内部错误"提示
2. 提供联系管理员的信息
3. 不暴露详细的错误堆栈

#### TC-ERROR-003: 超时处理
**优先级**: 中
**描述**: 测试API响应超时时的处理

**模拟方法**: 在后端添加延迟，使响应时间超过前端设置的超时时间

**预期结果**:
1. 前端显示"请求超时"提示
2. 提供重试按钮
3. 适当的加载状态显示

#### TC-ERROR-004: 响应格式错误
**优先级**: 低
**描述**: 测试后端返回非预期格式时的处理

**模拟方法**: 修改后端，返回非JSON格式或格式错误的响应

**预期结果**:
1. 前端显示"服务器响应格式错误"
2. 应用不会崩溃
3. 提供基本的错误恢复选项

### 测试套件5: 安全测试

#### TC-SEC-001: XSS防护测试
**优先级**: 高
**描述**: 测试输入字段的XSS防护

**测试步骤**:
1. 在用户名输入框中输入XSS攻击代码: `<script>alert('xss')</script>`
2. 尝试登录
3. 检查脚本是否被执行

**预期结果**:
1. 输入被正确过滤或拒绝
2. 脚本不会在前端执行
3. 显示适当的输入验证错误

#### TC-SEC-002: SQL注入防护
**优先级**: 高
**描述**: 测试SQL注入防护

**测试步骤**:
1. 在用户名输入框中输入SQL注入代码: `admin' OR '1'='1`
2. 尝试登录
3. 检查后端是否正确处理

**预期结果**:
1. 登录失败
2. 不暴露数据库错误信息
3. 显示通用的登录失败提示

#### TC-SEC-003: 暴力破解防护
**优先级**: 中
**描述**: 测试连续登录失败的处理

**测试步骤**:
1. 连续使用错误密码尝试登录10次
2. 检查是否触发防护机制

**预期结果**:
1. 多次失败后显示验证码或增加延迟
2. 可能的IP限制或账户锁定
3. 适当的防护提示

#### TC-SEC-004: Token安全
**优先级**: 高
**描述**: 测试token的安全性

**测试步骤**:
1. 检查token是否通过HTTPS传输
2. 检查token是否存储在安全的storage中
3. 检查是否有token刷新机制

**预期结果**:
1. 生产环境使用HTTPS
2. token有合理的过期时间
3. 有token刷新机制避免频繁登录

### 测试执行记录模板

```markdown
## 测试执行记录 - [日期]

### 环境信息
- 前端版本: [版本号]
- 后端版本: [版本号]
- 测试环境: [环境名称]
- 测试人员: [姓名]

### 测试结果摘要
- 总测试用例: [数量]
- 通过: [数量]
- 失败: [数量]
- 跳过: [数量]
- 通过率: [百分比]

### 详细结果
| 测试用例ID | 测试用例名称 | 状态 | 执行时间 | 备注 |
|------------|--------------|------|----------|------|
| TC-AUTH-001 | 正常登录流程 | ✅ | 10:30 | |
| TC-AUTH-002 | 用户名错误登录 | ✅ | 10:35 | |
| TC-API-001 | 登录API测试 | ❌ | 10:40 | API返回500错误 |

### 发现的问题
1. **严重问题**: [问题描述]
   - 影响: [影响范围]
   - 建议: [修复建议]
   - 负责人: [负责人]

2. **一般问题**: [问题描述]
   - 影响: [影响范围]
   - 建议: [修复建议]
   - 负责人: [负责人]

### 测试结论
[测试是否通过，是否建议进入下一阶段]
```

## 自动化测试脚本示例

### Playwright E2E测试示例
```javascript
const { test, expect } = require('@playwright/test');

test('正常登录流程', async ({ page }) => {
  // 1. 打开登录页面
  await page.goto('http://localhost:5173/login');
  
  // 2. 验证页面元素
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  
  // 3. 输入登录信息
  await page.fill('input[name="username"]', 'demo_user');
  await page.fill('input[name="password"]', 'demo123');
  
  // 4. 点击登录
  await page.click('button[type="submit"]');
  
  // 5. 验证跳转
  await page.waitForURL('http://localhost:5173/');
  
  // 6. 验证首页内容
  await expect(page.locator('h1')).toContainText('技术论坛');
  
  // 7. 验证token存储
  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  expect(token).toBeTruthy();
});

test('密码错误登录', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  
  await page.fill('input[name="username"]', 'demo_user');
  await page.fill('input[name="password"]', 'wrong_password');
  await page.click('button[type="submit"]');
  
  // 应该停留在登录页面
  await expect(page).toHaveURL(/\/login$/);
  
  // 应该有错误提示
  await expect(page.locator('.text-red-700')).toBeVisible();
  await expect(page.locator('.text-red-700')).toContainText('用户名或密码错误');
});
```

### Jest API测试示例
```javascript
const request = require('supertest');
const app = require('../backend/src/app');

describe('认证API测试', () => {
  test('正常登录', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'demo_user',
        password: 'demo123'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.username).toBe('demo_user');
  });
  
  test('错误凭证登录', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wrong_user',
        password: 'wrong_password'
      })
      .expect(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});
```

## 下一步行动

1. **环境准备**: 确保前后端服务正常运行
2. **测试数据**: 创建测试用户账户
3. **执行测试**: 按照优先级执行测试用例
4. **问题跟踪**: 记录和跟踪发现的问题
5. **报告生成**: 生成测试报告并分享给团队