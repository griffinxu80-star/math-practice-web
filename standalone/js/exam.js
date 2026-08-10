const renderExamList = function() {
  const grade = App.currentUser.grade || 4;
  const questions = DB.getQuestions({ grade, limit: 50 });
  const grouped = {};
  questions.forEach(q => {
    const key = (q.chapter || '其他') + '-' + (q.unit || 1);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(q);
  });
  const list = document.getElementById('exam-list');
  if (!list) return;
  if (Object.keys(grouped).length === 0) { list.innerHTML = '<div class=\"empty\">暂无题目</div>'; return; }
  list.innerHTML = Object.entries(grouped).map(([key, qs]) => '<div class=\"exam-card\" onclick=\"startExam(' + grade + ')\"><div class=\"exam-info\"><h3>' + key.replace('-', ' 单元') + '</h3><p>' + qs.length + '道题目</p></div><div class=\"exam-meta\"><span>题目：' + qs.length + '题</span><span>时间：' + (qs.length * 2) + '分钟</span></div></div>').join('');
};
const startExam = function(grade) {
  const attempt = App.startExam(grade);
  if (!attempt) { alert('暂无题目'); return; }
  attempt.currentIndex = 0;
  navigate('exam-detail');
  setTimeout(() => renderQuestion(), 100);
};
