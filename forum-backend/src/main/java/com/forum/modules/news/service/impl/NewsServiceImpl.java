package com.forum.modules.news.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.news.dto.NewsDTO;
import com.forum.modules.news.dto.NewsQueryDTO;
import com.forum.modules.news.entity.News;
import com.forum.modules.news.mapper.NewsMapper;
import com.forum.modules.news.service.NewsService;
import com.forum.modules.news.vo.NewsVO;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 新闻服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsMapper newsMapper;
    private final PermissionService permissionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NewsVO save(NewsDTO newsDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        if (userId == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("用户未登录，无法创建新闻");
        }
        
        LocalDateTime now = LocalDateTime.now();
        News news = new News();
        news.setTitle(newsDTO.getTitle());
        news.setSummary(newsDTO.getSummary());
        news.setContent(newsDTO.getContent());
        news.setCoverImage(newsDTO.getCoverImage());
        news.setAuthorId(userId);
        news.setCategoryId(newsDTO.getCategoryId());
        news.setStatus(0); // 草稿
        news.setViewCount(0);
        news.setLikeCount(0);
        news.setCommentCount(0);
        news.setIsTop(false);
        news.setIsHot(false);
        news.setIsOriginal(newsDTO.getIsOriginal());
        news.setSource(newsDTO.getSource());
        news.setSourceUrl(newsDTO.getSourceUrl());
        news.setAuditStatus(0);
        news.setCreatedBy(userId);
        news.setUpdatedBy(userId);
        news.setCreatedAt(now);
        news.setUpdatedAt(now);
        
        newsMapper.insert(news);
        log.info("用户 {} 创建新闻：{}", userId, news.getTitle());
        
        return getById(news.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NewsVO update(Long id, NewsDTO newsDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        news.setTitle(newsDTO.getTitle());
        news.setSummary(newsDTO.getSummary());
        news.setContent(newsDTO.getContent());
        news.setCoverImage(newsDTO.getCoverImage());
        news.setCategoryId(newsDTO.getCategoryId());
        news.setIsOriginal(newsDTO.getIsOriginal());
        news.setSource(newsDTO.getSource());
        news.setSourceUrl(newsDTO.getSourceUrl());
        news.setUpdatedBy(userId);
        
        newsMapper.updateById(news);
        log.info("用户 {} 更新新闻：{}", userId, news.getTitle());
        
        return getById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        newsMapper.deleteById(id);
        log.info("用户 {} 删除新闻：{}", userId, news.getTitle());
    }

    @Override
    public NewsVO getById(Long id) {
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        return convertToVO(news);
    }

    @Override
    public IPage<NewsVO> page(NewsQueryDTO queryDTO) {
        LambdaQueryWrapper<News> wrapper = new LambdaQueryWrapper<>();
        
        if (queryDTO.getKeyword() != null) {
            wrapper.like(News::getTitle, queryDTO.getKeyword());
        }
        if (queryDTO.getCategoryId() != null) {
            wrapper.eq(News::getCategoryId, queryDTO.getCategoryId());
        }
        if (queryDTO.getAuthorId() != null) {
            wrapper.eq(News::getAuthorId, queryDTO.getAuthorId());
        }
        if (queryDTO.getStatus() != null) {
            wrapper.eq(News::getStatus, queryDTO.getStatus());
        }
        if (queryDTO.getIsTop() != null) {
            wrapper.eq(News::getIsTop, queryDTO.getIsTop());
        }
        if (queryDTO.getIsHot() != null) {
            wrapper.eq(News::getIsHot, queryDTO.getIsHot());
        }
        
        // 确保已发布的新闻优先显示，且publishAt不为null的新闻排在前面
        wrapper.orderByDesc(News::getIsTop)
                .orderByDesc(News::getPublishAt)
                .orderByDesc(News::getCreatedAt);
        
        IPage<News> page = newsMapper.selectPage(
                new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize()),
                wrapper
        );
        
        return page.convert(this::convertToVO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publish(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        if (userId == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("用户未登录，无法发布新闻");
        }
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        news.setStatus(2); // 已发布
        news.setPublishAt(LocalDateTime.now());
        news.setUpdatedBy(userId);
        
        newsMapper.updateById(news);
        log.info("用户 {} 发布新闻：{}", userId, news.getTitle());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void offline(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        if (userId == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("用户未登录，无法下架新闻");
        }
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        news.setStatus(3); // 已下架
        news.setUpdatedBy(userId);
        
        newsMapper.updateById(news);
        log.info("用户 {} 下架新闻：{}", userId, news.getTitle());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setTop(Long id, Boolean top) {
        Long userId = permissionService.getCurrentUserId();
        
        if (userId == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("用户未登录，无法设置新闻置顶");
        }
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        news.setIsTop(top);
        news.setUpdatedBy(userId);
        
        newsMapper.updateById(news);
        log.info("用户 {} 设置新闻 {} 置顶：{}", userId, news.getTitle(), top);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setHot(Long id, Boolean hot) {
        Long userId = permissionService.getCurrentUserId();
        
        if (userId == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("用户未登录，无法设置新闻热门");
        }
        
        News news = newsMapper.selectById(id);
        if (news == null) {
            throw new RuntimeException("新闻不存在");
        }
        
        news.setIsHot(hot);
        news.setUpdatedBy(userId);
        
        newsMapper.updateById(news);
        log.info("用户 {} 设置新闻 {} 热门：{}", userId, news.getTitle(), hot);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void incrementViewCount(Long id) {
        News news = newsMapper.selectById(id);
        if (news != null) {
            news.setViewCount(news.getViewCount() + 1);
            newsMapper.updateById(news);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void incrementLikeCount(Long id) {
        News news = newsMapper.selectById(id);
        if (news != null) {
            news.setLikeCount(news.getLikeCount() + 1);
            newsMapper.updateById(news);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void incrementCommentCount(Long id) {
        News news = newsMapper.selectById(id);
        if (news != null) {
            news.setCommentCount(news.getCommentCount() + 1);
            newsMapper.updateById(news);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void decrementCommentCount(Long id) {
        News news = newsMapper.selectById(id);
        if (news != null && news.getCommentCount() > 0) {
            news.setCommentCount(news.getCommentCount() - 1);
            newsMapper.updateById(news);
        }
    }

    private NewsVO convertToVO(News news) {
        NewsVO vo = new NewsVO();
        vo.setId(news.getId());
        vo.setTitle(news.getTitle());
        vo.setSummary(news.getSummary());
        vo.setContent(news.getContent());
        vo.setCoverImage(news.getCoverImage());
        vo.setStatus(news.getStatus());
        vo.setViewCount(news.getViewCount());
        vo.setLikeCount(news.getLikeCount());
        vo.setCommentCount(news.getCommentCount());
        vo.setIsTop(news.getIsTop());
        vo.setIsHot(news.getIsHot());
        vo.setPublishAt(news.getPublishAt());
        vo.setCreatedAt(news.getCreatedAt());
        
        // TODO: 填充作者信息、分类信息、标签信息
        // 这里需要调用相应的服务来获取关联数据
        
        return vo;
    }
}
