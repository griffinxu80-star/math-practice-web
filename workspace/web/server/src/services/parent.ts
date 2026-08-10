import { run, get, all } from '../models/db.js';

export const getChildList = async (parentId: string) => {
  return await all('SELECT u.id, u.username, u.name, u.grade FROM parent_child_bindings pcb JOIN users u ON pcb.child_id = u.id WHERE pcb.parent_id = ?', [parentId]);
};

export const bindChild = async (parentId: string, childId: string) => {
  const existing = await get('SELECT id FROM parent_child_bindings WHERE parent_id = ? AND child_id = ?', [parentId, childId]);
  if (existing) return { success: false, message: '已绑定' };
  const id = `bind_${Date.now()}`;
  await run('INSERT INTO parent_child_bindings (id, parent_id, child_id, bound_at) VALUES (?, ?, ?, datetime(\'now\'))', [id, parentId, childId]);
  return { success: true };
};

export const unbindChild = async (parentId: string, childId: string) => {
  await run('DELETE FROM parent_child_bindings WHERE parent_id = ? AND child_id = ?', [parentId, childId]);
  return { success: true };
};

export const getChildReport = async (childId: string) => {
  return await all('SELECT * FROM weekly_reports WHERE user_id = ? ORDER BY week_start DESC LIMIT 4', [childId]);
};

export const getChildWrongQuestions = async (childId: string) => {
  return await all('SELECT wq.*, q.content, qp.name as knowledge_point_name FROM wrong_questions wq JOIN questions q ON wq.question_id = q.id JOIN knowledge_points qp ON wq.knowledge_point_id = qp.id WHERE wq.user_id = ? AND wq.mastered = 0 ORDER BY wq.attempted_at DESC LIMIT 20', [childId]);
};

export const createGoal = async (data: any) => {
  const id = `goal_${Date.now()}`;
  await run('INSERT INTO learning_goals (id, student_id, parent_id, description, target_score, deadline, status, created_at) VALUES (?, ?, ?, ?, ?, ?, \'active\', datetime(\'now\'))',
    [id, data.studentId, data.parentId, data.description, data.targetScore || null, data.deadline || null]);
  return { id, ...data };
};

export const getGoals = async (userId: string) => {
  return await all('SELECT lg.*, u.name as parent_name FROM learning_goals lg JOIN users u ON lg.parent_id = u.id WHERE lg.student_id = ? ORDER BY lg.created_at DESC', [userId]);
};

export const updateGoalStatus = async (goalId: string, status: string) => {
  await run('UPDATE learning_goals SET status = ? WHERE id = ?', [status, goalId]);
  return { success: true };
};