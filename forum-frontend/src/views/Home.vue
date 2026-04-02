<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎来到论坛系统</h1>
      <p class="subtitle">分享知识，交流经验，共同成长</p>
    </div>

    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-number">1,234</div>
            <div class="stat-label">用户总数</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-number">567</div>
            <div class="stat-label">文章总数</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-number">890</div>
            <div class="stat-label">评论总数</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-number">123</div>
            <div class="stat-label">今日活跃</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>最新文章</span>
                <el-button type="primary" text>查看更多</el-button>
              </div>
            </template>
            <div class="article-list">
              <el-empty description="暂无文章" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>热门标签</span>
            </template>
            <div class="tag-list">
              <el-tag v-for="tag in hotTags" :key="tag" class="hot-tag">
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const hotTags = ref([
  "ChatGPT",
  "GPT-4",
  "人工智能",
  "新能源",
  "元宇宙",
  "区块链",
]);
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
}

.welcome-section {
  text-align: center;
  padding: 40px 0;

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    color: #666;
  }
}

.stats-section {
  margin-bottom: 20px;

  .stat-card {
    text-align: center;
    padding: 20px 0;

    .stat-number {
      font-size: 28px;
      font-weight: 600;
      color: #409eff;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }
  }
}

.content-section {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .article-list {
    min-height: 200px;
  }

  .tag-list {
    .hot-tag {
      margin: 5px;
      cursor: pointer;
    }
  }
}
</style>
