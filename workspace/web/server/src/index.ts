import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initDatabase, seedShopItems } from './models/db';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './data/db.sqlite';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './routes/auth';
import examRoutes from './routes/exam';
import masteryRoutes from './routes/mastery';
import questionRoutes from './routes/question';
import gamificationRoutes from './routes/gamification';
import parentRoutes from './routes/parent';
import knowledgeRoutes from './routes/knowledge';
import pointsRoutes from './routes/points';
import shopRoutes from './routes/shop';
import wrongQuestionRoutes from './routes/wrongQuestion';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exam', examRoutes);
app.use('/api/v1/mastery', masteryRoutes);
app.use('/api/v1/question', questionRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/points', pointsRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/wrong-questions', wrongQuestionRoutes);

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

export { app };

if (require.main === module) {
  initDatabase().then(async () => {
    console.log('Database initialized');
    await seedShopItems();
    console.log('Shop items seeded');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1/health`);
    });
  }).catch(err => {
    console.error('Failed to init database:', err.message);
    process.exit(1);
  });
}
