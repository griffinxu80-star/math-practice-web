const initSqlJs = require("sql.js");
const fs = require("fs");
const DB_PATH = "data/db.sqlite";

initSqlJs().then(SQL => {
  const sqlDb = new SQL.Database(fs.readFileSync(DB_PATH));
  
  // Simulate the exact query from the service
  const sql = "SELECT q.*, kp.name as knowledge_point_name FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id WHERE 1=1 AND kp.grade = ? ORDER BY q.difficulty ASC LIMIT ? OFFSET ?";
  const params = [4, 1, 0];
  
  try {
    const stmt = sqlDb.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      const row = {};
      const names = stmt.getColumnNames();
      for (let i = 0; i < names.length; i++) row[names[i]] = stmt.get(i);
      rows.push(row);
    }
    stmt.free();
    console.log("SUCCESS: " + rows.length + " rows");
    if (rows.length > 0) console.log("First row keys:", Object.keys(rows[0]));
  } catch(e) {
    console.log("ERROR:", e.message);
  }
  
  // Test the simpler version
  try {
    const sql2 = "SELECT q.*, kp.name as knowledge_point_name FROM questions q JOIN knowledge_points kp ON q.knowledge_point_id = kp.id WHERE kp.grade = 4 LIMIT 1";
    const r2 = sqlDb.exec(sql2);
    console.log("SIMPLE JOIN:", JSON.stringify(r2).substring(0, 200));
  } catch(e) {
    console.log("SIMPLE ERROR:", e.message);
  }
  
  // Check if grade column is actually INTEGER
  const r3 = sqlDb.exec("SELECT typeof(grade), grade FROM knowledge_points LIMIT 3");
  console.log("grade types:", JSON.stringify(r3));
  
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });