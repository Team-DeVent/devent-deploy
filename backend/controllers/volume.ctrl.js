import * as volumeModel from '../models/volume.model.js'
import * as dockerService from '../services/docker.serv.js'

import crypto from 'crypto';
import winston from 'winston';


export async function insert (req, res) {
    try {
        let arg = {
            repo_hash: crypto.createHash('md5').update(req.body.name).digest('hex'),
            volume_name: req.body.volume_name,
            volume_mount: req.body.volume_mount
        }

        let configs = {
            "Name": arg.volume_name
        }


        let data = await volumeModel.insert(arg)
        let result = await dockerService.createVolume(configs)

        res.status(200).json({status:1})
    } catch (error) {
        winston.log('error', error);
        res.status(500).json({status:0})
    }

}


export async function get (req, res) {
    try {
        let repo_hash = String(req.params.hash || 'all');
        let result = await volumeModel.get(repo_hash)
    
        res.status(200).json({
            status:result.data.length >= 1 ? 1 : 0, 
            data: result.data
        })
    } catch (error) {
        res.status(500).json({status:0})
    }

}