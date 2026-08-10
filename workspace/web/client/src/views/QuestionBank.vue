<template>
  <div class="question-bank-page">
    <van-nav-bar title="题库管理" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-cell-group inset>
        <van-cell title="添加题目" description="手动录入新的练习题" is-link @click="showAddDialog = true" />
        <van-cell title="导入题库" description="批量导入题目数据" is-link />
        <van-cell title="知识点管理" description="管理知识点和章节" is-link to="/knowledge" />
      </van-cell-group>
      
      <div style="margin-top: 16px;">
        <van-search v-model="searchText" placeholder="搜索题目" @search="handleSearch" />
      </div>
      
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell
          v-for="q in questions"
          :key="q.id"
          :title="q.content.substring(0, 50) + '...'"
          :label="q.knowledge_point_name"
        >
          <template #right-icon>
            <van-tag type="primary">{{ q.question_type }}</van-tag>
          </template>
        </van-cell>
      </van-list>
    </div>
    
    <van-dialog v-model:show="showAddDialog" title="添加题目" show-cancel-button>
      <van-field v-model="newQ.content" label="题目内容" placeholder="请输入题目" />
      <van-field v-model="newQ.answer" label="正确答案" placeholder="请输入答案" />
      <van-field v-model="newQ.type" label="题型" placeholder="choice/fill_blank/calculation">
        <template #button>
          <van-button size="small" @click="newQ.type = 'choice'">选择</van-button>
          <van-button size="small" @click="newQ.type = 'fill_blank'">填空</van-button>
        </template>
      </van-field>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { knowledgeApi } from '../api/services'

const router = useRouter()
const searchText = ref('')
const questions = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const showAddDialog = ref(false)
const newQ = ref({ content: '', answer: '', type: 'choice' })

async function onLoad() {
  try {
    const grade = 4
    const res = await knowledgeApi.getRandomQuestions(grade, 20)
    questions.value = [...questions.value, ...res.data.data]
    loading.value = false
    if (questions.value.length >= 50) finished.value = true
  } catch (err) {
    loading.value = false
  }
}

function handleSearch() {
  // search logic
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped>
.question-bank-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
</style>
