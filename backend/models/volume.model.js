
import { db } from '../db/sqlite.js'


export async function insert (arg) {
    try {
        // arg.repo_hash, arg.volume_name, arg.volume_mount
        await db.serialize();

        const query = `REPLACE INTO volume(repo_hash, volume_name, volume_mount) VALUES(?, ?, ?)`;
        const row = await db.run(query, [arg.repo_hash, arg.volume_name, arg.volume_mount]);
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

        const query = `SELECT * FROM volume WHERE repo_hash = ?`;
        const query_all = `SELECT * FROM volume`;

        const data = await new Promise((resolve, reject) => {
            db.all(repo_hash != 'all' ? query : query_all, repo_hash != 'all' ? [`${repo_hash}`] : [], function(err,row){
                let status = typeof row !== 'undefined'
                
                if (status == true) {
                    resolve({
                        status: status, 
                        data: row
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