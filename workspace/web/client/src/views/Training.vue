<template>
  <div class="training-page">
    <van-nav-bar
      :title="trainingType === 'diagnosis' ? '薄弱点训练' : trainingType === 'daily' ? '每日一题' : '提升训练'"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
    />
    
    <div class="content">
      <div class="training-info">
        <van-cell-group inset>
          <van-cell title="知识点" :value="knowledgePoint" />
          <van-cell title="题目数量" :value="`${questionCount}题`" />
          <van-cell title="预计用时" :value="`${estimatedTime}分钟`" />
        </van-cell-group>
      </div>
      
      <div class="question-area" v-if="currentQuestion">
        <div class="question-header">
          <van-tag type="primary">{{ currentQuestion.knowledge_point_name }}</van-tag>
        </div>
        
        <div class="question-content">
          <p>{{ currentQuestion.content }}</p>
        </div>
        
        <van-radio-group v-if="currentQuestion.question_type === 'choice'" v-model="selectedAnswer" direction="vertical">
          <van-cell-group inset>
            <van-cell
              v-for="(opt, idx) in options"
              :key="idx"
              :title="opt"
              @click="selectedAnswer = opt"
            >
              <template #right-icon>
                <van-radio name="" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        
        <van-field
          v-else
          v-model="selectedAnswer"
          type="text"
          placeholder="请输入答案"
        />
        
        <div class="feedback" v-if="feedback">
          <van-notice-bar
            :color="feedback.isCorrect ? 'white' : '#ffffff'"
            :background="feedback.isCorrect ? 'var(--success-color)' : 'var(--error-color)'"
            :text="feedback.isCorrect ? '回答正确！' : '回答错误，正确答案是：' + currentQuestion.correct_answer"
          />
        </div>
        
        <div class="action-buttons">
          <van-button
            v-if="!feedback"
            round
            block
            type="primary"
            @click="checkAnswer"
          >
            提交答案
          </van-button>
          <van-button
            v-else
            round
            block
            @click="nextQuestion"
          >
            下一题
          </van-button>
        </div>
      </div>
      
      <van-empty v-else description="加载中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { knowledgeApi, masteryApi } from '../api/services'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const trainingType = computed(() => route.params.type as string)
const knowledgePoint = ref('')
const questionCount = ref(10)
const currentQuestion = ref<any>(null)
const selectedAnswer = ref('')
const feedback = ref<{ isCorrect: boolean } | null>(null)
const currentScore = ref(0)

// questionCountDisplay
const estimatedTime = computed(() => questionCount.value * 2)

const options = computed(() => {
  if (!currentQuestion.value?.options) return []
  try {
    return JSON.parse(currentQuestion.value.options)
  } catch {
    return currentQuestion.value.options.split(',')
  }
})

async function loadQuestion() {
  const grade = userStore.user?.grade || 4
  try {
    const res = await knowledgeApi.getRandomQuestions(grade, 1)
    if (res.data.data.length > 0) {
      currentQuestion.value = res.data.data[0]
      knowledgePoint.value = currentQuestion.value.knowledge_point_name || '通用练习'
      selectedAnswer.value = ''
      feedback.value = null
    }
  } catch (err) {
    console.error('加载题目失败', err)
  }
}

function checkAnswer() {
  if (!selectedAnswer.value.trim()) {
    return
  }
  
  const isCorrect = selectedAnswer.value.trim() === currentQuestion.value.correct_answer.trim()
  feedback.value = { isCorrect }
  
  if (isCorrect) {
    currentScore.value += 10
    masteryApi.update({ knowledgePointId: currentQuestion.value.knowledge_point_id, isCorrect: true })
  } else {
    masteryApi.update({ knowledgePointId: currentQuestion.value.knowledge_point_id, isCorrect: false })
  }
}

function nextQuestion() {
  questionCount.value--
  if (questionCount.value > 0) {
    loadQuestion()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  loadQuestion()
})
</script>

<style scoped>
.training-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}

.training-info {
  margin-bottom: 16px;
}

.question-area {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.question-header {
  margin-bottom: 16px;
}

.question-content {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.feedback {
  margin-top: 16px;
}

.action-buttons {
  margin-top: 20px;
}
</style>

