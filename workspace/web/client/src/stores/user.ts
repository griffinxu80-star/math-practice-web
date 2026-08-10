import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  role: 'student' | 'parent'
  grade?: number
  name?: string
}

export interface StudentProfile {
  id: string
  grade: number
  school?: string
  class_name?: string
  total_score: number
  total_exam_count: number
  current_points: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const profile = ref<StudentProfile | null>(JSON.parse(localStorage.getItem('profile') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isStudent = computed(() => user.value?.role === 'student')
  const isParent = computed(() => user.value?.role === 'parent')

  function setAuth(data: { token: string; user: User; profile?: StudentProfile }) {
    token.value = data.token
    user.value = data.user
    profile.value = data.profile || null
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.profile) {
      localStorage.setItem('profile', JSON.stringify(data.profile))
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    profile.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
  }

  return { token, user, profile, isLoggedIn, isStudent, isParent, setAuth, clearAuth }
})
