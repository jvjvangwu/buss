<template>
  <div class="profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="info">
          <ProfileInfo />
        </el-tab-pane>
        <el-tab-pane label="密码修改" name="password">
          <ProfilePassword />
        </el-tab-pane>
        <el-tab-pane label="我的消息" name="message">
          <ProfileMessage />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProfileInfo from "./info.vue";
import ProfilePassword from "./password.vue";
import ProfileMessage from "./message.vue";

const activeTab = ref("info");
</script>

<style scoped>
.profile {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
