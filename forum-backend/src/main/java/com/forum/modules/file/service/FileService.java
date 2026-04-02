package com.forum.modules.file.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.file.dto.FileDTO;
import com.forum.modules.file.vo.FileVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 文件服务接口
 */
public interface FileService {

    /**
     * 上传文件
     */
    FileVO upload(MultipartFile file) throws IOException;

    /**
     * 批量上传文件
     */
    List<FileVO> batchUpload(MultipartFile[] files) throws IOException;

    /**
     * 更新文件信息
     */
    FileVO update(Long id, FileDTO fileDTO);

    /**
     * 删除文件
     */
    void delete(Long id);

    /**
     * 获取文件详情
     */
    FileVO getById(Long id);

    /**
     * 分页查询文件列表
     */
    IPage<FileVO> page(int pageNum, int pageSize, String keyword, String fileType);

    /**
     * 启用文件
     */
    void enable(Long id);

    /**
     * 禁用文件
     */
    void disable(Long id);

    /**
     * 根据MD5检查文件是否存在
     */
    FileVO getByMd5(String md5);

    /**
     * 清理过期文件
     */
    void cleanExpiredFiles();
}
