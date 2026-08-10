import express from 'express';
import { initDatabase, run, get, all, saveDatabase } from './models/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (req: any, res: any) => {
  try {
    await initDatabase();
    res.json({ status: 'ok' });
  } catch (e) {
    res.json({ status: 'error', message: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
