<template>
  <div class="news-home">
    <!-- 手动加载按钮 -->
    <div class="container">
      <button @click="loadData" class="load-btn">手动加载新闻数据</button>
    </div>
    
    <!-- 精选新闻区域 -->
    <section class="featured-news">
      <div class="container">
        <h2 class="section-title">精选新闻</h2>
        <div v-if="featuredNews.length > 0" class="featured-news-grid">
          <div v-for="news in featuredNews" :key="news.id" class="featured-news-item">
            <router-link :to="`/news/detail/${news.id}`" class="news-link">
              <div class="news-image">
                <img :src="news.coverImage || placeholderImage" :alt="news.title" />
              </div>
              <div class="news-content">
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-summary">{{ news.summary }}</p>
                <div class="news-meta">
                  <span class="publish-date">{{ formatDate(news.publishAt) }}</span>
                  <span class="view-count">{{ news.viewCount }} 浏览</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-else class="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    </section>

    <!-- 新闻列表区域 -->
    <section class="news-list">
      <div class="container">
        <h2 class="section-title">最新新闻</h2>
        <div v-if="newsList.length > 0" class="news-grid">
          <div v-for="news in newsList" :key="news.id" class="news-card">
            <router-link :to="`/news/detail/${news.id}`" class="news-link">
              <div class="news-image">
                <img :src="news.coverImage || placeholderImage" :alt="news.title" />
              </div>
              <div class="news-content">
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-summary">{{ news.summary }}</p>
                <div class="news-meta">
                  <span class="publish-date">{{ formatDate(news.publishAt) }}</span>
                  <span class="view-count">{{ news.viewCount }} 浏览</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-else class="loading-state">
          <p>加载中...</p>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getNewsList, getFeaturedNews } from '@/api/news';

console.log('新闻展示页面组件加载');

const featuredNews = ref<any[]>([]);
const newsList = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const placeholderImage = 'https://via.placeholder.com/300x200?text=News';

const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

const loadFeaturedNews = async () => {
  try {
    console.log('开始加载精选新闻');
    const response = await getFeaturedNews({ pageNum: 1, pageSize: 3 });
    console.log('精选新闻响应:', response);
    featuredNews.value = response.records || response.list || response.data || [];
    console.log('精选新闻数据:', featuredNews.value);
  } catch (error) {
    console.error('加载精选新闻失败:', error);
  }
};

const loadNewsList = async () => {
  try {
    console.log('开始加载新闻列表');
    const response = await getNewsList({ 
      pageNum: currentPage.value, 
      pageSize: pageSize.value 
    });
    console.log('新闻列表响应:', response);
    newsList.value = response.records || response.list || response.data || [];
    total.value = response.total;
    console.log('新闻列表数据:', newsList.value);
  } catch (error) {
    console.error('加载新闻列表失败:', error);
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadNewsList();
};

const loadData = () => {
  console.log('手动加载新闻数据');
  loadFeaturedNews();
  loadNewsList();
};

console.log('onMounted 钩子注册');
onMounted(() => {
  console.log('组件挂载，开始加载新闻数据');
  loadFeaturedNews();
  loadNewsList();
});
</script>

<style scoped>
.news-home {
  padding: 2rem 0;
}

.load-btn {
  padding: 0.75rem 1.5rem;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-bottom: 2rem;
}

.load-btn:hover {
  background-color: #40a9ff;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

/* 精选新闻样式 */
.featured-news {
  margin-bottom: 3rem;
}

.featured-news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.featured-news-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.featured-news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 新闻列表样式 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.news-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.news-link {
  display: block;
  text-decoration: none;
  color: #333;
}

.news-image {
  height: 180px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-link:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 1rem;
}

.news-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.news-summary {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.loading-state {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .featured-news-grid,
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .news-image {
    height: 150px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>