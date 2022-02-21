import exec from 'child_process';
import gitconfig from '../config/git.js';


let clone_dir = gitconfig.clone_repo_dir;

//https://github.com/Team-DeVent/devent-imageserver

export async function cloneRepository({url, branch}) {
    try {
        
        const results = await new Promise((resolve, reject) => {
            let args = [
                "clone",
                url,
                "--progress"
            ];
            let child = exec.spawn('git', args, {
                cwd: clone_dir
            })
            resolve({status:1})
        })
      
        return results
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}
