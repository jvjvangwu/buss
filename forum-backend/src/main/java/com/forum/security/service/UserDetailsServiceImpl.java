package com.forum.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 用户详情服务实现
 * TODO: 对接实际的用户查询服务
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    // TODO: 注入 UserService 或 UserMapper

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO: 从数据库查询用户信息
        // User user = userService.getByUsername(username);
        // if (user == null) {
        //     throw new UsernameNotFoundException("用户不存在: " + username);
        // }

        // 临时实现：返回一个默认用户
        // 实际项目中应该从数据库查询用户信息
        return User.builder()
                .username(username)
                .password("")
                .authorities(Collections.emptyList())
                .build();
    }
}
