import { Request, Response, NextFunction } from 'express';

/**
 * 错误处理中间件
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // 处理验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      error: {
        code: 'VALIDATION_ERROR',
        details: err.message,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // 处理数据库错误
  if (err.name === 'QueryFailedError') {
    return res.status(500).json({
      success: false,
      message: '数据库操作失败',
      error: {
        code: 'DATABASE_ERROR',
        details: '请稍后重试',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // 默认错误
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || '请稍后重试',
    },
    timestamp: new Date().toISOString(),
  });
};
