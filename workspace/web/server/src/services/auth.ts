import { run, get, all } from '../models/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';

export const register = async (req: any, res: any) => {
  const { username, password, role, grade, name } = req.body;
  if (!username || !password || !role || !grade) return res.status(400).json({ success: false, message: 'Missing required fields' });
  if (role !== 'student' && role !== 'parent') return res.status(400).json({ success: false, message: 'Invalid role' });
  if (grade < 4 || grade > 6) return res.status(400).json({ success: false, message: 'Grade must be 4-6' });

  const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) return res.status(400).json({ success: false, message: 'Username already exists' });

  const password_hash = await bcrypt.hash(password, 10);
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const now = "NOW()";
  await run('INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ' + now + ', ' + now + ')',
    [id, username, password_hash, role, grade, name || username]);

  let studentProfile = null;
  if (role === 'student') {
    const profileId = `profile_${Date.now()}`;
    await run('INSERT INTO student_profiles (id, user_id, grade, total_score, total_exam_count, current_points, created_at) VALUES (?, ?, ?, 0, 0, 0, ' + now + ')',
      [profileId, id, grade]);
    studentProfile = { id: profileId, grade };
  }

  const token = jwt.sign({ id, username, role, grade }, JWT_SECRET, { expiresIn: '7d' as any });
  res.json({ success: true, message: 'Registered', data: { token, user: { id, username, role, grade, name: name || username }, studentProfile } });
};

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing username or password' });

  const user = await get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, grade: user.grade }, JWT_SECRET, { expiresIn: '7d' as any });

  let studentProfile = null;
  if (user.role === 'student') {
    studentProfile = await get('SELECT * FROM student_profiles WHERE user_id = ?', [user.id]);
  }

  res.json({ success: true, message: 'Logged in', data: { token, user: { id: user.id, username: user.username, role: user.role, grade: user.grade, name: user.name }, studentProfile } });
};

export const getMe = async (req: any, res: any) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const userId = req.user.id;
  const user = await get('SELECT id, username, role, grade, name, avatar_url, created_at FROM users WHERE id = ?', [userId]);
  let profile = null;
  if (user.role === 'student') profile = await get('SELECT * FROM student_profiles WHERE user_id = ?', [userId]);
  else if (user.role === 'parent') profile = await get('SELECT * FROM parent_profiles WHERE user_id = ?', [userId]);
  res.json({ success: true, data: { user, profile } });
};

export const updateProfile = async (req: any, res: any) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { name, avatar_url } = req.body;
  await run("UPDATE users SET name = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?", [name, avatar_url, req.user.id]);
  res.json({ success: true, message: 'Updated' });
};