import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';
import { validateLoginForm } from '../../utils/validation';

// Mock the validation utilities
vi.mock('../../utils/validation', () => ({
  validateLoginForm: vi.fn(),
  isLoginFormValid: vi.fn(),
}));

describe('useLoginForm Hook', () => {
  const mockValidateLoginForm = validateLoginForm as vi.Mock;
  const mockIsLoginFormValid = vi.requireMock('../../utils/validation').isLoginFormValid;

  beforeEach(() => {
    mockValidateLoginForm.mockClear();
    mockIsLoginFormValid.mockClear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.formData).toEqual({
      username: '',
      password: '',
      rememberMe: false,
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.touched).toEqual({});
  });

  it('handles field changes', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange('username', 'testuser');
    });

    expect(result.current.formData.username).toBe('testuser');

    act(() => {
      result.current.handleChange('password', 'password123');
    });

    expect(result.current.formData.password).toBe('password123');

    act(() => {
      result.current.handleChange('rememberMe', true);
    });

    expect(result.current.formData.rememberMe).toBe(true);
  });

  it('validates field on blur', () => {
    const mockErrors = { username: '用户名不能为空' };
    mockValidateLoginForm.mockReturnValue(mockErrors);

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleBlur('username');
    });

    expect(result.current.touched.username).toBe(true);
    expect(mockValidateLoginForm).toHaveBeenCalledWith({
      username: '',
      password: '',
      rememberMe: false,
    });
    expect(result.current.errors.username).toBe('用户名不能为空');
  });

  it('validates field on change when already touched', () => {
    const initialErrors = { username: '用户名不能为空' };
    const updatedErrors = { username: '' };
    
    mockValidateLoginForm
      .mockReturnValueOnce(initialErrors)
      .mockReturnValueOnce(updatedErrors);

    const { result } = renderHook(() => useLoginForm());

    // First, mark field as touched
    act(() => {
      result.current.handleBlur('username');
    });

    // Then change the value
    act(() => {
      result.current.handleChange('username', 'testuser');
    });

    expect(mockValidateLoginForm).toHaveBeenCalledTimes(2);
    expect(result.current.errors.username).toBe('');
  });

  it('validates entire form', () => {
    const mockErrors = {};
    mockValidateLoginForm.mockReturnValue(mockErrors);
    mockIsLoginFormValid.mockReturnValue(true);

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.formData.username = 'testuser';
      result.current.formData.password = 'password123';
    });

    const isValid = result.current.validateForm();

    expect(mockValidateLoginForm).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
      rememberMe: false,
    });
    expect(result.current.touched.username).toBe(true);
    expect(result.current.touched.password).toBe(true);
    expect(isValid).toBe(true);
  });

  it('resets form to initial state', () => {
    const { result } = renderHook(() => useLoginForm());

    // Change some values
    act(() => {
      result.current.handleChange('username', 'testuser');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('rememberMe', true);
      result.current.setSubmitting(true);
    });

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      username: '',
      password: '',
      rememberMe: false,
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('sets submitting state', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.setSubmitting(false);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('does not validate on change when field is not touched', () => {
    mockValidateLoginForm.mockReturnValue({});

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange('username', 'testuser');
    });

    expect(mockValidateLoginForm).not.toHaveBeenCalled();
  });
});