package com.forum.modules.auth.service.impl;

import com.forum.common.exception.BusinessException;
import com.forum.common.utils.JwtUtils;
import com.forum.modules.auth.dto.*;
import com.forum.modules.auth.service.AuthService;
import com.forum.modules.user.dto.UserDTO;
import com.forum.modules.user.entity.User;
import com.forum.modules.user.service.UserService;
import com.forum.modules.user.vo.UserVO;
import com.forum.security.service.PermissionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PermissionService permissionService;
    private final HttpServletRequest request;

    @Override
    public LoginVO login(LoginDTO loginDTO, String ip) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getUsername(),
                            loginDTO.getPassword()
                    )
            );

            User user = userService.getByUsername(loginDTO.getUsername());
            if (user == null) {
                throw new BusinessException("用户不存在");
            }

            if (user.getStatus() != 1) {
                throw new BusinessException("账号已被禁用");
            }

            userService.updateLastLogin(user.getId(), ip);

            String accessToken = jwtUtils.generateAccessToken(user.getId(), user.getUsername());
            String refreshToken = jwtUtils.generateRefreshToken(user.getId(), user.getUsername());

            LoginVO loginVO = new LoginVO();
            loginVO.setAccessToken(accessToken);
            loginVO.setRefreshToken(refreshToken);
            loginVO.setExpiresIn(jwtUtils.getAccessTokenExpiration() / 1000);

            LoginVO.UserInfo userInfo = new LoginVO.UserInfo();
            UserVO userVO = userService.getUserVO(user.getId());
            userInfo.setId(userVO.getId());
            userInfo.setUsername(userVO.getUsername());
            userInfo.setNickname(userVO.getNickname());
            userInfo.setAvatar(userVO.getAvatar());
            userInfo.setRoles(userService.getUserRoles(user.getId()));
            userInfo.setPermissions(userService.getUserPermissions(user.getId()));
            loginVO.setUser(userInfo);

            log.info("用户 {} 登录成功，IP: {}", user.getUsername(), ip);
            return loginVO;

        } catch (AuthenticationException e) {
            log.warn("用户 {} 登录失败: {}", loginDTO.getUsername(), e.getMessage());
            throw new BusinessException("用户名或密码错误");
        }
    }

    @Override
    public LoginVO register(RegisterDTO registerDTO) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(registerDTO.getUsername());
        userDTO.setPassword(registerDTO.getPassword());
        userDTO.setEmail(registerDTO.getEmail());
        userDTO.setNickname(registerDTO.getNickname());
        userDTO.setPhone(registerDTO.getPhone());

        UserVO userVO = userService.register(userDTO);

        String accessToken = jwtUtils.generateAccessToken(userVO.getId(), userVO.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(userVO.getId(), userVO.getUsername());

        LoginVO loginVO = new LoginVO();
        loginVO.setAccessToken(accessToken);
        loginVO.setRefreshToken(refreshToken);
        loginVO.setExpiresIn(jwtUtils.getAccessTokenExpiration() / 1000);

        LoginVO.UserInfo userInfo = new LoginVO.UserInfo();
        userInfo.setId(userVO.getId());
        userInfo.setUsername(userVO.getUsername());
        userInfo.setNickname(userVO.getNickname());
        userInfo.setAvatar(userVO.getAvatar());
        userInfo.setRoles(userService.getUserRoles(userVO.getId()));
        userInfo.setPermissions(userService.getUserPermissions(userVO.getId()));
        loginVO.setUser(userInfo);

        log.info("用户 {} 注册成功", registerDTO.getUsername());
        return loginVO;
    }

    @Override
    public LoginVO refreshToken(RefreshTokenDTO refreshTokenDTO) {
        String refreshToken = refreshTokenDTO.getRefreshToken();

        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BusinessException("刷新令牌无效");
        }

        String tokenType = jwtUtils.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BusinessException("令牌类型错误");
        }

        Long userId = jwtUtils.getUserIdFromToken(refreshToken);
        String username = jwtUtils.getUsernameFromToken(refreshToken);

        User user = userService.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (user.getStatus() != 1) {
            throw new BusinessException("账号已被禁用");
        }

        String newAccessToken = jwtUtils.generateAccessToken(userId, username);
        String newRefreshToken = jwtUtils.generateRefreshToken(userId, username);

        LoginVO loginVO = new LoginVO();
        loginVO.setAccessToken(newAccessToken);
        loginVO.setRefreshToken(newRefreshToken);
        loginVO.setExpiresIn(jwtUtils.getAccessTokenExpiration() / 1000);

        LoginVO.UserInfo userInfo = new LoginVO.UserInfo();
        UserVO userVO = userService.getUserVO(user.getId());
        userInfo.setId(userVO.getId());
        userInfo.setUsername(userVO.getUsername());
        userInfo.setNickname(userVO.getNickname());
        userInfo.setAvatar(userVO.getAvatar());
        userInfo.setRoles(userService.getUserRoles(user.getId()));
        userInfo.setPermissions(userService.getUserPermissions(user.getId()));
        loginVO.setUser(userInfo);

        log.info("用户 {} 刷新令牌成功", username);
        return loginVO;
    }

    @Override
    public void logout(String token) {
        if (token != null && jwtUtils.validateToken(token)) {
            Long userId = jwtUtils.getUserIdFromToken(token);
            String username = jwtUtils.getUsernameFromToken(token);
            log.info("用户 {} 退出登录", username);
        }
    }
}
