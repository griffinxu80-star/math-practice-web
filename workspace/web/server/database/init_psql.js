/**
 * PostgreSQL 数据库初始化和种子脚本
 * 运行方式: node database/init_psql.js
 */
const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSql(sql, params = []) {
  await client.query(sql, params);
}

async function getSql(sql, params = []) {
  const result = await client.query(sql, params);
  return result.rows[0] || null;
}

async function getAllSql(sql, params = []) {
  const result = await client.query(sql, params);
  return result.rows;
}

async function initMigrations() {
  const migrationDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationDir)
    .filter(f => f.endsWith('_psql.sql'))
    .sort();
  
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    console.log(`Running ${file}...`);
    await client.query(sql);
    console.log(`  done ${file}`);
  }
}

async function seedTestAccounts() {
  const passwordHash = await bcrypt.hash('test123', 10);
  const now = new Date().toISOString();
  
  let student = await getSql('SELECT id FROM users WHERE username = $1', ['test_student']);
  if (!student) {
    const id = 'user_test_student';
    await runSql(
      'INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, 'test_student', passwordHash, 'student', 4, '测试学生', now, now]
    );
    await runSql(
      'INSERT INTO student_profiles (id, user_id, grade, total_score, total_exam_count, current_points, created_at) VALUES ($1, $2, $3, 0, 0, 0, $4)',
      ['profile_test_student', id, 4, now]
    );
    console.log('  Created test_student');
  } else {
    console.log('  test_student already exists');
  }
  
  let parent = await getSql('SELECT id FROM users WHERE username = $1', ['test_parent']);
  if (!parent) {
    const id = 'user_test_parent';
    await runSql(
      'INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, 'test_parent', passwordHash, 'parent', null, '测试家长', now, now]
    );
    console.log('  Created test_parent');
  } else {
    console.log('  test_parent already exists');
  }
}

async function seedKnowledgePoints() {
  const points = [
    { name: '亿以内数的认识', grade: 4, chapter: '大数的认识', unit: 1 },
    { name: '数位顺序表', grade: 4, chapter: '大数的认识', unit: 1 },
    { name: '读亿以内的数', grade: 4, chapter: '大数的认识', unit: 1 },
    { name: '写亿以内的数', grade: 4, chapter: '大数的认识', unit: 1 },
    { name: '比较数的大小', grade: 4, chapter: '大数的认识', unit: 1 },
    { name: '角的度量', grade: 4, chapter: '角的度量', unit: 1 },
    { name: '平行与垂直', grade: 4, chapter: '平行四边形和梯形', unit: 1 },
    { name: '口算乘法', grade: 4, chapter: '三位数乘两位数', unit: 1 },
    { name: '笔算乘法', grade: 4, chapter: '三位数乘两位数', unit: 1 },
    { name: '条形统计图', grade: 4, chapter: '统计', unit: 1 },
    { name: '小数的意义', grade: 4, chapter: '小数的意义和性质', unit: 1 },
    { name: '小数加减法', grade: 4, chapter: '小数的加法和减法', unit: 1 },
    { name: '加法交换律', grade: 4, chapter: '运算定律', unit: 1 },
    { name: '乘法交换律', grade: 4, chapter: '运算定律', unit: 1 },
    { name: '乘法分配律', grade: 4, chapter: '运算定律', unit: 1 },
    { name: '三角形', grade: 4, chapter: '三角形', unit: 1 },
    { name: '三角形的内角和', grade: 4, chapter: '三角形', unit: 1 },
    { name: '小数乘法', grade: 5, chapter: '小数乘法', unit: 1 },
    { name: '小数除法', grade: 5, chapter: '小数除法', unit: 1 },
    { name: '解简易方程', grade: 5, chapter: '简易方程', unit: 1 },
    { name: '平行四边形的面积', grade: 5, chapter: '多边形的面积', unit: 1 },
    { name: '三角形的面积', grade: 5, chapter: '多边形的面积', unit: 1 },
    { name: '异分母分数加减法', grade: 5, chapter: '分数的加法和减法', unit: 1 },
    { name: '找次品', grade: 5, chapter: '数学广角', unit: 1 },
    { name: '分数乘法', grade: 6, chapter: '分数乘法', unit: 1 },
    { name: '分数除法', grade: 6, chapter: '分数除法', unit: 1 },
    { name: '比的认识', grade: 6, chapter: '比', unit: 1 },
    { name: '圆的周长', grade: 6, chapter: '圆', unit: 1 },
    { name: '圆的面积', grade: 6, chapter: '圆', unit: 1 },
    { name: '百分数的意义', grade: 6, chapter: '百分数', unit: 1 },
    { name: '圆柱的表面积', grade: 6, chapter: '圆柱与圆锥', unit: 1 },
    { name: '圆锥的体积', grade: 6, chapter: '圆柱与圆锥', unit: 1 },
    { name: '比例尺', grade: 6, chapter: '比例', unit: 1 },
  ];
  
  let inserted = 0;
  for (const kp of points) {
    const existing = await getSql('SELECT id FROM knowledge_points WHERE name = $1 AND grade = $2', [kp.name, kp.grade]);
    if (!existing) {
      const id = `kp_${kp.grade}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      await runSql(
        'INSERT INTO knowledge_points (id, name, grade, subject, chapter, unit, difficulty, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [id, kp.name, kp.grade, 'math', kp.chapter, kp.unit, 0.5]
      );
      inserted++;
    }
  }
  console.log(`  Seeded ${inserted} knowledge points`);
}

async function seedSampleQuestions(sampleKpId) {
  const sampleQuestions = [
    { knowledgePointId: sampleKpId, content: '356 + 478 = ?', type: 'calculation', correctAnswer: '834', difficulty: 0.3 },
    { knowledgePointId: sampleKpId, content: '下面哪个是质数？A. 4 B. 9 C. 7 D. 15', type: 'choice', options: JSON.stringify(['A. 4', 'B. 9', 'C. 7', 'D. 15']), correctAnswer: 'C', difficulty: 0.4 },
    { knowledgePointId: sampleKpId, content: '一个直角三角形的两个锐角之和是（）度。', type: 'fill_blank', correctAnswer: '90', difficulty: 0.5 },
    { knowledgePointId: sampleKpId, content: '把12个苹果平均分给3个小朋友，每人分（）个。', type: 'fill_blank', correctAnswer: '4', difficulty: 0.3 },
    { knowledgePointId: sampleKpId, content: '计算：25 × 4 = ?', type: 'calculation', correctAnswer: '100', difficulty: 0.2 },
  ];
  
  for (const q of sampleQuestions) {
    const id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await runSql(
      'INSERT INTO questions (id, knowledge_point_id, content, question_type, options, correct_answer, difficulty, source_type, source_name, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())',
      [id, q.knowledgePointId, q.content, q.type, q.options || null, q.correctAnswer, q.difficulty, 'original', '官方公开资源']
    );
  }
  console.log(`  Seeded ${sampleQuestions.length} sample questions`);
}

async function seedShopItems() {
  const items = [
    { id: 'shop_1', name: 'Xueba Badge', description: 'Virtual badge', icon_url: '🏅', cost: 50 },
    { id: 'shop_2', name: 'Study Certificate', description: 'Learning cert', icon_url: '📜', cost: 100 },
    { id: 'shop_3', name: 'Superhero Badge', description: 'Limited badge', icon_url: '🦸', cost: 200 },
    { id: 'shop_4', name: 'Math Star Title', description: 'Exclusive title', icon_url: '⭐', cost: 150 },
    { id: 'shop_5', name: 'Challenge Ticket', description: 'Hard challenge', icon_url: '🎫', cost: 30 },
  ];
  
  for (const item of items) {
    const existing = await getSql('SELECT id FROM point_shop_items WHERE id = $1', [item.id]);
    if (!existing) {
      await runSql(
        'INSERT INTO point_shop_items (id, name, description, icon_url, cost, stock, is_virtual, created_at) VALUES ($1, $2, $3, $4, $5, -1, 1, NOW())',
        [item.id, item.name, item.description, item.icon_url, item.cost]
      );
    }
  }
  console.log('  Seeded shop items');
}

async function main() {
  console.log('Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log('Connected!');
  
  console.log('\n--- Running migrations ---');
  await initMigrations();
  
  console.log('\n--- Seeding data ---');
  await seedTestAccounts();
  await seedKnowledgePoints();
  
  const kps = await getAllSql('SELECT id FROM knowledge_points LIMIT 1');
  if (kps.length > 0) {
    await seedSampleQuestions(kps[0].id);
  } else {
    console.log('  No knowledge points found, skipping sample questions');
  }
  
  await seedShopItems();
  
  await client.end();
  console.log('\nSeed completed!');
  process.exit(0);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  client.end().catch(() => {});
  process.exit(1);
});