package com.forum.modules.role.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.api.Result;
import com.forum.common.annotation.RequirePermission;
import com.forum.modules.role.entity.Role;
import com.forum.modules.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "角色管理", description = "角色CRUD、权限分配等角色管理接口")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "获取所有角色")
    @RequirePermission("role:view")
    public Result<List<Role>> listRoles() {
        List<Role> roles = roleService.listAllRoles();
        return Result.success(roles);
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询角色")
    @RequirePermission("role:view")
    public Result<IPage<Role>> pageRoles(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String roleName) {
        Page<Role> page = new Page<>(pageNum, pageSize);
        IPage<Role> result = roleService.pageRoles(page, roleName);
        return Result.success(result);
    }

    @PostMapping
    @Operation(summary = "创建角色")
    @RequirePermission("role:create")
    public Result<Role> createRole(@RequestBody Role role) {
        Role createdRole = roleService.createRole(role);
        return Result.success("角色创建成功", createdRole);
    }

    @PutMapping
    @Operation(summary = "更新角色")
    @RequirePermission("role:update")
    public Result<Role> updateRole(@RequestBody Role role) {
        Role updatedRole = roleService.updateRole(role);
        return Result.success("角色更新成功", updatedRole);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新角色状态")
    @RequirePermission("role:update")
    public Result<Void> updateRoleStatus(@PathVariable Long id, @RequestParam Integer status) {
        roleService.updateRoleStatus(id, status);
        return Result.success("状态更新成功");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除角色")
    @RequirePermission("role:delete")
    public Result<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return Result.success("角色删除成功");
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取角色详情")
    @RequirePermission("role:view")
    public Result<Role> getRole(@PathVariable Long id) {
        Role role = roleService.getById(id);
        return Result.success(role);
    }

    @GetMapping("/{id}/permissions")
    @Operation(summary = "获取角色权限")
    @RequirePermission("role:view")
    public Result<List<Long>> getRolePermissions(@PathVariable Long id) {
        List<Long> permissionIds = roleService.getRolePermissions(id);
        return Result.success(permissionIds);
    }

    @PostMapping("/{id}/permissions")
    @Operation(summary = "分配权限")
    @RequirePermission("role:assign-permission")
    public Result<Void> assignPermissions(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        roleService.assignPermissions(id, permissionIds);
        return Result.success("权限分配成功");
    }
}
