<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="register-title">注册账号</h2>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Check"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="goToLogin"
          >立即登录</el-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { authApi } from "@/api/auth";

const router = useRouter();

const registerFormRef = ref<FormInstance>();
const loading = ref(false);

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const registerRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 50, message: "用户名长度为 3-50 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度为 6-20 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 注册
async function handleRegister() {
  console.log("点击了注册按钮");
  const valid = await registerFormRef.value?.validate().catch(() => false);
  console.log("表单验证结果:", valid);
  if (!valid) return;

  loading.value = true;
  try {
    console.log("开始注册，数据:", registerForm);
    await authApi.register(registerForm);
    console.log("注册成功");
    ElMessage.success("注册成功，请登录");
    router.push("/login");
  } catch (error) {
    console.error("注册失败:", error);
    ElMessage.error("注册失败，请检查网络或联系管理员");
  } finally {
    loading.value = false;
  }
}

// 跳转到登录页面
function goToLogin() {
  router.push("/login");
}
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.register-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
}

.register-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.register-btn {
  width: 100%;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}
</style>
