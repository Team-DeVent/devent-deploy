import exec from 'child_process';
import EventEmitter from 'events';
import Dockerode from 'dockerode';
import crypto from 'crypto';
import winston from 'winston';


import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

import config from '../config/setting.json' assert {type: "json"};
import { getContainerInfo, removeContainer, createContainer } from '../services/docker.serv.js';
import { getFile, existDirectory, removeDirectory } from '../services/file.serv.js';

import * as envModel from '../models/env.model.js'
import * as volumeModel from '../models/volume.model.js'


let clone_dir = config.CLONE_REPO_DIR;
let github_pat = config.GITHUB_PAT;


const event = new EventEmitter();
const docker = new Dockerode(); 


event.on('clone_repository', async (github_url)  => {
    let url = github_url;
    let uuid = uuidv4();
    let hash = crypto.createHash('md5').update(url).digest('hex');

    winston.log('info', `[ DOCKER ] Clone '${url}' repository.`);

    let check_dir = await existDirectory(`${clone_dir}/${hash}/`)
    let remove_dir = await removeDirectory(`${clone_dir}/${hash}/`)

    let repo = {
        name: url,
        hash: hash,
        env: ''
    }


    if ((check_dir.isexists == 1 && 
        remove_dir.isremoved == 1) ||
        (check_dir.isexists == 0)) {
            let url_split = url.split('/')

            let account_name = url_split[3]
            let repository_name = url_split[4]


        let child = exec.exec(`git clone https://x-access-token:${github_pat}@github.com/${account_name}/${repository_name} ${hash} --progress`, {
            cwd: clone_dir
        })
    
        child.stdout.on('close', code => {
            event.emit("create_image", hash, uuid, url)
        });
    }



});

event.on('create_image', async (hash, uuid, url) => {
    winston.log('info', `[ DOCKER ] Get package.json.`);

    let uuid_replaced = uuid.replaceAll('-','')
    let json_data, package_name_replaced, image_tag, version;
    let result = await getFile(`${clone_dir}/${hash}/package.json`)

    if (result.isexists == 1) {
        json_data = JSON.parse(result.data);
        package_name_replaced = json_data.name.replaceAll('-','')
        version = json_data.version.split(".")
        image_tag = `${package_name_replaced}:${version[0]+"."+version[1]}`
    } else {
        image_tag = `${uuid_replaced}:1.0`
    }

    let child = exec.exec(`docker build --tag ${image_tag} .`, {
        cwd: `${clone_dir}/${hash}/`
    })

    child.stdout.on('close', code => {
        winston.log('info', `[ DOCKER ] Created '${image_tag}' image.`);

        event.emit("check_container", image_tag, hash)
    });
});


event.on("check_container", async (image_tag, hash) => {
    let data = await getContainerInfo(`${hash}-test`)
    
    if (data.isexists == 1) {
        let container = docker.getContainer(data.container.Id);
        let isremoved = await removeContainer(container);
        if (isremoved.status == 1) {
            winston.log('info', `[ DOCKER ] Removed '${hash}' container`);

            event.emit("create_container", image_tag, hash)
        }

    } else {
        event.emit("create_container", image_tag, hash)
    }
})


event.on("create_container", async (image_tag, hash) => {
    //let result = await getFile(`${clone_dir}/${hash}/deployenv`)
    let docker_file = await getFile(`${clone_dir}/${hash}/Dockerfile`)
    let docker_env = await envModel.get(hash)
    let docker_volume = await volumeModel.get(hash)

    if (docker_env.status == 1) {
        let env = String(docker_env.data[0].env).split(",")
        let docker_port = (docker_file.data.split("EXPOSE")[1].replace(/[&\/\\#,+()$~%.'"A-Za-z]|\s/g,""))

        let configs = {
            Image: image_tag, 
            Env: env,
            PortBindings: {},
            Binds: [],
            name: `${hash}-test`
        }
        configs.PortBindings[docker_port+"/tcp"] = [{
            "HostPort": docker_port
        }]

        if (docker_volume.status == 1) {
            docker_volume.data.forEach(element => {
                configs.Binds.push(`${element.volume_name}:${element.volume_mount}`)
            });
        }


        let is_created = await createContainer(configs)
        if (is_created.status == 1) {
            winston.log('info', `[ DOCKER ] Created '${hash}' container.`);

        }

    } else {
        winston.log('error', `[ DOCKER ] Fail.`);
    }
})

export { event }