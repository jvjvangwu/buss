<template>
  <div class="permission-assignment">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限分配 - {{ roleName }}</span>
          <el-button type="primary" @click="handleSave"> 保存分配 </el-button>
        </div>
      </template>

      <!-- 权限树 -->
      <el-tree
        v-loading="loading"
        :data="permissionTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissionIds"
        :props="treeProps"
        @check-change="handleCheckChange"
        style="max-height: 600px; overflow-y: auto"
      >
        <template #default="{ node, data }">
          <div class="permission-node">
            <span>{{ node.label }}</span>
            <span v-if="data.code" class="permission-code">{{
              data.code
            }}</span>
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
import { roleApi, permissionApi } from "@/api/role";
import type { PermissionInfo } from "@/api/role";

// 路由
const route = useRoute();
const router = useRouter();

// 加载状态
const loading = ref(false);

// 角色ID
const roleId = computed(() => {
  return Number(route.params.id);
});

// 角色名称
const roleName = ref("");

// 权限树
const permissionTree = ref<PermissionInfo[]>([]);

// 已选择的权限ID
const selectedPermissionIds = ref<number[]>([]);

// 树结构配置
const treeProps = {
  children: "children",
  label: "name",
};

// 初始化
onMounted(() => {
  fetchRoleInfo();
  fetchPermissionTree();
  fetchRolePermissions();
});

// 获取角色信息
const fetchRoleInfo = async () => {
  try {
    const role = await roleApi.getRole(roleId.value);
    roleName.value = role.name;
  } catch (error) {
    ElMessage.error("获取角色信息失败");
    console.error("获取角色信息失败:", error);
  }
};

// 获取权限树
const fetchPermissionTree = async () => {
  loading.value = true;
  try {
    const permissions = await permissionApi.getPermissionTree();
    permissionTree.value = permissions;
  } catch (error) {
    ElMessage.error("获取权限树失败");
    console.error("获取权限树失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取角色已分配的权限
const fetchRolePermissions = async () => {
  try {
    const permissionIds = await roleApi.getRolePermissions(roleId.value);
    selectedPermissionIds.value = permissionIds;
  } catch (error) {
    ElMessage.error("获取角色权限失败");
    console.error("获取角色权限失败:", error);
  }
};

// 权限选择变化
const handleCheckChange = (
  data: PermissionInfo,
  checked: boolean,
  indeterminate: boolean,
) => {
  // 自动处理，不需要手动操作
};

// 保存权限分配
const handleSave = async () => {
  try {
    await roleApi.assignPermissions(roleId.value, selectedPermissionIds.value);
    ElMessage.success("权限分配成功");
    // 跳转回角色列表
    router.push("/roles");
  } catch (error) {
    ElMessage.error("权限分配失败");
    console.error("权限分配失败:", error);
  }
};
</script>

<style scoped>
.permission-assignment {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.permission-code {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}
</style>
