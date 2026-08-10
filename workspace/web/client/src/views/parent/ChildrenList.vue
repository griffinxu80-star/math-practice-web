<template>
  <div class="children-list-page">
    <van-nav-bar title="孩子列表" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-empty description="暂无绑定的孩子，请先绑定" />
      <van-button type="primary" block style="margin-top: 20px;" @click="router.push('/parent')">返回首页</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.children-list-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
</style>
