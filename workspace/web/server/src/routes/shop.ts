import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getShopItems, getShopItem, redeemItem, getRedemptions } from '../services/shop.js';

const router = express.Router();

router.get('/items', async (req: any, res: any) => {
  const items = await getShopItems();
  res.json({ success: true, data: items });
});

router.get('/items/:id', async (req: any, res: any) => {
  const item = await getShopItem(req.params.id);
  res.json({ success: true, data: item });
});

router.post('/redeem', authenticate, async (req: any, res: any) => {
  const { itemId, quantity } = req.body;
  const result = await redeemItem(req.user.id, itemId, quantity);
  res.json({ success: true, data: result });
});

router.get('/redemptions', authenticate, async (req: any, res: any) => {
  const redemptions = await getRedemptions(req.user.id);
  res.json({ success: true, data: redemptions });
});

export default router;