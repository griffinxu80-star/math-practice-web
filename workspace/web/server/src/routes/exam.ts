import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { startExam, submitExam, getExamAttempt, getExamHistory, createExam } from '../services/exam.js';

const router = Router();

router.post('/create', authenticate, authorize('student', 'parent'), async (req: any, res: any) => {
  const result = await createExam(req.body);
  res.json({ success: true, data: result });
});
router.post('/start', authenticate, async (req: any, res: any) => {
  const { examId } = req.body;
  const result = await startExam(examId, req.user.id);
  res.json({ success: true, data: result });
});
router.post('/submit', authenticate, async (req: any, res: any) => {
  const { attemptId, answers } = req.body;
  const result = await submitExam(attemptId, answers);
  res.json({ success: true, data: result });
});
router.get('/:attemptId', authenticate, async (req: any, res: any) => {
  const attempt = await getExamAttempt(req.params.attemptId);
  res.json({ success: true, data: attempt });
});
router.get('/history', authenticate, async (req: any, res: any) => {
  const history = await getExamHistory(req.user.id);
  res.json({ success: true, data: history });
});

export default router;