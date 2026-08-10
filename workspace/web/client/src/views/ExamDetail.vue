<template>
  <div class="exam-detail-page">
    <van-nav-bar :title="exam?.name || '答题'" left-arrow @click-left="handleBack" fixed placeholder>
      <template #right>
        <span class="timer">{{ formatTime(remainingTime) }}</span>
      </template>
    </van-nav-bar>
    <div class="content" v-if="currentQuestion">
      <div class="progress-bar">
        <van-progress :percentage="currentIndex / totalQuestions * 100" stroke-width="4" />
        <span>{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      </div>
      <div class="question-card">
        <div class="question-header">
          <van-tag type="primary">{{ currentQuestion?.knowledge_point_name }}</van-tag>
          <van-tag :type="currentQuestion?.difficulty > 0.7 ? 'danger' : 'success'">
            {{ currentQuestion?.difficulty > 0.7 ? '困难' : '简单' }}
          </van-tag>
        </div>
        <div class="question-content"><p>{{ currentQuestion?.content }}</p></div>
        <div class="question-options" v-if="currentQuestion?.question_type === 'choice'">
          <van-radio-group v-model="selectedAnswer" direction="vertical">
            <van-cell-group inset>
              <van-cell v-for="(opt, idx) in options" :key="idx" :title="opt" @click="selectedAnswer = opt">
                <template #right-icon><van-radio :name="opt" /></template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <van-field v-else v-model="selectedAnswer" type="text" placeholder="请输入答案" />
      </div>
      <div class="question-actions">
        <van-button round block @click="prevQuestion" :disabled="currentIndex === 0">上一题</van-button>
        <van-button v-if="currentIndex < totalQuestions - 1" round block type="primary" @click="nextQuestion">下一题</van-button>
        <van-button v-else round block type="danger" @click="submitExam">提交答卷</van-button>
      </div>
    </div>
    <van-loading v-else size="24px" vertical>加载中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { knowledgeApi, examApi } from '../api/services'
import { useUserStore } from '../stores/user'

const router = useRouter()
// route removed
const userStore = useUserStore()
const exam = ref<any>(null)
const questions = ref<any[]>([])
const currentIndex = ref(0)
const answers = ref<Record<string, string>>({})
const selectedAnswer = ref('')
const remainingTime = ref(0)
let timer: any = null

const currentQuestion = computed(() => questions.value[currentIndex.value])
const totalQuestions = computed(() => questions.value.length)

const options = computed(() => {
  if (!currentQuestion.value?.options) return []
  try { return JSON.parse(currentQuestion.value.options) }
  catch { return currentQuestion.value.options?.split(',') || [] }
})

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

async function loadExam() {
  try {
    const grade = userStore.user?.grade || 4
    const res = await knowledgeApi.getRandomQuestions(grade, 10)
    questions.value = res.data.data
    exam.value = { name: '自测诊断', timeLimit: questions.value.length * 3 }
    remainingTime.value = exam.value.timeLimit * 60
    startTimer()
  } catch (err) { console.error('加载考试失败', err) }
}

function startTimer() {
  timer = setInterval(() => {
    if (remainingTime.value > 0) remainingTime.value--
    else submitExam()
  }, 1000)
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = answers.value[questions.value[currentIndex.value]?.id] || ''
  }
}

function nextQuestion() {
  if (currentIndex.value < totalQuestions.value - 1) {
    answers.value[questions.value[currentIndex.value]?.id] = selectedAnswer.value
    currentIndex.value++
    selectedAnswer.value = answers.value[questions.value[currentIndex.value]?.id] || ''
  }
}

async function submitExam() {
  if (timer) clearInterval(timer)
  const attemptId = `attempt_${Date.now()}`
  try {
    const res = await examApi.submit(attemptId, answers.value)
    showToast(`考试完成！得分：${res.data.data.score}`)
    router.push('/')
  } catch (err) { showToast('提交失败') }
}

function handleBack() { if (timer) clearInterval(timer); router.back() }

onMounted(() => { loadExam() })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.exam-detail-page { min-height: 100vh; background: var(--bg-color); padding-top: 60px; }
.content { padding: 16px; }
.progress-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.progress-bar span { font-size: 14px; color: var(--text-secondary); white-space: nowrap; }
.question-card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.question-header { display: flex; gap: 8px; margin-bottom: 16px; }
.question-content { font-size: 16px; line-height: 1.8; margin-bottom: 20px; }
.question-actions { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
.timer { font-size: 14px; color: var(--primary-color); font-weight: bold; }
</style>


