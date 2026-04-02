<template>
  <div class="profile-password">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      class="mt-4"
    >
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入当前密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { userApi } from "@/api/user";

// 表单
const formRef = ref();
const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 验证规则
const rules = reactive({
  oldPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20个字符之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 加载状态
const loading = ref(false);

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  loading.value = true;
  try {
    await formRef.value.validate();

    await userApi.updatePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    ElMessage.success("密码修改成功");

    // 清空表单
    form.oldPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
  } catch (error) {
    console.error("修改密码失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-password {
  padding: 20px 0;
}
</style>
