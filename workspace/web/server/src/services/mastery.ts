import { run, get, all } from '../models/db.js';

export const getMasteryData = async (userId: string) => {
  return await all(`
    SELECT km.*, kp.name as knowledge_point_name, kp.grade, kp.chapter, kp.unit
    FROM knowledge_mastery km
    JOIN knowledge_points kp ON km.knowledge_point_id = kp.id
    WHERE km.user_id = ?
    ORDER BY km.updated_at DESC
  `, [userId]) as any[];
};

export const updateMastery = async (userId: string, knowledgePointId: string, isCorrect: boolean) => {
  const mastery = (await all('SELECT * FROM knowledge_mastery WHERE user_id = ? AND knowledge_point_id = ?', [userId, knowledgePointId]))[0] as any;
  
  if (!mastery) {
    const id = `km_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    await run('INSERT INTO knowledge_mastery (id, user_id, knowledge_point_id, alpha, beta, attempt_count, updated_at) VALUES (?, ?, ?, 1, 1, 1, datetime(\'now\'))',
      [id, userId, knowledgePointId]);
    return { knowledgePointId, mastery: 0.5, alpha: 1, beta: 1, attemptCount: 1 };
  }
  
  await run('UPDATE knowledge_mastery SET alpha = alpha + ?, beta = beta + ?, last_attempt = datetime(\'now\'), attempt_count = attempt_count + 1, updated_at = datetime(\'now\') WHERE id = ?',
    [isCorrect ? 1 : 0, isCorrect ? 0 : 1, mastery.id]);
  
  const alpha = mastery.alpha + (isCorrect ? 1 : 0);
  const beta = mastery.beta + (isCorrect ? 0 : 1);
  const attemptCount = mastery.attempt_count + 1;
  
  return { knowledgePointId, mastery: alpha / (alpha + beta), alpha, beta, attemptCount };
};

export const getWeakPoints = async (userId: string, threshold = 0.55) => {
  const data = await getMasteryData(userId);
  return data.filter((m: any) => {
    const level = m.alpha / (m.alpha + m.beta);
    return level < threshold && m.attempt_count >= 3;
  }).sort((a: any, b: any) => {
    const levelA = a.alpha / (a.alpha + a.beta);
    const levelB = b.alpha / (b.alpha + b.beta);
    return levelA - levelB;
  });
};

export const getImprovedPoints = async (userId: string, threshold = 0.7) => {
  const data = await getMasteryData(userId);
  return data.filter((m: any) => {
    const level = m.alpha / (m.alpha + m.beta);
    return level >= threshold && m.attempt_count >= 3;
  });
};