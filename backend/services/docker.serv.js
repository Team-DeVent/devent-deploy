import jwt from 'jsonwebtoken';
import data from '../config/webhook.js';
import dockerode from 'dockerode';
let docker = new dockerode(); 


let webhook_secret = data.secret;

export async function createContainer() {
    try {

      
        const check = await new Promise((resolve, reject) => {
            // create docker container from image
        })
      
        return check
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}
