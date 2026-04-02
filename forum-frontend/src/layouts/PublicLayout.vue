<template>
  <div class="public-layout">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <router-link to="/news">论坛系统</router-link>
          </div>
          <div class="header-actions">
            <button v-if="!isLoggedIn" @click="showLoginModal = true" class="login-btn">登录</button>
            <router-link v-else to="/" class="dashboard-btn">管理后台</router-link>
          </div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; {{ new Date().getFullYear() }} 论坛系统. 保留所有权利.</p>
        </div>
      </div>
    </footer>
    
    <!-- 登录模态框 -->
    <div v-if="showLoginModal" class="modal-overlay" @click="showLoginModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户登录</h3>
          <button @click="showLoginModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">用户名/邮箱</label>
              <input type="text" id="username" v-model="loginForm.username" required>
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input type="password" id="password" v-model="loginForm.password" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-btn">登录</button>
              <a href="#" class="forgot-password">忘记密码?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { login } from '@/api/auth';

const router = useRouter();
const userStore = useUserStore();
const showLoginModal = ref(false);
const loginForm = ref({
  username: '',
  password: ''
});

const isLoggedIn = computed(() => {
  return userStore.token !== '';
});

const handleLogin = async () => {
  try {
    const response = await login(loginForm.value);
    userStore.setToken(response.accessToken, response.refreshToken);
    userStore.setUserInfo(response.user);
    showLoginModal.value = false;
    
    // 检查是否有重定向参数
    const redirect = localStorage.getItem('redirect') || '/';
    if (redirect) {
      localStorage.removeItem('redirect');
      router.push(redirect);
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请检查用户名和密码');
  }
};
</script>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.login-btn, .dashboard-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover, .dashboard-btn:hover {
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background-color: #f5f5f5;
  padding: 1rem 0;
  margin-top: 2rem;
}

.footer-content {
  text-align: center;
  color: #666;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #40a9ff;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
}
</style>