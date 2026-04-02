package com.forum.modules.permission.controller;

import com.forum.api.Result;
import com.forum.common.annotation.RequirePermission;
import com.forum.modules.permission.entity.Permission;
import com.forum.modules.permission.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@Tag(name = "权限管理", description = "权限相关接口")
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @Operation(summary = "获取所有权限")
    @RequirePermission("permission:view")
    public Result<List<Permission>> listPermissions() {
        List<Permission> permissions = permissionService.listAllPermissions();
        return Result.success(permissions);
    }

    @GetMapping("/tree")
    @Operation(summary = "获取权限树")
    @RequirePermission("permission:view")
    public Result<List<Permission>> getPermissionTree() {
        List<Permission> permissionTree = permissionService.getPermissionTree();
        return Result.success(permissionTree);
    }
}
