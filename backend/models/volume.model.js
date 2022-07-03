
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