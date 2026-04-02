<template>
  <div class="profile-info">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="mt-4"
    >
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话" />
      </el-form-item>

      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="{
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          }"
          :on-success="handleImageUploadSuccess"
          :on-error="handleImageUploadError"
          :show-file-list="false"
          accept="image/*"
        >
          <img
            v-if="form.avatar"
            :src="form.avatar"
            class="avatar"
            alt="头像"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-tip">点击上传头像</div>
      </el-form-item>

      <el-form-item label="简介">
        <el-input
          v-model="form.bio"
          type="textarea"
          placeholder="请输入个人简介"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { userApi } from "@/api/user";
import type { UserInfo } from "@/api/user";

// 表单
const formRef = ref();
const form = reactive({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  avatar: "",
  bio: "",
});

// 验证规则
const rules = reactive({
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 50, message: "昵称长度在2-50个字符之间", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
});

// 加载状态
const loading = ref(false);

// 上传配置
const uploadUrl = "http://localhost:8080/api/v1/files/upload";

// 初始化
onMounted(() => {
  fetchUserInfo();
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const user = await userApi.getCurrentUser();
    Object.assign(form, {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
    });
  } catch (error) {
    ElMessage.error("获取用户信息失败");
    console.error("获取用户信息失败:", error);
  }
};

// 图片上传成功
const handleImageUploadSuccess = (response: any) => {
  if (response.code === 200) {
    form.avatar = response.data.url;
    ElMessage.success("头像上传成功");
  } else {
    ElMessage.error("头像上传失败");
  }
};

// 图片上传失败
const handleImageUploadError = () => {
  ElMessage.error("头像上传失败");
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  loading.value = true;
  try {
    await formRef.value.validate();

    await userApi.updateUserProfile({
      nickname: form.nickname,
      email: form.email,
      phone: form.phone,
      avatar: form.avatar,
      bio: form.bio,
    });

    ElMessage.success("保存成功");
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-info {
  padding: 20px 0;
}

.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
