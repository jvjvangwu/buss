package com.forum.security.service;

import com.forum.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final UserService userService;

    public Set<String> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new HashSet<>();
        }

        Long userId = getCurrentUserId();
        if (userId == null) {
            return new HashSet<>();
        }

        return new HashSet<>(userService.getUserPermissions(userId));
    }

    public boolean hasPermission(String permission) {
        return getCurrentUserPermissions().contains(permission);
    }

    public boolean hasAnyPermission(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).anyMatch(userPermissions::contains);
    }

    public boolean hasAllPermissions(String... permissions) {
        Set<String> userPermissions = getCurrentUserPermissions();
        return Arrays.stream(permissions).allMatch(userPermissions::contains);
    }

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User user = 
                (org.springframework.security.core.userdetails.User) principal;
            com.forum.modules.user.entity.User userEntity = userService.getByUsername(user.getUsername());
            if (userEntity == null) {
                return null;
            }
            return userEntity.getId();
        }
        return null;
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }
}
