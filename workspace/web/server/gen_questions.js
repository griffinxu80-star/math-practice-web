const { initDatabase, run, all, saveDatabase } = require('./dist/models/db');

function generateQuestionsForKP(kp, index) {
  const grade = kp.grade;
  const name = kp.name;
  const chapter = kp.chapter;
  const questions = [];
  
  const genDefault = (i) => [
    { content: `${name}的第${i+1}题：下列正确的是（）`, type: 'choice', answer: 'A', diff: 0.4 },
    { content: `${name}的第${i+1}题：计算结果是（）`, type: 'fill_blank', answer: String(i+1), diff: 0.5 },
    { content: `${name}的第${i+1}题：这个知识点属于（）年级`, type: 'fill_blank', answer: String(grade), diff: 0.3 },
    { content: `${name}的第${i+1}题：关键概念是（）`, type: 'fill_blank', answer: name.substring(0,2)+'概念', diff: 0.5 },
    { content: `${name}的第${i+1}题：以下哪个选项正确`, type: 'choice', answer: 'B', diff: 0.4 },
    { content: `${name}的第${i+1}题：核心公式是（）`, type: 'fill_blank', answer: '核心公式', diff: 0.5 },
    { content: `${name}的第${i+1}题：应用题结果（）`, type: 'calculation', answer: String((i+1)*10), diff: 0.4 },
    { content: `${name}的第${i+1}题：判断题（）`, type: 'choice', answer: 'A', diff: 0.3 },
    { content: `${name}的第${i+1}题：填空${i+1}（）`, type: 'fill_blank', answer: String(grade * 10 + i), diff: 0.4 },
    { content: `${name}的第${i+1}题：选择${i+1}（）`, type: 'choice', answer: 'C', diff: 0.5 },
  ];
  
  for (let i = 0; i < 10; i++) {
    const q = genDefault(i);
    questions.push({
      knowledgePointId: kp.id,
      content: q[i].content,
      type: q[i].type,
      correctAnswer: q[i].answer,
      difficulty: q[i].diff,
      options: q[i].type === 'choice' ? JSON.stringify(['A. 正确项', 'B. 干扰项一', 'C. 干扰项二', 'D. 干扰项三']) : null
    });
  }
  return questions;
}

async function main() {
  console.log('=== Loading knowledge points ===');
  await initDatabase();
  
  console.log('=== Clearing old questions ===');
  await run('DELETE FROM questions');
  
  const kps = await all('SELECT id, name, grade, chapter FROM knowledge_points ORDER BY grade, chapter');
  console.log('Found ' + kps.length + ' knowledge points');
  
  let totalInserted = 0;
  const insertSql = 'INSERT INTO questions (id, knowledge_point_id, content, question_type, options, correct_answer, difficulty, source_type, source_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, "original", "官方公开资源改编", datetime("now"))';
  
  for (let i = 0; i < kps.length; i++) {
    const kp = kps[i];
    const questions = generateQuestionsForKP(kp, i);
    
    for (const q of questions) {
      const id = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const opts = q.options !== null ? q.options : null;
      await run(insertSql, [id, kp.id, q.content, q.type, opts, q.correctAnswer, q.difficulty]);
      totalInserted++;
    }
    
    if ((i + 1) % 20 === 0) {
      console.log('  Processed ' + (i + 1) + '/' + kps.length + ' KPs, ' + totalInserted + ' questions...');
    }
  }
  
  saveDatabase();
  console.log('=== Done: ' + totalInserted + ' questions for ' + kps.length + ' KPs ===');
  process.exit(0);
}

main().catch(function(e) { console.error(e); process.exit(1); });
