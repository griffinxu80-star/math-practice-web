const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

async function main() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'data/db.sqlite');
  
  // Load or create
  let db;
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
    console.log('Loaded existing DB');
  } else {
    db = new SQL.Database();
    console.log('Created new DB');
  }
  
  // Check tables
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', JSON.stringify(tables));
  } catch (e) {
    console.log('Error checking tables:', e.message);
  }
  
  // Try to run migration
  const migrationSql = fs.readFileSync(path.join(__dirname, 'database/migrations/001_init.sql'), 'utf8');
  console.log('Running migration...');
  try {
    const result = db.run(migrationSql);
    console.log('Migration result:', result);
  } catch (e) {
    console.log('Migration error:', e.message);
  }
  
  // Check tables again
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables after migration:', JSON.stringify(tables));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

main().catch(console.error);
