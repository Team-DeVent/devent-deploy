
import { ifError } from 'assert';
import * as fs from 'fs';


export async function getFile(filename) {
    const result = new Promise((resolve, rejects) => {
        fs.readFile(`${filename}`, 'utf8', (error, data) => {
            if (!error) {
                resolve({
                    isexists:1,
                    data:data
                })
            } else {
                resolve({
                    isexists:0
                })
            }
        });
    })

    return result
}