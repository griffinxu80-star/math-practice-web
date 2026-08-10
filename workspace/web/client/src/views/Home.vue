<template>
  <div class="home-page">
    <van-nav-bar
      title="小学数学自测辅导"
      left-arrow
      @click-left="router.push('/login')"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="user-o" @click="showMenu = true" />
      </template>
    </van-nav-bar>
    
    <div class="content">
      <div class="welcome-card">
        <h2>你好，{{ userStore.user?.name || userStore.user?.username }}</h2>
        <p>年级：{{ userStore.user?.grade }}年级</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ userStore.profile?.total_exam_count || 0 }}</span>
            <span class="stat-label">完成考试</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userStore.profile?.current_points || 0 }}</span>
            <span class="stat-label">积分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userStore.profile?.total_score?.toFixed(0) || 0 }}</span>
            <span class="stat-label">总得分</span>
          </div>
        </div>
      </div>
      
      <div class="menu-grid">
        <router-link to="/exam" class="menu-item">
          <div class="menu-icon">📝</div>
          <span class="menu-text">自测诊断</span>
        </router-link>
        <router-link to="/training/diagnosis" class="menu-item">
          <div class="menu-icon">💪</div>
          <span class="menu-text">提升训练</span>
        </router-link>
        <router-link to="/review" class="menu-item">
          <div class="menu-icon">📚</div>
          <span class="menu-text">学期复习</span>
        </router-link>
        <router-link to="/preview" class="menu-item">
          <div class="menu-icon">🚀</div>
          <span class="menu-text">新学期预习</span>
        </router-link>
        <router-link to="/weekly" class="menu-item">
          <div class="menu-icon">📅</div>
          <span class="menu-text">周自测</span>
        </router-link>
        <router-link to="/points" class="menu-item">
          <div class="menu-icon">⭐</div>
          <span class="menu-text">我的积分</span>
        </router-link>
        <router-link to="/achievements" class="menu-item">
          <div class="menu-icon">🏆</div>
          <span class="menu-text">成就徽章</span>
        </router-link>
        <router-link to="/games" class="menu-item">
          <div class="menu-icon">🎮</div>
          <span class="menu-text">闯关游戏</span>
        </router-link>
        <router-link to="/shop" class="menu-item">
          <div class="menu-icon">🛒</div>
          <span class="menu-text">积分商城</span>
        </router-link>
        <router-link to="/wrong-questions" class="menu-item">
          <div class="menu-icon">📖</div>
          <span class="menu-text">错题本</span>
        </router-link>
        <router-link to="/knowledge" class="menu-item">
          <div class="menu-icon">🗂</div>
          <span class="menu-text">知识点</span>
        </router-link>
      </div>
    </div>
    
    <van-popup v-model:show="showMenu" position="right" style="width: 70%; height: 100%">
      <div class="menu-sidebar">
        <van-nav-bar title="菜单" left-arrow @click-left="showMenu = false" />
        <div class="menu-list">
          <router-link to="/profile" class="menu-list-item" @click="showMenu = false">
            <van-icon name="user-o" />
            <span>个人中心</span>
          </router-link>
          <router-link v-if="userStore.isParent" to="/parent" class="menu-list-item" @click="showMenu = false">
            <van-icon name="orders-o" />
            <span>家长中心</span>
          </router-link>
          <router-link to="/privacy" class="menu-list-item" @click="showMenu = false">
            <van-icon name="balance-o" />
            <span>隐私协议</span>
          </router-link>
          <div class="menu-list-item" @click="handleLogout">
            <van-icon name="sign-out" />
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const showMenu = ref(false)

function handleLogout() {
  userStore.clearAuth()
  showToast('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-color);
}

.content {
  padding: 16px;
  padding-top: 80px;
}

.welcome-card {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  margin-bottom: 20px;
}

.welcome-card h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.welcome-card p {
  opacity: 0.9;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.menu-item {
  background: white;
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s;
}

.menu-item:active {
  transform: scale(0.95);
}

.menu-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.menu-text {
  font-size: 13px;
}

.menu-sidebar {
  height: 100%;
  background: white;
}

.menu-list {
  padding: 16px;
}

.menu-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
}

.menu-list-item:active {
  background: var(--bg-color);
}

.menu-list-item .van-icon {
  font-size: 20px;
  color: var(--primary-color);
}
</style>
