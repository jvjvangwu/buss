import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../index';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RegisterRequestDto, LoginRequestDto, LoginResponseDto, RegisterResponseDto, UserResponseDto, UpdateProfileRequestDto } from '../types/auth.types';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 延迟获取repository，确保数据库连接已初始化
const getUserRepository = () => AppDataSource.getRepository(User);

/**
 * 用户注册
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, displayName } = req.body as RegisterRequestDto;

    // 检查用户是否已存在
    const existingUser = await getUserRepository().findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.username === username ? '用户名已存在' : '邮箱已被注册',
        error: {
          code: existingUser.username === username ? 'USERNAME_ALREADY_EXISTS' : 'EMAIL_ALREADY_EXISTS',
          details: existingUser.username === username ? '请选择其他用户名' : '请使用其他邮箱',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const user = getUserRepository().create({
      username,
      email,
      passwordHash,
      displayName: displayName || username,
      role: 'user',
      status: 'active',
      emailVerified: false,
      loginAttempts: 0,
    });

    await getUserRepository().save(user);

    const response: RegisterResponseDto = {
      userId: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      requiresEmailVerification: true,
    };

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as LoginRequestDto;

    // 查找用户
    const user = await getUserRepository().findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: '请检查您的用户名和密码',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 检查账户状态
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: '账户已被封禁',
        error: {
          code: 'ACCOUNT_SUSPENDED',
          details: '请联系管理员',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      // 增加登录尝试次数
      user.loginAttempts += 1;
      await getUserRepository().save(user);

      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: '请检查您的用户名和密码',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 生成JWT
    const token = jwt.sign(
      { sub: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // 更新登录信息
    user.lastLoginAt = new Date();
    user.loginAttempts = 0;
    await getUserRepository().save(user);

    const userResponse: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };

    const response: LoginResponseDto = {
      token: {
        token,
        refreshToken: token, // 简化处理，实际应生成不同的refresh token
        expiresIn: 7 * 24 * 60 * 60, // 7天
        tokenType: 'Bearer',
      },
      user: userResponse,
    };

    res.json({
      success: true,
      message: '登录成功',
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登出
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 在实际应用中，这里应该将token加入黑名单
    res.json({
      success: true,
      message: '登出成功',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权',
        error: {
          code: 'UNAUTHORIZED',
          details: '请先登录',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const user = await getUserRepository().findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
        error: {
          code: 'USER_NOT_FOUND',
          details: '用户可能已被删除',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const userResponse: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };

    res.json({
      success: true,
      message: '获取成功',
      data: userResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户资料
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user?.sub;
    const { displayName, bio, avatar, newPassword, currentPassword } = req.body as UpdateProfileRequestDto;

    const user = await getUserRepository().findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
        error: {
          code: 'USER_NOT_FOUND',
          details: '用户可能已被删除',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 更新基本资料
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    // 更新密码
    if (newPassword && currentPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: '当前密码错误',
          error: {
            code: 'INVALID_CREDENTIALS',
            details: '请输入正确的当前密码',
          },
          timestamp: new Date().toISOString(),
        });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await getUserRepository().save(user);

    const userResponse: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };

    res.json({
      success: true,
      message: '更新成功',
      data: userResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
