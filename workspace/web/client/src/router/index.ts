import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { requiresAuth: false } },
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
  { path: '/exam', name: 'Exam', component: () => import('../views/Exam.vue'), meta: { requiresAuth: true } },
  { path: '/exam/:examId', name: 'ExamDetail', component: () => import('../views/ExamDetail.vue'), meta: { requiresAuth: true } },
  { path: '/training', name: 'Training', component: () => import('../views/Training.vue'), meta: { requiresAuth: true } },
  { path: '/training/:type', name: 'TrainingType', component: () => import('../views/TrainingType.vue'), meta: { requiresAuth: true } },
  { path: '/review', name: 'Review', component: () => import('../views/Review.vue'), meta: { requiresAuth: true } },
  { path: '/preview', name: 'Preview', component: () => import('../views/Preview.vue'), meta: { requiresAuth: true } },
  { path: '/weekly', name: 'Weekly', component: () => import('../views/Weekly.vue'), meta: { requiresAuth: true } },
  { path: '/points', name: 'Points', component: () => import('../views/Points.vue'), meta: { requiresAuth: true } },
  { path: '/achievements', name: 'Achievements', component: () => import('../views/Achievements.vue'), meta: { requiresAuth: true } },
  { path: '/games', name: 'Games', component: () => import('../views/Games.vue'), meta: { requiresAuth: true } },
  { path: '/shop', name: 'Shop', component: () => import('../views/Shop.vue'), meta: { requiresAuth: true } },
  { path: '/wrong-questions', name: 'WrongQuestions', component: () => import('../views/WrongQuestions.vue'), meta: { requiresAuth: true } },
  { path: '/parent', name: 'Parent', component: () => import('../views/parent/ParentDashboard.vue'), meta: { requiresAuth: true, roles: ['parent'] } },
  { path: '/parent/children', name: 'ParentChildren', component: () => import('../views/parent/ChildrenList.vue'), meta: { requiresAuth: true, roles: ['parent'] } },
  { path: '/parent/report/:childId', name: 'ParentReport', component: () => import('../views/parent/Report.vue'), meta: { requiresAuth: true, roles: ['parent'] } },
  { path: '/parent/goals', name: 'ParentGoals', component: () => import('../views/parent/Goals.vue'), meta: { requiresAuth: true, roles: ['parent'] } },
  { path: '/knowledge', name: 'Knowledge', component: () => import('../views/Knowledge.vue'), meta: { requiresAuth: true } },
  { path: '/question-bank', name: 'QuestionBank', component: () => import('../views/QuestionBank.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/privacy', name: 'Privacy', component: () => import('../views/Privacy.vue'), meta: { requiresAuth: false } },
  { path: '/guardian-consent', name: 'GuardianConsent', component: () => import('../views/GuardianConsent.vue'), meta: { requiresAuth: false } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to: any, _from: any, next: any) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.roles && userStore.user && !(to.meta.roles as string[]).includes(userStore.user.role)) {
    next('/')
  } else {
    next()
  }
})

export default router
