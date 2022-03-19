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

export async function existDirectory(directory) {
    const result = new Promise((resolve, rejects) => {
        fs.access(directory, function(error) {
            if (error) {
                resolve({ isexists: 0 })
            } else {
                resolve({ isexists: 1 })
            }
        })
    })

    return result
}

export async function removeDirectory(directory) {
    const result = new Promise((resolve, rejects) => {
        fs.rmdir(directory, {
            recursive: true, force: true
        }, (error) => {
            if (error) {
                resolve({ isremoved: 0 })
            } else {
                resolve({ isremoved: 1 })
            }
        });
    })

    return result
}
