<template>
  <div class="review-page">
    <van-nav-bar title="学期复习" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(units, chapter) in chapterData"
          :key="chapter"
          :title="chapter"
          :name="chapter"
        >
          <van-cell
            v-for="unit in units"
            :key="unit.id"
            :title="unit.name"
            :label="`掌握度: ${(unit.mastery * 100).toFixed(0)}%`"
            is-link
            @click="startReview(unit)"
          >
            <template #right-icon>
              <van-progress :percentage="unit.mastery * 100" stroke-width="4" />
            </template>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { knowledgeApi, masteryApi } from '../api/services'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeNames = ref<string[]>([])
const chapterData = ref<Record<string, any[]>>({})

async function loadReviewData() {
  const grade = userStore.user?.grade || 4
  try {
    const res = await knowledgeApi.getTree(grade)
    const masteryRes = await masteryApi.getWeakPoints()
    
    // Build mastery map
    const masteryMap = new Map()
    for (const m of masteryRes.data.data) {
      masteryMap.set(m.knowledge_point_id, m.mastery)
    }
    
    const tree = res.data.data
    const data: Record<string, any[]> = {}
    
    for (const chapter of Object.keys(tree)) {
      for (const unit of tree[chapter]) {
        const mastery = masteryMap.get(unit.id) || 0
        if (!data[chapter]) data[chapter] = []
        data[chapter].push({ ...unit, mastery })
      }
    }
    
    chapterData.value = data
    activeNames.value = Object.keys(data)
  } catch (err) {
    console.error('加载复习数据失败', err)
  }
}

function startReview(unit: any) {
  router.push(`/training?knowledge_point_id=${unit.id}`)
}

onMounted(() => {
  loadReviewData()
})
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
</style>
