package com.forum.modules.news.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.forum.modules.news.entity.News;
import org.apache.ibatis.annotations.Mapper;

/**
 * 新闻 Mapper
 */
@Mapper
public interface NewsMapper extends BaseMapper<News> {

}
