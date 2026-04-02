package com.forum.modules.tag.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.tag.dto.TagDTO;
import com.forum.modules.tag.vo.TagVO;

import java.util.List;

/**
 * 标签服务接口
 */
public interface TagService {

    /**
     * 保存标签
     */
    TagVO save(TagDTO tagDTO);

    /**
     * 更新标签
     */
    TagVO update(Long id, TagDTO tagDTO);

    /**
     * 删除标签
     */
    void delete(Long id);

    /**
     * 获取标签详情
     */
    TagVO getById(Long id);

    /**
     * 分页查询标签列表
     */
    IPage<TagVO> page(int pageNum, int pageSize, String keyword);

    /**
     * 获取所有启用的标签
     */
    List<TagVO> getAllEnabled();

    /**
     * 启用标签
     */
    void enable(Long id);

    /**
     * 禁用标签
     */
    void disable(Long id);

    /**
     * 增加使用次数
     */
    void incrementUseCount(Long id);

    /**
     * 减少使用次数
     */
    void decrementUseCount(Long id);
}