
import { db } from '../db/sqlite.js'


export async function insert (repo) {
    try {
        // repo.name, repo.hash, repo.env
        await db.serialize();

        const query = `REPLACE INTO repo_config(repo_name, repo_hash, env) VALUES(?, ?, ?)`;
        const row = await db.run(query, [repo.name, repo.hash, repo.env]);
        let status = typeof row !== 'undefined'
        
        //db.close();
        return { status: status }
    } catch (error) {
        console.log(error)
        return { status: -1 }
    }
}