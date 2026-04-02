package com.forum.modules.file.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.forum.modules.file.dto.FileDTO;
import com.forum.modules.file.entity.File;
import com.forum.modules.file.mapper.FileMapper;
import com.forum.modules.file.service.FileService;
import com.forum.modules.file.vo.FileVO;
import com.forum.security.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 文件服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;
    private final PermissionService permissionService;

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${file.access.url:http://localhost:8080/api/v1/files}")
    private String accessUrl;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FileVO upload(MultipartFile file) throws IOException {
        Long userId = permissionService.getCurrentUserId();
        
        // 检查文件大小
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new RuntimeException("文件大小不能超过10MB");
        }
        
        // 计算文件MD5
        String md5 = DigestUtil.md5Hex(file.getBytes());
        
        // 检查文件是否已存在
        File existingFile = fileMapper.selectOne(
                new LambdaQueryWrapper<File>()
                        .eq(File::getMd5, md5)
        );
        if (existingFile != null) {
            log.info("文件已存在，直接返回：{}", existingFile.getFileName());
            return convertToVO(existingFile);
        }
        
        // 生成文件名
        String originalName = file.getOriginalFilename();
        String extension = FileUtil.extName(originalName);
        String fileName = UUID.randomUUID().toString() + (extension.isEmpty() ? "" : "." + extension);
        
        // 生成存储路径
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path storePath = Paths.get(uploadPath, datePath);
        
        // 创建目录
        if (!Files.exists(storePath)) {
            Files.createDirectories(storePath);
        }
        
        // 保存文件
        Path filePath = storePath.resolve(fileName);
        file.transferTo(filePath);
        
        // 保存文件信息到数据库
        File fileEntity = new File();
        fileEntity.setFileName(fileName);
        fileEntity.setOriginalName(originalName);
        fileEntity.setFilePath(datePath + "/" + fileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setMd5(md5);
        fileEntity.setStorageType(1); // 本地存储
        fileEntity.setUrl(accessUrl + "/" + fileName);
        fileEntity.setUploadUserId(userId);
        fileEntity.setStatus(1);
        fileEntity.setCreatedBy(userId);
        fileEntity.setUpdatedBy(userId);
        
        fileMapper.insert(fileEntity);
        log.info("用户 {} 上传文件：{}", userId, originalName);
        
        return convertToVO(fileEntity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<FileVO> batchUpload(MultipartFile[] files) throws IOException {
        List<FileVO> result = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    FileVO fileVO = upload(file);
                    result.add(fileVO);
                } catch (Exception e) {
                    log.error("文件上传失败：{}", file.getOriginalFilename(), e);
                    // 继续处理其他文件
                }
            }
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FileVO update(Long id, FileDTO fileDTO) {
        Long userId = permissionService.getCurrentUserId();
        
        File file = fileMapper.selectById(id);
        if (file == null) {
            throw new RuntimeException("文件不存在");
        }
        
        file.setFileName(fileDTO.getFileName());
        file.setDescription(fileDTO.getDescription());
        file.setStatus(fileDTO.getStatus());
        file.setUpdatedBy(userId);
        
        fileMapper.updateById(file);
        log.info("用户 {} 更新文件信息：{}", userId, file.getFileName());
        
        return convertToVO(file);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        File file = fileMapper.selectById(id);
        if (file == null) {
            throw new RuntimeException("文件不存在");
        }
        
        // 删除物理文件
        Path filePath = Paths.get(uploadPath, file.getFilePath());
        if (Files.exists(filePath)) {
            try {
                Files.delete(filePath);
            } catch (IOException e) {
                log.error("删除文件失败：{}", file.getFilePath(), e);
                // 继续删除数据库记录
            }
        }
        
        // 删除数据库记录
        fileMapper.deleteById(id);
        log.info("用户 {} 删除文件：{}", userId, file.getOriginalName());
    }

    @Override
    public FileVO getById(Long id) {
        File file = fileMapper.selectById(id);
        if (file == null) {
            throw new RuntimeException("文件不存在");
        }
        
        return convertToVO(file);
    }

    @Override
    public IPage<FileVO> page(int pageNum, int pageSize, String keyword, String fileType) {
        LambdaQueryWrapper<File> wrapper = new LambdaQueryWrapper<>();
        
        if (keyword != null) {
            wrapper.like(File::getOriginalName, keyword)
                    .or().like(File::getFileName, keyword);
        }
        
        if (fileType != null) {
            wrapper.like(File::getFileType, fileType);
        }
        
        wrapper.orderByDesc(File::getCreatedAt);
        
        IPage<File> page = fileMapper.selectPage(
                new Page<>(pageNum, pageSize),
                wrapper
        );
        
        return page.convert(this::convertToVO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        File file = fileMapper.selectById(id);
        if (file == null) {
            throw new RuntimeException("文件不存在");
        }
        
        file.setStatus(1);
        file.setUpdatedBy(userId);
        
        fileMapper.updateById(file);
        log.info("用户 {} 启用文件：{}", userId, file.getOriginalName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        Long userId = permissionService.getCurrentUserId();
        
        File file = fileMapper.selectById(id);
        if (file == null) {
            throw new RuntimeException("文件不存在");
        }
        
        file.setStatus(0);
        file.setUpdatedBy(userId);
        
        fileMapper.updateById(file);
        log.info("用户 {} 禁用文件：{}", userId, file.getOriginalName());
    }

    @Override
    public FileVO getByMd5(String md5) {
        File file = fileMapper.selectOne(
                new LambdaQueryWrapper<File>()
                        .eq(File::getMd5, md5)
        );
        
        return file != null ? convertToVO(file) : null;
    }

    @Override
    public void cleanExpiredFiles() {
        // TODO: 实现清理过期文件的逻辑
        log.info("清理过期文件");
    }

    private FileVO convertToVO(File file) {
        FileVO vo = new FileVO();
        vo.setId(file.getId());
        vo.setFileName(file.getFileName());
        vo.setOriginalName(file.getOriginalName());
        vo.setFilePath(file.getFilePath());
        vo.setFileType(file.getFileType());
        vo.setFileSize(file.getFileSize());
        vo.setFileSizeFormat(formatFileSize(file.getFileSize()));
        vo.setMd5(file.getMd5());
        vo.setStorageType(file.getStorageType());
        vo.setUrl(file.getUrl());
        vo.setUploadUserId(file.getUploadUserId());
        vo.setStatus(file.getStatus());
        vo.setDescription(file.getDescription());
        vo.setCreatedAt(file.getCreatedAt());
        
        return vo;
    }

    private String formatFileSize(long size) {
        if (size < 1024) {
            return size + " B";
        } else if (size < 1024 * 1024) {
            return String.format("%.2f KB", size / 1024.0);
        } else if (size < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", size / (1024.0 * 1024.0));
        } else {
            return String.format("%.2f GB", size / (1024.0 * 1024.0 * 1024.0));
        }
    }
}