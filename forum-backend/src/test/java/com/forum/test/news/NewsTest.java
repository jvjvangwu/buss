package com.forum.test.news;

import com.forum.modules.news.dto.NewsDTO;
import com.forum.test.BaseTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * 新闻模块测试
 */
public class NewsTest extends BaseTest {

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
    public void testCreateNews() throws Exception {
        String token = getAccessToken();

        NewsDTO newsDTO = new NewsDTO();
        newsDTO.setTitle("测试新闻标题");
        newsDTO.setSummary("测试新闻摘要");
        newsDTO.setContent("测试新闻内容");
        newsDTO.setCategoryId(1L);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/news")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(newsDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200));
    }

    @Test
    public void testPageNews() throws Exception {
        String token = getAccessToken();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/news")
                .header("Authorization", "Bearer " + token)
                .param("pageNum", "1")
                .param("pageSize", "10"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.records").isArray());
    }

    @Test
    public void testPublishNews() throws Exception {
        String token = getAccessToken();

        // 先创建一条新闻
        NewsDTO newsDTO = new NewsDTO();
        newsDTO.setTitle("测试发布新闻");
        newsDTO.setSummary("测试发布新闻摘要");
        newsDTO.setContent("测试发布新闻内容");
        newsDTO.setCategoryId(1L);

        String response = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/news")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(newsDTO)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // 提取新闻ID
        Long newsId = Long.parseLong(response.split("id:")[1].split(",")[0]);

        // 发布新闻
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/news/" + newsId + "/publish")
                .header("Authorization", "Bearer " + token))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}