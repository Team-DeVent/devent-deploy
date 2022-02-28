import { checkWebhookSecret } from '../services/webhook.serv.js'
import { event } from '../events/docker.js'


export async function receiveWebhookFromGithub (req, res) {
    try {
        let webhook_data = req;
        let github_url = webhook_data.body.repository.clone_url

        let is_valid = await checkWebhookSecret(req)
        console.log(is_valid)

        if (is_valid) {
            event.emit("clone_repository", github_url)
        } else {
            return res.status(401).json({status:0})
        }

    
        res.status(200).json({status:1})
    } catch (error) {
        res.status(500).json({status:0})
    }

}

export function test (req, res) {
    try {
        event.emit("clone_repository", "https://github.com/Team-DeVent/devent-imageserver.git")

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}