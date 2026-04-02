package com.forum.test.auth;

import com.forum.modules.auth.dto.LoginDTO;
import com.forum.modules.auth.dto.RegisterDTO;
import com.forum.test.BaseTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * 认证模块测试
 */
public class AuthTest extends BaseTest {

    @Test
    public void testRegister() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setUsername("testuser");
        registerDTO.setPassword("123456");
        registerDTO.setEmail("test@example.com");
        registerDTO.setNickname("测试用户");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(registerDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200));
    }

    @Test
    public void testLogin() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("123456");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(loginDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.accessToken").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.refreshToken").exists());
    }

    @Test
    public void testLoginWithInvalidCredentials() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("wrongpassword");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(loginDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(500))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("用户名或密码错误"));
    }
}
