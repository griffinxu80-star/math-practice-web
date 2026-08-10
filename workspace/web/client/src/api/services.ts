import api from './index'

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (data: { username: string; password: string; role: string; grade: number; name?: string }) =>
    api.post('/auth/register', data),
  getMe: () =>
    api.get('/auth/me'),
  updateProfile: (data: { name?: string; avatar_url?: string }) =>
    api.put('/auth/profile', data)
}

export const examApi = {
  start: (examId: string) =>
    api.post('/exam/start', { examId }),
  submit: (attemptId: string, answers: Record<string, string>) =>
    api.post('/exam/submit', { attemptId, answers }),
  getAttempt: (attemptId: string) =>
    api.get(`/exam/${attemptId}`),
  getHistory: () =>
    api.get('/exam/history')
}

export const knowledgeApi = {
  getTree: (grade?: number) =>
    api.get('/knowledge/tree', { params: { grade } }),
  getById: (id: string) =>
    api.get(`/knowledge/${id}`),
  getQuestions: (params: any) =>
    api.get('/knowledge/questions', { params }),
  getRandomQuestions: (grade: number, count: number) =>
    api.get(`/knowledge/training/${grade}`, { params: { count } }),
  getGeometryQuestions: (grade: number) =>
    api.get(`/knowledge/geometry/${grade}`)
}

export const masteryApi = {
  getWeakPoints: (threshold?: number) =>
    api.get('/mastery/weak', { params: { threshold } }),
  getImprovedPoints: () =>
    api.get('/mastery/improved'),
  update: (data: { knowledgePointId: string; isCorrect: boolean }) =>
    api.post('/mastery/update', data)
}

export const pointsApi = {
  getBalance: () =>
    api.get('/points/balance'),
  getHistory: (limit = 50) =>
    api.get('/points/history', { params: { limit } }),
  earn: (amount: number, source: string, sourceId?: string) =>
    api.post('/points/earn', { amount, source, sourceId }),
  spend: (amount: number, source: string, sourceId: string) =>
    api.post('/points/spend', { amount, source, sourceId })
}

export const shopApi = {
  getItems: () =>
    api.get('/shop/items'),
  getItem: (id: string) =>
    api.get(`/shop/items/${id}`),
  redeem: (itemId: string, quantity = 1) =>
    api.post('/shop/redeem', { itemId, quantity }),
  getRedemptions: () =>
    api.get('/shop/redemptions')
}

export const wrongQuestionApi = {
  getList: (mastered?: boolean) =>
    api.get('/wrong-questions', { params: { mastered } }),
  markMastered: (id: string) =>
    api.post(`/wrong-questions/mark-mastered/${id}`),
  add: (data: any) =>
    api.post('/wrong-questions/add', data)
}

export const parentApi = {
  getChildren: () =>
    api.get('/parent/children'),
  bindChild: (childId: string) =>
    api.post('/parent/bind', { childId }),
  unbindChild: (childId: string) =>
    api.delete(`/parent/unbind/${childId}`),
  getChildReport: (childId: string) =>
    api.get(`/parent/report/${childId}`),
  getChildWrongQuestions: (childId: string) =>
    api.get(`/parent/wrong-questions/${childId}`),
  getGoals: () =>
    api.get('/parent/goals'),
  createGoal: (data: any) =>
    api.post('/parent/goals', data),
  updateGoalStatus: (id: string, status: string) =>
    api.put(`/parent/goals/${id}/status`, { status })
}

export const gamificationApi = {
  getAchievements: () =>
    api.get('/gamification'),
  unlockAchievement: (achievementId: string) =>
    api.post('/gamification/unlock', { achievementId }),
  checkAchievements: (stats: any) =>
    api.post('/gamification/check', stats)
}
