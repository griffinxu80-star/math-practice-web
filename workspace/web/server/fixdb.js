const { initDatabase, all, run, execMulti, seedShopItems, saveDatabase } = require('./src/models/db');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('=== Init DB ===');
  await initDatabase();

  console.log('=== Run migrations ===');
  const migrationDir = path.join(__dirname, 'database/migrations');
  const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(migrationDir, f), 'utf8');
    await execMulti(sql);
    console.log('  Migrated:', f);
  }

  const tables = await all('SELECT name FROM sqlite_master WHERE type="table"');
  console.log('Tables:', tables.map(t => t.name));

  const kps = await all('SELECT COUNT(*) as cnt FROM knowledge_points');
  console.log('Knowledge points:', kps[0].cnt);

  const qs = await all('SELECT COUNT(*) as cnt FROM questions');
  console.log('Questions:', qs[0].cnt);

  // Create admin user
  await run('INSERT OR REPLACE INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
    ['admin', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 4, '¹ÜÀíÔ±']);
  await run('INSERT OR REPLACE INTO student_profiles (id, user_id, grade) VALUES (?, ?, ?)', ['std_1', 'admin', 4]);

  seedShopItems();
  saveDatabase();
  console.log('DB ready!');
}

main().catch(e => console.error(e.stack));
