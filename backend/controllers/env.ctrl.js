import * as envserv from '../services/env.serv.js'

export async function insert (req, res) {
    try {
        let repo = {
            name: req.body.name,
            hash: req.body.hash,
            env: req.body.env
        }
        let data = await envserv.insert(repo)
    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}
