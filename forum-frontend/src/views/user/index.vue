<template>
  <div class="user-management">
    <el-page-header @back="goBack" content="用户管理" />
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>用户列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="search-form mb-4">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetForm"> 重置 </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="users" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleAssignRole(scope.row.id)"
            >
              分配角色
            </el-button>
            <el-button
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="page.pageNum"
          v-model:page-size="page.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :disabled="!!form.id"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            active-value="1"
            inactive-value="0"
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
import { userApi } from "@/api/user";

const router = useRouter();

// 用户列表数据
const users = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 搜索表单
const searchForm = reactive({
  username: "",
  email: "",
  status: "",
});

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref("新增用户");
const formRef = ref();
const form = reactive({
  id: "",
  username: "",
  password: "",
  nickname: "",
  email: "",
  status: 1,
});

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少 6 个字符", trigger: "blur" },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
});

// 加载用户列表
const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await userApi.pageUsers({ ...page, ...searchForm });
    users.value = response.records;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("加载用户列表失败");
    console.error("加载用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理新增用户
const handleCreate = () => {
  dialogTitle.value = "新增用户";
  form.id = "";
  form.username = "";
  form.password = "";
  form.nickname = "";
  form.email = "";
  form.phone = "";
  form.status = 1;
  dialogVisible.value = true;
};

// 处理编辑用户
const handleEdit = (row: any) => {
  dialogTitle.value = "编辑用户";
  form.id = row.id;
  form.username = row.username;
  form.password = "";
  form.nickname = row.nickname;
  form.email = row.email;
  form.status = row.status;
  dialogVisible.value = true;
};

// 处理分配角色
const handleAssignRole = (userId: number) => {
  router.push(`/users/role-assignment/${userId}`);
};

// 处理状态切换
const handleToggleStatus = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? "禁用" : "启用"}该用户吗？`,
      "状态确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await userApi.updateUserStatus(row.id, row.status === 1 ? 0 : 1);
    ElMessage.success(`${row.status === 1 ? "禁用" : "启用"}成功`);
    loadUsers();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败");
      console.error("状态切换失败:", error);
    }
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    if (form.id) {
      await userApi.updateUser(form.id, form);
    } else {
      await userApi.createUser(form);
    }
    ElMessage.success(form.id ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    loadUsers();
  } catch (error) {
    ElMessage.error("提交失败");
    console.error("提交用户失败:", error);
  }
};

// 处理搜索
const handleSearch = () => {
  page.pageNum = 1;
  loadUsers();
};

// 重置表单
const resetForm = () => {
  searchForm.username = "";
  searchForm.email = "";
  searchForm.status = "";
  page.pageNum = 1;
  loadUsers();
};

// 分页处理
const handleSizeChange = (size: number) => {
  page.pageSize = size;
  loadUsers();
};

const handleCurrentChange = (current: number) => {
  page.pageNum = current;
  loadUsers();
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 初始化加载
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
