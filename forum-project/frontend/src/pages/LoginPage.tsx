import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { LoginFormData } from '../types/auth';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState<string>('');

  const handleLoginSuccess = () => {
    // 登录成功后跳转到首页
    navigate('/');
  };

  const handleLogin = async (formData: LoginFormData) => {
    try {
      setLoginError('');
      const result = await authService.login(formData);
      
      if (result.success) {
        handleLoginSuccess();
      } else {
        setLoginError(result.message || '登录失败，请检查用户名和密码');
      }
    } catch (error: any) {
      setLoginError(error.message || '登录过程中发生错误');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          欢迎来到技术论坛
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          加入我们的技术社区，分享知识，交流经验
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">用户登录</h3>
            <p className="text-sm text-gray-600 mt-1">
              请输入您的用户名和密码登录账户
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          <LoginForm onSubmit={handleLogin} />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">其他选项</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  注册账户
                </Link>
              </div>
              <div>
                <Link
                  to="/forgot-password"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  忘记密码
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">测试账户</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>用户名: <span className="font-mono">demo_user</span></p>
                <p>密码: <span className="font-mono">demo123</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            继续登录即表示您同意我们的
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 ml-1">服务条款</Link>
            和
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 ml-1">隐私政策</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;