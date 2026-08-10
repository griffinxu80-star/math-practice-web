import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { register, login, getMe, updateProfile } from '../services/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;

