import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { addAchievement, getAchievements, checkAchievements } from '../services/achievement.js';

const router = Router();

router.get('/', authenticate, async (req: any, res: any) => {
  const achievements = await getAchievements(req.user.id);
  res.json({ success: true, data: achievements });
});

router.post('/unlock', authenticate, async (req: any, res: any) => {
  const { achievementId } = req.body;
  const result = await addAchievement(req.user.id, achievementId);
  res.json({ success: true, data: result });
});

router.post('/check', authenticate, async (req: any, res: any) => {
  const result = await checkAchievements(req.user.id, req.body);
  res.json({ success: true, data: result });
});

export default router;