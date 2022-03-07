import exec from 'child_process';
import EventEmitter from 'events';
import Dockerode from 'dockerode';
import crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

import gitconfig from '../config/setting.js';


let clone_dir = gitconfig.CLONE_REPO_DIR;

const event = new EventEmitter();
const docker = new Dockerode(); 


event.on('clone_repository', (github_url)  => {
    let url = github_url;
    let uuid = uuidv4();
    let hash = crypto.createHash('md5').update(url).digest('hex');

    console.log(`[ + ] Clone '${url}' repository.`)
    
    let child = exec.exec(`git clone ${url} ${hash} --progress`, {
        cwd: clone_dir
    })

    child.stdout.on('close', code => {
        event.emit("create_image", hash, uuid, url)
    });

});

event.on('create_image', (hash, uuid, url) => {
    fs.readFile(`${clone_dir}/${hash}/package.json`, 'utf8', (error, json) => {
        console.log(`[ + ] Get package.json`)
        let uuid_replaced = uuid.replaceAll('-','')
        let json_data, package_name_replaced, image_tag, version;

        if (error) {
            image_tag = `${uuid_replaced}:1.0`
        } else {
            json_data = JSON.parse(json);
            package_name_replaced = json_data.name.replaceAll('-','')
            version = json_data.version.split(".")
            image_tag = `${package_name_replaced}:${version[0]+"."+version[1]}`
        }

        let child = exec.exec(`docker build --tag ${image_tag} .`, {
            cwd: `${clone_dir}/${hash}/`
        })
    
        child.stdout.on('close', code => {
            console.log(`[ + ] Created '${image_tag}' image.`)

            event.emit("check_container", image_tag, hash)
        });
    });
});


event.on("check_container", (image_tag, hash) => {
    docker.listContainers({
        "limit": 1,
        "filters": `{"name": ["${hash}-test"]}`
    }, function(err, containers) {
        if(err) {
            console.log(err)
        } else{
            try {
                //console.log(containers[0].Id)
                var container = docker.getContainer(containers[0].Id);
                container.stop(function (err, data) {
                    console.log(`[ + ] Stopped '${hash}' container.`)
                    container.remove(function (err, data) {
                        console.log(`[ + ] Removed '${hash}' container.`)
                        event.emit("create_container", image_tag, hash)
                    });
                })
            } catch (error) {
                event.emit("create_container", image_tag, hash)
            }


        }
    });
})


event.on("create_container", (image_tag, hash) => {
    fs.readFile(`${clone_dir}/${hash}/deployenv`, 'utf8', (error, data) => {
        if (error) {
            console.log("[ + ] Fail. ")
        } else {
            let env = String(data).split(",")
            docker.createContainer({
                Image: image_tag, 
                Env: env,
                name: `${hash}-test`}, function (err, container) {
                container.start(function (err, data) {
                    console.log(`[ + ] Created '${hash}' container.`)
        
                });
            });
        }
    });

})

export { event }