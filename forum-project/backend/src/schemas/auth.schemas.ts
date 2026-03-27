import { body } from 'express-validator';

export const registerSchema = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度应在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('用户名只能包含字母、数字、下划线和中划线'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .isEmail()
    .withMessage('邮箱格式不正确'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6, max: 50 })
    .withMessage('密码长度应在6-50个字符之间')
    .matches(/^(?=.*[a-zA-Z]).+$/)
    .withMessage('密码必须包含字母'),

  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('确认密码不能为空')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('两次输入的密码不一致'),
];

export const loginSchema = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名或邮箱不能为空'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空'),
];

export const updateProfileSchema = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('昵称长度应在2-30个字符之间'),

  body('bio')
    .optional()
    .trim()
    .isLength({ min: 0, max: 200 })
    .withMessage('简介长度不能超过200个字符'),

  body('avatar')
    .optional()
    .trim()
    .isURL()
    .withMessage('头像必须是有效的URL'),

  body('newPassword')
    .optional()
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage('新密码长度应在6-50个字符之间'),

  body('currentPassword')
    .if(body('newPassword').exists())
    .trim()
    .notEmpty()
    .withMessage('修改密码时需要提供当前密码'),
];
