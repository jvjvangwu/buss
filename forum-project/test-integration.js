#!/usr/bin/env node

/**
 * 集成测试验证脚本
 * 用于快速验证前后端集成是否正常工作
 */

const http = require('http');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// 配置
const config = {
  frontendUrl: 'http://localhost:5173',
  backendUrl: 'http://localhost:3000',
  apiBaseUrl: 'http://localhost:3000/api',
  timeout: 10000, // 10秒超时
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// 检查服务是否运行
async function checkService(url, serviceName) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({
        running: true,
        statusCode: res.statusCode,
        serviceName,
      });
    });

    req.on('error', (err) => {
      resolve({
        running: false,
        error: err.message,
        serviceName,
      });
    });

    req.setTimeout(config.timeout, () => {
      req.destroy();
      resolve({
        running: false,
        error: '请求超时',
        serviceName,
      });
    });
  });
}

// 检查端口占用
async function checkPort(port) {
  try {
    const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// 检查进程
async function checkProcess(processName) {
  try {
    const { stdout } = await execPromise(`tasklist | findstr ${processName}`);
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// 主测试函数
async function runIntegrationTests() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('🚀 论坛项目集成测试验证', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  logInfo('开始检查服务状态...\n');

  // 1. 检查后端服务
  logInfo('1. 检查后端服务...');
  const backendResult = await checkService(config.backendUrl, '后端服务');
  
  if (backendResult.running) {
    logSuccess(`后端服务运行正常 (状态码: ${backendResult.statusCode})`);
  } else {
    logError(`后端服务未运行: ${backendResult.error}`);
    
    // 检查Node进程
    const nodeRunning = await checkProcess('node');
    if (nodeRunning) {
      logWarning('检测到Node.js进程正在运行，但后端服务不可访问');
    }
    
    // 检查端口
    const port3000 = await checkPort(3000);
    if (port3000) {
      logWarning('端口3000已被占用，但不是后端服务');
    }
  }

  // 2. 检查前端服务
  logInfo('\n2. 检查前端服务...');
  const frontendResult = await checkService(config.frontendUrl, '前端服务');
  
  if (frontendResult.running) {
    logSuccess(`前端服务运行正常 (状态码: ${frontendResult.statusCode})`);
  } else {
    logError(`前端服务未运行: ${frontendResult.error}`);
    
    // 检查端口
    const port5173 = await checkPort(5173);
    if (port5173) {
      logWarning('端口5173已被占用，但不是前端服务');
    }
  }

  // 3. 检查API端点
  logInfo('\n3. 检查API端点...');
  if (backendResult.running) {
    const apiResult = await checkService(`${config.apiBaseUrl}/auth/login`, '登录API');
    
    if (apiResult.running) {
      if (apiResult.statusCode === 404) {
        logWarning('登录API返回404，可能路由未配置');
      } else if (apiResult.statusCode === 405) {
        logSuccess('登录API存在 (返回405 Method Not Allowed，正常)');
      } else {
        logSuccess(`登录API可访问 (状态码: ${apiResult.statusCode})`);
      }
    } else {
      logError(`登录API不可访问: ${apiResult.error}`);
    }
  } else {
    logWarning('跳过API检查，后端服务未运行');
  }

  // 4. 检查数据库连接
  logInfo('\n4. 检查数据库连接...');
  try {
    const { stdout } = await execPromise('docker ps --format "table {{.Names}}\t{{.Status}}" | findstr postgres');
    if (stdout.trim().length > 0) {
      logSuccess('PostgreSQL Docker容器正在运行');
      console.log(stdout.trim());
    } else {
      // 检查本地PostgreSQL
      const pgRunning = await checkProcess('postgres');
      if (pgRunning) {
        logSuccess('PostgreSQL服务正在运行');
      } else {
        logWarning('PostgreSQL服务未运行，数据库相关功能可能不可用');
      }
    }
  } catch (error) {
    logWarning('无法检查数据库状态，Docker可能未安装');
  }

  // 5. 总结
  log('\n' + '='.repeat(60), colors.cyan);
  log('📊 测试结果总结', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const results = [
    { name: '后端服务', ok: backendResult.running },
    { name: '前端服务', ok: frontendResult.running },
    { name: 'API端点', ok: backendResult.running && apiResult?.running },
  ];

  let allPass = true;
  results.forEach(result => {
    if (result.ok) {
      logSuccess(`${result.name}: 正常`);
    } else {
      logError(`${result.name}: 异常`);
      allPass = false;
    }
  });

  // 6. 建议
  log('\n' + '='.repeat(60), colors.cyan);
  log('💡 建议和下一步', colors.cyan);
  log('='.repeat(60), colors.cyan);

  if (!allPass) {
    logInfo('\n需要解决的问题:');
    
    if (!backendResult.running) {
      logInfo('1. 启动后端服务:');
      logInfo('   cd forum-project/backend');
      logInfo('   npm run dev');
    }
    
    if (!frontendResult.running) {
      logInfo('2. 启动前端服务:');
      logInfo('   cd forum-project/frontend');
      logInfo('   npm run dev');
    }
    
    if (backendResult.running && !apiResult?.running) {
      logInfo('3. 检查后端路由配置，确保API端点正确设置');
    }
  } else {
    logSuccess('\n所有服务运行正常！可以开始集成测试。');
    logInfo('\n下一步:');
    logInfo('1. 打开浏览器访问: http://localhost:5173');
    logInfo('2. 使用测试账户登录:');
    logInfo('   用户名: demo_user');
    logInfo('   密码: demo123');
    logInfo('3. 验证登录流程是否正常工作');
  }

  // 7. 快速测试命令
  logInfo('\n快速测试命令:');
  logInfo('curl -X POST http://localhost:3000/api/auth/login \\');
  logInfo('  -H "Content-Type: application/json" \\');
  logInfo('  -d \'{"username":"demo_user","password":"demo123"}\'');
}

// 运行测试
runIntegrationTests().catch(error => {
  logError(`测试执行失败: ${error.message}`);
  process.exit(1);
});