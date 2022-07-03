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

const sql_create_container = `create table IF NOT EXISTS container (
	idx integer primary key autoincrement, 
	repo_name text, 
	repo_hash text type UNIQUE, 
	env text
);`;
  
db.run(sql_create_container, err => {
    if( err ) {
        return winston.log('error', err.message);
    }
    winston.log('info', 'container table');
});

const sql_create_volume = `create table IF NOT EXISTS volume (
	idx integer primary key autoincrement, 
	repo_hash text, 
	volume_name text type UNIQUE, 
	volume_mount text
);`;
  
db.run(sql_create_volume, err => {
    if( err ) {
        return winston.log('error', err.message);
    }
    winston.log('info', 'volume table');
});
  

export { db }