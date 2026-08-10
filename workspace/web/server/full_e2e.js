var db = require("./dist/models/db");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var JWT_SECRET = "dev-jwt-secret-change-in-production";

(async function() {
  await db.initDatabase();
  var hash = await bcrypt.hash("test123", 10);
  var userId = "user_e2e_" + Date.now();
  await db.run("INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [userId, "e2etest", hash, "student", 4, "E2E Test"]);
  var profileId = "profile_e2e_" + Date.now();
  await db.run("INSERT INTO student_profiles (id, user_id, grade, total_score, total_exam_count, current_points, created_at) VALUES (?, ?, ?, 0, 0, 0, datetime('now'))",
    [profileId, userId, 4]);
  var token = jwt.sign({ id: userId, username: "e2etest", role: "student", grade: 4 }, JWT_SECRET, { expiresIn: "7d" });
  console.log("Token ok:", token.substring(0, 30));
  var q = await db.all("SELECT COUNT(*) as c FROM questions WHERE knowledge_point_id IN (SELECT id FROM knowledge_points WHERE grade=4)");
  console.log("Grade 4 questions:", q[0].c);
  var kps = await db.all("SELECT COUNT(*) as c FROM knowledge_points WHERE grade=4");
  console.log("Grade 4 KPs:", kps[0].c);
  var kps5 = await db.all("SELECT COUNT(*) as c FROM knowledge_points WHERE grade=5");
  console.log("Grade 5 KPs:", kps5[0].c);
  var kps6 = await db.all("SELECT COUNT(*) as c FROM knowledge_points WHERE grade=6");
  console.log("Grade 6 KPs:", kps6[0].c);
  console.log("E2E test passed!");
  process.exit(0);
})();
