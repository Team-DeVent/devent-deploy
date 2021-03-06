import * as envModel from '../models/env.model.js'
import crypto from 'crypto';
import winston from 'winston';



export async function insert (req, res) {
    try {
        let repo = {
            name: req.body.name,
            hash: crypto.createHash('md5').update(req.body.name).digest('hex'),
            env: req.body.env
        }

        let data = await envModel.insert(repo)
    
        res.status(200).json({status:1})
    } catch (error) {
        winston.log('error', error);
        res.status(500).json({status:0})
    }

}

export async function get (req, res) {
    try {
        let repo_hash = String(req.params.hash || 'all');
        let result = await envModel.get(repo_hash)
    
        res.status(200).json({
            status:result.data.length >= 1 ? 1 : 0, 
            data: result.data
        })
    } catch (error) {
        res.status(500).json({status:0})
    }

}

export async function remove (req, res) {
    try {
        let repo_hash = String(req.params.hash || '');
        let result = await envModel.remove(repo_hash)
    
        res.status(200).json({status:1})

    } catch (error) {
        res.status(500).json({status:0})
    }

}
