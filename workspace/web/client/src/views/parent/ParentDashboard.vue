<template>
  <div class="parent-dashboard">
    <van-nav-bar title="家长中心" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="content">
      <div class="children-list">
        <h3>我的孩子</h3>
        <van-cell
          v-for="child in children"
          :key="child.id"
          :title="child.name"
          :label="`年级：${child.grade} | 积分：${child.current_points}`"
          is-link
          @click="router.push(`/parent/report/${child.id}`)"
        >
          <template #right-icon>
            <van-button size="mini" @click.stop="unbindChild(child.id)">解绑</van-button>
          </template>
        </van-cell>
        <van-button type="primary" block @click="showBindDialog = true">绑定孩子</van-button>
      </div>
      
      <div class="quick-actions">
        <h3>快捷操作</h3>
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item icon="orders-o" text="学习报告" @click="router.push('/parent/goals')" />
          <van-grid-item icon="label-o" text="学习目标" @click="router.push('/parent/goals')" />
          <van-grid-item icon="label-o" text="错题本" @click="router.push('/wrong-questions')" />
          <van-grid-item icon="balance-o" text="积分记录" @click="router.push('/points')" />
        </van-grid>
      </div>
    </div>
    
    <van-popup v-model:show="showBindDialog" position="bottom">
      <van-picker
        :columns="childrenOptions"
        @confirm="onBindChild"
        @cancel="showBindDialog = false"
        title="选择孩子"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { parentApi } from '../../api/services'

const router = useRouter()
const children = ref<any[]>([])
const showBindDialog = ref(false)
const childrenOptions = ref<any[]>([])

async function loadChildren() {
  try {
    const res = await parentApi.getChildren()
    children.value = res.data.data
    childrenOptions.value = res.data.data.map((c: any) => ({ text: c.name, value: c.id }))
  } catch (err) {
    console.error('加载孩子列表失败', err)
  }
}

async function onBindChild({ selectedOptions }: any) {
  const childId = selectedOptions[0].value
  try {
    await parentApi.bindChild(childId)
    showBindDialog.value = false
    showToast('绑定成功')
    loadChildren()
  } catch (err) {
    showToast('绑定失败')
  }
}

async function unbindChild(childId: string) {
  try {
    await parentApi.unbindChild(childId)
    showToast('已解绑')
    loadChildren()
  } catch (err) {
    showToast('解绑失败')
  }
}

onMounted(() => {
  loadChildren()
})
</script>

<style scoped>
.parent-dashboard {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 16px;
}

.children-list, .quick-actions {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.children-list h3, .quick-actions h3 {
  font-size: 16px;
  margin-bottom: 12px;
}
</style>
