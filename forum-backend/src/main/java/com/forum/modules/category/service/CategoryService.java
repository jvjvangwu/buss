package com.forum.modules.category.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.category.dto.CategoryDTO;
import com.forum.modules.category.vo.CategoryVO;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService {

    /**
     * 保存分类
     */
    CategoryVO save(CategoryDTO categoryDTO);

    /**
     * 更新分类
     */
    CategoryVO update(Long id, CategoryDTO categoryDTO);

    /**
     * 删除分类
     */
    void delete(Long id);

    /**
     * 获取分类详情
     */
    CategoryVO getById(Long id);

    /**
     * 分页查询分类列表
     */
    IPage<CategoryVO> page(int pageNum, int pageSize);

    /**
     * 获取分类树
     */
    List<CategoryVO> getCategoryTree();

    /**
     * 启用分类
     */
    void enable(Long id);

    /**
     * 禁用分类
     */
    void disable(Long id);
}