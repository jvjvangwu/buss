package com.forum.modules.file.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.forum.modules.file.dto.FileDTO;
import com.forum.modules.file.service.FileService;
import com.forum.modules.file.vo.FileVO;
import com.forum.common.annotation.RequirePermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * 文件控制器
 */
@RestController
@RequestMapping("/api/v1/files")
@Tag(name = "文件管理", description = "文件上传、下载、管理相关接口")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @Operation(summary = "上传文件")
    @RequirePermission("file:upload")
    public FileVO upload(@RequestParam("file") MultipartFile file) throws IOException {
        return fileService.upload(file);
    }

    @PostMapping("/batch-upload")
    @Operation(summary = "批量上传文件")
    @RequirePermission("file:upload")
    public List<FileVO> batchUpload(@RequestParam("files") MultipartFile[] files) throws IOException {
        return fileService.batchUpload(files);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文件信息")
    @RequirePermission("file:update")
    public FileVO update(@PathVariable Long id, @Validated @RequestBody FileDTO fileDTO) {
        return fileService.update(id, fileDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除文件")
    @RequirePermission("file:delete")
    public void delete(@PathVariable Long id) {
        fileService.delete(id);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取文件详情")
    public FileVO getById(@PathVariable Long id) {
        return fileService.getById(id);
    }

    @GetMapping
    @Operation(summary = "分页查询文件列表")
    @RequirePermission("file:view")
    public IPage<FileVO> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String fileType
    ) {
        return fileService.page(pageNum, pageSize, keyword, fileType);
    }

    @PutMapping("/{id}/enable")
    @Operation(summary = "启用文件")
    @RequirePermission("file:enable")
    public void enable(@PathVariable Long id) {
        fileService.enable(id);
    }

    @PutMapping("/{id}/disable")
    @Operation(summary = "禁用文件")
    @RequirePermission("file:disable")
    public void disable(@PathVariable Long id) {
        fileService.disable(id);
    }

    @GetMapping("/download/{fileName}")
    @Operation(summary = "下载文件")
    public ResponseEntity<Resource> download(@PathVariable String fileName) throws IOException {
        // 构建文件路径
        Path filePath = Paths.get("./uploads", fileName);
        Resource resource = new PathResource(filePath);

        if (!resource.exists()) {
            throw new RuntimeException("文件不存在");
        }

        // 设置响应头
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
