package com.forum.modules.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.forum.modules.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT r.id || ':' || r.name || ':' || r.code " +
            "FROM sys_role r " +
            "INNER JOIN user_role ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND r.deleted = 0 AND r.status = 1")
    List<String> selectRolesByUserId(@Param("userId") Long userId);

    @Select("SELECT id FROM sys_role WHERE code = #{code}")
    Long selectRoleIdByCode(@Param("code") String code);

    @Select("SELECT DISTINCT p.code " +
            "FROM sys_permission p " +
            "INNER JOIN role_permission rp ON p.id = rp.permission_id " +
            "INNER JOIN user_role ur ON rp.role_id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND p.status = 1")
    List<String> selectPermissionsByUserId(@Param("userId") Long userId);

    void deleteUserRoles(@Param("userId") Long userId);

    void insertUserRoles(@Param("userId") Long userId, @Param("roleIds") List<Long> roleIds);
}
