package com.forum.modules.category.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.category.dto.CategoryDTO;
import com.forum.modules.category.service.CategoryService;
import com.forum.modules.category.vo.CategoryVO;
import com.forum.common.annotation.RequirePermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "分类管理", description = "分类相关接口")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "创建分类")
    @RequirePermission("category:create")
    public CategoryVO create(@Validated @RequestBody CategoryDTO categoryDTO) {
        return categoryService.save(categoryDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类")
    @RequirePermission("category:update")
    public CategoryVO update(@PathVariable Long id, @Validated @RequestBody CategoryDTO categoryDTO) {
        return categoryService.update(id, categoryDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    @RequirePermission("category:delete")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情")
    public CategoryVO getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @GetMapping
    @Operation(summary = "分页查询分类列表")
    @RequirePermission("category:view")
    public IPage<CategoryVO> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return categoryService.page(pageNum, pageSize);
    }

    @GetMapping("/tree")
    @Operation(summary = "获取分类树")
    public List<CategoryVO> getCategoryTree() {
        return categoryService.getCategoryTree();
    }

    @PutMapping("/{id}/enable")
    @Operation(summary = "启用分类")
    @RequirePermission("category:enable")
    public void enable(@PathVariable Long id) {
        categoryService.enable(id);
    }

    @PutMapping("/{id}/disable")
    @Operation(summary = "禁用分类")
    @RequirePermission("category:disable")
    public void disable(@PathVariable Long id) {
        categoryService.disable(id);
    }
}