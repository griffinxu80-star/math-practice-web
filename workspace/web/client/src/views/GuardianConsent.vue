<template>
  <div class="guardian-consent-page">
    <div class="consent-container">
      <h1>监护人同意书</h1>
      <p>尊敬的家长/监护人：</p>
      <p>本产品面向4-6年级小学生提供学习辅助服务。为了确保未成年人的网络安全，我们需要您的同意：</p>
      
      <ul>
        <li>我们将收集孩子的学习数据（考试分数、错题记录等）</li>
        <li>数据仅用于提供个性化学习服务</li>
        <li>我们会采取加密措施保护数据安全</li>
        <li>您作为监护人可以随时查看孩子的学习报告</li>
      </ul>
      
      <p>请确认您同意以上条款：</p>
      
      <van-checkbox-group v-model="checked">
        <van-checkbox name="agree">我同意上述条款</van-checkbox>
      </van-checkbox-group>
      
      <van-button
        type="primary"
        block
        :disabled="!checked.includes('agree')"
        @click="handleConsent"
      >
        确认同意
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const checked = ref<string[]>([])

function handleConsent() {
  if (checked.value.includes('agree')) {
    localStorage.setItem('guardianConsent', 'true')
    showToast('感谢同意，请继续登录')
    router.push('/login')
  }
}
</script>

<style scoped>
.guardian-consent-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  padding: 20px;
}

.consent-container {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  max-width: 500px;
  width: 100%;
}

.consent-container h1 {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
}

.consent-container p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.consent-container ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

.consent-container li {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 8px;
}
</style>
