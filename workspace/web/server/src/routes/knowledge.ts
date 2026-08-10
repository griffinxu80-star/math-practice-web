import express from 'express';
import { getKnowledgeTree, getKnowledgePoint, getQuestions, getRandomQuestions, getGeometryQuestions } from '../services/knowledge.js';

const router = express.Router();

// GET /api/v1/knowledge/tree
router.get('/tree', async (req: any, res: any) => {
  const grade = req.query.grade ? parseInt(req.query.grade) : undefined;
  const tree = await getKnowledgeTree(grade);
  res.json({ success: true, data: tree });
});

// GET /api/v1/knowledge/questions - MUST be before /:id
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

// GET /api/v1/knowledge/training/:grade
router.get('/training/:grade', async (req: any, res: any) => {
  const grade = parseInt(req.params.grade) || 4;
  const count = parseInt(req.query.count) || 10;
  const questions = await getRandomQuestions(grade, count);
  res.json({ success: true, data: questions });
});

// GET /api/v1/knowledge/geometry/:grade
router.get('/geometry/:grade', async (req: any, res: any) => {
  const grade = parseInt(req.params.grade) || 4;
  const questions = await getGeometryQuestions(grade);
  res.json({ success: true, data: questions });
});

// GET /api/v1/knowledge/:id - MUST be last
router.get('/:id', async (req: any, res: any) => {
  const point = await getKnowledgePoint(req.params.id);
  if (!point) return res.status(404).json({ success: false, message: '知识点不存在' });
  res.json({ success: true, data: point });
});

export default router;
