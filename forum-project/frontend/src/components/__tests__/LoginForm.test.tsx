import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { LoginFormData } from '../../types/auth';

describe('LoginForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the login form with all fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/记住我/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields on submit', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/用户名不能为空/i)).toBeInTheDocument();
      expect(screen.getByText(/密码不能为空/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('handles remember me checkbox', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const rememberMeCheckbox = screen.getByLabelText(/记住我/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(rememberMeCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: true,
      });
    });
  });

  it('clears validation error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /登录/i });
    await user.click(submitButton);

    expect(screen.getByText(/用户名不能为空/i)).toBeInTheDocument();

    const usernameInput = screen.getByLabelText(/用户名/i);
    await user.type(usernameInput, 'testuser');

    await waitFor(() => {
      expect(screen.queryByText(/用户名不能为空/i)).not.toBeInTheDocument();
    });
  });

  it('disables submit button when isLoading is true', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /登录中.../i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByRole('button', { name: /登录中.../i })).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('handles form submission with keyboard', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123{enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('applies error styling to invalid fields', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const usernameInput = screen.getByLabelText(/用户名/i);
      const passwordInput = screen.getByLabelText(/密码/i);

      expect(usernameInput).toHaveClass('border-red-300');
      expect(passwordInput).toHaveClass('border-red-300');
    });
  });
});