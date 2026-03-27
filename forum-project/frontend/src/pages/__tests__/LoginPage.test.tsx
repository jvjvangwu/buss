import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';
import { authService } from '../../services/authService';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../services/authService');

const mockedAuthService = authService as vi.Mocked<typeof authService>;
const mockedNavigate = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useNavigate
    vi.doMock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockedNavigate,
    }));
  });

  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  };

  it('renders login page with all elements', () => {
    renderLoginPage();

    expect(screen.getByText(/欢迎来到技术论坛/i)).toBeInTheDocument();
    expect(screen.getByText(/用户登录/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/记住我/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
    expect(screen.getByText(/注册账户/i)).toBeInTheDocument();
    expect(screen.getByText(/忘记密码/i)).toBeInTheDocument();
    expect(screen.getByText(/测试账户/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    mockedAuthService.login.mockResolvedValue({
      success: true,
      message: 'Login successful',
      token: 'mock-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      },
    });

    renderLoginPage();

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: false,
      });
    });

    // Since we're mocking useNavigate, we can't test actual navigation
    // But we can verify the service was called
    expect(mockedAuthService.login).toHaveBeenCalledTimes(1);
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockedAuthService.login.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    renderLoginPage();

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/登录失败，请检查用户名和密码/i)).toBeInTheDocument();
    });
  });

  it('displays network error message', async () => {
    const user = userEvent.setup();
    mockedAuthService.login.mockRejectedValue(new Error('Network error'));

    renderLoginPage();

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/登录过程中发生错误/i)).toBeInTheDocument();
    });
  });

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    mockedAuthService.login.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    renderLoginPage();

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    // Trigger error
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/登录失败，请检查用户名和密码/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newuser');

    await waitFor(() => {
      expect(screen.queryByText(/登录失败，请检查用户名和密码/i)).not.toBeInTheDocument();
    });
  });

  it('handles remember me checkbox', async () => {
    const user = userEvent.setup();
    mockedAuthService.login.mockResolvedValue({
      success: true,
      message: 'Login successful',
      token: 'mock-token',
    });

    renderLoginPage();

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const rememberMeCheckbox = screen.getByLabelText(/记住我/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(rememberMeCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: true,
      });
    });
  });

  it('shows test account information', () => {
    renderLoginPage();

    expect(screen.getByText(/测试账户/i)).toBeInTheDocument();
    expect(screen.getByText(/demo_user/)).toBeInTheDocument();
    expect(screen.getByText(/demo123/)).toBeInTheDocument();
  });

  it('has links to other pages', () => {
    renderLoginPage();

    const registerLink = screen.getByText(/注册账户/i);
    const forgotPasswordLink = screen.getByText(/忘记密码/i);
    const termsLink = screen.getByText(/服务条款/i);
    const privacyLink = screen.getByText(/隐私政策/i);

    expect(registerLink).toHaveAttribute('href', '/register');
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('applies correct styling classes', () => {
    renderLoginPage();

    const mainContainer = screen.getByText(/欢迎来到技术论坛/i).closest('div');
    expect(mainContainer).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');

    const loginCard = screen.getByText(/用户登录/i).closest('div');
    expect(loginCard).toHaveClass('bg-white', 'shadow-xl', 'rounded-lg');

    const submitButton = screen.getByRole('button', { name: /登录/i });
    expect(submitButton).toHaveClass('bg-indigo-600', 'hover:bg-indigo-700');
  });
});