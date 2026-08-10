<template>
  <div class="points-page">
    <van-nav-bar title="我的积分" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="content">
      <div class="points-card">
        <div class="points-value">{{ userStore.profile?.current_points || 0 }}</div>
        <div class="points-label">当前积分</div>
      </div>
      
      <div class="points-history">
        <h3>积分明细</h3>
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in list"
            :key="item.id"
            :title="item.source"
            :label="item.created_at"
            :icon="item.type === 'earn' ? 'integral-gift-o' : 'integral'"
          >
            <template #right-icon>
              <span :class="item.type === 'earn' ? 'points-positive' : 'points-negative'">
                {{ item.type === 'earn' ? '+' : '-' }}{{ Math.abs(item.amount) }}
              </span>
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { pointsApi } from '../api/services'

const router = useRouter()
const userStore = useUserStore()

const list = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)

async function onLoad() {
  try {
    const res = await pointsApi.getHistory(20)
    list.value = [...list.value, ...res.data.data]
    loading.value = false
    if (list.value.length >= 20) {
      finished.value = true
    }
  } catch (err) {
    loading.value = false
  }
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped>
.points-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}

.points-card {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.points-value {
  font-size: 48px;
  font-weight: bold;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 8px;
}

.points-history {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.points-history h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.points-positive {
  color: var(--success-color);
}

.points-negative {
  color: var(--error-color);
}
</style>
