package com.forum.modules.permission.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("sys_permission")
public class Permission {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String code;

    private Integer type;

    private Long parentId;

    private String path;

    private String icon;

    private Integer sort;

    private Integer status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // 非数据库字段，用于构建权限树
    @TableField(exist = false)
    private List<Permission> children;
}
