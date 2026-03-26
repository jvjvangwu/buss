package com.forum.modules.user.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户 VO
 */
@Data
public class UserVO {

    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 性别
     */
    private Integer gender;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 角色列表
     */
    private List<RoleInfo> roles;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 角色信息
     */
    @Data
    public static class RoleInfo {
        private Long id;
        private String roleName;
        private String roleCode;
    }
}
