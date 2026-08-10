<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>小学数学自测辅导</h1>
        <p>网页版</p>
      </div>
      
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
        
        <div class="login-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
          <div class="login-footer">
            <span>还没有账号？</span>
            <router-link to="/register">立即注册</router-link>
          </div>
          <div class="login-footer">
            <router-link to="/privacy">隐私协议</router-link>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '../stores/user'
import { authApi } from '../api/services'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    showToast('请填写完整信息')
    return
  }
  
  loading.value = true
  try {
    const res = await authApi.login(username.value, password.value)
    userStore.setAuth(res.data.data)
    showToast('登录成功')
    router.push('/')
  } catch (err: any) {
    showToast(err.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-actions {
  margin-top: 30px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: 8px;
}
</style>
