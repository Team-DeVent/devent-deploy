import sqlite3 from 'sqlite3';
import path from 'path';
import winston from 'winston';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db_dir = path.join(__dirname, "deploy.db");
let conn = sqlite3.verbose()


const db = new conn.Database(db_dir, async (err) => {
    if (err) {
        winston.log('error', err.message);
    } else {
        winston.log('info', 'Connected to the database.');

    }
}); 

const sql_create = `create table IF NOT EXISTS repo_config (
	idx integer primary key autoincrement, 
	repo_name text, 
	repo_hash text type UNIQUE, 
	env text
);`;
  
db.run(sql_create, err => {
    if( err ) {
        return winston.log('error', err.message);
    }
    winston.log('info', 'repo_config table');
});
  

export { db }