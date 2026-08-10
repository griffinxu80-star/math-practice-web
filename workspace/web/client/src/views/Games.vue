<template>
  <div class="games-page">
    <van-nav-bar title="闯关游戏" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <div class="game-map" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <h3>🗺️ 闯关地图</h3>
        <div class="levels">
          <div
            v-for="level in levels"
            :key="level.id"
            :class="['level-card', { completed: level.completed, locked: level.locked }]"
            @click="!level.locked && startLevel(level)"
          >
            <div class="level-icon">{{ level.completed ? '✅' : level.locked ? '🔒' : '🎯' }}</div>
            <div class="level-info">
              <div class="level-name">{{ level.name }}</div>
              <div class="level-desc">{{ level.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="daily-challenge" style="background: white; border-radius: 12px; padding: 16px;">
        <h3>📌 每日一题</h3>
        <van-button type="primary" block @click="startDaily">开始挑战</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const levels = ref([
  { id: 1, name: '第一关：数的认识', description: '完成10道题', completed: false, locked: false },
  { id: 2, name: '第二关：几何初步', description: '完成10道题', completed: false, locked: true },
  { id: 3, name: '第三关：运算定律', description: '完成10道题', completed: false, locked: true },
  { id: 4, name: '第四关：综合挑战', description: '完成15道题', completed: false, locked: true },
])

function startLevel(level: any) {
  router.push('/exam?type=game&level=' + level.id)
}

function startDaily() {
  router.push('/training?type=daily')
}
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
.levels { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
.level-card { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; background: var(--bg-color); }
.level-card.completed { background: #E8F5E9; }
.level-card.locked { opacity: 0.5; }
.level-icon { font-size: 24px; }
.level-info { flex: 1; }
.level-name { font-size: 14px; font-weight: bold; }
.level-desc { font-size: 12px; color: var(--text-secondary); }
.daily-challenge h3 { font-size: 16px; margin-bottom: 12px; color: var(--primary-color); }
</style>
