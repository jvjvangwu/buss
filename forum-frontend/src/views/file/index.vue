<template>
  <div class="file-management">
    <el-page-header @back="goBack" content="文件管理" />
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>文件列表</span>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :multiple="true"
          >
            <el-icon class="el-icon--upload"><Upload /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip text-sm text-gray-500">
                支持上传图片、文档等文件，单个文件不超过 10MB
              </div>
            </template>
          </el-upload>
        </div>
      </template>
      <el-table v-loading="loading" :data="files" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="文件名称" min-width="200">
          <template #default="scope">
            <span class="file-name">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" width="120" />
        <el-table-column prop="fileSize" label="文件大小" width="100">
          <template #default="scope">
            <span>{{ formatFileSize(scope.row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传者" width="120" />
        <el-table-column prop="createdAt" label="上传时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDownload(scope.row)"
            >
              下载
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { fileApi } from "@/api/file";

// 文件列表数据
const files = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 加载文件列表
const loadFiles = async () => {
  loading.value = true;
  try {
    const response = await fileApi.pageFiles(page);
    files.value = response.records;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("加载文件列表失败");
    console.error("加载文件列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理文件上传
const handleFileChange = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file.raw);
    await fileApi.uploadFile(formData);
    ElMessage.success("文件上传成功");
    loadFiles();
  } catch (error) {
    ElMessage.error("文件上传失败");
    console.error("文件上传失败:", error);
  }
};

// 处理文件下载
const handleDownload = (file: any) => {
  const downloadUrl = fileApi.downloadFile(file.fileName);
  window.open(downloadUrl, "_blank");
};

// 处理文件删除
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除该文件吗？", "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await fileApi.deleteFile(id);
    ElMessage.success("删除成功");
    loadFiles();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
      console.error("删除文件失败:", error);
    }
  }
};

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  page.pageSize = size;
  loadFiles();
};

const handleCurrentChange = (current: number) => {
  page.pageNum = current;
  loadFiles();
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 初始化加载
onMounted(() => {
  loadFiles();
});
</script>

<style scoped>
.file-management {
  padding: 20px;
}

.file-name {
  word-break: break-all;
}
</style>
