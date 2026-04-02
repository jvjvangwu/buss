package com.forum.modules.news.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.news.dto.NewsDTO;
import com.forum.modules.news.dto.NewsQueryDTO;
import com.forum.modules.news.service.NewsService;
import com.forum.modules.news.vo.NewsVO;
import com.forum.common.annotation.RequirePermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 新闻控制器
 */
@RestController
@RequestMapping("/api/v1/news")
@Tag(name = "新闻管理", description = "新闻相关接口")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @PostMapping
    @Operation(summary = "创建新闻")
    @RequirePermission("news:create")
    public NewsVO create(@Validated @RequestBody NewsDTO newsDTO) {
        return newsService.save(newsDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新新闻")
    @RequirePermission("news:update")
    public NewsVO update(@PathVariable Long id, @Validated @RequestBody NewsDTO newsDTO) {
        return newsService.update(id, newsDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除新闻")
    @RequirePermission("news:delete")
    public void delete(@PathVariable Long id) {
        newsService.delete(id);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取新闻详情")
    public NewsVO getById(@PathVariable Long id) {
        // 增加浏览次数
        newsService.incrementViewCount(id);
        return newsService.getById(id);
    }

    @GetMapping
    @Operation(summary = "分页查询新闻列表")
    @RequirePermission("news:view")
    public IPage<NewsVO> page(NewsQueryDTO queryDTO) {
        return newsService.page(queryDTO);
    }

    @GetMapping("/public/list")
    @Operation(summary = "获取公开新闻列表")
    public IPage<NewsVO> getPublicNewsList(NewsQueryDTO queryDTO) {
        // 设置状态为已发布
        queryDTO.setStatus(2);
        return newsService.page(queryDTO);
    }

    @GetMapping("/public/featured")
    @Operation(summary = "获取精选新闻")
    public IPage<NewsVO> getFeaturedNews(NewsQueryDTO queryDTO) {
        // 设置状态为已发布且热门
        queryDTO.setStatus(2);
        queryDTO.setIsHot(true);
        return newsService.page(queryDTO);
    }

    @PutMapping("/{id}/publish")
    @Operation(summary = "发布新闻")
    @RequirePermission("news:publish")
    public void publish(@PathVariable Long id) {
        newsService.publish(id);
    }

    @PutMapping("/{id}/offline")
    @Operation(summary = "下架新闻")
    @RequirePermission("news:offline")
    public void offline(@PathVariable Long id) {
        newsService.offline(id);
    }

    @PutMapping("/{id}/top")
    @Operation(summary = "设置新闻置顶")
    @RequirePermission("news:top")
    public void setTop(@PathVariable Long id, @RequestParam Boolean top) {
        newsService.setTop(id, top);
    }

    @PutMapping("/{id}/hot")
    @Operation(summary = "设置新闻热门")
    @RequirePermission("news:hot")
    public void setHot(@PathVariable Long id, @RequestParam Boolean hot) {
        newsService.setHot(id, hot);
    }

    @PutMapping("/{id}/like")
    @Operation(summary = "点赞新闻")
    public void like(@PathVariable Long id) {
        newsService.incrementLikeCount(id);
    }
}

