package com.forum.modules.log.aspect;

import com.forum.modules.log.entity.OperationLog;
import com.forum.modules.log.service.OperationLogService;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 操作日志AOP切面
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class OperationLogAspect {
    
    private final OperationLogService operationLogService;
    private final PermissionService permissionService;
    
    // 记录开始时间
    private final ThreadLocal<Long> startTime = new ThreadLocal<>();
    // 记录操作日志
    private final ThreadLocal<OperationLog> operationLogThreadLocal = new ThreadLocal<>();
    
    /**
     * 定义切点
     */
    @Pointcut("@within(org.springframework.web.bind.annotation.RestController)")
    public void operationLogPointcut() {}
    
    /**
     * 前置通知，记录请求信息
     */
    @Before("operationLogPointcut()")
    public void before(JoinPoint joinPoint) {
        // 记录开始时间
        startTime.set(System.currentTimeMillis());
        
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return;
        }
        HttpServletRequest request = attributes.getRequest();
        
        // 创建操作日志
        OperationLog operationLog = new OperationLog();
        operationLog.setOperation(getOperationType(request.getMethod()));
        operationLog.setMethod(request.getMethod());
        operationLog.setIp(request.getRemoteAddr());
        operationLog.setCreatedAt(LocalDateTime.now());
        
        // 获取操作人信息
        try {
            Long userId = permissionService.getCurrentUserId();
            operationLog.setUserId(userId);
            operationLog.setUsername(permissionService.getCurrentUsername());
        } catch (Exception e) {
            // 未登录用户
            operationLog.setUsername("匿名用户");
        }
        
        // 保存到线程本地变量
        operationLogThreadLocal.set(operationLog);
    }
    
    /**
     * 后置通知，记录成功操作
     */
    @AfterReturning(pointcut = "operationLogPointcut()", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        // 计算耗时
        int duration = (int) (System.currentTimeMillis() - startTime.get());
        
        // 获取操作日志
        OperationLog operationLog = operationLogThreadLocal.get();
        if (operationLog == null) {
            return;
        }
        
        // 设置操作结果
        operationLog.setDuration(duration);
        operationLog.setResult(result != null ? result.toString() : "");
        
        // 保存操作日志
        operationLogService.save(operationLog);
        
        // 清理线程本地变量
        cleanup();
    }
    
    /**
     * 异常通知，记录失败操作
     */
    @AfterThrowing(pointcut = "operationLogPointcut()", throwing = "throwable")
    public void afterThrowing(JoinPoint joinPoint, Throwable throwable) {
        // 计算耗时
        int duration = (int) (System.currentTimeMillis() - startTime.get());
        
        // 获取操作日志
        OperationLog operationLog = operationLogThreadLocal.get();
        if (operationLog == null) {
            return;
        }
        
        // 设置操作结果
        operationLog.setDuration(duration);
        operationLog.setErrorMsg(throwable.getMessage());
        
        // 保存操作日志
        operationLogService.save(operationLog);
        
        // 清理线程本地变量
        cleanup();
    }
    
    /**
     * 清理线程本地变量
     */
    private void cleanup() {
        startTime.remove();
        operationLogThreadLocal.remove();
    }
    
    /**
     * 根据HTTP方法获取操作类型
     */
    private String getOperationType(String method) {
        Map<String, String> methodMap = new HashMap<>();
        methodMap.put("GET", "查询");
        methodMap.put("POST", "创建");
        methodMap.put("PUT", "更新");
        methodMap.put("DELETE", "删除");
        return methodMap.getOrDefault(method, "其他");
    }
}
