import { initDatabase, saveDatabase, run, get } from '../../src/models/db';
import { seedKnowledgePoints } from './knowledge';
import { seedQuestions } from './questions';

async function seedTestAccounts() {
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.default.hash('test123', 10);
  const { run, get } = await import('../../src/models/db');
  const now = "NOW()";

  const existingStudent = await get('SELECT id FROM users WHERE username = ?', ['test_student']);
  if (!existingStudent) {
    const id = 'user_test_student';
    await run('INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ' + now + ', ' + now + ')',
      [id, 'test_student', passwordHash, 'student', 4, '测试学生']);
    await run('INSERT INTO student_profiles (id, user_id, grade, total_score, total_exam_count, current_points, created_at) VALUES (?, ?, ?, 0, 0, 0, ' + now + ')',
      ['profile_test_student', id, 4]);
    console.log('Created test_student');
  } else {
    console.log('test_student already exists');
  }

  const existingParent = await get('SELECT id FROM users WHERE username = ?', ['test_parent']);
  if (!existingParent) {
    const id = 'user_test_parent';
    await run('INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ' + now + ', ' + now + ')',
      [id, 'test_parent', passwordHash, 'parent', null, '测试家长']);
    console.log('Created test_parent');
  } else {
    console.log('test_parent already exists');
  }
}

async function main() {
  console.log('Starting database seed...');
  await initDatabase();
  await seedTestAccounts();

  // Insert sample knowledge point for demo questions
  await run("DELETE FROM knowledge_points WHERE id = ?", ['kp_sample']);
  await run("INSERT INTO knowledge_points (id, name, grade, subject, chapter, unit, difficulty, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
    ['kp_sample', '示例知识点', 4, 'math', '示例章节', 1, 0.3]);
  console.log('Inserted kp_sample');

  await seedKnowledgePoints();
  await seedQuestions();
  saveDatabase();
  console.log('Seed completed!');
  process.exit(0);
}

main().catch(console.error);