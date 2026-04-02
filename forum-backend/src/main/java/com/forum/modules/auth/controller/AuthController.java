package com.forum.modules.auth.controller;

import com.forum.api.Result;
import com.forum.common.annotation.RequirePermission;
import com.forum.modules.auth.dto.LoginDTO;
import com.forum.modules.auth.dto.LoginVO;
import com.forum.modules.auth.dto.RefreshTokenDTO;
import com.forum.modules.auth.dto.RegisterDTO;
import com.forum.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "认证管理", description = "登录、注册、令牌刷新等认证相关接口")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        String ip = getClientIp(request);
        LoginVO loginVO = authService.login(loginDTO, ip);
        return Result.success(loginVO);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<LoginVO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        LoginVO loginVO = authService.register(registerDTO);
        return Result.success("注册成功", loginVO);
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌")
    public Result<LoginVO> refreshToken(@Valid @RequestBody RefreshTokenDTO refreshTokenDTO) {
        LoginVO loginVO = authService.refreshToken(refreshTokenDTO);
        return Result.success(loginVO);
    }

    @PostMapping("/logout")
    @Operation(summary = "退出登录")
    public Result<Void> logout(HttpServletRequest request) {
        String token = extractToken(request);
        authService.logout(token);
        return Result.success("退出成功");
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
