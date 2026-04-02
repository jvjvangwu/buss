<template>
  <div class="news-detail">
    <div class="container">
      <div v-if="news" class="news-content">
        <h1 class="news-title">{{ news.title }}</h1>
        <div class="news-meta">
          <span class="publish-date">发布时间：{{ formatDate(news.publishAt) }}</span>
          <span class="view-count">{{ news.viewCount }} 浏览</span>
          <span class="like-count">{{ news.likeCount }} 点赞</span>
        </div>
        
        <div class="news-cover" v-if="news.coverImage">
          <img :src="news.coverImage" :alt="news.title" />
        </div>
        
        <div class="news-body" v-html="news.content"></div>
        
        <div class="news-actions">
          <button @click="likeNews" class="like-btn">
            <span class="like-icon">❤</span>
            <span>点赞</span>
          </button>
        </div>
      </div>
      <div v-else class="loading-state">
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getNewsById, likeNews } from '@/api/news';

const route = useRoute();
const news = ref<any>(null);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

const loadNewsDetail = async () => {
  const id = route.params.id;
  if (!id) return;
  
  try {
    const response = await getNewsById(id);
    news.value = response;
  } catch (error) {
    console.error('加载新闻详情失败:', error);
  }
};

const likeNews = async () => {
  if (!news.value) return;
  
  try {
    await likeNews(news.value.id);
    news.value.likeCount += 1;
    alert('点赞成功！');
  } catch (error) {
    console.error('点赞失败:', error);
    alert('点赞失败，请稍后重试');
  }
};

onMounted(() => {
  loadNewsDetail();
});
</script>

<style scoped>
.news-detail {
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.news-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.3;
}

.news-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.news-cover {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.news-cover img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

.news-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
}

.news-body p {
  margin-bottom: 1.5rem;
}

.news-body img {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 4px;
}

.news-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.like-btn:hover {
  background-color: #ffecec;
  border-color: #ff9999;
  color: #ff4d4f;
}

.like-icon {
  font-size: 1.2rem;
}

.loading-state {
  text-align: center;
  padding: 5rem 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-content {
    padding: 1.5rem;
  }
  
  .news-title {
    font-size: 1.5rem;
  }
  
  .news-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .news-body {
    font-size: 1rem;
  }
}
</style>