import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addPoints, spendPoints, getPointHistory, getCurrentPoints } from '../services/points.js';

const router = express.Router();

router.get('/balance', authenticate, async (req: any, res: any) => {
  const balance = await getCurrentPoints(req.user.id);
  res.json({ success: true, data: { balance } });
});

router.post('/earn', authenticate, async (req: any, res: any) => {
  const { amount, source, sourceId } = req.body;
  const result = await addPoints(req.user.id, amount, source, sourceId);
  res.json({ success: true, data: result });
});

router.post('/spend', authenticate, async (req: any, res: any) => {
  const { amount, source, sourceId } = req.body;
  const result = await spendPoints(req.user.id, amount, source, sourceId);
  res.json({ success: true, data: result });
});

router.get('/history', authenticate, async (req: any, res: any) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const history = await getPointHistory(req.user.id, limit);
  res.json({ success: true, data: history });
});

export default router;