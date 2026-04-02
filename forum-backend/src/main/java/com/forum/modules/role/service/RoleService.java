package com.forum.modules.role.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.forum.modules.role.entity.Role;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface RoleService extends IService<Role> {

    List<Role> listAllRoles();

    IPage<Role> pageRoles(Page<Role> page, String roleName);

    Role createRole(Role role);

    Role updateRole(Role role);

    void updateRoleStatus(Long roleId, Integer status);

    void deleteRole(Long roleId);

    List<Long> getRolePermissions(Long roleId);

    void assignPermissions(Long roleId, List<Long> permissionIds);
}
