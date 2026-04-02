package com.forum.modules.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.forum.common.exception.BusinessException;
import com.forum.modules.user.dto.UserDTO;
import com.forum.modules.user.dto.UserQueryDTO;
import com.forum.modules.user.entity.User;
import com.forum.modules.user.mapper.UserMapper;
import com.forum.modules.user.service.UserService;
import com.forum.modules.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;

    @Override
    public User getByUsername(String username) {
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }

    @Override
    public User getByEmail(String email) {
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, email));
    }

    @Override
    public User getByPhone(String phone) {
        // 由于 User 实体类中已经删除了 phone 字段，所以返回 null
        return null;
    }

    @Override
    public UserVO getUserVO(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        UserVO userVO = BeanUtil.copyProperties(user, UserVO.class);
        userVO.setRoles(getUserRoles(userId).stream()
                .map(role -> {
                    UserVO.RoleInfo roleInfo = new UserVO.RoleInfo();
                    roleInfo.setId(Long.parseLong(role.split(":")[0]));
                    roleInfo.setRoleName(role.split(":")[1]);
                    roleInfo.setRoleCode(role.split(":")[2]);
                    return roleInfo;
                })
                .collect(Collectors.toList()));
        return userVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVO register(UserDTO userDTO) {
        if (getByUsername(userDTO.getUsername()) != null) {
            throw new BusinessException("用户名已存在");
        }
        if (getByEmail(userDTO.getEmail()) != null) {
            throw new BusinessException("邮箱已被注册");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setNickname(userDTO.getNickname() != null ? userDTO.getNickname() : userDTO.getUsername());
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        save(user);

        // 给新用户分配默认角色（普通用户角色）
        Long userRoleId = baseMapper.selectRoleIdByCode("ROLE_USER");
        if (userRoleId != null) {
            baseMapper.insertUserRoles(user.getId(), java.util.Collections.singletonList(userRoleId));
        }

        return getUserVO(user.getId());
    }

    @Override
    public void updateLastLogin(Long userId, String ip) {
        User user = new User();
        user.setId(userId);
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(ip);
        user.setUpdatedAt(LocalDateTime.now());
        updateById(user);
    }

    @Override
    public IPage<UserVO> pageUsers(UserQueryDTO queryDTO) {
        Page<User> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
                .like(queryDTO.getUsername() != null, User::getUsername, queryDTO.getUsername())
                .like(queryDTO.getEmail() != null, User::getEmail, queryDTO.getEmail())
                .like(queryDTO.getNickname() != null, User::getNickname, queryDTO.getNickname())
                .eq(queryDTO.getStatus() != null, User::getStatus, queryDTO.getStatus())
                .orderByDesc(User::getCreatedAt);

        IPage<User> userPage = page(page, wrapper);

        Page<UserVO> voPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        List<UserVO> voList = userPage.getRecords().stream()
                .map(user -> BeanUtil.copyProperties(user, UserVO.class))
                .collect(Collectors.toList());
        voPage.setRecords(voList);

        return voPage;
    }

    @Override
    public void updateUserStatus(Long userId, Integer status) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setStatus(status);
        updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long userId, UserDTO userDTO) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (userDTO.getNickname() != null) {
            user.setNickname(userDTO.getNickname());
        }
        if (userDTO.getAvatar() != null) {
            user.setAvatar(userDTO.getAvatar());
        }
        if (userDTO.getGender() != null) {
            user.setGender(userDTO.getGender());
        }
        if (userDTO.getBio() != null) {
            user.setBio(userDTO.getBio());
        }
        if (userDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        removeById(userId);
    }

    @Override
    public List<String> getUserRoles(Long userId) {
        return baseMapper.selectRolesByUserId(userId);
    }

    @Override
    public List<String> getUserPermissions(Long userId) {
        return baseMapper.selectPermissionsByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignRoles(Long userId, List<Long> roleIds) {
        baseMapper.deleteUserRoles(userId);
        if (roleIds != null && !roleIds.isEmpty()) {
            baseMapper.insertUserRoles(userId, roleIds);
        }
    }
}
