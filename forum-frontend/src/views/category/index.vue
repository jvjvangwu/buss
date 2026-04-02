<template>
  <div class="category-management">
    <el-page-header @back="goBack" content="分类管理" />
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>分类列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增分类
          </el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.id)"
            >
              删除
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

    <!-- 新增/编辑分类对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入分类描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
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
import { Plus } from "@element-plus/icons-vue";
import { categoryApi } from "@/api/news";

// 分类列表数据
const categories = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref("新增分类");
const formRef = ref();
const form = reactive({
  id: "",
  name: "",
  description: "",
  sort: 0,
});

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
    {
      min: 1,
      max: 50,
      message: "分类名称长度在 1 到 50 个字符",
      trigger: "blur",
    },
  ],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
});

// 加载分类列表
const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await categoryApi.pageCategories(page);
    categories.value = response.records;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("加载分类列表失败");
    console.error("加载分类列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理新增分类
const handleCreate = () => {
  dialogTitle.value = "新增分类";
  form.id = "";
  form.name = "";
  form.description = "";
  form.sort = 0;
  dialogVisible.value = true;
};

// 处理编辑分类
const handleEdit = (row: any) => {
  dialogTitle.value = "编辑分类";
  form.id = row.id;
  form.name = row.name;
  form.description = row.description;
  form.sort = row.sort;
  dialogVisible.value = true;
};

// 处理删除分类
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除该分类吗？", "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await categoryApi.deleteCategory(id);
    ElMessage.success("删除成功");
    loadCategories();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
      console.error("删除分类失败:", error);
    }
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    if (form.id) {
      await categoryApi.updateCategory(form.id, form);
    } else {
      await categoryApi.createCategory(form);
    }
    ElMessage.success(form.id ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    loadCategories();
  } catch (error) {
    ElMessage.error("提交失败");
    console.error("提交分类失败:", error);
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  page.pageSize = size;
  loadCategories();
};

const handleCurrentChange = (current: number) => {
  page.pageNum = current;
  loadCategories();
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 初始化加载
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-management {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
