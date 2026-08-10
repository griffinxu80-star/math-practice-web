import { run, get, all } from '../models/db.js';

export const createExam = async (data: any) => {
  const id = `exam_${Date.now()}`;
  await run('INSERT INTO exams (id, name, description, grade, chapter, unit, question_ids, time_limit, total_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))',
    [id, data.name, data.description || null, data.grade, data.chapter || null, data.unit || null, JSON.stringify(data.questionIds), data.timeLimit || null, data.totalScore || 100]);
  return { id, ...data };
};

export const startExam = async (examId: string, userId: string) => {
  const exam = await get('SELECT * FROM exams WHERE id = ?', [examId]);
  if (!exam) throw new Error('考试不存在');
  const attemptId = `attempt_${Date.now()}`;
  await run('INSERT INTO exam_attempts (id, exam_id, user_id, started_at, answers, status) VALUES (?, ?, ?, datetime(\'now\'), \'{}\', \'in_progress\')',
    [attemptId, examId, userId]);
  return { attemptId, exam };
};

export const submitExam = async (attemptId: string, answers: Record<string, string>) => {
  const attempt = await get('SELECT * FROM exam_attempts WHERE id = ?', [attemptId]);
  if (!attempt) throw new Error('答题记录不存在');
  const exam = await get('SELECT * FROM exams WHERE id = ?', [attempt.exam_id]);
  const questionIds = JSON.parse(exam.question_ids);
  let score = 0;
  const totalScore = exam.total_score;
  const scorePerQuestion = totalScore / questionIds.length;
  for (const qId of questionIds) {
    const question = await get('SELECT correct_answer FROM questions WHERE id = ?', [qId]);
    if (question && answers[qId] && answers[qId].trim() === question.correct_answer.trim()) score += scorePerQuestion;
  }
  score = Math.round(score * 100) / 100;
  await run('UPDATE exam_attempts SET answers = ?, submitted_at = datetime(\'now\'), score = ?, status = \'submitted\' WHERE id = ?',
    [JSON.stringify(answers), score, attemptId]);
  return { attemptId, score, totalScore };
};

export const getExamAttempt = async (attemptId: string) => get('SELECT * FROM exam_attempts WHERE id = ?', [attemptId]);

export const getExamHistory = async (userId: string, limit = 20) => {
  return await all('SELECT ea.*, e.name as exam_name, e.grade, e.chapter FROM exam_attempts ea JOIN exams e ON ea.exam_id = e.id WHERE ea.user_id = ? ORDER BY ea.started_at DESC LIMIT ?', [userId, limit]);
};