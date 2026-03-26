# 论坛系统后端

基于 Spring Boot 3 + PostgreSQL + Spring Security + JWT 的论坛系统后端。

## 技术栈

- Java 17
- Spring Boot 3.2.0
- Spring Security 6
- PostgreSQL 15+
- Redis 7+
- MyBatis Plus 3.5.5
- JWT (jjwt 0.12.3)
- Knife4j (API 文档)

## 项目结构

```
forum-backend/
├── src/main/java/com/forum/
│   ├── ForumApplication.java          # 主启动类
│   ├── api/                           # API 响应
│   │   └── Result.java                # 统一响应格式
│   ├── common/                        # 公共模块
│   │   ├── annotation/                # 自定义注解
│   │   ├── config/                    # 配置类
│   │   ├── constant/                  # 常量
│   │   ├── enums/                     # 枚举
│   │   ├── exception/                 # 异常处理
│   │   └── utils/                     # 工具类
│   ├── security/                      # 安全模块
│   │   ├── aspect/                    # 权限切面
│   │   ├── filter/                    # JWT 过滤器
│   │   ├── handler/                   # 异常处理器
│   │   └── service/                   # 权限服务
│   └── modules/                       # 业务模块
│       ├── auth/                      # 认证模块
│       ├── user/                      # 用户模块
│       └── news/                      # 新闻模块
└── src/main/resources/
    ├── application.yml                # 主配置
    ├── application-dev.yml            # 开发环境配置
    └── mapper/                        # MyBatis XML
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- PostgreSQL 15+
- Redis 7+

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE forum_dev ENCODING 'UTF8';
```

2. 执行数据库脚本（见 TECH-SPEC.md）

### 启动项目

```bash
# 安装依赖
mvn clean install

# 启动项目
mvn spring-boot:run
```

### API 文档

启动后访问：http://localhost:8080/doc.html

## 核心功能

### 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1703275200000
}
```

### 权限控制

使用 `@RequirePermission` 注解进行权限控制：

```java
@GetMapping
@RequirePermission("user:view")
public Result<List<UserVO>> list() {
    // ...
}
```

### JWT 认证

请求头携带 Token：
```
Authorization: Bearer {token}
```

## 配置说明

### 数据库配置

修改 `application-dev.yml`：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/forum_dev
    username: postgres
    password: postgres
```

### Redis 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

### JWT 配置

```yaml
jwt:
  secret: your-secret-key
  access-token-expiration: 7200000  # 2小时
  refresh-token-expiration: 604800000  # 7天
```

## 开发指南

### 添加新模块

1. 在 `modules` 包下创建模块目录
2. 创建 controller、service、mapper、entity、dto、vo 等包
3. 实现业务逻辑

### 添加新权限

1. 在数据库 `permissions` 表添加权限记录
2. 在 Controller 方法上使用 `@RequirePermission` 注解

## License

MIT
