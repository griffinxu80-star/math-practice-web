import { run, get, all } from '../models/db.js';

export const getAchievements = async (userId: string) => {
  const achievements = [
    { id: 'ach_1', achievement_id: 'first_exam', name: '首次挑战', description: '完成第一次自测', icon_url: '🏆', unlocked_at: null },
    { id: 'ach_2', achievement_id: 'perfect_score', name: '满分达人', description: '获得一次满分', icon_url: '⭐', unlocked_at: null },
    { id: 'ach_3', achievement_id: 'five_exams', name: '练习达人', description: '完成5次自测', icon_url: '📝', unlocked_at: null },
    { id: 'ach_4', achievement_id: 'ten_exams', name: '学习之星', description: '完成10次自测', icon_url: '🌟', unlocked_at: null },
    { id: 'ach_5', achievement_id: 'all_correct', name: '全对王', description: '连续答对10题', icon_url: '💯', unlocked_at: null },
    { id: 'ach_6', achievement_id: 'points_100', name: '积分达人', description: '累计获得100积分', icon_url: '💎', unlocked_at: null },
  ];
  const unlocked = await all('SELECT * FROM achievements WHERE user_id = ?', [userId]);
  const unlockedMap = new Map();
  for (const a of unlocked as any[]) unlockedMap.set(a.achievement_id, a.unlocked_at);
  return achievements.map(a => ({ ...a, unlocked_at: unlockedMap.get(a.achievement_id) || null }));
};

export const addAchievement = async (userId: string, achievementId: string) => {
  const existing = await get('SELECT id FROM achievements WHERE user_id = ? AND achievement_id = ?', [userId, achievementId]);
  if (existing) return { success: false, message: '成就已解锁' };
  const id = `ach_r_${Date.now()}`;
  await run('INSERT INTO achievements (id, achievement_id, user_id, unlocked_at) VALUES (?, ?, ?, datetime(\'now\'))',
    [id, achievementId, userId]);
  return { success: true, achievementId };
};

export const checkAchievements = async (userId: string, stats: any) => {
  const unlocked: string[] = [];
  if (stats.examCount >= 1) unlocked.push('first_exam');
  if (stats.examCount >= 5) unlocked.push('five_exams');
  if (stats.examCount >= 10) unlocked.push('ten_exams');
  if (stats.maxScore === 100) unlocked.push('perfect_score');
  if (stats.consecutiveCorrect >= 10) unlocked.push('all_correct');
  if (stats.totalPoints >= 100) unlocked.push('points_100');
  for (const achId of unlocked) {
    const existing = await get('SELECT id FROM achievements WHERE user_id = ? AND achievement_id = ?', [userId, achId]);
    if (!existing) {
      const id = `ach_r_${Date.now()}_${Math.random()}`;
      await run('INSERT INTO achievements (id, achievement_id, user_id, unlocked_at) VALUES (?, ?, ?, datetime(\'now\'))',
        [id, achId, userId]);
    }
  }
  return { success: true, unlocked };
};