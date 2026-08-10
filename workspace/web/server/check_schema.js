const initSqlJs = require("sql.js");
const fs = require("fs");
const DB_PATH = "data/db.sqlite";

initSqlJs().then(SQL => {
  const sqlDb = new SQL.Database(fs.readFileSync(DB_PATH));
  
  const schema = sqlDb.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='questions'");
  console.log("questions schema:", JSON.stringify(schema));
  
  const schema2 = sqlDb.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='knowledge_points'");
  console.log("kp schema:", JSON.stringify(schema2));
  
  const kp = sqlDb.exec("SELECT id, typeof(id) as tid FROM knowledge_points LIMIT 3");
  console.log("KP sample:", JSON.stringify(kp));
  
  const q = sqlDb.exec("SELECT id, knowledge_point_id, typeof(knowledge_point_id) as tqid, question_type FROM questions LIMIT 3");
  console.log("Q sample:", JSON.stringify(q));
  
  try {
    const j = sqlDb.exec("SELECT q.id, kp.id FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id LIMIT 3");
    console.log("JOIN:", JSON.stringify(j));
  } catch(e) {
    console.log("JOIN ERROR:", e.message);
  }
  
  try {
    const j2 = sqlDb.exec("SELECT q.id, kp.id FROM questions q JOIN knowledge_points kp ON CAST(q.knowledge_point_id AS TEXT) = CAST(kp.id AS TEXT) LIMIT 3");
    console.log("JOIN CAST:", JSON.stringify(j2));
  } catch(e) {
    console.log("JOIN CAST ERROR:", e.message);
  }
  
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });