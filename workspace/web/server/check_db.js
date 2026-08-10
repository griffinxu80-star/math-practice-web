var fs = require('fs');
var db = require('./dist/models/db');
(async function() {
  await db.initDatabase();
  var r = await db.all('SELECT COUNT(*) as c FROM questions');
  console.log('Questions:', r[0].c);
  var kps = await db.all('SELECT id, name, grade, chapter FROM knowledge_points ORDER BY grade, chapter');
  console.log('KPs:', kps.length);
  kps.slice(0, 5).forEach(function(k) { console.log(k.id, k.grade, k.chapter, k.name); });
  process.exit(0);
})();
