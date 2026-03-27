import axios from 'axios';
import { authService } from '../authService';
import { LoginFormData } from '../../types/auth';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

// Mock localStorage and sessionStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
  });

  describe('login', () => {
    const mockFormData: LoginFormData = {
      username: 'testuser',
      password: 'password123',
      rememberMe: false,
    };

    it('successfully logs in and stores token in sessionStorage', async () => {
      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockFormData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', mockFormData);
      expect(result.success).toBe(true);
      expect(result.token).toBe('mock-jwt-token');
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('stores token in localStorage when rememberMe is true', async () => {
      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const formDataWithRememberMe: LoginFormData = {
        ...mockFormData,
        rememberMe: true,
      };

      await authService.login(formDataWithRememberMe);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('handles login failure', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid credentials',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('handles network errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await authService.login(mockFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('网络错误，请检查网络连接');
    });

    it('handles axios response errors', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Server error',
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      const result = await authService.login(mockFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Server error');
    });
  });

  describe('logout', () => {
    it('clears tokens from storage', async () => {
      mockedAxios.post.mockResolvedValue({});

      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('clears storage even when API call fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      sessionStorageMock.getItem.mockReturnValue(null);

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('returns true when token exists in sessionStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      sessionStorageMock.getItem.mockReturnValue('mock-token');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('returns false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      sessionStorageMock.getItem.mockReturnValue(null);

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('returns token from localStorage first', () => {
      localStorageMock.getItem.mockReturnValue('local-token');
      sessionStorageMock.getItem.mockReturnValue('session-token');

      expect(authService.getToken()).toBe('local-token');
    });

    it('returns token from sessionStorage when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      sessionStorageMock.getItem.mockReturnValue('session-token');

      expect(authService.getToken()).toBe('session-token');
    });

    it('returns null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      sessionStorageMock.getItem.mockReturnValue(null);

      expect(authService.getToken()).toBe(null);
    });
  });

  describe('getUserInfo', () => {
    it('successfully fetches user info', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await authService.getUserInfo();

      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(authService.getUserInfo()).rejects.toThrow('Network error');
    });
  });
});