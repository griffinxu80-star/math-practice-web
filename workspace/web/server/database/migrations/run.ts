import { initDatabase, getDb, saveDatabase } from '../src/models/db';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  await initDatabase();
  
  const migrationDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationDir).filter(function(f: string) { return f.endsWith('.sql'); }).sort();
  
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    console.log('Running ' + file + '...');
    getDb().run(sql);
  }
  
  saveDatabase();
  console.log('All migrations completed');
}

main().catch(console.error);
