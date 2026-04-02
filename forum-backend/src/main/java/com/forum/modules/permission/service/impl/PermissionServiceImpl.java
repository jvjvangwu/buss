package com.forum.modules.permission.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.forum.modules.permission.entity.Permission;
import com.forum.modules.permission.mapper.PermissionMapper;
import com.forum.modules.permission.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl extends ServiceImpl<PermissionMapper, Permission> implements PermissionService {

    @Override
    public List<Permission> listAllPermissions() {
        return lambdaQuery()
                .eq(Permission::getStatus, 1)
                .orderByAsc(Permission::getSort)
                .list();
    }

    @Override
    public List<Permission> getPermissionTree() {
        List<Permission> allPermissions = listAllPermissions();
        
        // 构建权限树
        Map<Long, Permission> permissionMap = allPermissions.stream()
                .collect(Collectors.toMap(Permission::getId, permission -> {
                    permission.setChildren(new ArrayList<>());
                    return permission;
                }));

        List<Permission> rootPermissions = new ArrayList<>();

        for (Permission permission : allPermissions) {
            if (permission.getParentId() == null || permission.getParentId() == 0) {
                rootPermissions.add(permission);
            } else {
                Permission parent = permissionMap.get(permission.getParentId());
                if (parent != null) {
                    parent.getChildren().add(permission);
                }
            }
        }

        return rootPermissions;
    }
}
