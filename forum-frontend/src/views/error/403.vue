<template>
  <div class="error-page">
    <div class="error-content">
      <h1>403</h1>
      <h2>无权限访问</h2>
      <p>抱歉，您没有权限访问此页面</p>
      <el-button type="primary" @click="goBack">返回上一页</el-button>
      <el-button @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.error-content {
  text-align: center;

  h1 {
    font-size: 120px;
    font-weight: 600;
    color: #f56c6c;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
  }
}
</style>
