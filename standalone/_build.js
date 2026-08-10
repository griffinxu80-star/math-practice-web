const fs = require('fs');
const path = require('path');
const root = 'E:/360MoveData/Users/admin/Documents/小学数学自测及辅导/standalone';
const jsDir = path.join(root, 'js');
fs.mkdirSync(jsDir, { recursive: true });
console.log('Directories ready');

// Write store.js
const storeJs = `const DB = {
  _get(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e) { return null; } },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  _getArr(key) { return this._get(key) || []; },
  _setArr(key, arr) { this._set(key, arr); },
  getUser(username) { const u = this._getArr('users').find(u => u.username === username); return u || null; },
  addUser(user) { const users = this._getArr('users'); users.push(user); this._setArr('users', users); return user; },
  updateUser(id, data) { const users = this._getArr('users'); const u = users.find(x => x.id === id); if (u) Object.assign(u, data); this._setArr('users', users); },
  getProfile(userId) { return this._getArr('profiles').find(p => p.userId === userId) || null; },
  addProfile(profile) { const profiles = this._getArr('profiles'); profiles.push(profile); this._setArr('profiles', profiles); return profile; },
  updateProfile(userId, data) { const profiles = this._getArr('profiles'); const p = profiles.find(x => x.userId === userId); if (p) Object.assign(p, data); this._setArr('profiles', profiles); },
  getAttempt(attemptId) { return this._getArr('attempts').find(a => a.id === attemptId) || null; },
  saveAttempt(attempt) { const attempts = this._getArr('attempts'); attempts.push(attempt); this._setArr('attempts', attempts); },
  updateAttempt(id, data) { const attempts = this._getArr('attempts'); const a = attempts.find(x => x.id === id); if (a) Object.assign(a, data); this._setArr('attempts', attempts); },
  getAttempts(userId) { return this._getArr('attempts').filter(a => a.userId === userId).sort((a, b) => b.startedAt - a.startedAt); },
  getQuestion(qId) { return this._getArr('questions').find(q => q.id === qId) || null; },
  saveQuestion(q) { const qs = this._getArr('questions'); qs.push(q); this._setArr('questions', qs); },
  getQuestions(filters) { filters = filters || {}; let qs = this._getArr('questions'); if (filters.knowledgePointId) qs = qs.filter(q => q.knowledgePointId === filters.knowledgePointId); if (filters.grade !== undefined) qs = qs.filter(q => q.grade === filters.grade); if (filters.type) qs = qs.filter(q => q.type === filters.type); if (filters.limit) qs = qs.slice(0, filters.limit); return qs; },
  getKnowledgePoint(kpId) { return this._getArr('knowledgePoints').find(k => k.id === kpId) || null; },
  getKnowledgePoints(filters) { filters = filters || {}; let kps = this._getArr('knowledgePoints'); if (filters.grade !== undefined) kps = kps.filter(k => k.grade === filters.grade); return kps; },
  buildKnowledgeTree(grade) { const kps = this.getKnowledgePoints({grade}); const tree = {}; for (const kp of kps) { const ch = kp.chapter || '其他'; if (!tree[ch]) tree[ch] = []; tree[ch].push(kp); } return tree; },
  getWrongQuestions(userId, mastered) { let wqs = this._getArr('wrongQuestions').filter(w => w.userId === userId); if (mastered !== null && mastered !== undefined) wqs = wqs.filter(w => w.mastered === mastered); return wqs.sort((a, b) => b.attemptedAt - a.attemptedAt); },
  addWrongQuestion(wq) { const exists = this._getArr('wrongQuestions').find(w => w.userId === wq.userId && w.questionId === wq.questionId && !w.mastered); if (exists) return null; const wqs = this._getArr('wrongQuestions'); wqs.push(wq); this._setArr('wrongQuestions', wqs); return wq; },
  markWrongMastered(id) { const wqs = this._getArr('wrongQuestions'); const w = wqs.find(x => x.id === id); if (w) w.mastered = 1; this._setArr('wrongQuestions', wqs); },
  getPoints(userId) { const txs = this._getArr('transactions').filter(t => t.userId === userId); return txs.reduce((sum, t) => sum + (t.type === 'earn' ? t.amount : -t.amount), 0); },
  addTransaction(tx) { const txs = this._getArr('transactions'); txs.push(tx); this._setArr('transactions', txs); },
  getTransactionHistory(userId, limit) { limit = limit || 50; return this._getArr('transactions').filter(t => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt).slice(0, limit); },
  getShopItems() { return this._getArr('shopItems'); },
  getRedemptions(userId) { return this._getArr('redemptions').filter(r => r.userId === userId); },
  redeemItem(item, quantity, userId) { const redemptions = this._getArr('redemptions'); redemptions.push({id:'red_'+Date.now(), userId, itemId:item.id, quantity, totalCost:item.cost*quantity, status:'redeemed', redeemedAt:Date.now()}); this._setArr('redemptions', redemptions); const txs = this._getArr('transactions'); txs.push({id:'tx_'+Date.now(), userId, amount:-(item.cost*quantity), type:'spend', source:'shop', sourceId:item.id, createdAt:Date.now()}); this._setArr('transactions', txs); return {success:true}; },
  getMastery(userId, kpId) { return this._getArr('mastery').find(m => m.userId === userId && m.knowledgePointId === kpId) || null; },
  updateMastery(userId, kpId, isCorrect) { const mastery = this._getArr('mastery'); let m = mastery.find(x => x.userId === userId && x.knowledgePointId === kpId); if (!m) { m = {id:'m_'+Date.now(), userId, knowledgePointId:kpId, alpha:1, beta:1, attemptCount:0, lastAttempt:Date.now()}; mastery.push(m); } if (isCorrect) m.alpha++; else m.beta++; m.attemptCount++; m.lastAttempt = Date.now(); this._setArr('mastery', mastery); return m; },
  getMasteryRate(userId, kpId) { const m = this.getMastery(userId, kpId); if (!m) return 0; return m.alpha / (m.alpha + m.beta); }
};
`;
fs.writeFileSync(path.join(jsDir, 'store.js'), storeJs, 'utf8');
console.log('store.js written');
