package com.forum.modules.tag.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.tag.dto.TagDTO;
import com.forum.modules.tag.entity.Tag;
import com.forum.modules.tag.mapper.TagMapper;
import com.forum.modules.tag.service.TagService;
import com.forum.modules.tag.vo.TagVO;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 标签服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagMapper tagMapper;
    private final PermissionService permissionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TagVO save(TagDTO tagDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        // 检查标签名称是否已存在
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tag::getName, tagDTO.getTagName());
        if (tagMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("标签名称已存在");
        }
        
        Tag tag = new Tag();
        tag.setName(tagDTO.getTagName());
        tag.setColor(tagDTO.getColor());
        tag.setStatus(tagDTO.getStatus() != null ? tagDTO.getStatus() : 1);
        
        tagMapper.insert(tag);
        log.info("用户 {} 创建标签：{}", userId, tag.getName());
        
        return getById(tag.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TagVO update(Long id, TagDTO tagDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        
        // 检查标签名称是否已被其他标签使用
        if (!tag.getName().equals(tagDTO.getTagName())) {
            LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Tag::getName, tagDTO.getTagName())
                    .ne(Tag::getId, id);
            if (tagMapper.selectCount(wrapper) > 0) {
                throw new RuntimeException("标签名称已存在");
            }
        }
        
        tag.setName(tagDTO.getTagName());
        tag.setColor(tagDTO.getColor());
        tag.setStatus(tagDTO.getStatus());
        
        tagMapper.updateById(tag);
        log.info("用户 {} 更新标签：{}", userId, tag.getName());
        
        return getById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        
        tagMapper.deleteById(id);
        log.info("用户 {} 删除标签：{}", userId, tag.getName());
    }

    @Override
    public TagVO getById(Long id) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        
        return convertToVO(tag);
    }

    @Override
    public IPage<TagVO> page(int pageNum, int pageSize, String keyword) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        
        if (keyword != null) {
            wrapper.like(Tag::getName, keyword);
        }
        
        wrapper.orderByAsc(Tag::getId)
                .orderByDesc(Tag::getCreatedAt);
        
        IPage<Tag> page = tagMapper.selectPage(
                new Page<>(pageNum, pageSize),
                wrapper
        );
        
        return page.convert(this::convertToVO);
    }

    @Override
    public List<TagVO> getAllEnabled() {
        List<Tag> tags = tagMapper.selectList(
                new LambdaQueryWrapper<Tag>()
                        .eq(Tag::getStatus, 1)
                        .orderByAsc(Tag::getId)
        );
        
        return tags.stream()
                .map(this::convertToVO)
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        
        tag.setStatus(1);
        
        tagMapper.updateById(tag);
        log.info("用户 {} 启用标签：{}", userId, tag.getName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        
        tag.setStatus(0);
        
        tagMapper.updateById(tag);
        log.info("用户 {} 禁用标签：{}", userId, tag.getName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void incrementUseCount(Long id) {
        // 简化实现，实际项目中可能需要添加使用次数字段
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void decrementUseCount(Long id) {
        // 简化实现，实际项目中可能需要添加使用次数字段
    }

    private TagVO convertToVO(Tag tag) {
        TagVO vo = new TagVO();
        vo.setId(tag.getId());
        vo.setTagName(tag.getName());
        vo.setColor(tag.getColor());
        vo.setStatus(tag.getStatus());
        
        return vo;
    }
}