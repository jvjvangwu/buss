import { useState, useCallback } from 'react';
import { LoginFormData, LoginFormErrors } from '../types/auth';
import { validateLoginForm, isLoginFormValid } from '../utils/validation';

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 如果字段已经被触摸过，立即验证
    if (touched[field]) {
      const newErrors = validateLoginForm({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  }, [formData, touched]);

  const handleBlur = useCallback((field: keyof LoginFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validateLoginForm(formData);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  }, [formData]);

  const validateForm = useCallback(() => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    setTouched({
      username: true,
      password: true,
    });
    return isLoginFormValid(newErrors);
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      rememberMe: false,
    });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setSubmitting,
  };
};