package com.forum.modules.user.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.api.Result;
import com.forum.common.annotation.RequirePermission;
import com.forum.modules.user.dto.UserDTO;
import com.forum.modules.user.dto.UserQueryDTO;
import com.forum.modules.user.service.UserService;
import com.forum.modules.user.vo.UserVO;
import com.forum.security.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "用户管理", description = "用户CRUD、角色分配等用户管理接口")
public class UserController {

    private final UserService userService;
    private final PermissionService permissionService;

    @GetMapping("/current")
    @Operation(summary = "获取当前用户信息")
    public Result<UserVO> getCurrentUser() {
        Long userId = permissionService.getCurrentUserId();
        UserVO userVO = userService.getUserVO(userId);
        return Result.success(userVO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    @RequirePermission("user:view")
    public Result<UserVO> getUser(@PathVariable Long id) {
        UserVO userVO = userService.getUserVO(id);
        return Result.success(userVO);
    }

    @GetMapping
    @Operation(summary = "分页查询用户列表")
    @RequirePermission("user:view")
    public Result<IPage<UserVO>> pageUsers(UserQueryDTO queryDTO) {
        IPage<UserVO> page = userService.pageUsers(queryDTO);
        return Result.success(page);
    }

    @PostMapping
    @Operation(summary = "创建用户")
    @RequirePermission("user:create")
    public Result<UserVO> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserVO userVO = userService.register(userDTO);
        return Result.success("创建成功", userVO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新用户信息")
    @RequirePermission("user:edit")
    public Result<Void> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        userService.updateUser(id, userDTO);
        return Result.success("更新成功");
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新用户状态")
    @RequirePermission("user:edit")
    public Result<Void> updateUserStatus(@PathVariable Long id, @RequestParam Integer status) {
        userService.updateUserStatus(id, status);
        return Result.success("状态更新成功");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    @RequirePermission("user:delete")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success("删除成功");
    }

    @GetMapping("/{id}/roles")
    @Operation(summary = "获取用户角色")
    @RequirePermission("user:view")
    public Result<java.util.List<java.util.Map<String, Object>>> getUserRoles(@PathVariable Long id) {
        java.util.List<String> roleStrings = userService.getUserRoles(id);
        java.util.List<java.util.Map<String, Object>> roles = roleStrings.stream()
                .map(roleStr -> {
                    java.util.Map<String, Object> roleMap = new java.util.HashMap<>();
                    String[] parts = roleStr.split(":");
                    roleMap.put("id", Long.parseLong(parts[0]));
                    roleMap.put("roleName", parts[1]);
                    roleMap.put("roleCode", parts[2]);
                    return roleMap;
                })
                .collect(java.util.stream.Collectors.toList());
        return Result.success(roles);
    }

    @PostMapping("/{id}/roles")
    @Operation(summary = "分配角色")
    @RequirePermission("user:assign-role")
    public Result<Void> assignRoles(@PathVariable Long id, @RequestBody java.util.Map<String, java.util.List<Long>> request) {
        java.util.List<Long> roleIds = request.get("roleIds");
        userService.assignRoles(id, roleIds);
        return Result.success("角色分配成功");
    }
}
