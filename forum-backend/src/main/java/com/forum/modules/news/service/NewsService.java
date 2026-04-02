package com.forum.modules.news.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.news.dto.NewsDTO;
import com.forum.modules.news.dto.NewsQueryDTO;
import com.forum.modules.news.vo.NewsVO;

/**
 * 新闻服务接口
 */
public interface NewsService {

    /**
     * 保存新闻
     */
    NewsVO save(NewsDTO newsDTO);

    /**
     * 更新新闻
     */
    NewsVO update(Long id, NewsDTO newsDTO);

    /**
     * 删除新闻
     */
    void delete(Long id);

    /**
     * 获取新闻详情
     */
    NewsVO getById(Long id);

    /**
     * 分页查询新闻列表
     */
    IPage<NewsVO> page(NewsQueryDTO queryDTO);

    /**
     * 发布新闻
     */
    void publish(Long id);

    /**
     * 下架新闻
     */
    void offline(Long id);

    /**
     * 置顶新闻
     */
    void setTop(Long id, Boolean top);

    /**
     * 设置热门
     */
    void setHot(Long id, Boolean hot);

    /**
     * 增加浏览次数
     */
    void incrementViewCount(Long id);

    /**
     * 增加点赞次数
     */
    void incrementLikeCount(Long id);

    /**
     * 增加评论次数
     */
    void incrementCommentCount(Long id);

    /**
     * 减少评论次数
     */
    void decrementCommentCount(Long id);
}
