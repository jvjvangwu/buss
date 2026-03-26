package com.forum.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * 权限服务
 * TODO: 对接实际的权限查询服务
 */
@Service
@RequiredArgsConstructor
public class PermissionService {

    // TODO: 注入 PermissionMapper

    /**
     * 获取当前用户权限
     */
    public Set<String> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new HashSet<>();
        }

        // TODO: 从数据库查询用户权限
        // Long userId = getUserId();
        // return permissionMapper.selectPermissionsByUserId(userId);
        
        return new HashSet<>();
    }

    /**
     * 检查当前用户是否有指定权限
     */
    public boolean hasPermission(String permission) {
        return getCurrentUserPermissions().contains(permission);
    }

    /**
     * 检查当前用户是否有任一权限
     */
    public boolean hasAnyPermission(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).anyMatch(userPermissions::contains);
    }

    /**
     * 检查当前用户是否有所有权限
     */
    public boolean hasAllPermissions(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).allMatch(userPermissions::contains);
    }

    /**
     * 获取当前用户ID
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        // TODO: 从认证信息中获取用户ID
        return null;
    }

    /**
     * 获取当前用户名
     */
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }
}
