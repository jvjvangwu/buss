import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * 验证请求中间件
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: 'path' in err ? err.path : 'unknown',
        message: err.msg,
        code: 'VALIDATION_ERROR',
      }));

      return res.status(400).json({
        success: false,
        message: '验证失败',
        error: {
          code: 'VALIDATION_ERROR',
          details: formattedErrors[0].message,
        },
        errors: formattedErrors,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};
