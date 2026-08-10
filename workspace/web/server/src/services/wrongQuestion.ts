import { run, get, all } from '../models/db.js';

export const getWrongQuestions = async (userId: string, mastered = false) => {
  let sql = 'SELECT wq.*, q.content, q.question_type, q.correct_answer, q.difficulty, qp.name as knowledge_point_name FROM wrong_questions wq JOIN questions q ON wq.question_id = q.id JOIN knowledge_points qp ON wq.knowledge_point_id = qp.id WHERE wq.user_id = ?';
  const params: any[] = [userId];
  if (mastered !== undefined) { sql += ' AND wq.mastered = ?'; params.push(mastered ? 1 : 0); }
  sql += ' ORDER BY wq.attempted_at DESC';
  return await all(sql, params);
};

export const markWrongQuestionMastered = async (wrongQuestionId: string) => {
  await run('UPDATE wrong_questions SET mastered = 1 WHERE id = ?', [wrongQuestionId]);
  return { success: true };
};

export const addWrongQuestion = async (data: any) => {
  const existing = await get('SELECT id FROM wrong_questions WHERE user_id = ? AND question_id = ? AND mastered = 0',
    [data.userId, data.questionId]);
  if (existing) return { success: true };
  const id = `wq_${Date.now()}`;
  await run('INSERT INTO wrong_questions (id, user_id, question_id, wrong_answer, correct_answer, knowledge_point_id, exam_attempt_id, attempted_at, mastered) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'), 0)',
    [id, data.userId, data.questionId, data.wrongAnswer || null, data.correctAnswer, data.knowledgePointId, data.examAttemptId || null]);
  return { success: true, id };
};