<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>注册账号</h1>
        <p>欢迎来到小学数学自测辅导</p>
      </div>
      <van-form @submit="handleRegister">
        <van-cell-group inset>
          <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请输入用户名' }]" />
          <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请输入密码' }, { validator: (v) => v.length >= 6, message: '密码至少6位' }]" />
          <van-field v-model="confirmPassword" type="password" name="confirmPassword" label="确认密码" placeholder="请再次输入密码" :rules="[{ validator: validateConfirmPassword, message: '两次密码不一致' }]" />
          <van-field v-model="name" name="name" label="姓名" placeholder="请输入姓名" />
          <van-field is-link readonly name="role" label="角色" :value="role === 'student' ? '学生' : '家长'" @click="role = role === 'student' ? 'parent' : 'student'" />
          <van-field is-link readonly name="grade" label="年级" :value="grade?.toString() + '年级'" @click="showGradePicker = true" />
        </van-cell-group>
        <div class="register-actions">
          <van-button round block type="primary" native-type="submit" :loading="loading">注册</van-button>
          <div class="register-footer">
            <span>已有账号？</span>
            <router-link to="/login">立即登录</router-link>
          </div>
        </div>
      </van-form>
      <van-popup v-model:show="showGradePicker" position="bottom">
        <van-picker :columns="gradeColumns" @confirm="onGradeConfirm" @cancel="showGradePicker = false" />
      </van-popup>
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
const confirmPassword = ref('')
const name = ref('')
const role = ref<'student' | 'parent'>('student')
const grade = ref<4 | 5 | 6 | null>(null)
const loading = ref(false)
const showGradePicker = ref(false)

const gradeColumns = [
  { text: '4年级', value: 4 },
  { text: '5年级', value: 5 },
  { text: '6年级', value: 6 }
]

function validateConfirmPassword(val: string) { return val === password.value }

function onGradeConfirm(value: any) { grade.value = value.value; showGradePicker.value = false }

async function handleRegister() {
  if (!username.value || !password.value || !grade.value) { showToast('请填写完整信息'); return }
  if (password.value !== confirmPassword.value) { showToast('两次密码不一致'); return }
  loading.value = true
  try {
    const res = await authApi.register({ username: username.value, password: password.value, role: role.value, grade: grade.value, name: name.value })
    userStore.setAuth(res.data.data)
    showToast('注册成功')
    router.push('/')
  } catch (err: any) { showToast(err.response?.data?.message || '注册失败') }
  finally { loading.value = false }
}
</script>

<style scoped>
.register-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%); padding: 20px; }
.register-container { background: white; border-radius: 16px; padding: 40px 30px; width: 100%; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
.register-header { text-align: center; margin-bottom: 30px; }
.register-header h1 { font-size: 24px; color: var(--primary-color); margin-bottom: 8px; }
.register-header p { color: var(--text-secondary); font-size: 14px; }
.register-actions { margin-top: 30px; }
.register-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }
.register-footer a { color: var(--primary-color); text-decoration: none; margin-left: 8px; }
</style>
