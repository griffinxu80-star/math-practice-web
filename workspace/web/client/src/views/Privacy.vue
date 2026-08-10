<template>
  <div class="privacy-page">
    <van-nav-bar title="隐私协议" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="content">
      <div class="privacy-content">
        <h1>隐私协议</h1>
        <h2>一、信息收集</h2>
        <p>我们仅收集必要的学习数据，包括：</p>
        <ul>
          <li>账号信息（用户名、年级）</li>
          <li>学习记录（考试分数、错题记录）</li>
          <li>进度数据（知识点掌握度）</li>
        </ul>
        
        <h2>二、信息使用</h2>
        <p>收集的信息仅用于：</p>
        <ul>
          <li>提供个性化学习服务</li>
          <li>生成学习报告</li>
          <li>改进教学质量</li>
        </ul>
        
        <h2>三、信息保护</h2>
        <p>我们采取加密措施保护您的数据安全，不会向第三方透露您的个人信息。</p>
        
        <h2>四、未成年人保护</h2>
        <p>本产品面向4-6年级学生，我们严格遵守未成年人个人信息保护相关规定。</p>
        <p>家长可通过家长端查看孩子的学习进度和报告。</p>
        
        <h2>五、联系方式</h2>
        <p>如有疑问，请联系我们的客服团队。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-top: 60px;
}

.content {
  padding: 20px;
  background: white;
}

.privacy-content h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.privacy-content h2 {
  font-size: 18px;
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--text-color);
}

.privacy-content p, .privacy-content ul {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.privacy-content ul {
  padding-left: 20px;
  margin-bottom: 16px;
}
</style>
