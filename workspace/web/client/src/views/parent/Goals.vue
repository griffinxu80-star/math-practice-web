<template>
  <div class="goals-page">
    <van-nav-bar title="学习目标" left-arrow @click-left="router.back()" fixed placeholder>
      <template #right>
        <van-button size="small" @click="showAddDialog = true">添加目标</van-button>
      </template>
    </van-nav-bar>
    
    <div class="content">
      <van-cell
        v-for="goal in goals"
        :key="goal.id"
        :title="goal.description"
        :label="goal.target_score ? `目标分数：${goal.target_score}` : ''"
      >
        <template #right-icon>
          <van-tag
            :type="goal.status === 'completed' ? 'success' : goal.status === 'expired' ? 'default' : 'primary'"
          >
            {{ goal.status === 'completed' ? '已完成' : goal.status === 'expired' ? '已过期' : '进行中' }}
          </van-tag>
        </template>
      </van-cell>
      
      <van-dialog
        v-model:show="showAddDialog"
        title="添加学习目标"
        show-cancel-button
        @confirm="addGoal"
      >
        <van-field v-model="newGoal.description" label="目标描述" placeholder="如：本学期数学达到90分" />
        <van-field v-model="newGoal.targetScore" label="目标分数" type="number" placeholder="如：90" />
        <van-field v-model="newGoal.deadline" label="截止日期" placeholder="如：2026-06-30" />
      </van-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { parentApi } from '../../api/services'

const router = useRouter()
const goals = ref<any[]>([])
const showAddDialog = ref(false)
const newGoal = ref({ description: '', targetScore: '', deadline: '' })

async function loadGoals() {
  try {
    const res = await parentApi.getGoals()
    goals.value = res.data.data
  } catch (err) {
    console.error('加载目标失败', err)
  }
}

async function addGoal() {
  if (!newGoal.value.description) return
  
  try {
    await parentApi.createGoal({
      studentId: goals.value[0]?.student_id,
      parentId: goals.value[0]?.parent_id,
      description: newGoal.value.description,
      targetScore: newGoal.value.targetScore ? parseFloat(newGoal.value.targetScore) : null,
      deadline: newGoal.value.deadline || null
    })
    showAddDialog.value = false
    newGoal.value = { description: '', targetScore: '', deadline: '' }
    loadGoals()
  } catch (err) {
    console.error('添加目标失败', err)
  }
}

onMounted(() => {
  loadGoals()
})
</script>

<style scoped>
.goals-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}
</style>
