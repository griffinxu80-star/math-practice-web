<template>
  <div class="preview-page">
    <van-nav-bar title="新学期预习" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <van-cell-group inset>
        <van-cell
          title="预习自测"
          description="测试下学期知识点掌握情况"
          is-link
          @click="startPreview"
        />
        <van-cell
          title="知识点预览"
          description="了解下学期将要学习的内容"
          is-link
          @click="showPreviewKp"
        />
      </van-cell-group>
      
      <div class="preview-tip" style="margin-top: 20px; background: white; border-radius: 12px; padding: 16px;">
        <h3>💡 预习建议</h3>
        <p>每天花15-20分钟预习新知识，先尝试做几道题，了解薄弱环节后再系统学习。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

function startPreview() {
  const nextGrade = (userStore.user?.grade || 4) + 1
  if (nextGrade > 6) {
    alert('已经是六年级，没有更高的年级了')
    return
  }
  router.push(`/exam?grade=${nextGrade}&type=preview`)
}

function showPreviewKp() {
  router.push('/knowledge')
}
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}
.content { padding: 16px; }
.preview-tip h3 { font-size: 16px; margin-bottom: 8px; color: var(--primary-color); }
.preview-tip p { font-size: 14px; color: var(--text-secondary); line-height: 1.8; }
</style>
