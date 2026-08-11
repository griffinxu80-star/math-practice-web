import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getChildList, bindChild, unbindChild, getChildReport, getChildWrongQuestions, createGoal, getGoals, updateGoalStatus } from '../services/parent.js';

const router = Router();

router.get('/children', authenticate, authorize('parent'), async (req: any, res: any) => {
  const children = await getChildList(req.user.id);
  res.json({ success: true, data: children });
});

router.post('/bind', authenticate, authorize('parent'), async (req: any, res: any) => {
  const { childId } = req.body;
  const result = await bindChild(req.user.id, childId);
  res.json({ success: true, data: result });
});

router.delete('/unbind/:childId', authenticate, authorize('parent'), async (req: any, res: any) => {
  const result = await unbindChild(req.user.id, req.params.childId);
  res.json({ success: true, data: result });
});

router.get('/report/:childId', authenticate, authorize('parent'), async (req: any, res: any) => {
  const report = await getChildReport(req.params.childId);
  res.json({ success: true, data: report });
});

router.get('/wrong-questions/:childId', authenticate, authorize('parent'), async (req: any, res: any) => {
  const questions = await getChildWrongQuestions(req.params.childId);
  res.json({ success: true, data: questions });
});

router.get('/goals', authenticate, authorize('student'), async (req: any, res: any) => {
  const goals = await getGoals(req.user.id);
  res.json({ success: true, data: goals });
});

router.post('/goals', authenticate, authorize('parent'), async (req: any, res: any) => {
  const result = await createGoal({
    studentId: req.body.studentId,
    parentId: req.user.id,
    ...req.body
  });
  res.json({ success: true, data: result });
});

router.put('/goals/:id/status', authenticate, authorize('parent'), async (req: any, res: any) => {
  const result = await updateGoalStatus(req.params.id, req.body.status);
  res.json({ success: true, data: result });
});

export default router;