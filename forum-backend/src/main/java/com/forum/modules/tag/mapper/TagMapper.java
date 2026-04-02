package com.forum.modules.tag.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.forum.modules.tag.entity.Tag;
import org.apache.ibatis.annotations.Mapper;

/**
 * 标签 Mapper
 */
@Mapper
public interface TagMapper extends BaseMapper<Tag> {

}