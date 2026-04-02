<template>
  <div class="log-management">
    <el-page-header @back="goBack" content="操作日志" />
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>操作日志列表</span>
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="操作人">
              <el-input
                v-model="searchForm.username"
                placeholder="请输入操作人"
              />
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select
                v-model="searchForm.operation"
                placeholder="请选择操作类型"
              >
                <el-option label="新增" value="新增" />
                <el-option label="修改" value="修改" />
                <el-option label="删除" value="删除" />
                <el-option label="查询" value="查询" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                placeholder="开始时间"
                style="width: 180px"
              />
              <span class="mx-2">至</span>
              <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                placeholder="结束时间"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="resetForm"> 重置 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table v-loading="loading" :data="logs" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="operation" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.operation)">
              {{ scope.row.operation }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="请求方法" width="100" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column
          prop="errorMsg"
          label="错误信息"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="duration" label="耗时(ms)" width="100" />
        <el-table-column prop="createdAt" label="操作时间" width="180" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { logApi } from "@/api/log";

// 日志列表数据
const logs = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 搜索表单
const searchForm = reactive({
  username: "",
  operation: "",
  startTime: "",
  endTime: "",
});

// 加载日志列表
const loadLogs = async () => {
  loading.value = true;
  try {
    const params: any = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    };
    if (searchForm.username) params.username = searchForm.username;
    if (searchForm.operation) params.operation = searchForm.operation;
    if (searchForm.startTime) params.startTime = searchForm.startTime;
    if (searchForm.endTime) params.endTime = searchForm.endTime;

    const response = await logApi.pageOperationLogs(params);
    logs.value = response.records;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("加载日志列表失败");
    console.error("加载日志列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  page.pageNum = 1;
  loadLogs();
};

// 重置表单
const resetForm = () => {
  searchForm.username = "";
  searchForm.operation = "";
  searchForm.startTime = "";
  searchForm.endTime = "";
  page.pageNum = 1;
  loadLogs();
};

// 获取标签类型
const getTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    新增: "success",
    修改: "warning",
    删除: "danger",
    查询: "info",
  };
  return typeMap[type] || "info";
};

// 分页处理
const handleSizeChange = (size: number) => {
  page.pageSize = size;
  loadLogs();
};

const handleCurrentChange = (current: number) => {
  page.pageNum = current;
  loadLogs();
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 初始化加载
onMounted(() => {
  loadLogs();
});
</script>

<style scoped>
.log-management {
  padding: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
