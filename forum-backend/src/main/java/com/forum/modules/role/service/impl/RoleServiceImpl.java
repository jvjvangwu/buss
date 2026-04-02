package com.forum.modules.role.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.forum.modules.role.entity.Role;
import com.forum.modules.role.mapper.RoleMapper;
import com.forum.modules.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements RoleService {

    @Override
    public List<Role> listAllRoles() {
        return lambdaQuery()
                .eq(Role::getStatus, 1)
                .orderByAsc(Role::getId)
                .list();
    }

    @Override
    public IPage<Role> pageRoles(Page<Role> page, String roleName) {
        return lambdaQuery()
                .like(roleName != null && !roleName.isEmpty(), Role::getName, roleName)
                .orderByAsc(Role::getId)
                .page(page);
    }

    @Override
    public Role createRole(Role role) {
        save(role);
        return role;
    }

    @Override
    public Role updateRole(Role role) {
        updateById(role);
        return role;
    }

    @Override
    public void updateRoleStatus(Long roleId, Integer status) {
        lambdaUpdate()
                .set(Role::getStatus, status)
                .eq(Role::getId, roleId)
                .update();
    }

    @Override
    public void deleteRole(Long roleId) {
        removeById(roleId);
    }

    @Override
    public List<Long> getRolePermissions(Long roleId) {
        return baseMapper.selectPermissionIdsByRoleId(roleId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        baseMapper.deleteRolePermissions(roleId);
        if (permissionIds != null && !permissionIds.isEmpty()) {
            baseMapper.insertRolePermissions(roleId, permissionIds);
        }
    }
}
