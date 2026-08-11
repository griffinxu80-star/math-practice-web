const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/db.sqlite');

let pgClient = null;
let sqlDb = null;
let SQL = null;
let sqliteReady = false;

async function initPostgres() {
  if (pgClient) return;
  const { Client } = require('pg');
  pgClient = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await pgClient.connect();
  console.log('Connected to PostgreSQL');
}

async function pgRun(sql, params = []) {
  await initPostgres();
  await pgClient.query(sql, params);
}

async function pgGet(sql, params = []) {
  await initPostgres();
  const result = await pgClient.query(sql, params);
  return result.rows[0] || null;
}

async function pgAll(sql, params = []) {
  await initPostgres();
  const result = await pgClient.query(sql, params);
  return result.rows;
}

async function pgExec(sql) {
  await initPostgres();
  await pgClient.query(sql);
}

async function pgSeedShopItems() {
  const items = [
    { id: 'shop_1', name: 'Xueba Badge', description: 'Virtual badge', icon_url: '🏅', cost: 50 },
    { id: 'shop_2', name: 'Study Certificate', description: 'Learning cert', icon_url: '📜', cost: 100 },
    { id: 'shop_3', name: 'Superhero Badge', description: 'Limited badge', icon_url: '🦸', cost: 200 },
    { id: 'shop_4', name: 'Math Star Title', description: 'Exclusive title', icon_url: '⭐', cost: 150 },
    { id: 'shop_5', name: 'Challenge Ticket', description: 'Hard challenge', icon_url: '🎫', cost: 30 },
  ];
  for (const item of items) {
    const existing = await pgGet('SELECT id FROM point_shop_items WHERE id = $1', [item.id]);
    if (!existing) {
      await pgRun('INSERT INTO point_shop_items (id, name, description, icon_url, cost, stock, is_virtual, created_at) VALUES ($1, $2, $3, $4, $5, -1, 1, NOW())', [item.id, item.name, item.description, item.icon_url, item.cost]);
    }
  }
}

async function initSqlite() {
  if (sqliteReady) return;
  if (!SQL) {
    SQL = await initSqlJs();
  }
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(DB_PATH)) {
    try {
      sqlDb = new SQL.Database(fs.readFileSync(DB_PATH));
      console.log('Loaded SQLite database');
      sqliteReady = true;
      return;
    } catch (e) {
      console.log('Failed to load SQLite, creating new:', e.message);
    }
  }
  sqlDb = new SQL.Database();
  console.log('Created new SQLite database');
  sqliteReady = true;
}

function sqliteRun(sql, params = []) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  const stmt = sqlDb.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) {}
  stmt.free();
}

function sqliteGet(sql, params = []) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  const stmt = sqlDb.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

function sqliteAll(sql, params = []) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  const stmt = sqlDb.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function sqliteExec(sql) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  sqlDb.exec(sql);
}

function sqliteSave() {
  if (!sqlDb) return;
  const data = sqlDb.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function sqliteSeedShopItems() {
  const items = [
    { id: 'shop_1', name: 'Xueba Badge', description: 'Virtual badge', icon_url: '🏅', cost: 50 },
    { id: 'shop_2', name: 'Study Certificate', description: 'Learning cert', icon_url: '📜', cost: 100 },
    { id: 'shop_3', name: 'Superhero Badge', description: 'Limited badge', icon_url: '🦸', cost: 200 },
    { id: 'shop_4', name: 'Math Star Title', description: 'Exclusive title', icon_url: '⭐', cost: 150 },
    { id: 'shop_5', name: 'Challenge Ticket', description: 'Hard challenge', icon_url: '🎫', cost: 30 },
  ];
  for (const item of items) {
    if (!sqliteGet('SELECT id FROM point_shop_items WHERE id = ?', [item.id])) {
      sqliteRun('INSERT INTO point_shop_items (id, name, description, icon_url, cost, stock, is_virtual, created_at) VALUES (?, ?, ?, ?, ?, -1, 1, datetime(" now))', [item.id, item.name, item.description, item.icon_url, item.cost]);
    }
  }
}


function sqlitePrepare(sql) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  return sqlDb.prepare(sql);
}

function sqliteTransaction(callback, points) {
  if (!sqlDb) throw new Error('SQLite not initialized');
  sqlDb.exec('BEGIN TRANSACTION;');
  try {
    const result = callback(points || []);
    sqlDb.exec('COMMIT;');
    return result;
  } catch (e) {
    sqlDb.exec('ROLLBACK;');
    throw e;
  }
}

function pgTransaction(callback, items) {
  return pgClient.query('BEGIN')
    .then(() => callback())
    .then(r => pgClient.query('COMMIT').then(() => r))
    .catch(e => pgClient.query('ROLLBACK').then(() => { throw e; }));
}

async function prepare(sql) {
  if (DATABASE_URL) return pgPrepare(sql);
  return sqlitePrepare(sql);
}

async function transaction(callback, items) {
  if (DATABASE_URL) return pgTransaction(callback, items);
  return sqliteTransaction(callback, items);
}


async function pgPrepare(sql) {
  await initPostgres();
  return {
    run: async function(params = []) {
      await pgClient.query(sql, params);
    }
  };
}

async function initDatabase() {
  if (DATABASE_URL) {
    await initPostgres();
  } else {
    await initSqlite();
  }
}

function run(sql, params = []) {
  if (DATABASE_URL) return pgRun(sql, params);
  return sqliteRun(sql, params);
}

function get(sql, params = []) {
  if (DATABASE_URL) return pgGet(sql, params);
  return sqliteGet(sql, params);
}

function all(sql, params = []) {
  if (DATABASE_URL) return pgAll(sql, params);
  return sqliteAll(sql, params);
}

function execMulti(sql) {
  if (DATABASE_URL) return pgExec(sql);
  return sqliteExec(sql);
}

async function seedShopItems() {
  if (DATABASE_URL) return pgSeedShopItems();
  sqliteSeedShopItems();
}

function saveDatabase() {
  if (!DATABASE_URL) sqliteSave();
}

async function closeDatabase() {
  if (pgClient) { await pgClient.end(); pgClient = null; }
  saveDatabase();
}


async function transactionAll(callback) {
  return async (items) => transaction(async (it) => callback(it), items);
}
export { initDatabase, run, get, all, execMulti, seedShopItems, saveDatabase, closeDatabase, prepare, transaction, transactionAll };
