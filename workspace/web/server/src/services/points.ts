import { run, get, all } from '../models/db.js';

export const addPoints = async (userId: string, amount: number, source: string, sourceId?: string) => {
  const current = await get('SELECT id FROM users WHERE id = ?', [userId]);
  if (!current) throw new Error('用户不存在');
  const id = `pt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const txType = amount > 0 ? 'earn' : 'spend';
  await run('INSERT INTO point_transactions (id, user_id, amount, type, source, source_id, balance_after, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))',
    [id, userId, amount, txType, source, sourceId || null, amount]);
  return { id, newBalance: amount };
};

export const spendPoints = async (userId: string, amount: number, source: string, sourceId: string) => {
  const current = await get('SELECT id FROM users WHERE id = ?', [userId]);
  if (!current) throw new Error('用户不存在');
  const id = `pt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  await run('INSERT INTO point_transactions (id, user_id, amount, type, source, source_id, balance_after, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))',
    [id, userId, -amount, 'spend', source, sourceId, -amount]);
  return { id, newBalance: -amount };
};

export const getPointHistory = async (userId: string, limit = 50) => {
  return await all('SELECT * FROM point_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit]);
};

export const getCurrentPoints = async (userId: string) => {
  const transactions = await all('SELECT amount FROM point_transactions WHERE user_id = ?', [userId]);
  const total = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  return total;
};