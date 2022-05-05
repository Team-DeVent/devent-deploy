import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db_dir = path.join(__dirname, "deploy.db");
let conn = sqlite3.verbose()


const db = new conn.Database(db_dir,  (err) => {
    if (err) {
        console.error(err.message);
        console.error(db_dir)
    } else {
        console.log('[ + ] Connected to the database.');
    }
}); 

const sql_create = `create table IF NOT EXISTS repo_config (
	idx integer primary key autoincrement, 
	repo_name text, 
	repo_hash text, 
	env text
);`;
  
db.run(sql_create, err => {
    if( err ) {
        return console.error(err.message);
    }
    console.log("[ + ] repo_config table");
});
  

export { db }