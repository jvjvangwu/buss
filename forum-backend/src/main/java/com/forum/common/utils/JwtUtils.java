package com.forum.common.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 */
@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成访问令牌
     * @param userId 用户ID
     * @param username 用户名
     * @return JWT 令牌
     */
    public String generateAccessToken(Long userId, String username) {
        return generateAccessToken(userId, username, new HashMap<>());
    }

    /**
     * 生成访问令牌（带额外声明）
     * @param userId 用户ID
     * @param username 用户名
     * @param claims 额外声明
     * @return JWT 令牌
     */
    public String generateAccessToken(Long userId, String username, Map<String, Object> claims) {
        Map<String, Object> allClaims = new HashMap<>(claims);
        allClaims.put("userId", userId);
        allClaims.put("username", username);
        allClaims.put("type", "access");

        return Jwts.builder()
                .claims(allClaims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * 生成刷新令牌
     * @param userId 用户ID
     * @param username 用户名
     * @return JWT 令牌
     */
    public String generateRefreshToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("type", "refresh");

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * 解析令牌
     * @param token JWT 令牌
     * @return Claims
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("JWT 令牌已过期: {}", e.getMessage());
            throw new JwtException("令牌已过期");
        } catch (UnsupportedJwtException e) {
            log.warn("不支持的 JWT 令牌: {}", e.getMessage());
            throw new JwtException("不支持的令牌格式");
        } catch (MalformedJwtException e) {
            log.warn("无效的 JWT 令牌: {}", e.getMessage());
            throw new JwtException("无效的令牌");
        } catch (IllegalArgumentException e) {
            log.warn("JWT 令牌为空: {}", e.getMessage());
            throw new JwtException("令牌不能为空");
        }
    }

    /**
     * 验证令牌是否有效
     * @param token JWT 令牌
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从令牌中获取用户名
     * @param token JWT 令牌
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * 从令牌中获取用户ID
     * @param token JWT 令牌
     * @return 用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        Object userId = claims.get("userId");
        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        }
        return (Long) userId;
    }

    /**
     * 从令牌中获取令牌类型
     * @param token JWT 令牌
     * @return 令牌类型
     */
    public String getTokenType(String token) {
        return (String) parseToken(token).get("type");
    }

    /**
     * 检查令牌是否过期
     * @param token JWT 令牌
     * @return 是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 获取访问令牌过期时间（毫秒）
     */
    public Long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    /**
     * 获取刷新令牌过期时间（毫秒）
     */
    public Long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}
