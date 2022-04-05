import { checkWebhookSecret, checkAuthorization } from '../services/webhook.serv.js'
import { event } from '../events/docker.js'


export async function receiveWebhookFromGithub (req, res) {
    try {
        let webhook_data = req;
        let github_url = webhook_data.body.repository.clone_url
        let github_username = webhook_data.body.repository.full_name.split('/')[0]

        let is_valid = await checkWebhookSecret(req)
        let is_allow = await checkAuthorization(github_username)

        console.log(is_valid,is_allow,github_username)

        if (is_valid && is_allow) {
            event.emit("clone_repository", github_url)
        } else {
            return res.status(401).json({status:0})
        }

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}

export function test (req, res) {
    try {
        let url = req.body.git;
        console.log("[ + ] Git URL", url)
        if (url != undefined) {
            event.emit("clone_repository", url)

        }

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}

