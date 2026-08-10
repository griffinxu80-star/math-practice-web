import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getQuestions, getRandomQuestions, getGeometryQuestions } from '../services/question.js';

const router = express.Router();

router.get('/questions', async (req: any, res: any) => {
  const filters: any = {
    knowledge_point_id: req.query.knowledge_point_id || undefined,
    grade: req.query.grade ? parseInt(req.query.grade) : undefined,
    type: req.query.type || undefined,
    difficulty_min: req.query.difficulty_min ? parseFloat(req.query.difficulty_min) : undefined,
    difficulty_max: req.query.difficulty_max ? parseFloat(req.query.difficulty_max) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit) : 50,
    offset: req.query.offset ? parseInt(req.query.offset) : 0,
  };
  const questions = await getQuestions(filters);
  res.json({ success: true, data: questions });
});

router.get('/training/:grade', async (req: any, res: any) => {
  const grade = parseInt(req.params.grade) || 4;
  const count = parseInt(req.query.count) || 10;
  const questions = await getRandomQuestions(grade, count);
  res.json({ success: true, data: questions });
});

router.get('/geometry/:grade', async (req: any, res: any) => {
  const grade = parseInt(req.params.grade) || 4;
  const questions = await getGeometryQuestions(grade);
  res.json({ success: true, data: questions });
});

export default router;