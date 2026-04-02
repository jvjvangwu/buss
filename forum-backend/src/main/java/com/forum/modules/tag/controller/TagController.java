package com.forum.modules.tag.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.tag.dto.TagDTO;
import com.forum.modules.tag.service.TagService;
import com.forum.modules.tag.vo.TagVO;
import com.forum.common.annotation.RequirePermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签控制器
 */
@RestController
@RequestMapping("/api/v1/tags")
@Tag(name = "标签管理", description = "标签相关接口")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    @Operation(summary = "创建标签")
    @RequirePermission("tag:create")
    public TagVO create(@Validated @RequestBody TagDTO tagDTO) {
        return tagService.save(tagDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新标签")
    @RequirePermission("tag:update")
    public TagVO update(@PathVariable Long id, @Validated @RequestBody TagDTO tagDTO) {
        return tagService.update(id, tagDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签")
    @RequirePermission("tag:delete")
    public void delete(@PathVariable Long id) {
        tagService.delete(id);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取标签详情")
    public TagVO getById(@PathVariable Long id) {
        return tagService.getById(id);
    }

    @GetMapping
    @Operation(summary = "分页查询标签列表")
    @RequirePermission("tag:view")
    public IPage<TagVO> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword
    ) {
        return tagService.page(pageNum, pageSize, keyword);
    }

    @GetMapping("/enabled")
    @Operation(summary = "获取所有启用的标签")
    public List<TagVO> getAllEnabled() {
        return tagService.getAllEnabled();
    }

    @PutMapping("/{id}/enable")
    @Operation(summary = "启用标签")
    @RequirePermission("tag:enable")
    public void enable(@PathVariable Long id) {
        tagService.enable(id);
    }

    @PutMapping("/{id}/disable")
    @Operation(summary = "禁用标签")
    @RequirePermission("tag:disable")
    public void disable(@PathVariable Long id) {
        tagService.disable(id);
    }
}