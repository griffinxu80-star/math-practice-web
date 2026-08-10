import { initDatabase, saveDatabase } from '../../src/models/db';
import { seedKnowledgePoints } from './knowledge';
import { seedQuestions } from './questions';

async function main() {
  console.log('Starting database seed...');
  await initDatabase();
  await seedKnowledgePoints();
  await seedQuestions();
  saveDatabase();
  console.log('Seed completed!');
  process.exit(0);
}

main().catch(console.error);
