import jwt from 'jsonwebtoken';

import data from '../config/jwt.js';


let saltRounds = 10;
let jwtSecret = data.secret;

export async function pass(user_pw) {
    try {
      
        const hashedPassword = await new Promise((resolve, reject) => {
          bcrypt.hash(user_pw, saltRounds, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
          });
        })
      
        return hashedPassword
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}

