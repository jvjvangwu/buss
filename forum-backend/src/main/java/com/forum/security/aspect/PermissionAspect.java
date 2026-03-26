package com.forum.security.aspect;

import com.forum.common.annotation.RequirePermission;
import com.forum.common.exception.BusinessException;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;

/**
 * 权限切面
 */
@Aspect
@Component
@RequiredArgsConstructor
public class PermissionAspect {

    private final PermissionService permissionService;

    @Around("@annotation(com.forum.common.annotation.RequirePermission)")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        RequirePermission annotation = method.getAnnotation(RequirePermission.class);

        String[] permissions = annotation.value();
        if (permissions.length == 0) {
            return point.proceed();
        }

        Set<String> userPermissions = permissionService.getCurrentUserPermissions();

        boolean hasPermission;
        if (annotation.logical() == RequirePermission.Logical.AND) {
            hasPermission = Arrays.stream(permissions)
                    .allMatch(userPermissions::contains);
        } else {
            hasPermission = Arrays.stream(permissions)
                    .anyMatch(userPermissions::contains);
        }

        if (!hasPermission) {
            throw new BusinessException("无权限访问");
        }

        return point.proceed();
    }
}
