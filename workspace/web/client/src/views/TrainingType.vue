<template>
  <div class="training-type-page">
    <van-nav-bar title="提升训练" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-cell-group inset>
        <van-cell
          title="薄弱点训练"
          description="针对你的薄弱知识点进行专项训练"
          is-link
          @click="router.push('/training/diagnosis')"
        />
        <van-cell
          title="每日一题"
          description="每天一道题，保持学习节奏"
          is-link
          @click="router.push('/training/daily')"
        />
        <van-cell
          title="随机练习"
          description="随机抽取题目进行练习"
          is-link
          @click="router.push('/training/random')"
        />
      </van-cell-group>
      
      <div style="margin-top: 16px; background: white; border-radius: 12px; padding: 16px;">
        <h3 style="font-size: 16px; color: var(--primary-color); margin-bottom: 12px;">📊 学习进度</h3>
        <van-progress :percentage="85" stroke-width="8" indicator-size="14px" />
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">
          总体掌握度：85% | 薄弱点：3个
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.training-type-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
</style>
