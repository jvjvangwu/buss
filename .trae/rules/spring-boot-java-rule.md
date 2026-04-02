---
trigger: glob
glob: *.java
---
你是一个资深的java专家，请在开发中遵循如下规则：
---
name: java-spring-boot-expert
description: 在创建或修改 Spring Boot 项目代码时，按团队约定的分层结构、异常处理、日志规范进行开发。
---
# Java Spring Boot 开发规范
## 分层结构

- Controller 层：只做参数校验、调用 Service、返回 DTO、记录日志和添加@Operation注解
- Service 层：业务逻辑，事务边界
- Repository/Mapper 层：数据库访问
- 禁止跨层直接访问（如 Controller 直接调 Repository）
## 命名规范
- 类名使用 PascalCase，如 UserService
- 方法名使用 camelCase，如 getUserById
- 常量全大写下划线分隔，如 MAX_RETRY_COUNT
## 异常处理
- 不在代码中吞掉异常
- 使用统一的业务异常类型（如 BusinessException）
- 异常必须有对应的枚举常量 (如 ErrorCode)
- 在 Controller 层统一异常处理与错误响应格式，统一使用 ServiceExceptionUtil.exception 抛出异常
## 日志规范
- 关键业务入口、出口必须记录日志（INFO）
- 异常情况必须记录异常堆栈（ERROR）
- 日志中避免输出敏感信息
## 步骤
1. 分析新增/修改涉及的类和接口
2. 确保分层正确、调用路径清晰
3. 检查异常处理是否符合统一规范
4. 补齐必要的日志记录

### 框架开发规范
## 一、 模块与包结构规范
1. 模块划分规范
- `platform-module-log-bus`         # 日志总线模块
  ├─ api                         # 接口定义层 (DTO/VO/枚举/Feign接口)
  ├─ biz                         # 业务实现层 (Controller/Service/Mapper/entity)
  注意：
- 1.包按功能划分，不要按模块划分！
- 2.api的pom不能新增引入任何依赖，避免服务之间版本冲突！
- 3.不能在具体服务里面指定依赖的版本号，只能在platform-dependencies统一指定

## 二、数据实体与传输对象规范
1. 对象使用规范
   类型	命名规范	用途	示例
   DO	XxxDO	数据库实体	LogBusDO
   DTO	XxxReqDTO	请求参数	LogBusCreateReqDTO
   VO	XxxRespVO	响应结果	LogBusRespVO
   规范要求：
- 1.严禁在接口中直接返回DO实体
- 2.严禁在接口中直接返回敏感信息，如密码、手机号等，如必须要返回则必须脱敏或者AES加密处理
- 3.使用MapStruct映射DO到DTO/VO，避免手动映射


## 三、编码实现规范
1. SQL与数据库操作
   // 禁止：XML/SQL硬编码（国产化适配）
   ❌ @Select("SELECT * FROM log_bus WHERE id = #{id}")

   // 推荐：使用MyBatis-Plus条件构造器

2. 避免魔法值
   // 禁止：使用数字/字符串直接判断
   ❌ if (status == 1) {...}

   // 推荐：使用枚举类
   public enum LogStatusEnum {
   UNPROCESSED(0, "未处理"),
   PROCESSED(1, "已处理");
   private final Integer code;
   private final String desc;
   }
   // 使用示例
   if (LogStatusEnum.PROCESSED.getCode().equals(status)) {...}

3. 线程池管理
   // 禁止：直接new Thread
   ❌ new Thread(() -> {...}).start();

   // 推荐：使用统一线程池
   @Resource
   private ThreadPoolTaskExecutor taskExecutor;

   taskExecutor.execute(() -> {
   // 业务逻辑
   });

4. 批量数据处理
   // 禁止：循环中执行单条SQL
   ❌ for (LogBusDO log : logs) {
   logMapper.insert(log);
   }

   // 推荐：批量操作（每次≤1000条）
   ✅ ListUtils.partition(logs, 1000).forEach(batch -> {
   logMapper.insertBatch(batch);
   });


5. redis避免大key,导致redis阻塞超时，单个key不能超过512kb

6. 若对象可能为空，优先使用 Optional.ofNullable() 处理，避免空指针异常。

7. 涉及到第三方调用的接口，必须保留调用时间、原始参数、响应时间、原始响应时间到日志中，方便排查问题。

## 四、数据库表设计规范
1. 基础字段规范
- 主键：`id` BIGINT 雪花id
- 租户主键: `tenantId` BIGINT
- 逻辑删除：`deleted` BIT类型
- 审计字段：`create_time`/`update_time`/`creator`/`updater`
- 必要时可冗余字段：`creator_name `/`updater_name`等

## 五、接口与文档规范
1. 每个接口和方法都要添加注释，描述参数含义，返回结果含义
   /**
    * 获得 API 访问日志分页
    *
    * @param pageReqVO 分页查询
    * @return API 访问日志分页
   */
  PageResult<ApiAccessLogDO> getApiAccessLogPage(ApiAccessLogPageReqDTO pageReqVO);

2. 每个接口必须要通过冒烟测试，确保接口正常运行

## 六、系统安全
1. 外部接口必须考虑的流量、并发问题