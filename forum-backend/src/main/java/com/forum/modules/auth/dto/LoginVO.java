package com.forum.modules.auth.dto;

import lombok.Data;

import java.util.List;

/**
 * 登录响应 VO
 */
@Data
public class LoginVO {

    /**
     * 访问令牌
     */
    private String accessToken;

    /**
     * 令牌类型
     */
    private String tokenType = "Bearer";

    /**
     * 过期时间（秒）
     */
    private Long expiresIn;

    /**
     * 刷新令牌
     */
    private String refreshToken;

    /**
     * 用户信息
     */
    private UserInfo user;

    /**
     * 用户信息
     */
    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String nickname;
        private String avatar;
        private List<String> roles;
        private List<String> permissions;
    }
}
