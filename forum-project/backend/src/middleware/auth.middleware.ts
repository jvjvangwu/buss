import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * JWT认证中间件
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
        error: {
          code: 'TOKEN_REQUIRED',
          details: '请在请求头中提供Authorization: Bearer <token>',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: '令牌已过期',
        error: {
          code: 'TOKEN_EXPIRED',
          details: '请重新登录',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(401).json({
      success: false,
      message: '无效的令牌',
      error: {
        code: 'TOKEN_INVALID',
        details: '令牌格式不正确或已被篡改',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * 角色授权中间件
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    if (!user) {
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

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
        error: {
          code: 'FORBIDDEN',
          details: '您没有权限执行此操作',
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};
