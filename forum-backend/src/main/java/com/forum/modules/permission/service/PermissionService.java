package com.forum.modules.permission.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.forum.modules.permission.entity.Permission;

import java.util.List;

public interface PermissionService extends IService<Permission> {

    List<Permission> listAllPermissions();

    List<Permission> getPermissionTree();
}
