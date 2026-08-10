<template>
  <div class="exam-page">
    <van-nav-bar title="自测诊断" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-picker
        v-model="selectedGrade"
        :columns="gradeOptions"
        @confirm="onGradeConfirm"
        @cancel="showGradePicker = false"
      >
        <template #trigger>
          <div class="grade-selector">
            <span>选择年级：{{ gradeOptions[selectedGrade[0]]?.text || '4年级' }}</span>
            <van-icon name="arrow-down" />
          </div>
        </template>
      </van-picker>
      <div class="exam-list">
        <div v-for="exam in examList" :key="exam.id" class="exam-card" @click="startExam(exam)">
          <div class="exam-info">
            <h3>{{ exam.name }}</h3>
            <p>{{ exam.description || '章节测试' }}</p>
          </div>
          <div class="exam-meta">
            <span>题目：{{ exam.questionCount }}题</span>
            <span>时间：{{ exam.timeLimit || '不限' }}分钟</span>
          </div>
        </div>
        <van-empty v-if="examList.length === 0" description="暂无考试" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { knowledgeApi } from '../api/services'

const router = useRouter()
const userStore = useUserStore()
const selectedGrade = ref([0])
const showGradePicker = ref(false)
const examList = ref<any[]>([])

const gradeOptions = [
  { text: '4年级', value: 4 },
  { text: '5年级', value: 5 },
  { text: '6年级', value: 6 }
]

function onGradeConfirm({ selectedOptions }: any) {
  selectedGrade.value = [gradeOptions.indexOf(selectedOptions[0])]
  loadExams(selectedOptions[0].value)
}

async function loadExams(grade: number) {
  try {
    const res = await knowledgeApi.getQuestions({ grade, limit: 50 })
    const grouped: Record<string, any[]> = {}
    for (const q of res.data.data) {
      const key = `${q.chapter || '其他'}-${q.unit || 0}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(q)
    }
    examList.value = Object.entries(grouped).map(([key, questions]) => ({
      id: `exam_${key}`, name: `${key.replace('-', '单元')}`,
      description: `${questions.length}道题目`,
      questionCount: questions.length, timeLimit: questions.length * 2, grade
    }))
  } catch (err) { console.error('加载考试失败', err) }
}

function startExam(exam: any) { router.push(`/exam/${exam.id}`) }

onMounted(() => { loadExams(userStore.user?.grade || 4) })
</script>

<style scoped>
.exam-page { min-height: 100vh; background: var(--bg-color); }
.content { padding: 16px; padding-top: 60px; }
.grade-selector { background: white; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.exam-list { display: flex; flex-direction: column; gap: 12px; }
.exam-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.exam-card h3 { font-size: 16px; margin-bottom: 4px; }
.exam-card p { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
.exam-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary); }
</style>
