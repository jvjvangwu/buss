package com.forum.modules.category.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.forum.modules.category.entity.Category;
import org.apache.ibatis.annotations.Mapper;

/**
 * 分类 Mapper
 */
@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

}