import { run, get, all } from '../models/db.js';
import type { Question } from '../models/index.js';

export const getQuestions = async (filters: any = {}) => {
  let sql = 'SELECT q.*, kp.name as knowledge_point_name FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id WHERE 1=1';
  const params: any[] = [];
  if (filters.knowledge_point_id) { sql += ' AND q.knowledge_point_id = ?'; params.push(filters.knowledge_point_id); }
  if (filters.grade) { sql += ' AND kp.grade = ?'; params.push(filters.grade); }
  if (filters.type) { sql += ' AND q.question_type = ?'; params.push(filters.type); }
  if (filters.difficulty_min !== undefined) { sql += ' AND q.difficulty >= ?'; params.push(filters.difficulty_min); }
  if (filters.difficulty_max !== undefined) { sql += ' AND q.difficulty <= ?'; params.push(filters.difficulty_max); }
  sql += ' ORDER BY q.difficulty ASC';
  if (filters.limit) { sql += ' LIMIT ? OFFSET ?'; params.push(filters.limit, filters.offset || 0); }
  return await all(sql, params) as Question[];
};

export const getRandomQuestions = async (grade: number, count: number, excludeIds?: string[]) => {
  let sql = 'SELECT q.*, kp.name as knowledge_point_name FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id WHERE kp.grade = ? AND q.question_type != \'geometry\'';
  const params: any[] = [grade];
  if (excludeIds && excludeIds.length > 0) {
    const placeholders = excludeIds.map(() => '?').join(',');
    sql += ` AND q.id NOT IN (${placeholders})`;
    params.push(...excludeIds);
  }
  sql += ' ORDER BY RANDOM() LIMIT ?';
  params.push(count);
  return await all(sql, params) as Question[];
};

export const getGeometryQuestions = async (grade: number, limit = 5) => {
  return await all('SELECT q.*, kp.name as knowledge_point_name FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id WHERE kp.grade = ? AND q.question_type = \'geometry\' AND q.geogebra_id IS NOT NULL ORDER BY RANDOM() LIMIT ?', [grade, limit]) as Question[];
};