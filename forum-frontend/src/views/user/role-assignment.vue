<template>
  <div class="role-assignment">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色分配 - {{ userName }}</span>
          <el-button type="primary" @click="handleSave"> 保存分配 </el-button>
        </div>
      </template>

      <!-- 角色列表 -->
      <el-tree
        v-loading="loading"
        :data="roleList"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedRoleIds"
        @check-change="handleCheckChange"
        style="max-height: 500px; overflow-y: auto"
      >
        <template #default="{ node }">
          <div class="role-node">
            <span>{{ node.label }}</span>
            <span class="role-desc">{{ node.data.description || "" }}</span>
          </div>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { userApi } from "@/api/user";
import { roleApi } from "@/api/role";
import type { RoleInfo } from "@/api/role";

// 路由
const route = useRoute();
const router = useRouter();

// 加载状态
const loading = ref(false);

// 用户ID
const userId = computed(() => {
  return Number(route.params.id);
});

// 用户名
const userName = ref("");

// 角色列表
const roleList = ref<RoleInfo[]>([]);

// 已选择的角色ID
const selectedRoleIds = ref<number[]>([]);

// 初始化
onMounted(() => {
  fetchUserInfo();
  fetchRoleList();
  fetchUserRoles();
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const user = await userApi.getUser(userId.value);
    userName.value = user.nickname || user.username;
  } catch (error) {
    ElMessage.error("获取用户信息失败");
    console.error("获取用户信息失败:", error);
  }
};

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true;
  try {
    const response = await roleApi.pageRoles({ pageNum: 1, pageSize: 100 });
    roleList.value = response.data;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
    console.error("获取角色列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取用户已分配的角色
const fetchUserRoles = async () => {
  try {
    const roles = await userApi.getUserRoles(userId.value);
    selectedRoleIds.value = roles.map((role) => role.id);
  } catch (error) {
    ElMessage.error("获取用户角色失败");
    console.error("获取用户角色失败:", error);
  }
};

// 角色选择变化
const handleCheckChange = (
  data: RoleInfo,
  checked: boolean,
  indeterminate: boolean,
) => {
  // 自动处理，不需要手动操作
};

// 保存角色分配
const handleSave = async () => {
  try {
    await userApi.assignRoles(userId.value, { roleIds: selectedRoleIds.value });
    ElMessage.success("角色分配成功");
    // 跳转回用户列表
    router.push("/user");
  } catch (error) {
    ElMessage.error("角色分配失败");
    console.error("角色分配失败:", error);
  }
};
</script>

<style scoped>
.role-assignment {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.role-desc {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}
</style>
