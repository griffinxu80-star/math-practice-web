<template>
  <div class="weekly-page">
    <van-nav-bar title="周自测" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-cell-group inset>
        <van-cell title="本周自测" description="完成本周的练习题巩固知识" is-link @click="startWeekly" />
        <van-cell title="周报查看" description="查看家长发送的周报反馈" is-link @click="showReport" />
      </van-cell-group>
      
      <div class="weekly-tip" style="margin-top: 20px; background: white; border-radius: 12px; padding: 16px;">
        <h3>📅 本周任务</h3>
        <van-progress :percentage="weeklyProgress" :text-inside="false" style="margin-top: 12px;" />
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">
          已完成 {{ weeklyDone }} / {{ weeklyTotal }} 题
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const weeklyProgress = ref(35)
const weeklyDone = ref(7)
const weeklyTotal = ref(20)

function startWeekly() {
  router.push('/exam?type=weekly')
}

function showReport() {
  router.push('/parent/report/placeholder')
}
</script>

<style scoped>
.weekly-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
.weekly-tip h3 { font-size: 16px; margin-bottom: 8px; color: var(--primary-color); }
</style>
