<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      if (!res.ok) {
        userStore.clearAuth()
      }
    } catch {
      userStore.clearAuth()
    }
  }
})
</script>

<style>
:root {
  --primary-color: #2F5496;
  --primary-light: #597EC7;
  --primary-dark: #1D3A70;
  --success-color: #52C41A;
  --warning-color: #FAAD14;
  --error-color: #FF4D4F;
  --bg-color: #F5F7FA;
  --text-color: #333333;
  --text-secondary: #666666;
  --border-color: #E8E8E8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
