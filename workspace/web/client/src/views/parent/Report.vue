<template>
  <div class="parent-report">
    <van-nav-bar title="学习报告" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="content">
      <van-steps direction="vertical" :active="activeStep">
        <van-step>
          <template #title>学习情况</template>
          <template #content>
            <van-cell-group inset>
              <van-cell title="总考试次数" :value="report?.exam_count || 0" />
              <van-cell title="平均分" :value="report?.avg_score?.toFixed(1) || '0'" />
              <van-cell title="本周自测" :value="report?.exam_count || 0" />
            </van-cell-group>
          </template>
        </van-step>
        <van-step>
          <template #title>薄弱点改善</template>
          <template #content>
            <van-cell-group inset>
              <van-cell title="已改善知识点" :value="report?.improvement_points || 0" />
            </van-cell-group>
          </template>
        </van-step>
        <van-step>
          <template #title>错题统计</template>
          <template #content>
            <van-cell-group inset>
              <van-cell title="错题数量" :value="report?.wrong_question_count || 0" />
            </van-cell-group>
          </template>
        </van-step>
      </van-steps>
      
      <div class="goals-section">
        <h3>学习目标</h3>
        <van-cell
          v-for="goal in goals"
          :key="goal.id"
          :title="goal.description"
          :label="goal.target_score ? `目标分数：${goal.target_score}` : ''"
          :value="goal.status === 'completed' ? '已完成' : '进行中'"
          is-link
          @click="router.push('/parent/goals')"
        >
          <template #right-icon>
            <van-tag :type="goal.status === 'completed' ? 'success' : 'primary'">
              {{ goal.status === 'completed' ? '已完成' : '进行中' }}
            </van-tag>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { parentApi } from '../../api/services'

const router = useRouter()
const route = useRoute()
const childId = route.params.childId as string

const report = ref<any>(null)
const goals = ref<any[]>([])
const activeStep = ref(0)

onMounted(async () => {
  try {
    const res = await parentApi.getChildReport(childId)
    report.value = res.data.data[0]
  } catch (err) {
    console.error('加载报告失败', err)
  }
})
</script>

<style scoped>
.parent-report {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}

.goals-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.goals-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
}
</style>
