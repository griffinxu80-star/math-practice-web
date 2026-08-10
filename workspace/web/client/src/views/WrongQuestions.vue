<template>
  <div class="wrong-questions-page">
    <van-nav-bar title="错题本" left-arrow @click-left="router.back()" fixed placeholder>
      <template #right>
        <van-button size="small" @click="showFiltered = !showFiltered">
          {{ showFiltered ? '全部' : '未掌握' }}
        </van-button>
      </template>
    </van-nav-bar>
    
    <div class="content">
      <van-empty v-if="questions.length === 0" description="暂无错题" />
      
      <van-cell
        v-for="q in questions"
        :key="q.id"
        :title="q.content"
        :label="`知识点：${q.knowledge_point_name}`"
      >
        <template #right-icon>
          <van-tag :type="q.mastered ? 'success' : 'danger'">
            {{ q.mastered ? '已掌握' : '未掌握' }}
          </van-tag>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { wrongQuestionApi } from '../api/services'

const router = useRouter()
const questions = ref<any[]>([])
const showFiltered = ref(false)

// filteredQuestions

onMounted(async () => {
  try {
    const res = await wrongQuestionApi.getList(false)
    questions.value = res.data.data
  } catch (err) {
    console.error('加载错题失败', err)
  }
})
</script>

<style scoped>
.wrong-questions-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}
</style>


