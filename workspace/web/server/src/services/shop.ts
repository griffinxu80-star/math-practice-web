import { run, get, all } from '../models/db.js';

export const getShopItems = async () => all('SELECT * FROM point_shop_items ORDER BY cost ASC');

export const getShopItem = async (id: string) => get('SELECT * FROM point_shop_items WHERE id = ?', [id]);

export const redeemItem = async (userId: string, itemId: string, quantity = 1) => {
  const item = await get('SELECT * FROM point_shop_items WHERE id = ?', [itemId]);
  if (!item) throw new Error('商品不存在');
  const currentPoints = await all('SELECT amount FROM point_transactions WHERE user_id = ?', [userId]);
  const totalPoints = currentPoints.reduce((sum: number, t: any) => sum + t.amount, 0);
  if (totalPoints < item.cost * quantity) throw new Error('积分不足');
  const existing = await get('SELECT id FROM point_redemptions WHERE user_id = ? AND item_id = ? AND status = ?',
    [userId, itemId, 'pending']);
  if (existing) return { id: existing.id, totalCost: item.cost * quantity };
  const totalCost = item.cost * quantity;
  const id = `red_${Date.now()}`;
  await run('INSERT INTO point_redemptions (id, user_id, item_id, quantity, total_cost, status, created_at) VALUES (?, ?, ?, ?, ?, \'pending\', datetime(\'now\'))',
    [id, userId, itemId, quantity, totalCost]);
  const ptId = `pt_${Date.now()}`;
  await run('INSERT INTO point_transactions (id, user_id, amount, type, source, source_id, balance_after, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))',
    [ptId, userId, -totalCost, 'spend', 'shop', itemId, -totalCost]);
  return { id, totalCost, newBalance: totalPoints - totalCost };
};

export const getRedemptions = async (userId: string, limit = 20) => {
  return await all('SELECT pr.*, psi.name as item_name, psi.icon_url FROM point_redemptions pr JOIN point_shop_items psi ON pr.item_id = psi.id WHERE pr.user_id = ? ORDER BY pr.created_at DESC LIMIT ?', [userId, limit]);
};