import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getWeakPoints, getImprovedPoints, updateMastery } from '../services/mastery.js';

const router = express.Router();

router.get('/weak', authenticate, async (req: any, res: any) => {
  const threshold = parseFloat(req.query.threshold as string) || 0.55;
  const points = await getWeakPoints(req.user.id, threshold);
  res.json({ success: true, data: points });
});

router.get('/improved', authenticate, async (req: any, res: any) => {
  const points = await getImprovedPoints(req.user.id);
  res.json({ success: true, data: points });
});

router.post('/update', authenticate, async (req: any, res: any) => {
  const { knowledgePointId, isCorrect } = req.body;
  const result = await updateMastery(req.user.id, knowledgePointId, isCorrect);
  res.json({ success: true, data: result });
});

export default router;