package com.forum.modules.auth.service;

import com.forum.modules.auth.dto.LoginDTO;
import com.forum.modules.auth.dto.LoginVO;
import com.forum.modules.auth.dto.RefreshTokenDTO;
import com.forum.modules.auth.dto.RegisterDTO;

/**
 * 认证服务接口
 */
public interface AuthService {

    LoginVO login(LoginDTO loginDTO, String ip);

    LoginVO register(RegisterDTO registerDTO);

    LoginVO refreshToken(RefreshTokenDTO refreshTokenDTO);

    void logout(String token);
}
