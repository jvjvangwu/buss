package com.forum.test.user;

import com.forum.modules.user.dto.UserDTO;
import com.forum.test.BaseTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * 用户模块测试
 */
public class UserTest extends BaseTest {

    private String getAccessToken() throws Exception {
        // 先登录获取token
        String loginJson = "{\"username\": \"testuser\", \"password\": \"123456\"}";
        return mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andReturn()
                .getResponse()
                .getContentAsString()
                .split("accessToken:")[1]
                .split(",")[0];
    }

    @Test
    public void testGetCurrentUser() throws Exception {
        String token = getAccessToken();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users/current")
                .header("Authorization", "Bearer " + token))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.username").value("testuser"));
    }

    @Test
    public void testPageUsers() throws Exception {
        String token = getAccessToken();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users")
                .header("Authorization", "Bearer " + token)
                .param("pageNum", "1")
                .param("pageSize", "10"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.records").isArray());
    }

    @Test
    public void testCreateUser() throws Exception {
        String token = getAccessToken();

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("newuser");
        userDTO.setPassword("123456");
        userDTO.setEmail("newuser@example.com");
        userDTO.setNickname("新用户");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/users")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(userDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200));
    }
}
