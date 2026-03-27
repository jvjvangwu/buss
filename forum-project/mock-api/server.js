/**
 * Mock API 服务器
 * 用于前端集成测试，模拟后端API响应
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001; // 使用不同端口避免冲突

// 中间件
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock 数据库
const mockUsers = [
  {
    id: 1,
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'demo123', // 实际中应该存储哈希值
    display_name: '演示用户',
    role: 'user',
    avatar_url: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
    bio: '这是一个演示用户账户',
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'admin_user',
    email: 'admin@example.com',
    password: 'admin123',
    display_name: '管理员',
    role: 'admin',
    avatar_url: 'https://ui-avatars.com/api/?name=Admin&background=random',
    bio: '系统管理员',
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: new Date().toISOString()
  }
];

// JWT 配置
const JWT_SECRET = 'mock_jwt_secret_for_testing_only';
const JWT_EXPIRES_IN = '7d';

// 生成JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7天后过期
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// 验证JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'Mock API Server',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// 用户登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log(`登录请求: ${username}`);
  
  // 验证输入
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '用户名和密码不能为空'
      }
    });
  }
  
  // 查找用户
  const user = mockUsers.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: '用户名或密码错误'
      }
    });
  }
  
  // 验证密码（简单比较，实际应该使用bcrypt）
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: '用户名或密码错误'
      }
    });
  }
  
  // 更新最后登录时间
  user.last_login_at = new Date().toISOString();
  
  // 生成token
  const token = generateToken(user);
  
  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      token: token
    }
  });
});

// 用户注册
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, display_name } = req.body;
  
  console.log(`注册请求: ${username} (${email})`);
  
  // 验证输入
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '用户名、邮箱和密码不能为空'
      }
    });
  }
  
  // 检查用户名是否已存在
  if (mockUsers.some(u => u.username === username)) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_USERNAME',
        message: '用户名已存在'
      }
    });
  }
  
  // 检查邮箱是否已注册
  if (mockUsers.some(u => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_EMAIL',
        message: '邮箱已注册'
      }
    });
  }
  
  // 创建新用户
  const newUser = {
    id: mockUsers.length + 1,
    username,
    email,
    password, // 实际中应该哈希存储
    display_name: display_name || username,
    role: 'user',
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
    bio: '',
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  // 生成token
  const token = generateToken(newUser);
  
  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword,
      token: token
    }
  });
});

// 获取当前用户信息
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: '需要登录认证'
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '无效的认证令牌'
      }
    });
  }
  
  const user = mockUsers.find(u => u.id === decoded.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: '用户不存在'
      }
    });
  }
  
  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: {
      user: userWithoutPassword
    }
  });
});

// 用户登出
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
});

// Mock 帖子数据
const mockPosts = [
  {
    id: 1,
    title: '欢迎来到技术论坛',
    slug: 'welcome-to-tech-forum',
    content: '这是一个技术讨论社区，欢迎大家分享知识和经验。',
    user_id: 1,
    category_id: 1,
    view_count: 100,
    like_count: 10,
    comment_count: 5,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'React最佳实践',
    slug: 'react-best-practices',
    content: '分享一些React开发中的最佳实践和经验。',
    user_id: 2,
    category_id: 1,
    view_count: 150,
    like_count: 20,
    comment_count: 8,
    created_at: '2024-01-02T14:30:00Z',
    updated_at: '2024-01-02T14:30:00Z'
  }
];

// 获取帖子列表
app.get('/api/posts', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  // 模拟分页
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedPosts = mockPosts.slice(startIndex, endIndex);
  
  // 添加用户信息
  const postsWithUser = paginatedPosts.map(post => ({
    ...post,
    user: mockUsers.find(u => u.id === post.user_id)
  }));
  
  res.json({
    success: true,
    data: {
      posts: postsWithUser,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: mockPosts.length,
        total_pages: Math.ceil(mockPosts.length / limitNum)
      }
    }
  });
});

// 404处理
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `API端点 ${req.originalUrl} 不存在`
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
🚀 Mock API 服务器已启动!
📡 地址: http://localhost:${PORT}
📚 API文档:
  POST /api/auth/login    - 用户登录
  POST /api/auth/register - 用户注册
  GET  /api/auth/me       - 获取当前用户信息
  POST /api/auth/logout   - 用户登出
  GET  /api/posts         - 获取帖子列表
  GET  /api/health        - 健康检查

🔑 测试账户:
  用户名: demo_user, 密码: demo123
  用户名: admin_user, 密码: admin123

💡 前端配置:
  修改 frontend/.env 中的 VITE_API_BASE_URL 为:
  VITE_API_BASE_URL=http://localhost:${PORT}/api
  `);
});