<template>
  <div class="news-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新闻管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加新闻
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标题关键词"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.categoryName"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="草稿" :value="0" />
            <el-option label="待审核" :value="1" />
            <el-option label="已发布" :value="2" />
            <el-option label="已下架" :value="3" />
            <el-option label="已拒绝" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch"> 重置 </el-button>
        </el-form-item>
      </el-form>

      <!-- 新闻列表 -->
      <el-table v-loading="loading" :data="newsList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题">
          <template #default="scope">
            <div class="news-title">
              <span
                :class="{
                  'is-top': scope.row.isTop,
                  'is-hot': scope.row.isHot,
                }"
              ></span>
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="category.categoryName"
          label="分类"
          width="120"
        />
        <el-table-column prop="author.nickname" label="作者" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="80" />
        <el-table-column prop="likeCount" label="点赞" width="80" />
        <el-table-column prop="commentCount" label="评论" width="80" />
        <el-table-column prop="publishAt" label="发布时间" width="180" />
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
              v-if="scope.row.status !== 2"
              type="success"
              size="small"
              @click="handlePublish(scope.row)"
            >
              发布
            </el-button>
            <el-button
              v-else
              type="warning"
              size="small"
              @click="handleOffline(scope.row)"
            >
              下架
            </el-button>
            <el-button
              :type="scope.row.isTop ? 'info' : 'primary'"
              size="small"
              @click="handleTop(scope.row)"
            >
              {{ scope.row.isTop ? "取消置顶" : "置顶" }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import { newsApi, categoryApi } from "@/api/news";
import type { NewsInfo, NewsQueryParams } from "@/api/news";

// 搜索表单
const searchForm = reactive({
  keyword: "",
  categoryId: undefined,
  status: undefined,
});

// 加载状态
const loading = ref(false);

// 新闻列表
const newsList = ref<NewsInfo[]>([]);

// 分类列表
const categoryList = ref<any[]>([]);

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 初始化
onMounted(() => {
  fetchNewsList();
  fetchCategoryList();
});

// 获取新闻列表
const fetchNewsList = async () => {
  loading.value = true;
  try {
    const params: NewsQueryParams = {
      pageNum: pagination.current,
      pageSize: pagination.size,
      keyword: searchForm.keyword,
      categoryId: searchForm.categoryId,
      status: searchForm.status,
    };
    const response = await newsApi.pageNews(params);
    newsList.value = response.records;
    pagination.total = response.total;
  } catch (error) {
    ElMessage.error("获取新闻列表失败");
    console.error("获取新闻列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    const categories = await categoryApi.getCategoryTree();
    categoryList.value = categories;
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchNewsList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = "";
  searchForm.categoryId = "";
  searchForm.status = "";
  pagination.current = 1;
  fetchNewsList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.size = size;
  fetchNewsList();
};

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current;
  fetchNewsList();
};

// 添加新闻
const handleAdd = () => {
  router.push("/news/create");
};

// 编辑新闻
const handleEdit = (news: NewsInfo) => {
  router.push(`/news/edit/${news.id}`);
};

// 发布新闻
const handlePublish = async (news: NewsInfo) => {
  try {
    await ElMessageBox.confirm("确定要发布该新闻吗？", "操作确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await newsApi.publishNews(news.id);
    ElMessage.success("发布成功");
    fetchNewsList();
  } catch (error) {
    // 取消操作
    if (error.message) {
      ElMessage.error(error.message);
    }
  }
};

// 下架新闻
const handleOffline = async (news: NewsInfo) => {
  try {
    await ElMessageBox.confirm("确定要下架该新闻吗？", "操作确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await newsApi.offlineNews(news.id);
    ElMessage.success("下架成功");
    fetchNewsList();
  } catch (error) {
    // 取消操作
  }
};

// 置顶/取消置顶
const handleTop = async (news: NewsInfo) => {
  try {
    await newsApi.setTopNews(news.id, !news.isTop);
    ElMessage.success(news.isTop ? "取消置顶成功" : "置顶成功");
    fetchNewsList();
  } catch (error) {
    ElMessage.error("操作失败");
    console.error("操作失败:", error);
  }
};

// 删除新闻
const handleDelete = async (news: NewsInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除该新闻吗？", "操作确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "danger",
    });

    await newsApi.deleteNews(news.id);
    ElMessage.success("删除成功");
    fetchNewsList();
  } catch (error) {
    // 取消操作
  }
};

// 获取状态类型
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "danger";
    case 4:
      return "danger";
    default:
      return "";
  }
};

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "草稿";
    case 1:
      return "待审核";
    case 2:
      return "已发布";
    case 3:
      return "已下架";
    case 4:
      return "已拒绝";
    default:
      return "";
  }
};

// 路由
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
.news-management {
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

.news-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.is-top {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #f56c6c;
  border-radius: 50%;
}

.is-hot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #e6a23c;
  border-radius: 50%;
}
</style>
