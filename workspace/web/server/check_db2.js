var fs = require('fs');
var db = require('./dist/models/db');
(async function() {
  await db.initDatabase();
  var q = await db.all('SELECT COUNT(*) as c FROM questions');
  var kp = await db.all('SELECT COUNT(*) as c FROM knowledge_points');
  var u = await db.all('SELECT COUNT(*) as c FROM users');
  console.log('KPs:', kp[0].c, 'Qs:', q[0].c, 'Users:', u[0].c);
  var sample = await db.all('SELECT id, name, grade FROM knowledge_points LIMIT 5');
  console.log('Sample KPs:', JSON.stringify(sample));
  var sampleQ = await db.all('SELECT id, knowledge_point_id, content, question_type FROM questions LIMIT 3');
  console.log('Sample Qs:', JSON.stringify(sampleQ));
  process.exit(0);
})();
