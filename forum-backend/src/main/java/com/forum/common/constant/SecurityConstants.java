package com.forum.common.constant;

/**
 * 安全相关常量
 */
public class SecurityConstants {

    private SecurityConstants() {}

    /**
     * JWT 请求头
     */
    public static final String TOKEN_HEADER = "Authorization";

    /**
     * JWT 前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * JWT 黑名单前缀
     */
    public static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    /**
     * 用户权限缓存前缀
     */
    public static final String USER_PERMISSIONS_PREFIX = "user:permissions:";

    /**
     * 用户角色缓存前缀
     */
    public static final String USER_ROLES_PREFIX = "user:roles:";

    /**
     * 白名单路径
     */
    public static final String[] WHITE_LIST = {
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/wechat-login",
            "/api/v1/auth/refresh",
            "/doc.html",
            "/webjars/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            "/favicon.ico",
            "/error"
    };
}
