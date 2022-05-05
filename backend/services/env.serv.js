
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

export async function get (repo_hash) {
    try {
        await db.serialize();

        const query = `SELECT repo_name, repo_hash, env FROM repo_config WHERE repo_hash = ?`;
        const data = await new Promise((resolve, reject) => {
            db.all(query, [`${repo_hash}`], function(err,row){
                let status = typeof row !== 'undefined'
                
                if (status == true) {
                    resolve({
                        status: status, 
                        data: row[0]
                    })

                } else {
                    resolve({ 
                        status: -1
                    })
                }        
            });
        })
      
        return data

    } catch (error) {
        console.log(error)
        return { status: -1 }
    }
}