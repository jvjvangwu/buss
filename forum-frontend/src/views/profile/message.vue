<template>
  <div class="profile-message">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>消息过滤</span>
          <el-button type="primary" size="small" @click="markAllAsRead">
            全部标记为已读
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="消息类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择消息类型"
            clearable
          >
            <el-option label="系统消息" value="system" />
            <el-option label="评论消息" value="comment" />
            <el-option label="点赞消息" value="like" />
            <el-option label="关注消息" value="follow" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未读" value="unread" />
            <el-option label="已读" value="read" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 消息列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息列表</span>
        </div>
      </template>

      <el-empty v-if="messageList.length === 0" description="暂无消息" />

      <div v-else class="message-list">
        <el-card
          v-for="message in messageList"
          :key="message.id"
          class="message-item mb-4"
        >
          <div class="message-header">
            <div class="message-avatar">
              <el-avatar :size="40" :src="getAvatar(message.type)">
                <el-icon v-if="!getAvatar(message.type)">
                  {{ getIcon(message.type) }}
                </el-icon>
              </el-avatar>
            </div>
            <div class="message-content">
              <div class="message-title">
                <span>{{ message.title }}</span>
                <el-tag
                  v-if="message.status === 'unread'"
                  size="small"
                  type="danger"
                  >未读</el-tag
                >
              </div>
              <div class="message-body">{{ message.content }}</div>
              <div class="message-footer">
                <span class="message-time">{{
                  formatTime(message.createdAt)
                }}</span>
                <el-button type="text" @click="markAsRead(message.id)">
                  {{
                    message.status === "unread" ? "标记为已读" : "标记为未读"
                  }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination mt-4" v-if="messageList.length > 0">
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Bell, ChatLineRound, Star, UserFilled } from "@element-plus/icons-vue";
import { messageApi } from "@/api/message";
import type { MessageInfo, MessageQueryParams } from "@/api/message";

// 搜索表单
const searchForm = reactive({
  type: "",
  status: "",
});

// 加载状态
const loading = ref(false);

// 消息列表
const messageList = ref<MessageInfo[]>([]);

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 初始化
onMounted(() => {
  fetchMessageList();
});

// 获取消息列表
const fetchMessageList = async () => {
  loading.value = true;
  try {
    const params: MessageQueryParams = {
      pageNum: pagination.current,
      pageSize: pagination.size,
      type: searchForm.type,
      status: searchForm.status,
    };
    const response = await messageApi.pageMessages(params);
    messageList.value = response.data;
    pagination.total = response.total;
  } catch (error) {
    ElMessage.error("获取消息列表失败");
    console.error("获取消息列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchMessageList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.type = "";
  searchForm.status = "";
  pagination.current = 1;
  fetchMessageList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.size = size;
  fetchMessageList();
};

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current;
  fetchMessageList();
};

// 标记为已读
const markAsRead = async (id: number) => {
  try {
    await messageApi.markAsRead(id);
    ElMessage.success("操作成功");
    fetchMessageList();
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    await messageApi.markAllAsRead();
    ElMessage.success("全部标记为已读");
    fetchMessageList();
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 获取消息类型对应的图标
const getIcon = (type: string) => {
  switch (type) {
    case "system":
      return Bell;
    case "comment":
      return ChatLineRound;
    case "like":
      return Star;
    case "follow":
      return UserFilled;
    default:
      return Bell;
  }
};

// 获取消息类型对应的头像
const getAvatar = (type: string) => {
  // 这里可以根据消息类型返回不同的头像
  return "";
};

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString();
};
</script>

<style scoped>
.profile-message {
  padding: 20px 0;
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

.message-item {
  transition: all 0.3s;
}

.message-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  align-items: flex-start;
}

.message-avatar {
  margin-right: 16px;
}

.message-content {
  flex: 1;
}

.message-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-body {
  margin-bottom: 12px;
  color: #606266;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-time {
  font-size: 12px;
  color: #909399;
}
</style>
