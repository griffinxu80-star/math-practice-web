import { initDatabase, run, get, all, execMulti, seedShopItems, saveDatabase, closeDatabase, prepare, transaction, transactionAll } from '../../src/models/db';

const sampleQuestions = [
  // 四年级示例题目
  { knowledgePointId: 'kp_sample', content: '356 + 478 = ?', type: 'calculation', correctAnswer: '834', difficulty: 0.3 },
  { knowledgePointId: 'kp_sample', content: '下面哪个是质数？A. 4 B. 9 C. 7 D. 15', type: 'choice', options: JSON.stringify(['A. 4', 'B. 9', 'C. 7', 'D. 15']), correctAnswer: 'C', difficulty: 0.4 },
  { knowledgePointId: 'kp_sample', content: '一个直角三角形的两个锐角之和是（）度。', type: 'fill_blank', correctAnswer: '90', difficulty: 0.5 },
  { knowledgePointId: 'kp_sample', content: '把12个苹果平均分给3个小朋友，每人分（）个。', type: 'fill_blank', correctAnswer: '4', difficulty: 0.3 },
  { knowledgePointId: 'kp_sample', content: '计算：25 × 4 = ?', type: 'calculation', correctAnswer: '100', difficulty: 0.2 },
  { knowledgePointId: 'kp_sample', content: '下面哪个数最接近1000？A. 998 B. 1002 C. 995 D. 1005', type: 'choice', options: JSON.stringify(['A. 998', 'B. 1002', 'C. 995', 'D. 1005']), correctAnswer: 'A', difficulty: 0.5 },
  // 五年级示例题目
  { knowledgePointId: 'kp_sample', content: '0.5 × 0.4 = ?', type: 'calculation', correctAnswer: '0.2', difficulty: 0.4 },
  { knowledgePointId: 'kp_sample', content: '一个平行四边形的底是8cm，高是5cm，面积是（）平方厘米。', type: 'fill_blank', correctAnswer: '40', difficulty: 0.5 },
  { knowledgePointId: 'kp_sample', content: '解方程：x + 5 = 12，x = ?', type: 'calculation', correctAnswer: '7', difficulty: 0.4 },
  { knowledgePointId: 'kp_sample', content: '3.6 ÷ 0.9 = ?', type: 'calculation', correctAnswer: '4', difficulty: 0.5 },
  // 六年级示例题目
  { knowledgePointId: 'kp_sample', content: '1/2 + 1/3 = ?', type: 'calculation', correctAnswer: '5/6', difficulty: 0.6 },
  { knowledgePointId: 'kp_sample', content: '一个圆的半径是3cm，周长是（）cm。（π取3.14）', type: 'fill_blank', correctAnswer: '18.84', difficulty: 0.6 },
  { knowledgePointId: 'kp_sample', content: '25%的400是（）。', type: 'fill_blank', correctAnswer: '100', difficulty: 0.4 },
  { knowledgePointId: 'kp_sample', content: '一个数的3/4是60，这个数是（）。', type: 'fill_blank', correctAnswer: '80', difficulty: 0.7 },
];

export async function seedQuestions() {
  const stmt = prepare(`
    INSERT INTO questions (id, knowledge_point_id, content, question_type, options, correct_answer, difficulty, source_type, source_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'original', '官方公开资源', NOW())
  `);
  
  const batch = transactionAll((questions: any[]) => {
    let inserted = 0;
    for (const q of questions) {
      const id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("q:", JSON.stringify(q), "kp:", q.knowledgePointId);
      stmt.run([id, q.knowledgePointId, q.content, q.type, q.options || null, q.correctAnswer, q.difficulty]);
      inserted++;
    }
    return inserted;
  });
  
  const inserted = batch(sampleQuestions);
  console.log(`Seeded ${inserted} sample questions`);
  return { inserted };
}
