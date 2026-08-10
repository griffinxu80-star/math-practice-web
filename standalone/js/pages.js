const Pages = {
  login() {
    return '<div class="auth-page"><div class="auth-card"><h1>小学数学自测辅导</h1><p>本地版</p><div class="form-group"><label>用户名</label><input id="login-username" type="text" placeholder="请输入用户名"></div><div class="form-group"><label>密码</label><input id="login-password" type="password" placeholder="请输入密码"></div><button class="btn-primary" onclick="handleLogin()">登录</button><div class="auth-link">还没有账号？<a href="#register">立即注册</a></div></div></div>';
  },
  register() {
    return '<div class="auth-page"><div class="auth-card"><h1>注册账号</h1><p>欢迎来到小学数学自测辅导</p><div class="form-group"><label>用户名</label><input id="reg-username" type="text" placeholder="请输入用户名"></div><div class="form-group"><label>密码</label><input id="reg-password" type="password" placeholder="请输入密码（至少6位）"></div><div class="form-group"><label>姓名</label><input id="reg-name" type="text" placeholder="请输入姓名（选填）"></div><div class="form-group"><label>角色</label><select id="reg-role"><option value="student">学生</option><option value="parent">家长</option></select></div><div class="form-group"><label>年级</label><select id="reg-grade"><option value="4">4年级</option><option value="5">5年级</option><option value="6">6年级</option></select></div><button class="btn-primary" onclick="handleRegister()">注册</button><div class="auth-link">已有账号？<a href="#login">立即登录</a></div></div></div>';
  },
  home() {
    const u = App.currentUser, p = App.getProfile(), pts = App.getPoints();
    return '<div class="page"><div class="welcome-card"><h2>你好，' + (u.name||u.username) + '</h2><div class="grade">' + u.grade + '年级</div><div class="stats"><div class="stat"><div class="stat-val">' + (p?p.totalExamCount||0:0) + '</div><div class="stat-label">完成考试</div></div><div class="stat"><div class="stat-val">' + pts + '</div><div class="stat-label">积分</div></div><div class="stat"><div class="stat-val">' + Math.round(p?p.totalScore||0:0) + '</div><div class="stat-label">总得分</div></div></div></div><div class="menu-grid"><div class="menu-item" onclick="navigate(\'exam\')"><div class="menu-icon">📝</div><div class="menu-text">自测诊断</div></div><div class="menu-item" onclick="navigate(\'training\')"><div class="menu-icon">💪</div><div class="menu-text">提升训练</div></div><div class="menu-item" onclick="navigate(\'review\')"><div class="menu-icon">📚</div><div class="menu-text">学期复习</div></div><div class="menu-item" onclick="navigate(\'points\')"><div class="menu-icon">⭐</div><div class="menu-text">我的积分</div></div><div class="menu-item" onclick="navigate(\'shop\')"><div class="menu-icon">🛒</div><div class="menu-text">积分商城</div></div><div class="menu-item" onclick="navigate(\'wrong-questions\')"><div class="menu-icon">📖</div><div class="menu-text">错题本</div></div><div class="menu-item" onclick="navigate(\'knowledge\')"><div class="menu-icon">🗂</div><div class="menu-text">知识点</div></div></div></div>';
  },
  exam() {
    return '<div class="page"><div class="page-title">自测诊断</div><div class="grade-selector"><span>选择年级：' + App.currentUser.grade + '年级</span><span>›</span></div><div class="exam-list" id="exam-list"></div></div>';
  },
  examDetail() {
    return '<div class="page" id="exam-detail-page"><div class="progress-bar"><div class="bar"><div class="fill" id="progress-fill" style="width:0%"></div></div><div class="text" id="progress-text">0/0</div></div><div id="question-container"></div><div class="q-nav"><button class="btn-prev" id="btn-prev" onclick="prevQ()">上一题</button><button class="btn-next" id="btn-next" onclick="nextQ()">下一题</button></div></div>';
  },
  examResult() {
    return '<div class="page"><div class="result-card" id="result-content"></div><div id="answer-review"></div><button class="btn-primary" onclick="navigate(\'home\')" style="max-width:300px;margin:20px auto;display:block">返回首页</button></div>';
  },
  training() { return '<div class="page"><div class="page-title">提升训练</div><div class="empty">功能开发中...</div></div>'; },
  review() { return '<div class="page"><div class="page-title">学期复习</div><div class="empty">功能开发中...</div></div>'; },
  points() {
    const h = App.getTransactionHistory(20);
    let s = '<div class="page"><div class="points-card"><div class="points-val">' + App.getPoints() + '</div><div class="points-label">我的积分</div></div><div class="page-title">积分记录</div><div class="tx-list">';
    if (h.length === 0) s += '<div class="empty">暂无记录</div>';
    else h.forEach(t => { s += '<div class="tx-item"><span class="tx-source">' + (t.source==='exam'?'考试得分':'商城兑换') + '</span><span class="tx-amount ' + (t.type==='earn'?'positive':'negative') + '">' + (t.type==='earn'?'+':'-') + Math.abs(t.amount) + '</span></div>'; });
    s += '</div></div>';
    return s;
  },
  shop() {
    const items = App.getShopItems(), pts = App.getPoints();
    let s = '<div class="page"><div class="page-title">积分商城</div><div class="shop-grid">';
    items.forEach(item => { s += '<div class="shop-item"><div class="shop-icon">' + item.icon_url + '</div><div class="shop-name">' + item.name + '</div><div class="shop-desc">' + (item.description||'') + '</div><div class="shop-cost">' + item.cost + '积分</div><button class="btn-buy" onclick="handleBuy(\'' + item.id + '\')' + (pts<item.cost?' disabled':'') + '">兑换</button></div>'; });
    s += '</div></div>';
    return s;
  },
  wrongQuestions() {
    const wqs = App.getWrongQuestions(false);
    let s = '<div class="page"><div class="page-title">错题本</div><div class="tab-bar"><button class="tab active" onclick="filterWQ(false)">未掌握</button><button class="tab" onclick="filterWQ(true)">已掌握</button></div><div class="wq-list" id="wq-list">';
    if (wqs.length === 0) s += '<div class="empty">暂无错题</div>';
    else wqs.forEach(w => { s += '<div class="wq-card"><div class="wq-q">' + (w.questionContent||'题目') + '</div><div class="wq-answers"><span class="wrong">你的答案：' + (w.wrongAnswer||'未答') + '</span> | <span class="correct">正确答案：' + w.correctAnswer + '</span></div></div>'; });
    s += '</div></div>';
    return s;
  },
  knowledge() {
    const tree = App.getKnowledgeTree();
    let s = '<div class="page"><div class="page-title">知识点</div><div class="grade-selector"><span>选择年级：' + App.currentUser.grade + '年级</span><span>›</span></div><div class="kp-tree">';
    for (const ch of Object.keys(tree)) {
      s += '<div class="kp-chapter"><div class="kp-chapter-title">' + ch + '</div>';
      tree[ch].forEach(kp => { s += '<div class="kp-item">' + kp.name + '</div>'; });
      s += '</div>';
    }
    s += '</div></div>';
    return s;
  }
};
