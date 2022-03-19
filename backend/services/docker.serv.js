import EventEmitter from 'events';
import Dockerode from 'dockerode';

import * as fs from 'fs';


const docker = new Dockerode(); 

export async function getContainerInfo(container_name) {
    const containers = new Promise((resolve, rejects) => {
        docker.listContainers({
            "limit": 1,
            "filters": `{"name": ["${container_name}"]}`
        }, function(err, containers) {
            if(containers[0] == undefined) {
                resolve({
                    isexists:0
                })
            } else{
                try {
                    resolve({
                        isexists:1,
                        container:containers[0]
                    })
                } catch (error) {
                    resolve({
                        isexists:0
                    })
                }
            }
        });
    })

    return containers
}

export async function removeContainer(container) {
    const result = new Promise((resolve, rejects) => {
        container.stop(function (err, data) {
            container.remove(function (err, data) {
                resolve({
                    status:1
                })
            });
        })
    })

    return result
}

export async function createContainer(configs) {
    const result = new Promise((resolve, rejects) => {
        docker.createContainer(configs, function (err, container) {
            container.start(function (err, data) {
                resolve({
                    status:1
                })    
            });
        });
    })

    return result
}