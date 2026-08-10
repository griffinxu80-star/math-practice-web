const initSqlJs = require("sql.js");
const fs = require("fs");
const DB_PATH = "data/db.sqlite";
initSqlJs().then(SQL => {
  const db = new SQL.Database(fs.readFileSync(DB_PATH));
  const exams = db.exec("SELECT id, user_id FROM exam_attempts");
  console.log("exam_attempts:", JSON.stringify(exams));
  const users = db.exec("SELECT id, username FROM users");
  console.log("users:", JSON.stringify(users));
  process.exit(0);
});