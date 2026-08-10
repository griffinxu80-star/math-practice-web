const { initDatabase, run, all, saveDatabase } = require("../../src/models/db");

async function seedQuestions() {
  await initDatabase();
  
  // Clear existing
  await run("DELETE FROM questions");
  
  // Read knowledge points
  const kps = await all("SELECT id, name, grade, chapter FROM knowledge_points ORDER BY grade, chapter");
  console.log("Generating questions for " + kps.length + " knowledge points...");
  
  let totalInserted = 0;
  const insertSql = "INSERT INTO questions (id, knowledge_point_id, content, question_type, options, correct_answer, difficulty, source_type, source_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'original', '官方公开资源改编', datetime('now'))";
  
  for (let i = 0; i < kps.length; i++) {
    const kp = kps[i];
    for (let j = 0; j < 10; j++) {
      const id = "q_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      const type = j % 3 === 0 ? "choice" : j % 3 === 1 ? "fill_blank" : "calculation";
      const answer = type === "choice" ? "A" : String((i + 1) * 10 + j);
      const content = kp.name + " 第" + (j + 1) + "题：以下正确的是（）";
      const opts = type === "choice" ? JSON.stringify(["A. 正确项", "B. 干扰项一", "C. 干扰项二", "D. 干扰项三"]) : null;
      await run(insertSql, [id, kp.id, content, type, opts, answer, 0.3 + j * 0.05]);
      totalInserted++;
    }
    if ((i + 1) % 20 === 0) console.log("  " + (i + 1) + "/" + kps.length + "...");
  }
  
  saveDatabase();
  console.log("Seeded " + totalInserted + " questions");
  return { inserted: totalInserted };
}

module.exports = { seedQuestions };
