import { validateLoginForm, isLoginFormValid } from '../validation';
import { LoginFormData, LoginFormErrors } from '../../types/auth';

describe('Validation Utilities', () => {
  describe('validateLoginForm', () => {
    it('returns empty errors for valid form data', () => {
      const validData: LoginFormData = {
        username: 'testuser',
        password: 'password123',
        rememberMe: false,
      };

      const errors = validateLoginForm(validData);

      expect(errors).toEqual({});
    });

    it('validates username field', () => {
      const testCases = [
        {
          data: { username: '', password: 'password123', rememberMe: false },
          expectedError: '用户名不能为空',
        },
        {
          data: { username: 'ab', password: 'password123', rememberMe: false },
          expectedError: '用户名至少需要3个字符',
        },
        {
          data: { username: 'a'.repeat(21), password: 'password123', rememberMe: false },
          expectedError: '用户名不能超过20个字符',
        },
        {
          data: { username: 'test@user', password: 'password123', rememberMe: false },
          expectedError: '用户名只能包含字母、数字和下划线',
        },
        {
          data: { username: 'test user', password: 'password123', rememberMe: false },
          expectedError: '用户名只能包含字母、数字和下划线',
        },
        {
          data: { username: 'test-user', password: 'password123', rememberMe: false },
          expectedError: '用户名只能包含字母、数字和下划线',
        },
      ];

      testCases.forEach(({ data, expectedError }) => {
        const errors = validateLoginForm(data);
        expect(errors.username).toBe(expectedError);
      });
    });

    it('validates password field', () => {
      const testCases = [
        {
          data: { username: 'testuser', password: '', rememberMe: false },
          expectedError: '密码不能为空',
        },
        {
          data: { username: 'testuser', password: '12345', rememberMe: false },
          expectedError: '密码至少需要6个字符',
        },
        {
          data: { username: 'testuser', password: 'a'.repeat(51), rememberMe: false },
          expectedError: '密码不能超过50个字符',
        },
        {
          data: { username: 'testuser', password: 'validpass', rememberMe: false },
          expectedError: undefined,
        },
      ];

      testCases.forEach(({ data, expectedError }) => {
        const errors = validateLoginForm(data);
        expect(errors.password).toBe(expectedError);
      });
    });

    it('returns multiple errors for multiple invalid fields', () => {
      const invalidData: LoginFormData = {
        username: '',
        password: '',
        rememberMe: false,
      };

      const errors = validateLoginForm(invalidData);

      expect(errors.username).toBe('用户名不能为空');
      expect(errors.password).toBe('密码不能为空');
    });

    it('allows valid usernames with underscores', () => {
      const validUsernames = [
        'test_user',
        'user123',
        'USER_NAME',
        'test123_user',
        'a_b_c',
      ];

      validUsernames.forEach(username => {
        const data: LoginFormData = {
          username,
          password: 'password123',
          rememberMe: false,
        };

        const errors = validateLoginForm(data);
        expect(errors.username).toBeUndefined();
      });
    });

    it('handles whitespace in username', () => {
      const data: LoginFormData = {
        username: '  testuser  ',
        password: 'password123',
        rememberMe: false,
      };

      const errors = validateLoginForm(data);
      expect(errors.username).toBeUndefined();
    });
  });

  describe('isLoginFormValid', () => {
    it('returns true for empty errors object', () => {
      const errors: LoginFormErrors = {};
      expect(isLoginFormValid(errors)).toBe(true);
    });

    it('returns false for errors object with properties', () => {
      const errors: LoginFormErrors = {
        username: '用户名不能为空',
      };
      expect(isLoginFormValid(errors)).toBe(false);

      const errors2: LoginFormErrors = {
        password: '密码不能为空',
      };
      expect(isLoginFormValid(errors2)).toBe(false);

      const errors3: LoginFormErrors = {
        username: '用户名不能为空',
        password: '密码不能为空',
      };
      expect(isLoginFormValid(errors3)).toBe(false);
    });

    it('handles undefined errors', () => {
      const errors: LoginFormErrors = {
        username: undefined,
        password: undefined,
      };
      expect(isLoginFormValid(errors)).toBe(true);
    });
  });
});