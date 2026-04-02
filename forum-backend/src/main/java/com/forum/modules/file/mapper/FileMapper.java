package com.forum.modules.file.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.forum.modules.file.entity.File;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文件 Mapper
 */
@Mapper
public interface FileMapper extends BaseMapper<File> {

}