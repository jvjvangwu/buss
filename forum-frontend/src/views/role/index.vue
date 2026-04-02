<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加角色
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch"> 重置 </el-button>
        </el-form-item>
      </el-form>

      <!-- 角色列表 -->
      <el-table v-loading="loading" :data="roleList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="handlePermissionAssignment(scope.row)"
            >
              权限分配
            </el-button>
            <el-button
              :type="scope.row.status === 1 ? 'danger' : 'warning'"
              size="small"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination mt-4">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { roleApi } from "@/api/role";
import type { RoleInfo, RoleQueryParams, RoleParams } from "@/api/role";

// 路由
const router = useRouter();

// 搜索表单
const searchForm = reactive({
  roleName: "",
});

// 加载状态
const loading = ref(false);

// 角色列表
const roleList = ref<RoleInfo[]>([]);

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 对话框
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const formRef = ref();

// 表单数据
const form = reactive<RoleParams>({
  name: "",
  description: "",
  status: 1,
});

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "角色名称长度在2-50个字符之间",
      trigger: "blur",
    },
  ],
});

// 初始化
onMounted(() => {
  fetchRoleList();
});

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true;
  try {
    const params: RoleQueryParams = {
      pageNum: pagination.current,
      pageSize: pagination.size,
      roleName: searchForm.roleName,
    };
    const response = await roleApi.pageRoles(params);
    roleList.value = response.records || [];
    pagination.total = response.total || 0;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
    console.error("获取角色列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchRoleList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.roleName = "";
  pagination.current = 1;
  fetchRoleList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.size = size;
  fetchRoleList();
};

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current;
  fetchRoleList();
};

// 添加角色
const handleAdd = () => {
  dialogType.value = "add";
  Object.assign(form, {
    name: "",
    description: "",
    status: 1,
  });
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (role: RoleInfo) => {
  dialogType.value = "edit";
  Object.assign(form, {
    id: role.id,
    name: role.name,
    description: role.description,
    status: role.status,
  });
  dialogVisible.value = true;
};

// 权限分配
const handlePermissionAssignment = (role: RoleInfo) => {
  router.push(`/roles/permission-assignment/${role.id}`);
};

// 状态切换
const handleStatusChange = async (role: RoleInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要${role.status === 1 ? "禁用" : "启用"}该角色吗？`,
      "操作确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await roleApi.updateRoleStatus(role.id, role.status === 1 ? 0 : 1);
    ElMessage.success("操作成功");
    fetchRoleList();
  } catch (error) {
    // 取消操作
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    if (dialogType.value === "add") {
      // 生成角色code：将角色名称转换为小写，用下划线替换空格
      const roleCode = form.name.toLowerCase().replace(/\s+/g, "_");
      form.code = roleCode;
      await roleApi.createRole(form);
      ElMessage.success("添加成功");
    } else {
      await roleApi.updateRole(form);
      ElMessage.success("编辑成功");
    }

    dialogVisible.value = false;
    fetchRoleList();
  } catch (error) {
    console.error("提交失败:", error);
  }
};
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
