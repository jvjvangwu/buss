package com.forum.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户 DTO
 */
@Data
public class UserDTO {

    /**
     * 用户ID（更新时使用）
     */
    private Long id;

    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    private String username;

    /**
     * 密码
     */
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    private String password;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    private String email;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 昵称
     */
    @Size(max = 100, message = "昵称长度不能超过100个字符")
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
     * 生日
     */
    private String birthday;

    /**
     * 个人简介
     */
    @Size(max = 500, message = "个人简介不能超过500个字符")
    private String bio;

    /**
     * 角色ID列表
     */
    private java.util.List<Long> roleIds;
}
