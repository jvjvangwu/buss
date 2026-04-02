package com.forum.modules.user.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.forum.modules.user.dto.UserDTO;
import com.forum.modules.user.dto.UserQueryDTO;
import com.forum.modules.user.entity.User;
import com.forum.modules.user.vo.UserVO;

import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {

    User getByUsername(String username);

    User getByEmail(String email);

    User getByPhone(String phone);

    UserVO getUserVO(Long userId);

    UserVO register(UserDTO userDTO);

    void updateLastLogin(Long userId, String ip);

    IPage<UserVO> pageUsers(UserQueryDTO queryDTO);

    void updateUserStatus(Long userId, Integer status);

    void updateUser(Long userId, UserDTO userDTO);

    void deleteUser(Long userId);

    List<String> getUserRoles(Long userId);

    List<String> getUserPermissions(Long userId);

    void assignRoles(Long userId, List<Long> roleIds);
}
