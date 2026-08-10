const fs = require('fs');
const path = require('path');
const root = 'E:/360MoveData/Users/admin/Documents/小学数学自测及辅导/standalone';
const jsDir = path.join(root, 'js');

// app.js - 应用逻辑
const appJs = `// 应用状态管理
const App = {
  currentUser: null,
  currentAttempt: null,
  timer: null,
  
  init() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.updateNav();
    }
  },
  
  login(username, password) {
    const user = DB.getUser(username);
    if (!user) return { success: false, message: '用户名不存在' };
    if (password !== user.password) return { success: false, message: '密码错误' };
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.updateNav();
    return { success: true };
  },
  
  register(username, password, role, grade, name) {
    if (DB.getUser(username)) return { success: false, message: '用户名已存在' };
    const id = 'user_' + Date.now();
    const user = { id, username, password, role, grade, name: name || username, createdAt: Date.now() };
    DB.addUser(user);
    if (role === 'student') {
      const profile = { id: 'profile_' + Date.now(), userId: id, grade, totalScore: 0, totalExamCount: 0, currentPoints: 0, createdAt: Date.now() };
      DB.addProfile(profile);
    }
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.updateNav();
    return { success: true };
  },
  
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    if (this.timer) clearInterval(this.timer);
    this.updateNav();
    navigateTo('login');
  },
  
  isLoggedIn() { return !!this.currentUser; },
  isStudent() { return this.currentUser?.role === 'student'; },
  isParent() { return this.currentUser?.role === 'parent'; },
  
  getProfile() { return DB.getProfile(this.currentUser?.id); },
  getPoints() { return DB.getPoints(this.currentUser?.id); },
  
  updateNav() {
    const el = document.getElementById('nav-user');
    if (!el) return;
    if (this.isLoggedIn()) {
      const name = this.currentUser.name || this.currentUser.username;
      el.innerHTML = '<span class="nav-name">' + name + '</span><button class="btn-logout" onclick="App.logout()">退出</button>';
    } else {
      el.innerHTML = '<button class="btn-login" onclick="navigateTo(\'login\')">登录</button>';
    }
  },
  
  startExam(grade) {
    const questions = DB.getQuestions({ grade: grade || this.currentUser.grade, limit: 10 });
    if (questions.length === 0) return null;
    const attempt = {
      id: 'attempt_' + Date.now(),
      examId: 'diagnosis',
      userId: this.currentUser.id,
      grade: grade || this.currentUser.grade,
      questions: questions.map(q => ({ id: q.id, content: q.content, type: q.type, options: q.options, correctAnswer: q.correctAnswer, knowledgePointId: q.knowledgePointId, difficulty: q.difficulty })),
      answers: {},
      startedAt: Date.now(),
      status: 'in_progress'
    };
    DB.saveAttempt(attempt);
    this.currentAttempt = attempt;
    return attempt;
  },
  
  submitAnswer(questionId, answer) {
    if (!this.currentAttempt) return;
    this.currentAttempt.answers[questionId] = answer;
  },
  
  submitExam() {
    if (!this.currentAttempt) return null;
    const attempt = this.currentAttempt;
    let score = 0;
    const perQ = 100 / attempt.questions.length;
    for (const q of attempt.questions) {
      const correct = attempt.answers[q.id]?.trim() === q.correctAnswer.trim();
      if (correct) score += perQ;
      if (!correct) {
        DB.addWrongQuestion({ id: 'wq_' + Date.now() + Math.random(), userId: attempt.userId, questionId: q.id, wrongAnswer: attempt.answers[q.id], correctAnswer: q.correctAnswer, knowledgePointId: q.knowledgePointId, attemptedAt: Date.now(), mastered: 0 });
      }
      DB.updateMastery(attempt.userId, q.knowledgePointId, correct);
    }
    score = Math.round(score * 100) / 100;
    attempt.answers = { ...attempt.answers };
    attempt.score = score;
    attempt.status = 'submitted';
    attempt.submittedAt = Date.now();
    DB.updateAttempt(attempt.id, attempt);
    DB.addTransaction({ id: 'tx_' + Date.now(), userId: attempt.userId, amount: Math.floor(score), type: 'earn', source: 'exam', sourceId: attempt.id, createdAt: Date.now() });
    const profile = DB.getProfile(attempt.userId);
    if (profile) { profile.totalScore = (profile.totalScore || 0) + score; profile.totalExamCount = (profile.totalExamCount || 0) + 1; DB.updateProfile(attempt.userId, profile); }
    this.currentAttempt = null;
    if (this.timer) clearInterval(this.timer);
    return { score, totalScore: 100, questions: attempt.questions, answers: attempt.answers };
  },
  
  getExamHistory() { return DB.getAttempts(this.currentUser?.id); },
  getKnowledgeTree(grade) { return DB.buildKnowledgeTree(grade || this.currentUser?.grade); },
  buyItem(itemId) {
    const item = DB.getShopItems().find(i => i.id === itemId);
    if (!item) return { success: false, message: '商品不存在' };
    if (DB.getPoints(this.currentUser.id) < item.cost) return { success: false, message: '积分不足' };
    DB.redeemItem(item, 1, this.currentUser.id);
    return { success: true, message: '兑换成功' };
  },
  getShopItems() { return DB.getShopItems(); },
  getWrongQuestions(mastered) { return DB.getWrongQuestions(this.currentUser?.id, mastered); },
  markWrongMastered(id) { DB.markWrongMastered(id); },
  getTransactionHistory(limit) { return DB.getTransactionHistory(this.currentUser?.id, limit); },
  getMasteryRate(kpId) { return DB.getMasteryRate(this.currentUser?.id, kpId); }
};
`;

fs.writeFileSync(path.join(jsDir, 'app.js'), appJs, 'utf8');
console.log('app.js written');
