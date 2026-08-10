// 事件处理函数
function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) { alert('请填写完整信息'); return; }
  const res = App.login(username, password);
  if (res.success) { navigate('home'); }
  else { alert(res.message); }
}

function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const name = document.getElementById('reg-name').value.trim();
  const role = document.getElementById('reg-role').value;
  const grade = parseInt(document.getElementById('reg-grade').value);
  if (!username || !password || !grade) { alert('请填写完整信息'); return; }
  if (password.length < 6) { alert('密码至少6位'); return; }
  const res = App.register(username, password, role, grade, name);
  if (res.success) { navigate('home'); }
  else { alert(res.message); }
}

function handleBuy(itemId) {
  const res = App.buyItem(itemId);
  if (res.success) { alert(res.message); navigate('shop'); }
  else { alert(res.message); }
}

function prevQ() {
  if (App.currentAttempt && App.currentAttempt.currentIndex > 0) {
    App.currentAttempt.currentIndex--;
    renderQuestion();
  }
}

function nextQ() {
  if (App.currentAttempt && App.currentAttempt.currentIndex < App.currentAttempt.questions.length - 1) {
    App.currentAttempt.answers[App.currentAttempt.questions[App.currentAttempt.currentIndex]?.id] = document.getElementById('current-answer')?.value || '';
    App.currentAttempt.currentIndex++;
    renderQuestion();
  }
}

function submitExam() {
  if (!confirm('确定要提交试卷吗？')) return;
  App.currentAttempt.answers[App.currentAttempt.questions[App.currentAttempt.currentIndex]?.id] = document.getElementById('current-answer')?.value || '';
  const result = App.submitExam();
  if (result) {
    navigate('exam-result');
    setTimeout(() => renderResult(result), 100);
  }
}

function filterWQ(mastered) {
  navigate('wrong-questions');
  setTimeout(() => {
    const wqs = App.getWrongQuestions(mastered);
    const list = document.getElementById('wq-list');
    if (!list) return;
    if (wqs.length === 0) { list.innerHTML = '<div class="empty">暂无错题</div>'; return; }
    list.innerHTML = wqs.map(w => '<div class="wq-card"><div class="wq-q">' + (w.questionContent||'题目') + '</div><div class="wq-answers"><span class="wrong">你的答案：' + (w.wrongAnswer||'未答') + '</span> | <span class="correct">正确答案：' + w.correctAnswer + '</span></div></div>').join('');
  }, 100);
}

function renderQuestion() {
  if (!App.currentAttempt) return;
  const q = App.currentAttempt.questions[App.currentAttempt.currentIndex];
  if (!q) return;
  const total = App.currentAttempt.questions.length;
  const idx = App.currentAttempt.currentIndex;
  document.getElementById('progress-fill').style.width = ((idx+1)/total*100) + '%';
  document.getElementById('progress-text').textContent = (idx+1) + '/' + total;
  
  let html = '<div class="question-card"><div class="q-num">第 ' + (idx+1) + ' 题 / 共 ' + total + ' 题</div><div class="q-content">' + q.content + '</div>';
  if (q.type === 'choice') {
    let opts = [];
    try { opts = JSON.parse(q.options || '[]'); } catch(e) { opts = q.options?.split(',') || []; }
    html += '<div class="q-options">';
    opts.forEach((opt, i) => {
      const selected = App.currentAttempt.answers[q.id] === opt ? ' selected' : '';
      html += '<div class="q-option' + selected + '" onclick="selectOption(\'' + q.id + '\',\'' + opt.replace(/'/g,"\\'") + '\')">' + opt + '</div>';
    });
    html += '</div>';
  } else {
    const val = App.currentAttempt.answers[q.id] || '';
    html += '<input class="q-input" id="current-answer" type="text" value="' + val + '" placeholder="请输入答案" oninput="App.submitAnswer(\\'' + q.id + '\\',this.value)">';
  }
  html += '</div>';
  document.getElementById('question-container').innerHTML = html;
}

function selectOption(qId, opt) {
  App.submitAnswer(qId, opt);
  renderQuestion();
}

function renderResult(result) {
  const pct = Math.round(result.score);
  let msg = pct >= 90 ? '太棒了！🎉' : pct >= 70 ? '不错哦！💪' : pct >= 60 ? '继续加油！📚' : '需要多练习哦！📝';
  document.getElementById('result-content').innerHTML = '<div class="score-circle"><div class="num">' + pct + '</div></div><div class="result-msg">' + msg + '</div><div class="result-detail">得分：' + result.score + ' / ' + result.totalScore + '</div>';
  
  let reviewHtml = '';
  result.questions.forEach((q, i) => {
    const isCorrect = result.answers[q.id]?.trim() === q.correctAnswer.trim();
    reviewHtml += '<div class="answer-review ' + (isCorrect ? 'correct' : 'wrong') + '"><div class="q-text">' + (i+1) + '. ' + q.content + '</div><div class="answer">你的答案：<span>' + (result.answers[q.id]||'未答') + '</span> | 正确答案：<span>' + q.correctAnswer + '</span></div></div>';
  });
  document.getElementById('answer-review').innerHTML = reviewHtml;
}
