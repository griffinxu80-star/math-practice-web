<template>
  <div class="knowledge-page">
    <van-nav-bar title="知识点" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-picker
        v-model="selectedGrade"
        :columns="gradeColumns"
        @confirm="onGradeConfirm"
        @cancel="showGradePicker = false"
      >
        <template #trigger>
          <div class="grade-selector">
            <span>选择年级：{{ gradeColumns[selectedGrade[0]]?.text || '4年级' }}</span>
            <van-icon name="arrow-down" />
          </div>
        </template>
      </van-picker>
      <van-collapse v-model="activeNames" v-if="treeData[selectedGrade[0]]">
        <van-collapse-item
          v-for="(units, chapter) in treeData[selectedGrade[0]]"
          :key="chapter"
          :title="chapter"
          :name="chapter"
        >
          <van-cell
            v-for="unit in units"
            :key="unit.id"
            :title="unit.name"
            is-link
            @click="showQuestions(unit)"
          />
        </van-collapse-item>
      </van-collapse>
      <van-empty v-else description="请选择年级" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { knowledgeApi } from '../api/services'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const selectedGrade = ref([0])
const showGradePicker = ref(false)
const treeData = ref<Record<number, any>>({})
const activeNames = ref<string[]>([])

const gradeColumns = [
  { text: '4年级', value: 0 },
  { text: '5年级', value: 1 },
  { text: '6年级', value: 2 }
]

async function onGradeConfirm({ selectedOptions }: any) {
  const idx = selectedOptions[0].value
  selectedGrade.value = [idx]
  try {
    const grade = idx + 4
    const res = await knowledgeApi.getTree(grade)
    treeData.value[idx] = res.data.data
    activeNames.value = Object.keys(res.data.data)
  } catch (err) { console.error('加载知识点失败', err) }
}

function showQuestions(unit: any) {
  router.push(`/question-bank?knowledge_point_id=${unit.id}`)
}

onMounted(() => {
  const grade = userStore.user?.grade || 4
  selectedGrade.value = [grade - 4]
  onGradeConfirm({ selectedOptions: [gradeColumns[grade - 4]] })
})
</script>

<style scoped>
.knowledge-page { min-height: 100vh; background: var(--bg-color); padding-top: 60px; }
.content { padding: 16px; }
.grade-selector { background: white; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
</style>
