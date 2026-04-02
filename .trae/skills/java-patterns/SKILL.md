---
name: java-patterns
description: Java 21 编程模式、最佳实践和代码规范
---

# Java 编程模式

Java 21 开发的最佳实践和模式。

## 代码组织

### 命名规范

```java
// ✅ 好：遵循Java命名规范
public class UserService { }           // 类名：PascalCase
public interface UserRepository { }     // 接口：PascalCase
private String userName;               // 变量：camelCase
public static final int MAX_SIZE = 100; // 常量：UPPER_SNAKE_CASE
public void getUserById() { }           // 方法：camelCase

// ❌ 差：不符合规范
public class user_service { }
private String user_name;
public static final int maxSize = 100;
```

## Lambda 表达式和 Stream API

### Stream 操作

```java
// ✅ 好：使用 Stream 进行集合操作
List<User> activeUsers = users.stream()
    .filter(user -> user.isActive())
    .filter(user -> user.getAge() >= 18)
    .sorted(Comparator.comparing(User::getName))
    .collect(Collectors.toList());

// 计算统计信息
IntSummaryStatistics stats = users.stream()
    .mapToInt(User::getAge)
    .summaryStatistics();

System.out.println("平均年龄: " + stats.getAverage());
System.out.println("最大年龄: " + stats.getMax());

// 分组操作
Map<String, List<User>> usersByCity = users.stream()
    .collect(Collectors.groupingBy(User::getCity));

// ❌ 差：使用传统的循环
List<User> activeUsers = new ArrayList<>();
for (User user : users) {
    if (user.isActive() && user.getAge() >= 18) {
        activeUsers.add(user);
    }
}
Collections.sort(activeUsers, (a, b) -> a.getName().compareTo(b.getName()));
```

### Optional 使用

```java
// ✅ 好：正确使用 Optional
public Optional<User> findUserById(Long id) {
    return userRepository.findById(id);
}

// 使用 Optional 进行链式调用
String userName = findUserById(userId)
    .map(User::getName)
    .orElse("未知用户");

// 使用 Optional 进行条件操作
findUserById(userId)
    .ifPresent(user -> sendWelcomeEmail(user));

// 使用 Optional 处理默认值
User user = findUserById(userId)
    .orElseGet(() -> createDefaultUser());

// 使用 Optional 抛出异常
User user = findUserById(userId)
    .orElseThrow(() -> new UserNotFoundException("用户不存在"));

// ❌ 差：不正确使用 Optional
public Optional<User> findUserById(Long id) {
    User user = userRepository.findById(id);
    if (user != null) {
        return Optional.of(user);
    }
    return Optional.empty();
}

// ❌ 差：直接调用 get()
User user = findUserById(userId).get(); // 可能抛出 NoSuchElementException
```

## 数据库操作

### 使用 MyBatis-Plus

```java
// Entity
@Data
@TableName(name = "users")
public class User {

    @TableId
    private Long id;

    private String email;

    private String name;

    private LocalDateTime createTime;

    // getters, setters, constructors
}

// Repository
@Repository
public interface UserRepository extends BaseMapper<User> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByActiveTrueAndAgeGreaterThanEqual(Integer age);
    
}

// Service
@Service
@Transactional
public class UserService {
    
    private final UserMapper userMapper;
    
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    public User createUser(UserDto userDto) {
        // 验证邮箱是否已存在
        if (userMapper.findByEmail(userDto.getEmail()).isPresent()) {
            throw new BusinessException(
                ErrorCode.DUPLICATE_EMAIL,
                "邮箱已被使用"
            );
        }
        
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setCreatedAt(LocalDateTime.now());
        
        return userMapper.save(user);
    }
    
    @Transactional(readOnly = true)
    public List<User> getActiveUsers(Integer minAge) {
        return userMapper.findByActiveTrueAndAgeGreaterThanEqual(minAge);
    }
}
```

## REST API

### 使用 Spring Boot

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = users.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserDto userDto = convertToDto(user);
        return ResponseEntity.ok(userDto);
    }
    
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        User user = userService.createUser(userDto);
        UserDto createdUserDto = convertToDto(user);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(createdUserDto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDto userDto) {
        User user = userService.updateUser(id, userDto);
        UserDto updatedUserDto = convertToDto(user);
        return ResponseEntity.ok(updatedUserDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        return dto;
    }
}
```

## 依赖注入

### 使用构造函数注入

```java
// ✅ 好：使用构造函数注入
@Service
public class OrderService {
    
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    
    // Spring 4.3+ 可以省略 @Autowired
    public OrderService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }
    
    public Order createOrder(OrderDto orderDto) {
        // 使用注入的依赖
    }
}

// ❌ 差：使用字段注入
@Service
public class OrderService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
}
```

## 配置管理

### 使用 @ConfigurationProperties

```java
@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppConfig {
    private String name;
    private String version;
    private Database database;
    private Cache cache;

    @Data
    public static class Database {
        private String url;
        private String username;
        private String password;
    }

    @Data
    public static class Cache {
        private String type;
        private Long ttl;
    }
}

// application.properties
app.name=My Application
app.version=1.0.0
app.database.url=jdbc:postgresql://localhost:5432/mydb
app.database.username=admin
app.database.password=secret
app.cache.type=redis
app.cache.ttl=3600
```

## 日志记录

### 使用 SLF4J 和 Logback

```java

@Slf4j
@Service
public class UserService {
    
    private final UserMapper userMapper;
    
    public User createUser(UserDto userDto) {
        logger.info("创建用户: {}", userDto.getEmail());
        
        try {
            User user = userMapper.save(convertToEntity(userDto));
            logger.info("用户创建成功: ID={}", user.getId());
            return user;
        } catch (Exception e) {
            logger.error("创建用户失败: {}", userDto.getEmail(), e);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "创建用户失败");
        }
    }
    
    public User getUserById(Long id) {
        logger.debug("查询用户: ID={}", id);
        
        return userMapper.getById(id)
            .orElseThrow(() -> {
                logger.warn("用户不存在: ID={}", id);
                return new BusinessException(
                    ErrorCode.USER_NOT_FOUND,
                    "用户不存在"
                );
            });
    }
}
```

## 测试

### 使用 JUnit 5

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUser() {
        // Given
        UserDto userDto = new UserDto();
        userDto.setEmail("test@example.com");
        userDto.setName("Test User");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("test@example.com");
        savedUser.setName("Test User");
        
        when(userMapper.findByEmail("test@example.com"))
            .thenReturn(Optional.empty());
        when(userMapper.save(any(User.class)))
            .thenReturn(savedUser);
        
        // When
        User result = userService.createUser(userDto);
        
        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
        
        verify(userMapper).findByEmail("test@example.com");
        verify(userMapper).save(any(User.class));
    }
    
    @Test
    void shouldThrowExceptionWhenEmailExists() {
        // Given
        UserDto userDto = new UserDto();
        userDto.setEmail("existing@example.com");
        
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("existing@example.com");
        
        when(userMapper.findByEmail("existing@example.com"))
            .thenReturn(Optional.of(existingUser));
        
        // When & Then
        BusinessException exception = assertThrows(
            BusinessException.class,
            () -> userService.createUser(userDto)
        );
        
        assertEquals(ErrorCode.DUPLICATE_EMAIL, exception.getErrorCode());
    }
}
```

## 并发编程

### 使用 CompletableFuture

```java
// 并行执行多个任务
public CompletableFuture<OrderResult> processOrder(OrderDto orderDto) {
    // 并行获取用户和商品信息
    CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(
        () -> userService.getUserById(orderDto.getUserId())
    );
    
    CompletableFuture<Product> productFuture = CompletableFuture.supplyAsync(
        () -> productService.getProductById(orderDto.getProductId())
    );
    
    // 等待所有任务完成
    return userFuture.thenCombineAsync(productFuture, (user, product) -> {
        // 处理订单逻辑
        Order order = createOrder(user, product, orderDto);
        return orderRepository.save(order);
    }).thenApply(order -> {
        // 发送通知
        emailService.sendOrderConfirmation(order);
        return new OrderResult(order.getId(), "SUCCESS");
    }).exceptionally(ex -> {
        // 处理异常
        logger.error("订单处理失败", ex);
        return new OrderResult(null, "FAILED");
    });
}
```

## 性能优化

### 使用缓存

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearAllProductsCache() {
        // 清除所有缓存
    }
}
```

**记住**：Java 21 提供了丰富的特性，合理使用 Lambda、Stream、Optional 等特性可以提高代码的可读性和简洁性。