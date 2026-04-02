package com.forum.modules.category.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.category.dto.CategoryDTO;
import com.forum.modules.category.entity.Category;
import com.forum.modules.category.mapper.CategoryMapper;
import com.forum.modules.category.service.CategoryService;
import com.forum.modules.category.vo.CategoryVO;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 分类服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;
    private final PermissionService permissionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CategoryVO save(CategoryDTO categoryDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        Category category = new Category();
        category.setName(categoryDTO.getCategoryName());
        category.setSort(categoryDTO.getSort());
        category.setStatus(categoryDTO.getStatus() != null ? categoryDTO.getStatus() : 1);
        
        categoryMapper.insert(category);
        log.info("用户 {} 创建分类：{}", userId, category.getName());
        
        return getById(category.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CategoryVO update(Long id, CategoryDTO categoryDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        
        category.setName(categoryDTO.getCategoryName());
        category.setSort(categoryDTO.getSort());
        category.setStatus(categoryDTO.getStatus());
        
        categoryMapper.updateById(category);
        log.info("用户 {} 更新分类：{}", userId, category.getName());
        
        return getById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        
        categoryMapper.deleteById(id);
        log.info("用户 {} 删除分类：{}", userId, category.getName());
    }

    @Override
    public CategoryVO getById(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        
        return convertToVO(category);
    }

    @Override
    public IPage<CategoryVO> page(int pageNum, int pageSize) {
        IPage<Category> page = categoryMapper.selectPage(
                new Page<>(pageNum, pageSize),
                new LambdaQueryWrapper<Category>()
                        .orderByAsc(Category::getSort)
                        .orderByAsc(Category::getId)
        );
        
        return page.convert(this::convertToVO);
    }

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> categories = categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getStatus, 1)
                        .orderByAsc(Category::getSort)
                        .orderByAsc(Category::getId)
        );
        
        return categories.stream()
                .map(this::convertToVO)
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        
        category.setStatus(1);
        
        categoryMapper.updateById(category);
        log.info("用户 {} 启用分类：{}", userId, category.getName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        
        category.setStatus(0);
        
        categoryMapper.updateById(category);
        log.info("用户 {} 禁用分类：{}", userId, category.getName());
    }

    private CategoryVO convertToVO(Category category) {
        CategoryVO vo = new CategoryVO();
        vo.setId(category.getId());
        vo.setCategoryName(category.getName());
        vo.setSort(category.getSort());
        vo.setStatus(category.getStatus());
        
        return vo;
    }
}