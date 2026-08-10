import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getWrongQuestions, markWrongQuestionMastered, addWrongQuestion } from '../services/wrongQuestion.js';

const router = express.Router();

router.get('/', authenticate, async (req: any, res: any) => {
  const mastered = req.query.mastered !== undefined ? req.query.mastered === '1' : undefined;
  const questions = await getWrongQuestions(req.user.id, mastered);
  res.json({ success: true, data: questions });
});

router.post('/master', authenticate, async (req: any, res: any) => {
  const { wrongQuestionId } = req.body;
  const result = await markWrongQuestionMastered(wrongQuestionId);
  res.json({ success: true, data: result });
});

router.post('/add', authenticate, async (req: any, res: any) => {
  const result = await addWrongQuestion({ userId: req.user.id, ...req.body });
  res.json({ success: true, data: result });
});

export default router;