var bcrypt = require('bcryptjs');
var db = require('./dist/models/db');
(async function() {
  await db.initDatabase();
  var u = await db.all('SELECT id, username, password_hash FROM users WHERE username = ?', ['newuser1']);
  if (u.length === 0) { console.log('no user'); process.exit(0); }
  console.log('hash:', u[0].password_hash.substring(0, 30));
  var r = await bcrypt.compare('pass123', u[0].password_hash);
  console.log('match:', r);
  process.exit(0);
})();
