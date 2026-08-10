var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./dist/models/db');
var JWT_SECRET = 'dev-jwt-secret-change-in-production';
(async function() {
  await db.initDatabase();
  // Test login
  var user = await db.all('SELECT * FROM users WHERE username = ?', ['e2etest']);
  console.log('User:', user.length > 0 ? user[0].username : 'NOT FOUND');
  if (user.length > 0) {
    var valid = await bcrypt.compare('test123', user[0].password_hash);
    console.log('Password valid:', valid);
    var token = jwt.sign({ id: user[0].id, username: user[0].username, role: user[0].role, grade: user[0].grade }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Token:', token.substring(0, 50) + '...');
  }
  process.exit(0);
})();
