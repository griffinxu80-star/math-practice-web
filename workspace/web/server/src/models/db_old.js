const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db = null;

async function initDatabase(dbPath) {
  const SQL = await initSqlJs();
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('Database loaded from ' + dbPath);
    } else {
      db = new SQL.Database();
      console.log('New database created');
    }
  } catch (err) {
    db = new SQL.Database();
    console.log('Created new database');
  }
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const dbPath = process.env.DATABASE_PATH || './data/db.sqlite';
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function query(sql, params) {
  params = params || [];
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const columns = [];
  const rows = [];
  while (stmt.step()) {
    const row = {};
    if (columns.length === 0) {
      for (var i = 0; i < stmt.numColumns(); i++) {
        columns.push(stmt.getColumnName(i));
      }
    }
    for (var i = 0; i < columns.length; i++) {
      row[columns[i]] = stmt.get(i);
    }
    rows.push(row);
  }
  stmt.free();
  return rows;
}

function run(sql, params) {
  params = params || [];
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) {}
  stmt.free();
  saveDatabase();
}

module.exports = { initDatabase, getDb, saveDatabase, query, run };
