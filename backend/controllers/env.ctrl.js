
import { db } from '../db/sqlite.js'


export async function insert (req, res) {
    try {
    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}