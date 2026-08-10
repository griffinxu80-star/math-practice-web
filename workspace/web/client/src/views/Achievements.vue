<template>
  <div class="achievements-page">
    <van-nav-bar title="成就徽章" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="content">
      <van-grid :column-num="3" :gutter="10">
        <van-grid-item
          v-for="ach in achievements"
          :key="ach.achievement_id"
          :icon="ach.icon_url"
          :text="ach.achievement_name"
        >
          <template #icon>
            <div :class="['ach-icon', ach.unlocked_at ? 'unlocked' : 'locked']">
              {{ ach.icon_url }}
            </div>
          </template>
        </van-grid-item>
      </van-grid>
      
      <div class="achievement-list">
        <van-cell
          v-for="ach in achievements"
          :key="ach.id"
          :title="ach.achievement_name"
          :label="ach.description"
          :value="ach.unlocked_at ? '已解锁' : '未解锁'"
          :icon="ach.icon_url"
        >
          <template #right-icon>
            <van-tag :type="ach.unlocked_at ? 'success' : 'default'">
              {{ ach.unlocked_at ? '已解锁' : '未解锁' }}
            </van-tag>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gamificationApi } from '../api/services'

const router = useRouter()
const achievements = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await gamificationApi.getAchievements()
    achievements.value = res.data.data
  } catch (err) {
    console.error('加载成就失败', err)
  }
})
</script>

<style scoped>
.achievements-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}

.ach-icon {
  font-size: 32px;
}

.ach-icon.unlocked {
  opacity: 1;
}

.ach-icon.locked {
  opacity: 0.3;
  filter: grayscale(100%);
}

.achievement-list {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}
</style>
